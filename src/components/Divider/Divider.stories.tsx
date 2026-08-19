import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '```tsx\nimport { Divider } from "brightframe/Divider";\n\n<Divider />\n<Divider label="OR" />\n<Divider orientation="vertical" />\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <p style={{ margin: "0 0 12px" }}>Above</p>
      <Divider />
      <p style={{ margin: "12px 0 0" }}>Below</p>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Divider label="OR" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", height: 40, gap: 16 }}>
      <span>Edit</span>
      <Divider orientation="vertical" />
      <span>Duplicate</span>
      <Divider orientation="vertical" />
      <span>Delete</span>
    </div>
  ),
};
