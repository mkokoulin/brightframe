import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { Card } from "../Card";
import { Tag } from "../Tag";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Badge } from "brightframe/Badge";
import { Tag } from "brightframe/Tag";

<div style={{ position: "relative" }}>
  <Badge>
    <Tag variant="accent" size="sm">-20%</Tag>
  </Badge>
</div>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  render: () => (
    <Card variant="outlined" style={{ position: "relative", width: 220, padding: 20 }}>
      <Badge>
        <Tag variant="accent" size="sm">
          -20%
        </Tag>
      </Badge>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 21, color: "var(--c-text-1)" }}>60 000 ֏</p>
      <p style={{ margin: "4px 0 0", color: "var(--c-text-2)" }}>30 days</p>
    </Card>
  ),
};

export const Corners: Story = {
  name: "— all four corners",
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((corner) => (
        <Card key={corner} variant="outlined" style={{ position: "relative", width: 140, height: 100 }}>
          <Badge corner={corner}>
            <Tag variant="brand" size="sm">
              {corner}
            </Tag>
          </Badge>
        </Card>
      ))}
    </div>
  ),
};

export const TagVariants: Story = {
  name: "— with different Tag colors",
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["accent", "brand", "error", "neutral", "outline"] as const).map((variant) => (
        <Card key={variant} variant="outlined" style={{ position: "relative", width: 140, height: 100 }}>
          <Badge>
            <Tag variant={variant} size="sm">
              {variant}
            </Tag>
          </Badge>
        </Card>
      ))}
    </div>
  ),
};

export const CustomContent: Story = {
  name: "— with icon + text (not just a Tag)",
  render: () => (
    <Card variant="elevated" style={{ position: "relative", width: 220, padding: 20 }}>
      <Badge>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            borderRadius: 999,
            background: "var(--c-brand)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ★ New
        </span>
      </Badge>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: "var(--c-text-1)" }}>Ian+ subscription</p>
      <p style={{ margin: "4px 0 0", color: "var(--c-text-2)" }}>96 000 ֏</p>
    </Card>
  ),
};

export const OnAnActionCard: Story = {
  name: "— on a non-Card parent",
  render: () => (
    <div
      style={{
        position: "relative",
        width: 220,
        padding: 20,
        background: "var(--c-surface-alt)",
        borderRadius: 12,
      }}
    >
      <Badge corner="top-left">
        <Tag variant="error" size="sm">
          Sold out
        </Tag>
      </Badge>
      <p style={{ margin: 0, color: "var(--c-text-1)" }}>Any element with `position: relative` works, not just Card.</p>
    </div>
  ),
};
