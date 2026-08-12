import { useState } from "react";
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

const CalendarIcon = ({ active }: { active?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" color={active ? "var(--c-brand)" : undefined}>
    <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 1v2M11 1v2M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const ListIcon = ({ active }: { active?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" color={active ? "var(--c-brand)" : undefined}>
    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const WithIcons: Story = {
  name: "— With icons",
  render: () => {
    function Wrapper() {
      const [view, setView] = useState<"calendar" | "list">("calendar");
      return (
        <SegmentedBar role="tablist" aria-label="View mode">
          <SegmentedItem
            icon={<CalendarIcon active={view === "calendar"} />}
            role="tab"
            aria-selected={view === "calendar"}
            onClick={() => setView("calendar")}
          >
            {view === "calendar" ? <strong>Calendar</strong> : "Calendar"}
          </SegmentedItem>
          <SegmentedItem
            icon={<ListIcon active={view === "list"} />}
            role="tab"
            aria-selected={view === "list"}
            onClick={() => setView("list")}
          >
            {view === "list" ? <strong>List</strong> : "List"}
          </SegmentedItem>
        </SegmentedBar>
      );
    }
    return <Wrapper />;
  },
};

export const NaturalWidth: Story = {
  name: "— grow={false} (natural width)",
  render: () => (
    <SegmentedBar>
      <SegmentedItem grow={false}>All</SegmentedItem>
      <SegmentedItem grow={false}>Active</SegmentedItem>
      <SegmentedItem grow={false}>Archived</SegmentedItem>
    </SegmentedBar>
  ),
};
