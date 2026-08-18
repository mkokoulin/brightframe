import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, type TabItem } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Molecules/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["line", "pill"] },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const ITEMS: TabItem[] = [
  { id: "overview", label: "Overview", content: "A quiet coworking space in the city center, open 24/7." },
  { id: "amenities", label: "Amenities", content: "Fast wifi, meeting rooms, a coffee shop downstairs." },
  { id: "pricing", label: "Pricing", content: "Day passes, monthly desks, and dedicated offices." },
  { id: "reviews", label: "Reviews", content: "4.8 out of 5 from 120 members.", disabled: true },
];

export const Playground: Story = {
  args: {
    items: ITEMS,
    variant: "line",
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Tabs {...args} />
    </div>
  ),
};

export const Pill: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs items={ITEMS} variant="pill" />
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Tabs items={ITEMS} variant="pill" fullWidth />
    </div>
  ),
};

function ControlledWrapper() {
  const [active, setActive] = useState("overview");
  return (
    <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
      <Tabs items={ITEMS} value={active} onChange={setActive} />
      <p style={{ fontSize: 12, color: "var(--c-text-3)" }}>Active tab: {active}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledWrapper />,
};
