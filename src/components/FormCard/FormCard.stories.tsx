import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormCard } from "./FormCard";

const meta: Meta<typeof FormCard> = {
  title: "Form/FormCard",
  component: FormCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FormCard>;

export const Playground: Story = {
  args: {
    children: "Card content goes here",
  },
};
