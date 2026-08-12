import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubmitButton } from "./SubmitButton";

const meta: Meta<typeof SubmitButton> = {
  title: "Form/SubmitButton",
  component: SubmitButton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  args: {
    children: "Submit request",
  },
};

export const Disabled: Story = {
  args: {
    children: "Submit request",
    disabled: true,
  },
};
