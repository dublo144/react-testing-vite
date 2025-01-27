import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  it("should render no users when list is empty", () => {
    render(<UserList users={[]} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it("should render a list of users when user list is available", () => {
    const users: User[] = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];

    render(<UserList users={users} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(users.length);
  });
});
