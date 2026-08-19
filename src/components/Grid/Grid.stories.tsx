import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, GridItem } from "./Grid";
import { Card } from "../Card";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `\`\`\`tsx
import { Grid, GridItem } from "brightframe/Grid";

<Grid gap={16}>
  <GridItem span={4}>Column</GridItem>
  <GridItem span={8}>Column</GridItem>
</Grid>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 64,
        borderRadius: 8,
        background: "var(--c-brand-soft)",
        color: "var(--c-brand)",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

export const Playground: Story = {
  name: "— basic 12-column grid",
  render: () => (
    <Grid gap={16}>
      <GridItem span={4}>
        <Cell>span 4</Cell>
      </GridItem>
      <GridItem span={4}>
        <Cell>span 4</Cell>
      </GridItem>
      <GridItem span={4}>
        <Cell>span 4</Cell>
      </GridItem>
      <GridItem span={12}>
        <Cell>span 12</Cell>
      </GridItem>
    </Grid>
  ),
};

export const ResponsiveColumns: Story = {
  name: "— responsive columns (resize the viewport)",
  render: () => (
    <Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={16}>
      {Array.from({ length: 8 }, (_, i) => (
        <Cell key={i}>Card {i + 1}</Cell>
      ))}
    </Grid>
  ),
};

export const ResponsiveSpans: Story = {
  name: "— responsive item spans (bento layout)",
  render: () => (
    <Grid columns={12} gap={16}>
      <GridItem span={{ base: 12, md: 8 }}>
        <Cell>Hero — span 12 → 8</Cell>
      </GridItem>
      <GridItem span={{ base: 12, md: 4 }}>
        <Cell>Sidebar — span 12 → 4</Cell>
      </GridItem>
      <GridItem span={{ base: 12, sm: 6, lg: 3 }}>
        <Cell>1</Cell>
      </GridItem>
      <GridItem span={{ base: 12, sm: 6, lg: 3 }}>
        <Cell>2</Cell>
      </GridItem>
      <GridItem span={{ base: 12, sm: 6, lg: 3 }}>
        <Cell>3</Cell>
      </GridItem>
      <GridItem span={{ base: 12, sm: 6, lg: 3 }}>
        <Cell>4</Cell>
      </GridItem>
    </Grid>
  ),
};

export const WithCards: Story = {
  name: "— composed with Card",
  render: () => (
    <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={20}>
      {["Private desks", "Meeting rooms", "Event space"].map((title) => (
        <GridItem key={title}>
          <Card variant="elevated" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--c-text-1)" }}>{title}</h3>
            <p style={{ color: "var(--c-text-2)", margin: "8px 0 0" }}>
              Available today, flexible booking, no long-term commitment.
            </p>
          </Card>
        </GridItem>
      ))}
    </Grid>
  ),
};
