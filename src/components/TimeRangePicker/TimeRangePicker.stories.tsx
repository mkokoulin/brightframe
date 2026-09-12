import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeRangePicker } from "./TimeRangePicker";
import { toYMD } from "../FormDatePicker/FormDatePicker";

const meta: Meta<typeof TimeRangePicker> = {
  title: "Form/TimeRangePicker",
  component: TimeRangePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { TimeRangePicker } from "brightframe/TimeRangePicker";

function BookingRange() {
  const [date, setDate] = useState("2026-08-19");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  return (
    <TimeRangePicker
      date={date}
      onDateChange={setDate}
      startTime={startTime}
      endTime={endTime}
      onStartTimeChange={setStartTime}
      onEndTimeChange={setEndTime}
    />
  );
}
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimeRangePicker>;

export const Playground: Story = {
  render: () => {
    function Wrapper() {
      // Fixed, not `new Date()` — Playground is the story the visual-regression suite
      // screenshots (src/test-utils/visual.stories.test.tsx picks the first export), and
      // this date is rendered visibly (the date button), so a live "today" made the
      // committed baseline drift a little further out of tolerance every day.
      const [date, setDate] = useState(toYMD(new Date(2026, 2, 12)));
      const [startTime, setStartTime] = useState("10:00");
      const [endTime, setEndTime] = useState("11:00");
      return (
        <TimeRangePicker
          date={date}
          onDateChange={setDate}
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
      );
    }
    return <Wrapper />;
  },
};
