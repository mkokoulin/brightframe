import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionCard } from "./ActionCard";
import { Grid, GridItem } from "../Grid";

const meta: Meta<typeof ActionCard> = {
  title: "Molecules/ActionCard",
  component: ActionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { ActionCard } from "brightframe/ActionCard";

<ActionCard
  title="Storage"
  description="Reliable storage — your comfort and peace of mind"
  href="#"
/>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionCard>;

const StorageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 3 7l9 5 9-5-9-5Z" strokeLinejoin="round" />
    <path d="M3 7v10l9 5 9-5V7" strokeLinejoin="round" />
    <path d="M12 12v10" />
  </svg>
);

export const Playground: Story = {
  args: {
    icon: <StorageIcon />,
    title: "Storage",
    description: "Reliable storage — your comfort and peace of mind",
    href: "#",
  },
};

export const Grid_: Story = {
  name: "— in a Grid",
  render: () => {
    const items = [
      { title: "Souvenir shop", description: "Find exclusive gifts and memorable items" },
      { title: "Vacancies", description: "Join our team" },
      { title: "Room rental", description: "All our spaces are fully equipped for comfortable work." },
      { title: "Storage", description: "Reliable storage — your comfort and peace of mind" },
    ];
    return (
      <Grid columns={{ base: 1, sm: 2 }} gap={16}>
        {items.map((item) => (
          <GridItem key={item.title}>
            <ActionCard icon={<StorageIcon />} title={item.title} description={item.description} href="#" />
          </GridItem>
        ))}
      </Grid>
    );
  },
};

export const AsDiv: Story = {
  name: "— as a div (no href, e.g. opens a modal onClick instead)",
  args: {
    icon: <StorageIcon />,
    title: "Open filters",
    description: "Click handled via onClick, not a link",
    onClick: () => {},
  },
};

export const NoDescription: Story = {
  name: "— title only, no description",
  args: {
    icon: <StorageIcon />,
    title: "Vacancies",
    href: "#",
  },
};

export const NoIcon: Story = {
  name: "— no icon",
  args: {
    title: "Blog",
    description: "Articles, guides and community stories",
    href: "#",
  },
};

export const LongContent: Story = {
  name: "— long title and description (wrapping)",
  args: {
    icon: <StorageIcon />,
    title: "Meeting room booking for teams of ten or more people",
    description:
      "All our meeting spaces are fully equipped with fast wifi, a projector, a whiteboard, and complimentary tea and coffee for the duration of your booking.",
    href: "#",
    style: { maxWidth: 260 },
  },
};
