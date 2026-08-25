import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu, type DropdownMenuEntry } from "./DropdownMenu";

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
  trigger="Actions"
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

// DropdownMenu already renders its own <button> around `trigger` (for the
// aria-haspopup/aria-expanded wiring) — `trigger` itself must be non-interactive
// content (text, icon, styled span), never another button/link, or the two nest
// into invalid, inaccessible markup (WCAG 4.1.2, axe rule "nested-interactive").
function TriggerLabel({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 36,
        padding: "0 18px",
        borderRadius: "var(--radius-999)",
        border: "1px solid var(--c-border)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

export const Playground: Story = {
  render: () => (
    <div style={{ padding: 60 }}>
      <DropdownMenu trigger={<TriggerLabel>Actions</TriggerLabel>} items={ITEMS} />
    </div>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div style={{ padding: 60, display: "flex", justifyContent: "flex-end" }}>
      <DropdownMenu trigger={<TriggerLabel>Actions</TriggerLabel>} items={ITEMS} align="end" />
    </div>
  ),
};
