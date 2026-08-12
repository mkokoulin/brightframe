import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubTitle } from "./SubTitle";

const meta: Meta<typeof SubTitle> = {
  title: "Atoms/SubTitle",
  component: SubTitle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubTitle>;

export const Default: Story = {
  args: { children: "Workspaces and meeting rooms" },
};
