import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import ToastDemo from "../../src/components/ToastDemo";

describe("ToastDemo", () => {
  const renderToastDemo = () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    return {
      user: userEvent.setup(),
      button: screen.getByRole("button", { name: /show toast/i }),
    };
  };

  it("should render the toast button", async () => {
    const { button } = renderToastDemo();
    expect(button).toBeInTheDocument();
  });

  it("should show a toast on button click", async () => {
    const { button, user } = renderToastDemo();

    await user.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
