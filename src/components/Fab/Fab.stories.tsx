import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fab } from "./Fab";

const meta: Meta<typeof Fab> = {
  title: "Atoms/Fab",
  component: Fab,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Fab } from "brightframe/Fab";

<Fab label="Scroll to next section" variant="brand" style={{ position: "fixed", bottom: 24, right: 24 }}>
  ↓
</Fab>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Fab>;

const ChevronDownIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const Playground: Story = {
  args: {
    label: "Scroll to next section",
    variant: "brand",
    size: "md",
    children: <ChevronDownIcon />,
  },
};

export const Variants: Story = {
  name: "— variants",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Fab label="Brand" variant="brand">
        <ChevronDownIcon />
      </Fab>
      <Fab label="Accent" variant="accent">
        <ChevronDownIcon />
      </Fab>
      <Fab label="Danger" variant="danger">
        <ChatIcon />
      </Fab>
      <Fab label="Surface" variant="surface">
        <ChevronDownIcon />
      </Fab>
    </div>
  ),
};

export const Sizes: Story = {
  name: "— sizes",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Fab label="Small" size="sm">
        <ChevronDownIcon />
      </Fab>
      <Fab label="Medium" size="md">
        <ChevronDownIcon />
      </Fab>
      <Fab label="Large" size="lg">
        <ChevronDownIcon />
      </Fab>
    </div>
  ),
};

export const FloatingCorner: Story = {
  name: "— floating in a screen corner (via style)",
  render: () => (
    <div style={{ position: "relative", height: 200, background: "var(--c-surface-alt)", borderRadius: 12 }}>
      <Fab label="Contact support" variant="danger" style={{ position: "absolute", bottom: 16, right: 16 }}>
        <ChatIcon />
      </Fab>
    </div>
  ),
};

export const Disabled: Story = {
  name: "— disabled",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Fab label="Scroll to next section" variant="brand" disabled>
        <ChevronDownIcon />
      </Fab>
      <Fab label="Contact support" variant="danger" disabled>
        <ChatIcon />
      </Fab>
    </div>
  ),
};

export const TwoStackedFabs: Story = {
  name: "— two FABs stacked (matches the site's SOS + scroll-down buttons)",
  render: () => (
    <div style={{ position: "relative", height: 220, background: "var(--c-surface-alt)", borderRadius: 12 }}>
      <Fab
        label="Scroll to next section"
        variant="brand"
        size="sm"
        style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)" }}
      >
        <ChevronDownIcon />
      </Fab>
      <Fab label="Contact support" variant="danger" style={{ position: "absolute", bottom: 16, right: 16 }}>
        <ChatIcon />
      </Fab>
    </div>
  ),
};
