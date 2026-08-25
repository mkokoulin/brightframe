import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Atoms/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "muted", "brand"] },
    underline: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { Link } from "brightframe/Link";\n\n<Link href="/terms" variant="brand">Learn more</Link>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { children: "Learn more", href: "#" },
};

export const External: Story = {
  args: { children: "Instagram", href: "#", target: "_blank" },
};

export const Variants: Story = {
  name: "— All variants",
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      <Link href="#" variant="default">Default</Link>
      <Link href="#" variant="muted">Muted</Link>
      <Link href="#" variant="brand">Brand</Link>
    </div>
  ),
};

export const NoUnderline: Story = {
  name: "— Underline on hover only",
  args: { children: "Terms of service", href: "#", underline: false },
};

export const InParagraph: Story = {
  name: "— Inline in a paragraph",
  render: () => (
    // Inline links within a block of body text need an underline (or another
    // non-color cue) so they're distinguishable without relying on color alone
    // (WCAG 1.4.1) — `underline={false}` is for links that already read as
    // clearly interactive from context (nav items, footer links), not this case.
    <p style={{ maxWidth: 420, color: "var(--c-text-2)", lineHeight: 1.6 }}>
      By continuing you agree to our{" "}
      <Link href="#" variant="brand">
        terms of service
      </Link>{" "}
      and <Link href="#" variant="brand">privacy policy</Link>.
    </p>
  ),
};
