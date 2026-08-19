import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, type TooltipPosition } from "./Tooltip";
import { Btn } from "../Btn";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { Tooltip } from "brightframe/Tooltip";\n\n<Tooltip content="Saved to your favorites">\n  <button>Hover me</button>\n</Tooltip>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  args: {
    content: "Saved to your favorites",
    position: "top",
  },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Tooltip {...args}>
        <Btn variant="secondary">Hover me</Btn>
      </Tooltip>
    </div>
  ),
};

const POSITIONS: TooltipPosition[] = ["top", "bottom", "left", "right"];

export const AllPositions: Story = {
  name: "— All positions",
  render: () => (
    <div style={{ padding: 80, display: "flex", gap: 48 }}>
      {POSITIONS.map((p) => (
        <Tooltip key={p} content={`Position: ${p}`} position={p}>
          <Btn variant="ghost">{p}</Btn>
        </Tooltip>
      ))}
    </div>
  ),
};

export const OnPlainText: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip content="Coordinated Universal Time">
        <span style={{ textDecoration: "underline dotted", cursor: "help" }}>UTC</span>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip content="You won't see this" disabled>
        <Btn variant="ghost">Disabled tooltip</Btn>
      </Tooltip>
    </div>
  ),
};
