import type { Meta, StoryObj } from "@storybook/react-vite";
import { DayBadge } from "./DayBadge";

const meta: Meta<typeof DayBadge> = {
  title: "Atoms/DayBadge",
  component: DayBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DayBadge>;

export const Weekday: Story = {
  args: { date: new Date("2025-05-12") },
};

export const Weekend: Story = {
  args: { date: new Date("2025-05-11") },
};
