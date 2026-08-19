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
      const [date, setDate] = useState(toYMD(new Date()));
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
