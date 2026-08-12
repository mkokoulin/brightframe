import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./Eyebrow";

const meta: Meta<typeof Eyebrow> = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {
  args: { children: "Coworking" },
};

export const Long: Story = {
  args: { children: "Events and happenings" },
};

export const AsSpan: Story = {
  name: '— as="span" (inline, next to a title)',
  render: () => (
    <h2 style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <Eyebrow as="span">New</Eyebrow>
      <span>Autumn workshop lineup</span>
    </h2>
  ),
};
