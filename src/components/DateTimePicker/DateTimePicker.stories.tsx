import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "./DateTimePicker";

const meta: Meta<typeof DateTimePicker> = {
  title: "Form/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Playground: Story = {
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState<Date>(new Date());
      return <DateTimePicker value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};

export const RussianLabels: Story = {
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState<Date>(new Date());
      return (
        <DateTimePicker
          value={value}
          onChange={setValue}
          labels={{
            months: [
              "Января",
              "Февраля",
              "Марта",
              "Апреля",
              "Мая",
              "Июня",
              "Июля",
              "Августа",
              "Сентября",
              "Октября",
              "Ноября",
              "Декабря",
            ],
            weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            today: "Сегодня",
            pickTime: "Выбрать время",
            pickDate: "Выбрать дату",
            done: "Готово",
            timeLabel: "Время",
          }}
        />
      );
    }
    return <Wrapper />;
  },
};
