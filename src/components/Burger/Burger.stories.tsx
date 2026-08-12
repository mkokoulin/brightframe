import type { Meta, StoryObj } from "@storybook/react-vite";
import { Burger } from "./Burger";

const meta: Meta<typeof Burger> = {
  title: "Atoms/Burger",
  component: Burger,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Burger>;

export const Closed: Story = {
  args: { open: false, setOpen: () => {} },
};

export const Open: Story = {
  args: { open: true, setOpen: () => {} },
};
