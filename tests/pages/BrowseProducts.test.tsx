import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { server } from "../mocks/server";

describe("BrowseProductsPage", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  };

  /* ----------------------------- Loading states ----------------------------- */
  it("should render a loading skeleton when categories are loading", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    const skeleton = screen.getByRole("progressbar", { name: /categories/i });
    expect(skeleton).toBeInTheDocument();
  });

  it("should remove the loading skeleton when categories are loaded", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should render a loading skeleton when products are loading", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();

    const skeleton = screen.getByRole("progressbar", { name: /products/i });
    expect(skeleton).toBeInTheDocument();
  });

  it("should remove the loading skeleton when products are loaded", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });

  /* ----------------------------- Error handling ----------------------------- */
  it.todo("should render an error message when fetching categories fails");

  it("should render an error message when fetching products fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  });
});
