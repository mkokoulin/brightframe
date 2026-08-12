import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LabeledField } from "./LabeledField";

const meta: Meta<typeof LabeledField> = {
  title: "Form/LabeledField",
  component: LabeledField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof LabeledField>;

export const Playground: Story = {
  args: {
    label: "Name",
    value: "",
    placeholder: "Jane Doe",
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <LabeledField {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const WithPrefix: Story = {
  args: {
    label: "Phone",
    value: "+1",
    prefix: "+1",
    mask: "000-000-0000",
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <LabeledField {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const WithError: Story = {
  args: {
    label: "Name",
    value: "",
    error: "This field is required",
  },
};
