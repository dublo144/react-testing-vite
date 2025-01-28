import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductList", () => {
  const productIds: number[] = [];

  beforeAll(() => {
    Array.from({ length: 3 }).forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => db.product.deleteMany({ where: { id: { in: productIds } } }));

  it("should render a list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render 'No products available if no products is found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));

    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText("No products available.");
    expect(message).toBeInTheDocument();
  });

  it("should render an error message if fetching products fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument;
  });

  it("should render a loading message while fetching products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    const loadingIndicator = await screen.findByText(/loading/i); // Find by role or custom test id IRL
    expect(loadingIndicator).toBeInTheDocument;
  });

  it("should remove the loading indicator when data is fetched", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i)); // Times out if element is never removed
  });

  it("should remove the loading indicator if fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i)); // Times out if element is never removed
  });
});
