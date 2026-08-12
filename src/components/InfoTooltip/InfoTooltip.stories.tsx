import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoTooltip } from "./InfoTooltip";

const meta: Meta<typeof InfoTooltip> = {
  title: "Atoms/InfoTooltip",
  component: InfoTooltip,
  tags: ["autodocs"],
  argTypes: { label: { control: "text" } },
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
