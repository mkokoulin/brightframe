import type { Meta, StoryObj } from "@storybook/react-vite";
import { BorderBeam, type BorderBeamSize } from "./BorderBeam";
import { Card } from "../Card";

const meta: Meta<typeof BorderBeam> = {
  title: "Atoms/BorderBeam",
  component: BorderBeam,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { BorderBeam } from "brightframe/BorderBeam";

<BorderBeam>
  <Card radius="lg">Key CTA or AI-feature panel</Card>
</BorderBeam>
\`\`\`

Purely decorative — a looping gradient beam around a container's border.
Use for login panels, recommendation cards, AI-feature modules, or key CTA
blocks; not a substitute for focus rings, validation borders, or status
feedback. Respects \`prefers-reduced-motion\` (the beam freezes instead of
spinning).`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BorderBeam>;

const panel = (label: string) => (
  <Card radius="lg" style={{ width: 280, padding: 24 }}>
    {label}
  </Card>
);

export const Basic: Story = {
  render: () => <BorderBeam>{panel("Wrap any container to add a beam along its border.")}</BorderBeam>,
};

export const ShowOnHover: Story = {
  name: "— Show on hover",
  render: () => <BorderBeam triggerOnHover>{panel("Hover over this card to see the beam.")}</BorderBeam>,
};

export const Sizes: Story = {
  name: "— All sizes",
  render: () => {
    const sizes: BorderBeamSize[] = ["compact", "default", "extended"];
    return (
      <div style={{ display: "flex", gap: 24 }}>
        {sizes.map((size) => (
          <BorderBeam key={size} size={size}>
            {panel(`size="${size}"`)}
          </BorderBeam>
        ))}
      </div>
    );
  },
};

export const CustomColors: Story = {
  name: "— Custom colors",
  render: () => (
    <BorderBeam colors={["#f472b6", "#a78bfa"]} duration={4}>
      {panel("colors + duration overrides")}
    </BorderBeam>
  ),
};
