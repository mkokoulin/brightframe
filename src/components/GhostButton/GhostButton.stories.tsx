import type { Meta, StoryObj } from "@storybook/react-vite";
import { GhostButton } from "./GhostButton";

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 3.5c0-.83.67-1.5 1.5-1.5H5l1.5 3.5-1.5 1c.6 1.7 1.8 2.9 3.5 3.5l1-1.5L13 10v1.5c0 .83-.67 1.5-1.5 1.5C6.4 13 2 8.6 2 3.5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const meta: Meta<typeof GhostButton> = {
  title: "Atoms/GhostButton",
  component: GhostButton,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof GhostButton>;

export const AsButton: Story = {
  args: {
    label: "How to find us",
    onClick: () => {},
  },
};

export const AsLink: Story = {
  args: {
    label: "Open on the map",
    href: "#",
  },
};

export const ExternalLink: Story = {
  args: {
    label: "Open in Google Maps",
    href: "#",
    targetBlank: true,
  },
};

export const CustomIcon: Story = {
  name: "— Custom icon",
  args: {
    label: "Call us",
    href: "tel:+37400000000",
    icon: <PhoneIcon />,
  },
};

export const Sizes: Story = {
  name: "— All sizes",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <GhostButton label="Small" size="sm" onClick={() => {}} />
      <GhostButton label="Medium" size="md" onClick={() => {}} />
      <GhostButton label="Large" size="lg" onClick={() => {}} />
    </div>
  ),
};

export const InContext: Story = {
  name: "— Next to a map",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: 320,
        padding: 20,
        background: "var(--c-surface)",
        borderRadius: 16,
        boxShadow: "var(--c-shadow-sm)",
      }}
    >
      <div
        style={{
          height: 140,
          borderRadius: 12,
          background: "linear-gradient(135deg, var(--c-surface-2), var(--c-surface-alt))",
        }}
      />
      <div style={{ fontWeight: 700, color: "var(--c-text-1)" }}>35g Tumanyan St.</div>
      <div style={{ display: "flex", gap: 8 }}>
        <GhostButton label="How to find us" onClick={() => {}} />
        <GhostButton label="Call" icon={<PhoneIcon />} href="tel:+37400000000" />
      </div>
    </div>
  ),
};
