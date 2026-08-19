import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, type AccordionItem } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Molecules/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { Accordion } from "brightframe/Accordion";

<Accordion
  items={[
    { id: "checkin", title: "What time is check-in?", content: "Check-in is from 3 PM." },
    { id: "pets", title: "Are pets allowed?", content: "Small pets are welcome in select rooms." },
  ]}
/>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const ITEMS: AccordionItem[] = [
  { id: "checkin", title: "What time is check-in?", content: "Check-in is from 3 PM, and check-out is by 11 AM." },
  { id: "pets", title: "Are pets allowed?", content: "Small pets are welcome in select rooms — please let us know in advance." },
  { id: "cancel", title: "What is the cancellation policy?", content: "Free cancellation up to 48 hours before arrival." },
  { id: "parking", title: "Is parking available?", content: "Sold out for this property.", disabled: true },
];

export const Playground: Story = {
  args: { items: ITEMS },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Accordion {...args} />
    </div>
  ),
};

export const MultipleOpen: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Accordion items={ITEMS} multiple defaultValue={["checkin", "pets"]} />
    </div>
  ),
};

function ControlledWrapper() {
  const [open, setOpen] = useState<string[]>(["checkin"]);
  return (
    <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
      <Accordion items={ITEMS} value={open} onChange={setOpen} />
      <p style={{ fontSize: 12, color: "var(--c-text-3)" }}>Open: {open.join(", ") || "none"}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledWrapper />,
};
