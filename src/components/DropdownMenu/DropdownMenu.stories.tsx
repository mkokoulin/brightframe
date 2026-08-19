import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu, type DropdownMenuEntry } from "./DropdownMenu";
import { Btn } from "../Btn";

const meta: Meta<typeof DropdownMenu> = {
  title: "Molecules/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    align: { control: "select", options: ["start", "end"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { DropdownMenu } from "brightframe/DropdownMenu";

<DropdownMenu
  trigger={<button>Actions</button>}
  items={[
    { id: "edit", label: "Edit", onSelect: () => {} },
    { id: "delete", label: "Delete", danger: true, onSelect: () => {} },
  ]}
/>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

const ITEMS: DropdownMenuEntry[] = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  "separator",
  { id: "archive", label: "Archive", disabled: true },
  { id: "delete", label: "Delete", danger: true },
];

export const Playground: Story = {
  render: () => (
    <div style={{ padding: 60 }}>
      <DropdownMenu trigger={<Btn variant="secondary">Actions</Btn>} items={ITEMS} />
    </div>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div style={{ padding: 60, display: "flex", justifyContent: "flex-end" }}>
      <DropdownMenu trigger={<Btn variant="secondary">Actions</Btn>} items={ITEMS} align="end" />
    </div>
  ),
};
