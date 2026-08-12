import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { Btn } from "../components/Btn";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";

function DemoPanel() {
  const { theme, resolvedTheme, setTheme, toggleTheme, a11y, setA11y } = useTheme();

  return (
    <Card variant="elevated" radius="lg" style={{ padding: 24, width: 340, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Tag variant="brand">theme: {theme}</Tag>{" "}
        <Tag variant="accent">resolved: {resolvedTheme}</Tag>{" "}
        <Tag variant={a11y === "visually-impaired" ? "error" : "neutral"}>a11y: {a11y}</Tag>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn size="sm" variant={theme === "light" ? "primary" : "secondary"} onClick={() => setTheme("light")}>
          Light
        </Btn>
        <Btn size="sm" variant={theme === "dark" ? "primary" : "secondary"} onClick={() => setTheme("dark")}>
          Dark
        </Btn>
        <Btn size="sm" variant={theme === "system" ? "primary" : "secondary"} onClick={() => setTheme("system")}>
          System
        </Btn>
        <Btn size="sm" variant="ghost" onClick={toggleTheme}>
          Toggle
        </Btn>
      </div>

      <Btn
        size="sm"
        variant={a11y === "visually-impaired" ? "danger" : "ghost"}
        onClick={() => setA11y(a11y === "visually-impaired" ? "default" : "visually-impaired")}
      >
        {a11y === "visually-impaired" ? "Disable" : "Enable"} high-contrast mode
      </Btn>
    </Card>
  );
}

const meta: Meta<typeof ThemeProvider> = {
  title: "Theme/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const Playground: Story = {
  render: () => (
    <ThemeProvider storageKey="haloui-storybook">
      <DemoPanel />
    </ThemeProvider>
  ),
};
