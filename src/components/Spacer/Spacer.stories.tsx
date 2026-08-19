import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spacer } from "./Spacer";
import { Stack } from "../Stack";

const meta: Meta<typeof Spacer> = {
  title: "Layout/Spacer",
  component: Spacer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Spacer>;

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

export const VerticalGap: Story = {
  name: "— explicit vertical gap between two blocks",
  render: () => (
    <Stack gap={0}>
      <Swatch>Above</Swatch>
      <Spacer size={32} />
      <Swatch>Below</Swatch>
    </Stack>
  ),
};

export const HorizontalGap: Story = {
  name: "— explicit horizontal gap in a row",
  render: () => (
    <Stack direction="row" gap={0}>
      <Swatch>Left</Swatch>
      <Spacer axis="horizontal" size={24} />
      <Swatch>Right</Swatch>
    </Stack>
  ),
};

export const AutoSpring: Story = {
  name: "— auto spring pushes content apart (e.g. toolbar left/right groups)",
  render: () => (
    <Stack
      direction="row"
      gap={0}
      align="center"
      style={{ border: "1px solid var(--c-border)", borderRadius: 12, padding: 12 }}
    >
      <Swatch>Logo</Swatch>
      <Spacer size="auto" />
      <Swatch>Actions</Swatch>
    </Stack>
  ),
};
