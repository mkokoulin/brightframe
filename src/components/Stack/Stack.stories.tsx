import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "./Stack";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Stack>;

function Swatch({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 64,
        minHeight: 48,
        borderRadius: 8,
        background: "var(--c-brand-soft)",
        color: "var(--c-brand)",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

export const Playground: Story = {
  name: "— vertical stack, spacing-scale gap",
  render: () => (
    <Stack gap={12}>
      <Swatch>One</Swatch>
      <Swatch>Two</Swatch>
      <Swatch>Three</Swatch>
    </Stack>
  ),
};

export const RowDirection: Story = {
  name: "— row direction",
  render: () => (
    <Stack direction="row" gap={8} align="center">
      <Swatch>One</Swatch>
      <Swatch>Two</Swatch>
      <Swatch>Three</Swatch>
    </Stack>
  ),
};

export const ResponsiveDirection: Story = {
  name: "— column on mobile, row from md up (resize the viewport)",
  render: () => (
    <Stack direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 16 }}>
      <Swatch>One</Swatch>
      <Swatch>Two</Swatch>
      <Swatch>Three</Swatch>
    </Stack>
  ),
};

export const GapScale: Story = {
  name: "— every gap step on the spacing scale",
  render: () => (
    <Stack gap={16}>
      {([0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64] as const).map((gap) => (
        <div key={gap} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 56, fontFamily: "var(--font-sans)", color: "var(--c-text-2)", fontSize: 13 }}>
            {gap}px
          </span>
          <Stack direction="row" gap={gap}>
            <Swatch>A</Swatch>
            <Swatch>B</Swatch>
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};
