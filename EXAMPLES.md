# Examples

Copy-paste snippets for the common integration scenarios. For a full runnable app, see [`examples/basic-vite`](./examples/basic-vite).

## 1. Minimal setup (any React app)

```tsx
import "haloui/tokens.css";
import "haloui/style.css";
import { Btn, Card, Tag } from "haloui";

function Example() {
  return (
    <Card variant="elevated" hover>
      <Tag variant="accent">New</Tag>
      <Btn variant="primary" onClick={() => {}}>Register</Btn>
    </Card>
  );
}
```

## 2. Theming with `<ThemeProvider>`

Wrap your app once. `useTheme()` gives you the current theme and setters anywhere below it.

```tsx
import "haloui/tokens.css";
import "haloui/style.css";
import { ThemeProvider, useTheme, Btn } from "haloui";

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span>Current: {resolvedTheme} (preference: {theme})</span>
      <Btn size="sm" onClick={toggleTheme}>Toggle</Btn>
      <Btn size="sm" variant="ghost" onClick={() => setTheme("system")}>Use system</Btn>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ThemeToggle />
      {/* rest of your app */}
    </ThemeProvider>
  );
}
```

`ThemeProvider` persists the choice to `localStorage` and applies `data-theme`/`data-a11y` to `<html>` — every haloui component (and your own CSS, if it uses the same `--c-*` custom properties) reacts automatically.

### Accessibility mode

```tsx
const { a11y, setA11y } = useTheme();
setA11y("visually-impaired"); // high-contrast palette from tokens.css
setA11y("default");           // back to normal
```

## 3. Avoiding a flash of the wrong theme on first paint

`ThemeProvider` applies the theme after mount, which is fine for client-rendered apps but can cause a visible flash on server-rendered pages. Inline `getThemeInitScript()`'s output in the document `<head>` so the correct `data-theme` is set before hydration.

**Next.js (App Router)** — `app/layout.tsx`:

```tsx
import { ThemeProvider, getThemeInitScript } from "haloui";
import "haloui/tokens.css";
import "haloui/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Keep `getThemeInitScript()`'s options (`storageKey`, `defaultTheme`) in sync with the `<ThemeProvider>` props — they read/write the same `localStorage` keys.

## 4. A small pricing card composition

```tsx
import { Card, Tag, Btn, InfoTooltip } from "haloui";

function PricingCard() {
  return (
    <Card variant="elevated" radius="lg" hover style={{ width: 280, padding: 24 }}>
      <Tag variant="accent">Popular</Tag>
      <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <strong style={{ fontSize: 21 }}>70 000 ֏</strong>
        <InfoTooltip label="5 000 ֏ discount when renewing your subscription" />
      </p>
      <Btn variant="primary" fullWidth>Register</Btn>
    </Card>
  );
}
```

## 5. Page shell primitives

```tsx
import { Container, Eyebrow, Title, SubTitle, SectionHeading } from "haloui";

function Hero() {
  return (
    <Container>
      <Eyebrow>Coworking</Eyebrow>
      <Title>Letters and Numbers</Title>
      <SubTitle>Workspaces and meeting rooms</SubTitle>
      <SectionHeading title="Our plans" subtitle="Flexible options for any work rhythm" />
    </Container>
  );
}
```

## Runnable app

[`examples/basic-vite`](./examples/basic-vite) wires all of the above together in a real Vite project that installs `haloui` the same way a consumer would (`npm install`, importing from `dist/`). See its README for how to run it.
