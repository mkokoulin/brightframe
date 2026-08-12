import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, type CardVariant, type CardRadius } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Atoms/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["surface", "outlined", "elevated"] },
    radius: { control: "select", options: ["sm", "md", "lg", "xl"] },
    hover: { control: "boolean" },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Card>;

const sampleContent = (
  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--c-text-1)" }}>Card title</div>
    <div style={{ fontSize: 14, color: "var(--c-text-2)", lineHeight: 1.5 }}>
      Description — one or two lines of text explaining the card's content.
    </div>
  </div>
);

export const Playground: Story = {
  args: {
    variant: "elevated",
    radius: "md",
    hover: true,
    style: { width: 300 },
    children: sampleContent,
  },
};

const VARIANTS: CardVariant[] = ["surface", "outlined", "elevated"];
const RADII: CardRadius[] = ["sm", "md", "lg", "xl"];

export const AllVariants: Story = {
  name: "— All variants",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {VARIANTS.map((v) => (
        <Card key={v} variant={v} radius="md" style={{ width: 220 }}>
          {sampleContent}
        </Card>
      ))}
    </div>
  ),
};

export const Radii: Story = {
  name: "— Corner radius",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {RADII.map((r) => (
        <Card key={r} variant="elevated" radius={r} style={{ width: 160 }}>
          {sampleContent}
        </Card>
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  name: "— As a link (href)",
  args: {
    variant: "elevated",
    radius: "lg",
    hover: true,
    href: "#",
    style: { width: 240, textDecoration: "none", color: "inherit" },
    children: sampleContent,
  },
};
