import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormDatePicker } from "./FormDatePicker";

const meta: Meta<typeof FormDatePicker> = {
  title: "Form/FormDatePicker",
  component: FormDatePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FormDatePicker>;

export const Playground: Story = {
  args: {
    label: "Date",
    value: "",
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <FormDatePicker {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const WithError: Story = {
  args: {
    label: "Date",
    value: "",
    error: "Please pick a date",
  },
};
