import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render the users name", () => {
    // Arrange
    const user: User = { id: 1, name: "John Doe" };

    // Act
    render(<UserAccount user={user} />);

    // Assert
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render an edit button for an admin user", () => {
    // Arrange
    const user: User = { id: 1, name: "John Doe", isAdmin: true };

    // Act
    render(<UserAccount user={user} />);

    // Assert
    const editButton = screen.getByRole("button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveTextContent(/edit/i);
  });

  it("should not render an edit button for a non-admin user", () => {
    // Arrange
    const user: User = { id: 1, name: "John Doe", isAdmin: false };

    // Act
    render(<UserAccount user={user} />);

    // Assert
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
