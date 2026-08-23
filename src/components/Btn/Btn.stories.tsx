import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Btn, type BtnVariant, type BtnSize } from "./Btn";

const TgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.93 3.24a1.5 1.5 0 0 0-1.6-.22L2.9 10.43a1.5 1.5 0 0 0 .13 2.78l3.97 1.24 1.97 5.9a1 1 0 0 0 1.76.28l2.43-3.1 4.1 3.01a1.5 1.5 0 0 0 2.34-1l2.5-14.5a1.5 1.5 0 0 0-.17-1.8zm-9.5 11.3-1.6 2.05-1.3-3.9 9.4-7.05-6.5 8.9z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const meta: Meta<typeof Btn> = {
  title: "Atoms/Btn",
  component: Btn,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "brand", "ghost", "danger", "external", "white"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    pill: { control: "boolean" },
    fullWidth: { control: "boolean" },
    children: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { Btn } from "brightframe/Btn";

<Btn variant="primary" size="md">Register</Btn>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Btn>;

export const Playground: Story = {
  args: {
    children: "Register",
    variant: "primary",
    size: "md",
  },
};

const VARIANTS: { v: BtnVariant; label: string; when: string }[] = [
  { v: "primary", label: "Primary", when: "Main call to action — sign up, submit a form, book." },
  { v: "secondary", label: "Secondary", when: 'Alternative action next to Primary — "See prices", "Cancel".' },
  { v: "brand", label: "Brand", when: 'Confirmation with data — "Apply date", "Next", "Apply".' },
  { v: "ghost", label: "Ghost", when: 'Secondary action — "Reset", "Clear", "Not me".' },
  { v: "danger", label: "Danger", when: 'Urgent or limited signup — event registration, "Sign up".' },
  { v: "external", label: "External", when: "Navigating to an external service — Telegram, Instagram, email." },
  { v: "white", label: "White", when: "Secondary action on a dark background (CTA banner, dark hero)." },
];

const SIZES: BtnSize[] = ["sm", "md", "lg"];

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const IconOnly: Story = {
  name: "— icon-only (44×44)",
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Btn iconOnly aria-label="Search">
        <SearchIcon />
      </Btn>
      <Btn iconOnly aria-label="Search" disabled>
        <SearchIcon />
      </Btn>
    </div>
  ),
};

function LoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Btn
      loading={loading}
      loadingLabel="Sending"
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
      }}
    >
      Send the request
    </Btn>
  );
}

export const Loading: Story = {
  name: "— loading (width locked, label swaps)",
  render: () => <LoadingDemo />,
};

export const AllVariants: Story = {
  name: "— All variants",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ padding: "32px 40px", maxWidth: 900, display: "flex", flexDirection: "column", gap: 32 }}>
      {VARIANTS.map(({ v, label }) => (
        <div key={v} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ minWidth: 100, fontSize: 12, color: "var(--c-text-3)" }}>{label}</div>
          {SIZES.map((s) => (
            <Btn key={s} variant={v} size={s}>{label}</Btn>
          ))}
          <Btn variant={v} size="lg" pill iconLeft={v === "external" ? <TgIcon /> : undefined} iconRight={v === "primary" ? <ArrowIcon /> : undefined}>
            {label}
          </Btn>
        </div>
      ))}
    </div>
  ),
};
