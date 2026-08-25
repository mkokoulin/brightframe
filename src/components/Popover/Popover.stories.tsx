import { useState } from "react";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, type PopoverPosition } from "./Popover";
import { Btn } from "../Btn";

const meta: Meta<typeof Popover> = {
  title: "Molecules/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Popover } from "brightframe/Popover";

<Popover trigger="Filters">
  <p>Price range: $50 – $200</p>
</Popover>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

// Popover already renders its own <button> around `trigger` (for the
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
    <div style={{ padding: 80 }}>
      <Popover trigger={<TriggerLabel>Filters</TriggerLabel>}>
        <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Price range</p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>$50 — $200 per night</p>
      </Popover>
    </div>
  ),
};

const POSITIONS: PopoverPosition[] = ["top", "bottom", "left", "right"];

export const AllPositions: Story = {
  name: "— All positions",
  render: () => (
    <div style={{ padding: 120, display: "flex", gap: 64 }}>
      {POSITIONS.map((p) => (
        <Popover key={p} trigger={<TriggerLabel>{p}</TriggerLabel>} position={p}>
          Positioned {p}
        </Popover>
      ))}
    </div>
  ),
};

function ControlledWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 80, display: "flex", flexDirection: "column", gap: 12 }}>
      <Popover trigger={<TriggerLabel>Open</TriggerLabel>} open={open} onOpenChange={setOpen}>
        <p style={{ margin: 0 }}>Controlled from outside.</p>
      </Popover>
      <Btn size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Close externally
      </Btn>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledWrapper />,
};
