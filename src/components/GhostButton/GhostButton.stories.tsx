import type { Meta, StoryObj } from "@storybook/react-vite";
import { GhostButton } from "./GhostButton";

const meta: Meta<typeof GhostButton> = {
  title: "Atoms/GhostButton",
  component: GhostButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GhostButton>;

export const AsButton: Story = {
  args: {
    label: "How to find us",
    onClick: () => {},
  },
};

export const AsLink: Story = {
  args: {
    label: "Open on the map",
    href: "#",
  },
};

export const ExternalLink: Story = {
  args: {
    label: "Open in Google Maps",
    href: "#",
    targetBlank: true,
  },
};
