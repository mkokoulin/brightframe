# Examples

Copy-paste snippets for the common integration scenarios. For a full runnable app, see [`examples/basic-vite`](./examples/basic-vite).

## 1. Minimal setup (any React app)

```tsx
import "brightframe/tokens.css";
import "brightframe/style.css";
import { Btn, Card, Tag } from "brightframe";

function Example() {
  return (
    <Card variant="elevated" hover>
      <Tag variant="accent">New</Tag>
      <Btn variant="primary" onClick={() => {}}>Register</Btn>
    </Card>
  );
}
```

## 2. Loading the default font

Components render with `var(--font-sans)`, which defaults to `"PT Sans", "Helvetica Neue", Arial, sans-serif` (set in `tokens.css`). Naming the font isn't the same as loading it — import `brightframe/fonts.css` if you want the actual PT Sans webfont instead of the fallback stack:

```tsx
import "brightframe/tokens.css";
import "brightframe/fonts.css"; // optional — loads PT Sans from Google Fonts
import "brightframe/style.css";
```

Prefer a different typeface, or want to self-host? Skip `fonts.css` and override the variable instead:

```css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
}
```

## 3. Theming with `<ThemeProvider>`

Wrap your app once. `useTheme()` gives you the current theme and setters anywhere below it.

```tsx
import "brightframe/tokens.css";
import "brightframe/style.css";
import { ThemeProvider, useTheme, Btn } from "brightframe";

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

`ThemeProvider` persists the choice to `localStorage` and applies `data-theme`/`data-a11y` to `<html>` — every brightframe component (and your own CSS, if it uses the same `--c-*` custom properties) reacts automatically.

### Accessibility mode

```tsx
const { a11y, setA11y } = useTheme();
setA11y("visually-impaired"); // high-contrast palette from tokens.css
setA11y("default");           // back to normal
```

## 4. Avoiding a flash of the wrong theme on first paint

`ThemeProvider` applies the theme after mount, which is fine for client-rendered apps but can cause a visible flash on server-rendered pages. Inline `getThemeInitScript()`'s output in the document `<head>` so the correct `data-theme` is set before hydration.

**Next.js (App Router)** — `app/layout.tsx`:

```tsx
import { ThemeProvider, getThemeInitScript } from "brightframe";
import "brightframe/tokens.css";
import "brightframe/style.css";

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

## 5. A small pricing card composition

```tsx
import { Card, Tag, Btn, InfoTooltip } from "brightframe";

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

## 6. Page shell primitives

```tsx
import { Container, Eyebrow, Title, SubTitle, SectionHeading } from "brightframe";

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

[`examples/basic-vite`](./examples/basic-vite) wires all of the above together in a real Vite project that installs `brightframe` the same way a consumer would (`npm install`, importing from `dist/`). See its README for how to run it.
