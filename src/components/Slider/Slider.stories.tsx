import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Form/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { Slider } from "brightframe/Slider";

function GuestsSlider() {
  const [value, setValue] = useState(4);
  return <Slider label="Guests" value={value} onChange={(v) => setValue(v as number)} min={1} max={10} showValue />;
}
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

function SingleWrapper() {
  const [value, setValue] = useState(40);
  return (
    <div style={{ width: 320 }}>
      <Slider label="Guests" value={value} onChange={(v) => setValue(v as number)} min={1} max={10} showValue />
    </div>
  );
}

export const Playground: Story = {
  render: () => <SingleWrapper />,
};

function RangeWrapper() {
  const [value, setValue] = useState<[number, number]>([50, 200]);
  return (
    <div style={{ width: 320 }}>
      <Slider
        label="Price range"
        value={value}
        onChange={(v) => setValue(v as [number, number])}
        min={0}
        max={500}
        step={10}
        showValue
        formatValue={(v) => `$${v}`}
      />
    </div>
  );
}

export const Range: Story = {
  render: () => <RangeWrapper />,
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Slider label="Guests" value={4} onChange={() => {}} disabled showValue />
    </div>
  ),
};
