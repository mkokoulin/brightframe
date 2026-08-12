import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectField, type SelectOption } from "./SelectField";

const OPTIONS: SelectOption[] = [
  { value: "am", label: "Armenian" },
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
];

const meta: Meta<typeof SelectField> = {
  title: "Form/SelectField",
  component: SelectField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Playground: Story = {
  args: {
    label: "Language",
    value: "en",
    options: OPTIONS,
    placeholder: "Select a language",
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <SelectField {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const WithError: Story = {
  args: {
    label: "Language",
    value: "",
    options: OPTIONS,
    error: "Please select a language",
  },
};
