import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LikeButton } from "./LikeButton";

const meta: Meta<typeof LikeButton> = {
  title: "Molecules/LikeButton",
  component: LikeButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `\`\`\`tsx
import { useState } from "react";
import { LikeButton } from "brightframe/LikeButton";

function EventLike({ initialCount }: { initialCount: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  return (
    <LikeButton
      liked={liked}
      count={count}
      onToggle={() => {
        setLiked(!liked);
        setCount((c) => c + (liked ? -1 : 1));
      }}
      tooltip="Like this if you want us to run it again"
    />
  );
}
\`\`\`

Fully controlled, no data fetching of its own — wire it up to whatever
like/favorite endpoint your app has, same as \`Switch\`.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LikeButton>;

function Wrapper({ initialCount = 12, initialLiked = false, tooltip }: { initialCount?: number; initialLiked?: boolean; tooltip?: string }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  return (
    <LikeButton
      liked={liked}
      count={count}
      tooltip={tooltip}
      onToggle={() => {
        setLiked(!liked);
        setCount((c) => Math.max(0, c + (liked ? -1 : 1)));
      }}
    />
  );
}

export const Playground: Story = {
  render: () => <Wrapper />,
};

export const Liked: Story = {
  args: { liked: true, count: 13, onToggle: () => {} },
};

export const WithTooltip: Story = {
  render: () => <Wrapper tooltip="Like this if you want us to run it again" />,
};

export const Disabled: Story = {
  args: { liked: false, count: 4, disabled: true, onToggle: () => {} },
};
