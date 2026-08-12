import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedBar, SegmentedItem } from "./SegmentedBar";

const meta: Meta<typeof SegmentedBar> = {
  title: "Form/SegmentedBar",
  component: SegmentedBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SegmentedBar>;

export const Playground: Story = {
  render: () => (
    <SegmentedBar>
      <SegmentedItem>Day</SegmentedItem>
      <SegmentedItem>Week</SegmentedItem>
      <SegmentedItem>Month</SegmentedItem>
    </SegmentedBar>
  ),
};
