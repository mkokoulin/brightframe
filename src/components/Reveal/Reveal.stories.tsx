import type { Meta, StoryObj } from "@storybook/react-vite";
import { Reveal } from "./Reveal";

const meta: Meta<typeof Reveal> = {
  title: "Atoms/Reveal",
  component: Reveal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Reveal>;

export const ScrollToReveal: Story = {
  render: () => (
    <div style={{ height: 800, paddingTop: 400 }}>
      <Reveal>
        <div style={{ padding: 24, background: "var(--c-surface-alt)", borderRadius: 12, width: 280 }}>
          Scroll down to see this fade + slide in.
        </div>
      </Reveal>
    </div>
  ),
};
