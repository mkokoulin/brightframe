import type { Meta, StoryObj } from "@storybook/react-vite";
import { DayBadge } from "./DayBadge";

const meta: Meta<typeof DayBadge> = {
  title: "Atoms/DayBadge",
  component: DayBadge,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["md", "compact"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { DayBadge } from "brightframe/DayBadge";\n\n<DayBadge date={new Date(2025, 4, 12)} size="compact" />\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DayBadge>;

export const Weekday: Story = {
  args: { date: new Date(2025, 4, 12) },
};

export const Weekend: Story = {
  args: { date: new Date(2025, 4, 11) },
};

export const Compact: Story = {
  args: { date: new Date(2025, 4, 12), size: "compact" },
};

export const EnglishLocale: Story = {
  name: "— English locale",
  args: { date: new Date(2025, 4, 12), locale: "en-US" },
};

export const EventsList: Story = {
  name: "— In an events list",
  parameters: { layout: "fullscreen" },
  render: () => {
    const events = [
      { date: new Date(2025, 4, 12), title: "Clay Modeling Workshop", time: "18:00" },
      { date: new Date(2025, 4, 14), title: "Startup Pitch Night", time: "19:30" },
      { date: new Date(2025, 4, 17), title: "Weekend Board Games", time: "16:00" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480, padding: 24 }}>
        {events.map((e) => (
          <div
            key={e.title}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              padding: 12,
              background: "var(--c-surface)",
              borderRadius: 14,
              boxShadow: "var(--c-shadow-sm)",
            }}
          >
            <DayBadge date={e.date} size="compact" />
            <div>
              <div style={{ fontWeight: 700, color: "var(--c-text-1)" }}>{e.title}</div>
              <div style={{ fontSize: 13, color: "var(--c-text-2)" }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
