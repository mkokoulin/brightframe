import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoCards } from "./InfoCards";

const meta: Meta<typeof InfoCards> = {
  title: "Organisms/InfoCards",
  component: InfoCards,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InfoCards>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "1",
        icon: "building",
        title: "Meeting Rooms",
        description: "Cozy rooms for meetings, negotiations, and workshops for up to 20 people.",
        href: "#",
        linkText: "Learn more →",
      },
      {
        id: "2",
        icon: "wallet",
        title: "Flexible Plans",
        description: "An hour, half a day, a day, or a month — choose what suits you best.",
        href: "#",
        linkText: "See prices →",
      },
      {
        id: "3",
        icon: "map",
        title: "In the City Center",
        description: "Near the metro and major landmarks.",
      },
      {
        id: "4",
        icon: "hearts",
        title: "Vibrant Community",
        description: "Regular events, lectures, workshops, and creative meetups.",
        href: "#",
        linkText: "All events →",
      },
    ],
  },
};
