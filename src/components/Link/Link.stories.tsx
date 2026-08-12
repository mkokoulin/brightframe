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
  parameters: { layout: "padded" },
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
    <p style={{ maxWidth: 420, color: "var(--c-text-2)", lineHeight: 1.6 }}>
      By continuing you agree to our{" "}
      <Link href="#" variant="brand" underline={false}>
        terms of service
      </Link>{" "}
      and <Link href="#" variant="brand" underline={false}>privacy policy</Link>.
    </p>
  ),
};
