import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress, type ProgressSize } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Atoms/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Playground: Story = {
  args: { value: 60, showLabel: true },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Progress {...args} />
    </div>
  ),
};

const SIZES: ProgressSize[] = ["sm", "md", "lg"];

export const Sizes: Story = {
  render: () => (
    <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
      {SIZES.map((s) => (
        <Progress key={s} value={45} size={s} />
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Progress />
    </div>
  ),
};
