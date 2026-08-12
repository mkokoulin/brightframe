import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "./Loader";

const meta: Meta<typeof Loader> = {
  title: "Atoms/Loader",
  component: Loader,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: { layout: "padded" },
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

export const Sizes: Story = {
  name: "— All sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <Loader size="sm" overlay={false} />
      </div>
      <div style={{ position: "relative", width: 120, height: 120 }}>
        <Loader size="md" overlay={false} />
      </div>
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <Loader size="lg" overlay={false} />
      </div>
    </div>
  ),
};

export const OverCard: Story = {
  name: "— Overlaying a card",
  render: () => (
    <div
      style={{
        position: "relative",
        width: 280,
        height: 160,
        background: "var(--c-surface)",
        borderRadius: 16,
        boxShadow: "var(--c-shadow-sm)",
        padding: 16,
      }}
    >
      <p style={{ color: "var(--c-text-2)" }}>Loading events…</p>
      <Loader />
    </div>
  ),
};
