import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, type RadioOption } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Form/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["vertical", "horizontal"] },
  },
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { RadioGroup } from "brightframe/RadioGroup";

const [plan, setPlan] = useState("month");
const options = [
  { value: "day", label: "Day pass" },
  { value: "month", label: "Monthly desk" },
];

<RadioGroup options={options} value={plan} onChange={setPlan} label="Plan" />
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const OPTIONS: RadioOption[] = [
  { value: "day", label: "Day pass" },
  { value: "month", label: "Monthly desk" },
  { value: "office", label: "Dedicated office" },
  { value: "enterprise", label: "Enterprise", disabled: true },
];

function Wrapper(props: { direction?: "vertical" | "horizontal" }) {
  const [value, setValue] = useState("month");
  return <RadioGroup options={OPTIONS} value={value} onChange={setValue} label="Plan" direction={props.direction} />;
}

export const Playground: Story = {
  render: () => <Wrapper />,
};

export const Horizontal: Story = {
  render: () => <Wrapper direction="horizontal" />,
};

export const WithError: Story = {
  args: {
    options: OPTIONS,
    value: "",
    onChange: () => {},
    label: "Plan",
    error: "Choose a plan to continue",
  },
};
