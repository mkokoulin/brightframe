import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoTooltip } from "./InfoTooltip";

const meta: Meta<typeof InfoTooltip> = {
  title: "Atoms/InfoTooltip",
  component: InfoTooltip,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof InfoTooltip>;

export const Playground: Story = {
  args: {
    label: "Discount when renewing your subscription starting from the 2nd period",
  },
};

export const NextToPrice: Story = {
  name: "— Next to a price",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontWeight: 700, fontSize: 21, color: "var(--c-brand)" }}>70 000 ֏</span>
      <InfoTooltip label="5 000 ֏ discount when renewing your subscription" />
    </div>
  ),
};

export const Positions: Story = {
  name: "— All positions",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 60, padding: 60 }}>
      {(["top", "bottom", "left", "right"] as const).map((position) => (
        <div key={position} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <InfoTooltip label={`Opens ${position}`} position={position} />
          <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>{position}</span>
        </div>
      ))}
    </div>
  ),
};
