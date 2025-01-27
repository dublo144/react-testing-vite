import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  it("should render a greeting when a name is provided", () => {
    const name = "John Doe";

    render(<Greet name={name} />);
    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(new RegExp(`hello ${name}`, "i"));
  });

  it("should render a login button when no name is provided", () => {
    render(<Greet />);

    const loginButton = screen.getByRole("button");

    expect(loginButton).toBeInTheDocument();
  });
});
