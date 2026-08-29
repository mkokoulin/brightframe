import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

const NAMES = ["Aram Petrosyan", "Irina Sokolova", "David Hovhannisyan", "Maria Klimenko", "Anna Sargsyan"];

const meta: Meta<typeof AvatarGroup> = {
  title: "Atoms/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { Avatar, AvatarGroup } from "brightframe/Avatar";

<AvatarGroup max={3}>
  <Avatar name="Aram Petrosyan" />
  <Avatar name="Irina Sokolova" />
  <Avatar name="David Hovhannisyan" />
</AvatarGroup>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Playground: Story = {
  render: () => (
    <AvatarGroup max={3}>
      {NAMES.map((n) => (
        <Avatar key={n} name={n} />
      ))}
    </AvatarGroup>
  ),
};

export const NoOverflow: Story = {
  name: "— Fewer members than max",
  render: () => (
    <AvatarGroup max={5}>
      {NAMES.slice(0, 2).map((n) => (
        <Avatar key={n} name={n} />
      ))}
    </AvatarGroup>
  ),
};

export const LargeSize: Story = {
  name: "— lg size",
  render: () => (
    <AvatarGroup max={3} size="lg">
      {NAMES.map((n) => (
        <Avatar key={n} name={n} size="lg" />
      ))}
    </AvatarGroup>
  ),
};
