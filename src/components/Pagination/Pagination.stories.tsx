import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function Wrapper(props: { totalPages: number; siblingCount?: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={props.totalPages} onChange={setPage} siblingCount={props.siblingCount} />;
}

export const Playground: Story = {
  render: () => <Wrapper totalPages={12} />,
};

export const FewPages: Story = {
  render: () => <Wrapper totalPages={4} />,
};

export const ManyPagesWithEllipsis: Story = {
  render: () => <Wrapper totalPages={50} />,
};

export const WiderSiblingRange: Story = {
  render: () => <Wrapper totalPages={20} siblingCount={2} />,
};
