import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag, type TagVariant } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Atoms/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["brand", "accent", "neutral", "error", "outline", "blue", "orange", "green", "purple"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    children: { control: "text" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { Tag } from "brightframe/Tag";\n\n<Tag variant="brand">Workshop</Tag>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Playground: Story = {
  args: {
    children: "Workshop",
    variant: "brand",
    size: "md",
  },
};

const VARIANTS: TagVariant[] = [
  "brand",
  "accent",
  "neutral",
  "error",
  "outline",
  "blue",
  "orange",
  "green",
  "purple",
];

export const AllVariants: Story = {
  name: "— All variants",
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {VARIANTS.map((v) => (
        <Tag key={v} variant={v}>{v}</Tag>
      ))}
    </div>
  ),
};

export const Dismissible: Story = {
  name: "— Dismissible (filter tags)",
  render: () => {
    function Wrapper() {
      const [tags, setTags] = useState(["Meeting room", "Quiet room", "Parking", "Guest"]);
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map((t) => (
            <Tag key={t} variant="outline" onDismiss={() => setTags((prev) => prev.filter((x) => x !== t))}>
              {t}
            </Tag>
          ))}
        </div>
      );
    }
    return <Wrapper />;
  },
};
