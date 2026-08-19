import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MobileDatePicker, type Range } from "./MobileDatePicker";

const meta: Meta<typeof MobileDatePicker> = {
  title: "Form/MobileDatePicker",
  component: MobileDatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `\`\`\`tsx
import { MobileDatePicker } from "brightframe/MobileDatePicker";

const [open, setOpen] = useState(false);
const [range, setRange] = useState({ start: new Date(), end: new Date() });

<MobileDatePicker open={open} onClose={() => setOpen(false)} value={range} onChange={setRange} mode="range" />
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MobileDatePicker>;

function Wrapper(props: { mode?: "single" | "range"; locale?: string }) {
  const today = new Date();
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState<Range>({ start: today, end: today });
  return open ? (
    <MobileDatePicker
      open={open}
      onClose={() => setOpen(false)}
      value={value}
      onChange={setValue}
      mode={props.mode}
      locale={props.locale}
    />
  ) : (
    <button type="button" onClick={() => setOpen(true)}>
      Open picker
    </button>
  );
}

export const RangeMode: Story = {
  render: () => <Wrapper mode="range" />,
};

export const SingleMode: Story = {
  render: () => <Wrapper mode="single" />,
};

export const RussianLocale: Story = {
  render: () => <Wrapper mode="range" locale="ru-RU" />,
};
