import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Burger } from "./Burger";

const meta: Meta<typeof Burger> = {
  title: "Atoms/Burger",
  component: Burger,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Burger>;

export const Closed: Story = {
  args: { open: false, setOpen: () => {} },
};

export const Open: Story = {
  args: { open: true, setOpen: () => {} },
};

export const Interactive: Story = {
  name: "— Click to toggle",
  render: () => {
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return <Burger open={open} setOpen={setOpen} />;
    }
    return <Wrapper />;
  },
};

export const Sizes: Story = {
  name: "— All sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Burger open={false} setOpen={() => {}} size="sm" />
      <Burger open={false} setOpen={() => {}} size="md" />
      <Burger open={false} setOpen={() => {}} size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  args: { open: false, setOpen: () => {}, color: "var(--c-accent)" },
};
