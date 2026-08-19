import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, type AlertVariant } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Atoms/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "error"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Alert } from "brightframe/Alert";

<Alert variant="info" title="Heads up">
  Check-in opens at 3 PM local time.
</Alert>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Playground: Story = {
  args: {
    variant: "info",
    title: "Heads up",
    children: "Check-in opens at 3 PM local time.",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Alert {...args} />
    </div>
  ),
};

const VARIANTS: AlertVariant[] = ["info", "success", "warning", "error"];

export const AllVariants: Story = {
  name: "— All variants",
  render: () => (
    <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
      {VARIANTS.map((v) => (
        <Alert key={v} variant={v} title={v[0].toUpperCase() + v.slice(1)}>
          This is a {v} message.
        </Alert>
      ))}
    </div>
  ),
};

export const DescriptionOnly: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Alert variant="warning">Your card expires at the end of this month.</Alert>
    </div>
  ),
};

function DismissibleWrapper() {
  const [open, setOpen] = useState(true);
  if (!open) return <p style={{ fontSize: 13, color: "var(--c-text-3)" }}>Dismissed.</p>;
  return (
    <Alert variant="success" title="Booking confirmed" onDismiss={() => setOpen(false)}>
      We've emailed your confirmation.
    </Alert>
  );
}

export const Dismissible: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <DismissibleWrapper />
    </div>
  ),
};
