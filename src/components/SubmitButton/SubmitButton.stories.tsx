import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubmitButton } from "./SubmitButton";

const meta: Meta<typeof SubmitButton> = {
  title: "Form/SubmitButton",
  component: SubmitButton,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["accent", "brand", "ghost"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '```tsx\nimport { SubmitButton } from "brightframe/SubmitButton";\n\n<SubmitButton variant="accent">Submit request</SubmitButton>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  args: {
    children: "Submit request",
  },
};

export const Disabled: Story = {
  args: {
    children: "Submit request",
    disabled: true,
  },
};

export const Variants: Story = {
  name: "— All variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 240 }}>
      <SubmitButton variant="accent">Accent (default)</SubmitButton>
      <SubmitButton variant="brand">Brand</SubmitButton>
      <SubmitButton variant="ghost">Ghost</SubmitButton>
    </div>
  ),
};

export const InlineWidth: Story = {
  name: "— fullWidth={false}",
  args: {
    children: "Send",
    fullWidth: false,
  },
};
