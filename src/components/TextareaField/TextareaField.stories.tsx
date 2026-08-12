import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaField } from "./TextareaField";

const meta: Meta<typeof TextareaField> = {
  title: "Form/TextareaField",
  component: TextareaField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TextareaField>;

export const Playground: Story = {
  args: {
    label: "Comment",
    value: "",
    placeholder: "Leave a comment",
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <TextareaField {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const WithError: Story = {
  args: {
    label: "Comment",
    value: "",
    error: "This field is required",
  },
};
