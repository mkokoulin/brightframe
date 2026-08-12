import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "./Loader";

const meta: Meta<typeof Loader> = {
  title: "Atoms/Loader",
  component: Loader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {},
};

export const CustomColor: Story = {
  args: { color: "#1a1a1a" },
};

export const NoOverlay: Story = {
  args: { overlay: false },
};
