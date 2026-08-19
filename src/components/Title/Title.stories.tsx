import type { Meta, StoryObj } from "@storybook/react-vite";
import { Title } from "./Title";
import { Eyebrow } from "../Eyebrow/Eyebrow";
import { SubTitle } from "../SubTitle/SubTitle";

const meta: Meta<typeof Title> = {
  title: "Atoms/Title",
  component: Title,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { Title } from "brightframe/Title";\n\n<Title>Letters and Numbers</Title>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {
  args: { children: "Letters and Numbers" },
};

export const Long: Story = {
  args: { children: "An inspiring coworking space and coffee shop in the center of Yerevan" },
};

export const AsH2: Story = {
  name: '— as="h2" (page already has an <h1>)',
  args: { children: "Upcoming events", as: "h2" },
};

export const HeroComposition: Story = {
  name: "— With Eyebrow + SubTitle",
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Eyebrow>Coworking</Eyebrow>
      <Title>Letters and Numbers</Title>
      <SubTitle>Workspaces and meeting rooms in the center of Yerevan</SubTitle>
    </div>
  ),
};
