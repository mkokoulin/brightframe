import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubTitle } from "./SubTitle";

const meta: Meta<typeof SubTitle> = {
  title: "Atoms/SubTitle",
  component: SubTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { SubTitle } from "brightframe/SubTitle";\n\n<SubTitle>Workspaces and meeting rooms</SubTitle>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubTitle>;

export const Default: Story = {
  args: { children: "Workspaces and meeting rooms" },
};

export const AsH3: Story = {
  name: '— as="h3" (nested under a section heading)',
  args: { children: "Meeting rooms", as: "h3" },
};
