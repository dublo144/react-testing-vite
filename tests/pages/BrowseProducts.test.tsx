import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const allProducts: Product[] = [];

  beforeAll(() => {
    Array.from({ length: 3 }).map((_, i) => {
      const category = db.category.create({ name: `Category ${i}` }); // Guard against faker picking same names
      categories.push(category);
      Array.from({ length: 3 }).map(() =>
        allProducts.push(db.product.create({ categoryId: category.id }))
      );
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = allProducts.map((product) => product.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  /* ----------------------------- Loading states ----------------------------- */
  it("should render a loading skeleton when categories are loading", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should remove the loading skeleton when categories are loaded", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should render a loading skeleton when products are loading", async () => {
    simulateDelay("/products");

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should remove the loading skeleton when products are loaded", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  /* ----------------------------- Error handling ----------------------------- */
  it("should not render combobox if fetching categories fails", async () => {
    simulateError("/categories");

    const { getCategoriesCombobox } = renderComponent();

    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error message if fetching products fails", async () => {
    simulateError("/products");

    renderComponent();

    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  });

  /* -------------------------------- Rendering ------------------------------- */
  it("should render a combobox with categories", async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    allProducts.forEach(async (product) => {
      const productElement = await screen.findByText(product.name);
      expect(productElement).toBeInTheDocument();
    });
  });

  /* -------------------------------- Filtering ------------------------------- */
  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInDocument } = renderComponent();

    const selectedCategory = categories[0];
    const productsInCategory = getProductsByCategory(selectedCategory.id);

    selectCategory(selectedCategory.name);

    expectProductsToBeInDocument(productsInCategory);
  });

  it("should render all products when 'All'-category is selected", async () => {
    const { selectCategory, expectProductsToBeInDocument } = renderComponent();

    selectCategory(/all/i);

    const allProducts = db.product.getAll();
    expectProductsToBeInDocument(allProducts);
  });
});

const renderComponent = () => {
  render(
    <Theme>
      <CartProvider>
        <BrowseProducts />
      </CartProvider>
    </Theme>
  );

  const user = userEvent.setup();

  const getProductsSkeleton = () =>
    screen.getByRole("progressbar", { name: /products/i });

  const getCategoriesSkeleton = () =>
    screen.getByRole("progressbar", { name: /categories/i });

  const getCategoriesCombobox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();
    await user.click(combobox!);
    await user.click(screen.getByRole("option", { name }));
  };

  const expectProductsToBeInDocument = async (products: Product[]) => {
    await waitForElementToBeRemoved(getProductsSkeleton);
    const dataRows = screen.getAllByRole("row").slice(1); // Top row is header
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    user,
    getProductsSkeleton,
    getCategoriesSkeleton,
    getCategoriesCombobox,
    selectCategory,
    expectProductsToBeInDocument,
  };
};
