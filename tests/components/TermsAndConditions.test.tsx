import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      submitButton: screen.getByRole("button", { name: /submit/i }),
    };
  };

  it("should render with correct text and initial state", () => {
    const { heading, checkbox, submitButton } = renderComponent();

    expect(heading).toHaveTextContent(/Terms & Conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when checkbox is checked", async () => {
    const { checkbox, submitButton } = renderComponent();

    await userEvent.setup().click(checkbox);

    expect(submitButton).not.toBeDisabled();
  });
});
