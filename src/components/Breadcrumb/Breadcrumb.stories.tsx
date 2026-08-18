import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const ITEMS: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Locations", href: "/locations" },
  { label: "Yerevan", href: "/locations/yerevan" },
  { label: "Meeting Room A" },
];

export const Playground: Story = {
  args: { items: ITEMS },
};

export const CustomSeparator: Story = {
  args: { items: ITEMS, separator: "/" },
};

export const TwoLevels: Story = {
  args: { items: [{ label: "Home", href: "/" }, { label: "Booking" }] },
};
