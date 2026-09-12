import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarSlider, type Range, type Preset } from "./CalendarSlider";

const meta: Meta<typeof CalendarSlider> = {
  title: "Form/CalendarSlider",
  component: CalendarSlider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { CalendarSlider, type Range } from "brightframe/CalendarSlider";

const [range, setRange] = useState<Range>({ start: new Date(), end: new Date() });

<CalendarSlider value={range} onChange={(r) => setRange(r)} />
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CalendarSlider>;

// Fixed, not `new Date()` — Playground is the story the visual-regression suite screenshots
// (src/test-utils/visual.stories.test.tsx picks the first export), and this component renders
// its day-strip window (and each cell's day number) directly from this value, so a live "today"
// made the committed baseline drift a little further out of tolerance every day.
const FIXED_TODAY = new Date(2026, 2, 12);

function Wrapper(props: { locale?: string }) {
  const [range, setRange] = useState<Range>({ start: FIXED_TODAY, end: FIXED_TODAY });
  return (
    <CalendarSlider
      value={range}
      onChange={(r: Range, _preset: Preset) => setRange(r)}
      locale={props.locale}
    />
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};

export const RussianLocale: Story = {
  render: () => <Wrapper locale="ru-RU" />,
};
