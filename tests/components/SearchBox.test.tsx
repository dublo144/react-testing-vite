import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "../../src/components/SearchBox";

describe("SearchBox", () => {
  const renderSearchBox = () => {
    const mockOnChange = vi.fn();
    render(<SearchBox onChange={mockOnChange} />);

    return {
      user: userEvent.setup(),
      inputField: screen.getByPlaceholderText(/search/i),
      onChange: mockOnChange,
    };
  };

  it("should render an imput field for searching", () => {
    const { inputField } = renderSearchBox();

    expect(inputField).toBeInTheDocument();
  });

  it("should call the onChange callback when the user presses Enter", async () => {
    const { user, inputField, onChange } = renderSearchBox();

    const searchTerm = "search";
    await user.type(inputField, searchTerm + "{enter}");

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call the onChange callback when input field is empty", async () => {
    const { user, inputField, onChange } = renderSearchBox();

    await user.type(inputField, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
