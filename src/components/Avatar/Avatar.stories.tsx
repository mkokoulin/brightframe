import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, type AvatarSize } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {
  args: {
    src: "https://i.pravatar.cc/160?img=12",
    name: "Ana Torres",
    size: "md",
  },
};

const SIZES: AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];

export const AllSizes: Story = {
  name: "— All sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {SIZES.map((s) => (
        <Avatar key={s} src="https://i.pravatar.cc/160?img=12" name="Ana Torres" size={s} />
      ))}
    </div>
  ),
};

export const InitialsFallback: Story = {
  args: { name: "Marco Kokoulin", size: "lg" },
};

export const IconFallback: Story = {
  args: { size: "lg" },
};

export const BrokenImageFallsBackToInitials: Story = {
  args: { src: "https://example.invalid/broken.jpg", name: "Jamie Fox", size: "lg" },
};
