import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Form/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

function Wrapper() {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onChange={setChecked} label="Enable dark mode" />;
}

export const Playground: Story = {
  render: () => <Wrapper />,
};

export const On: Story = {
  args: { checked: true, onChange: () => {}, label: "Notifications enabled" },
};

export const Disabled: Story = {
  args: { checked: false, onChange: () => {}, disabled: true, label: "Not available on this plan" },
};
