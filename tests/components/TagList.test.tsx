import { render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("renders tags", async () => {
    render(<TagList />);

    // Calls the callback repeately for 1sec.. So dont have side effects..
    /* await waitFor(() => {
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    }); */

    const listitems = await screen.findAllByRole("listitem");
    expect(listitems.length).toBeGreaterThan(0);
  });
});
