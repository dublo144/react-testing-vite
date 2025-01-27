import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  /* ---------------------------------- Setup --------------------------------- */
  let product: ReturnType<typeof db.product.create>;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => db.product.delete({ where: { id: { equals: product.id } } }));

  /* ---------------------------- Product Fetching ---------------------------- */
  it("should render product details", async () => {
    render(<ProductDetail productId={product.id} />);

    const name = await screen.findByText(new RegExp(product.name, "i"));
    const price = await screen.findByText(
      new RegExp(product.price.toString(), "i")
    );

    expect(name).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });

  it("should render 'Not Found' if no product for the given id is found", async () => {
    server.use(
      http.get(`/products/${product.id}`, () => HttpResponse.json(null))
    );

    render(<ProductDetail productId={product.id} />);

    const error = await screen.findByText(/not found/i);
    expect(error).toBeInTheDocument();
  });

  it("should render an error if productId is invalid", async () => {
    render(<ProductDetail productId={0} />);

    const error = await screen.findByText(/invalid/i);
    expect(error).toBeInTheDocument;
  });

  it("should render an error if fetching product fails", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.error()));

    render(<ProductDetail productId={product.id} />);

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument;
  });

  /* ---------------------------- Loading indicator --------------------------- */
  it("should render a loading message while fetching product", async () => {
    server.use(
      http.get("/products/:id", async () => {
        delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={product.id} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument(); // Find by role or custom test id IRL
  });

  it("should remove the loading indicator when data is fetched", async () => {
    render(<ProductDetail productId={product.id} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i)); // Times out if element is never removed
  });

  it("should remove the loading indicator if fetching fails", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.error()));

    render(<ProductDetail productId={product.id} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i)); // Times out if element is never removed
  });
});
