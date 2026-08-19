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

function Wrapper(props: { locale?: string }) {
  const today = new Date();
  const [range, setRange] = useState<Range>({ start: today, end: today });
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
