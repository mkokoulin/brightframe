import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "./SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "Molecules/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const TitleOnly: Story = {
  args: { title: "Our plans" },
};

export const WithSubtitle: Story = {
  args: {
    title: "Our plans",
    subtitle: "Flexible options for any work rhythm",
  },
};
