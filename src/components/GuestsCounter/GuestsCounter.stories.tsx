import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuestsCounter } from "./GuestsCounter";

const meta: Meta<typeof GuestsCounter> = {
  title: "Form/GuestsCounter",
  component: GuestsCounter,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof GuestsCounter>;

export const Playground: Story = {
  args: {
    value: 2,
    min: 1,
    max: 20,
  },
  render: (args) => {
    function Wrapper() {
      const [value, setValue] = useState(args.value);
      return <GuestsCounter {...args} value={value} onChange={setValue} />;
    }
    return <Wrapper />;
  },
};
