import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";
import { Card } from "../Card";
import { Avatar } from "../Avatar";

const meta: Meta<typeof Skeleton> = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["text", "circle", "rect"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '```tsx\nimport { Skeleton } from "brightframe/Skeleton";\n\n<Skeleton variant="text" lines={3} />\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {
  args: { variant: "text" },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Skeleton {...args} />
    </div>
  ),
};

export const TextLines: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Skeleton variant="text" lines={3} />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Skeleton variant="circle" />
      <Skeleton variant="rect" width={160} height={100} />
    </div>
  ),
};

export const CardPlaceholder: Story = {
  name: "Composed — card loading state",
  render: () => (
    <Card style={{ padding: 20, maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Skeleton variant="circle" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <Skeleton variant="rect" height={120} />
      <Skeleton variant="text" lines={2} />
    </Card>
  ),
};

export const LoadedForComparison: Story = {
  name: "Loaded (for comparison)",
  render: () => (
    <Card style={{ padding: 20, maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name="Ana Torres" />
        <strong>Ana Torres</strong>
      </div>
      <div style={{ height: 120, background: "var(--c-surface-2)", borderRadius: 8 }} />
      <p style={{ margin: 0, color: "var(--c-text-2)" }}>
        A quiet coworking space in the city center, open 24/7 with fast wifi and a coffee shop downstairs.
      </p>
    </Card>
  ),
};
