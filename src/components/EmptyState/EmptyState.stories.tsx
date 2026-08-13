import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";
import { Btn } from "../Btn";
import { Card } from "../Card";

const meta: Meta<typeof EmptyState> = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

const ChatBubbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Playground: Story = {
  args: {
    icon: <ChatBubbleIcon />,
    title: "No reviews yet",
    description: "Be the first to share your experience",
  },
};

export const WithAction: Story = {
  name: "— with a call to action",
  args: {
    icon: <ChatBubbleIcon />,
    title: "No reviews yet",
    description: "Be the first to share your experience",
    action: (
      <Btn variant="secondary" pill>
        Leave a review on the site
      </Btn>
    ),
  },
};

export const TitleOnly: Story = {
  name: "— title only",
  args: {
    title: "No upcoming events",
  },
};

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" strokeLinecap="round" />
  </svg>
);

export const NoSearchResults: Story = {
  name: "— a different use case (empty search results)",
  args: {
    icon: <SearchIcon />,
    title: "No results found",
    description: "Try a different search term or clear your filters",
    action: <Btn variant="ghost">Clear filters</Btn>,
  },
};

export const InsideACard: Story = {
  name: "— inside a Card (realistic placement)",
  render: () => (
    <Card variant="outlined" style={{ maxWidth: 420 }}>
      <EmptyState
        icon={<ChatBubbleIcon />}
        title="No reviews yet"
        description="Be the first to share your experience"
        action={
          <Btn variant="secondary" pill>
            Leave a review on the site
          </Btn>
        }
      />
    </Card>
  ),
};
