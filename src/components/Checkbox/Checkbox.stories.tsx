import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

function Wrapper() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={setChecked} label="Send me booking confirmations by email" />;
}

export const Playground: Story = {
  render: () => <Wrapper />,
};

export const Checked: Story = {
  args: { checked: true, onChange: () => {}, label: "Subscribed" },
};

export const Indeterminate: Story = {
  args: { checked: false, onChange: () => {}, indeterminate: true, label: "Some rooms selected" },
};

export const Disabled: Story = {
  args: { checked: false, onChange: () => {}, disabled: true, label: "Not available for this plan" },
};

export const WithError: Story = {
  args: { checked: false, onChange: () => {}, label: "Accept the terms", error: "You must accept the terms to continue" },
};
