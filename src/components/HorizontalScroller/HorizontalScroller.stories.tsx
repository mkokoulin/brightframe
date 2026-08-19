import type { Meta, StoryObj } from "@storybook/react-vite";
import { HorizontalScroller } from "./HorizontalScroller";
import { Card } from "../Card";
import { ActionCard } from "../ActionCard";
import { Tag } from "../Tag";

const meta: Meta<typeof HorizontalScroller> = {
  title: "Molecules/HorizontalScroller",
  component: HorizontalScroller,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { HorizontalScroller } from "brightframe/HorizontalScroller";
import { ActionCard } from "brightframe/ActionCard";

<HorizontalScroller>
  {events.map((e) => (
    <ActionCard key={e.id} title={e.title} description={e.time} href={e.href} style={{ width: 240 }} />
  ))}
</HorizontalScroller>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HorizontalScroller>;

export const Playground: Story = {
  render: () => (
    <HorizontalScroller>
      {Array.from({ length: 8 }, (_, i) => (
        <Card key={i} variant="outlined" style={{ width: 240, padding: 20 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--c-text-1)" }}>Event {i + 1}</h3>
          <p style={{ color: "var(--c-text-2)", margin: "8px 0 0" }}>17:00 — Details about this event.</p>
        </Card>
      ))}
    </HorizontalScroller>
  ),
};

export const FewItemsNoOverflow: Story = {
  name: "— few items, nothing to scroll (arrows stay hidden)",
  render: () => (
    <HorizontalScroller>
      {Array.from({ length: 2 }, (_, i) => (
        <Card key={i} variant="outlined" style={{ width: 240, padding: 20 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--c-text-1)" }}>Event {i + 1}</h3>
        </Card>
      ))}
    </HorizontalScroller>
  ),
};

export const ArrowsDisabled: Story = {
  name: "— arrows=false (rely on native touch/trackpad scroll only)",
  render: () => (
    <HorizontalScroller arrows={false}>
      {Array.from({ length: 8 }, (_, i) => (
        <Card key={i} variant="outlined" style={{ width: 240, padding: 20 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--c-text-1)" }}>Event {i + 1}</h3>
        </Card>
      ))}
    </HorizontalScroller>
  ),
};

export const WithPricingCards: Story = {
  name: "— with pricing-style cards (narrower, more items)",
  render: () => (
    <HorizontalScroller>
      {[
        { label: "1 hour", price: "1 300 ֏" },
        { label: "4 hours", price: "3 000 ֏" },
        { label: "1 day", price: "5 000 ֏" },
        { label: "7 days", price: "20 000 ֏" },
        { label: "30 days", price: "60 000 ֏" },
      ].map((tariff) => (
        <Card key={tariff.label} variant="elevated" style={{ width: 160, padding: 16, textAlign: "center" }}>
          <Tag variant="neutral" size="sm">
            {tariff.label}
          </Tag>
          <p style={{ margin: "12px 0 0", fontWeight: 700, fontSize: 18, color: "var(--c-text-1)" }}>
            {tariff.price}
          </p>
        </Card>
      ))}
    </HorizontalScroller>
  ),
};

const RoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 18 3 20V6l6-2 6 2 6-2v14l-6 2-6-2Z" strokeLinejoin="round" />
  </svg>
);

export const WithActionCards: Story = {
  name: "— composed with ActionCard",
  render: () => (
    <HorizontalScroller>
      {["Souvenir shop", "Vacancies", "Room rental", "Storage", "Initiatives"].map((title) => (
        <div key={title} style={{ width: 220 }}>
          <ActionCard icon={<RoomIcon />} title={title} href="#" />
        </div>
      ))}
    </HorizontalScroller>
  ),
};
