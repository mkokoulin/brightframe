import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "./SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "Molecules/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  argTypes: {
    align: { control: "select", options: ["left", "center", "right"] },
  },
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

export const Centered: Story = {
  args: {
    title: "Why people work from here",
    subtitle: "A calm space, fast wifi, and a coffee shop downstairs.",
    align: "center",
  },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div style={{ padding: "48px 24px", maxWidth: 720, margin: "0 auto" }}>
      <SectionHeading {...args} />
    </div>
  ),
};

export const AsH1: Story = {
  name: "— Rendered as <h1> (page title)",
  args: {
    title: "Coworking in the heart of Yerevan",
    subtitle: "Desks, meeting rooms, and events for people who build things.",
    as: "h1",
  },
};
