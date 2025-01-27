import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";

describe("OrderStatusSelector", () => {
  const renderOrderStatusSelector = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      onChange,
      user: userEvent.setup(),
      combobox: screen.getByRole("combobox"),
      getOptions: () => screen.getAllByRole("option"),
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
    };
  };

  it("should render a select element with new as the default value", () => {
    const { combobox } = renderOrderStatusSelector();
    expect(combobox).toHaveTextContent(/new/i);
  });

  it("should render correct options", async () => {
    const { combobox, user, getOptions } = renderOrderStatusSelector();

    await user.click(combobox);

    const options = getOptions();
    const labels = options.map((option) => option.textContent);

    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with $value when $label is selected",
    async ({ label, value }) => {
      const { combobox, onChange, user, getOption } =
        renderOrderStatusSelector();
      await user.click(combobox);

      const option = await getOption(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with 'new' when New is selected", async () => {
    const { combobox, onChange, user, getOption } = renderOrderStatusSelector();
    await user.click(combobox);
    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(combobox);
    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith("new");
  });
});
