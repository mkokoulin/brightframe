import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";
import { Eyebrow } from "../Eyebrow/Eyebrow";
import { Title } from "../Title/Title";

const meta: Meta<typeof Container> = {
  title: "Atoms/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Container } from "brightframe/Container";

<Container as="main">
  Page content
</Container>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: 16 }}>Page content on a surface background</div>,
  },
};

export const AsMain: Story = {
  name: '— as="main" (page root landmark)',
  render: () => (
    <Container as="main" style={{ padding: 32 }}>
      <Eyebrow>Coworking</Eyebrow>
      <Title>Letters and Numbers</Title>
      <p style={{ color: "var(--c-text-2)", maxWidth: 480, marginTop: 12 }}>
        Rendered as a &lt;main&gt; landmark instead of a plain &lt;div&gt; — useful for the page's single root
        wrapper.
      </p>
    </Container>
  ),
};
