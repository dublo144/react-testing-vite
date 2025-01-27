import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpandableText from "../../src/components/ExpandableText";

describe("ExpandableText", () => {
  const textLimit = 255;
  const longText: string = "a".repeat(textLimit + 1);
  const truncatedText: string = longText.substring(0, textLimit) + "...";

  it("should render full text if text is less than 255 char", () => {
    const shortText: string = "Hello World";

    render(<ExpandableText text={shortText} />);

    expect(screen.getByText(shortText)).toBeInTheDocument();
  });

  it("should render truncated text if text is more than 255 char", () => {
    render(<ExpandableText text={longText} />);

    const showMoreBtn = screen.getByRole("button", { name: /show more/i });

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreBtn).toBeInTheDocument();
  });

  it("should render full text when show more button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    await userEvent.setup().click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/show less/i);
  });

  it("should collapse text then show less is clicked", async () => {
    render(<ExpandableText text={longText} />);
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    await userEvent.setup().click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await userEvent.setup().click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/show more/i);
  });
});
