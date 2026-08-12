import type { Meta, StoryObj } from "@storybook/react-vite";
import { Reveal, type RevealDirection } from "./Reveal";

const meta: Meta<typeof Reveal> = {
  title: "Atoms/Reveal",
  component: Reveal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Reveal>;

const card = (label: string) => (
  <div
    style={{
      padding: 24,
      background: "var(--c-surface)",
      borderRadius: 12,
      boxShadow: "var(--c-shadow-sm)",
      width: 280,
    }}
  >
    {label}
  </div>
);

export const ScrollToReveal: Story = {
  render: () => (
    <div style={{ height: 800, paddingTop: 400 }}>
      <Reveal>{card("Scroll down to see this fade + slide in.")}</Reveal>
    </div>
  ),
};

export const AllDirections: Story = {
  name: "— All directions",
  render: () => {
    const directions: RevealDirection[] = ["up", "down", "left", "right"];
    return (
      <div style={{ height: 900, paddingTop: 500, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
        {directions.map((direction) => (
          <Reveal key={direction} direction={direction}>
            {card(`direction="${direction}" — scroll to trigger`)}
          </Reveal>
        ))}
      </div>
    );
  },
};

export const Staggered: Story = {
  name: "— Staggered list (delay)",
  render: () => (
    <div style={{ height: 700, paddingTop: 400, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      {[0, 120, 240].map((delay) => (
        <Reveal key={delay} delay={delay}>
          {card(`delay={${delay}}`)}
        </Reveal>
      ))}
    </div>
  ),
};
