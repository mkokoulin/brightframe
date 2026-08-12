# brightframe

Independent React UI kit extracted from the [LAN](https://github.com/mkokoulin/lan-site) coworking site — a small set of presentational primitives (buttons, cards, tags, headings, ...) built on a light/dark/high-contrast design token system.

No app framework, i18n, or routing dependencies — every component here is a pure, self-contained function of its props.

## Install

```bash
npm install brightframe
```

React 18+ and React DOM 18+ are peer dependencies.

## Usage

Import the design tokens once at your app root, then use any component:

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

- `brightframe/tokens.css` — CSS custom properties (colors, shadows, motion). Required.
- `brightframe/style.css` — compiled component styles (CSS Modules output). Required.

### Theming

Tokens respond to `data-theme`/`data-a11y` attributes on any ancestor element (typically `<html>`). You can set these by hand:

```html
<html data-theme="dark">        <!-- dark theme -->
<html data-a11y="visually-impaired"> <!-- high-contrast mode -->
```

Omit both attributes for the light (default) theme. Or use `<ThemeProvider>` to manage them for you:

```tsx
import { ThemeProvider, useTheme } from "brightframe";

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme, a11y, setA11y } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {resolvedTheme === "dark" ? "🌙" : "☀️"} ({theme})
    </button>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system"> {/* "light" | "dark" | "system" */}
      <ThemeToggle />
      {/* rest of your app */}
    </ThemeProvider>
  );
}
```

`ThemeProvider`:
- Resolves `"system"` against `prefers-color-scheme` and keeps it in sync if the OS theme changes while mounted.
- Persists the choice to `localStorage` (key configurable via `storageKey`, default `"brightframe"`).
- Applies `data-theme`/`data-a11y` to `document.documentElement` — no wrapper `<div>`, no layout impact.
- Briefly suppresses CSS transitions on theme change so colors don't visibly animate (`disableTransitionOnChange`, default `true`).

For server-rendered apps (Next.js, etc.), pair it with `getThemeInitScript()` to avoid a flash of the wrong theme before hydration — see [EXAMPLES.md](./EXAMPLES.md#3-avoiding-a-flash-of-the-wrong-theme-on-first-paint).

## Components

| Component | Description |
|---|---|
| `Btn` | Unified button/link — 7 variants (`primary`, `secondary`, `brand`, `ghost`, `danger`, `external`, `white`), 3 sizes, pill/fullWidth/icon slots |
| `Card` | Surface wrapper — `surface`/`outlined`/`elevated` variants, configurable radius, optional hover animation, renders as `<a>` when `href` is passed |
| `Tag` | Inline label/badge — 5 variants, 3 sizes |
| `InfoTooltip` | Hover/focus/click tooltip triggered by a question-mark icon |
| `GhostButton` | Minimal text button with a leading icon (defaults to a pin icon) |
| `Eyebrow` | Small uppercase label above a heading |
| `SectionHeading` | `<h2>` + optional subtitle for section intros |
| `DayBadge` | Calendar-day badge (weekday/day/month), weekend styling, localizable via `locale` |
| `Reveal` | Fade + slide-in wrapper on scroll into view (`IntersectionObserver`), respects `prefers-reduced-motion` |
| `InfoCards` | Responsive icon + text card list (5 built-in icons) |
| `Loader` | Spinning SVG loader, optional dim overlay |
| `Burger` | Animated hamburger menu toggle |
| `Link` | Simple underlined text link |
| `Title` / `SubTitle` | `<h1>` / `<h2>` display headings |
| `Container` | Full-height block with a surface background |
| `ThemeProvider` / `useTheme` | Light/dark/system theme + a11y mode, persisted and applied to `<html>` |
| `getThemeInitScript` | Inline script to prevent a flash of the wrong theme on server-rendered pages |

All components are named exports and ship their own `.d.ts` types.

## Examples

See [EXAMPLES.md](./EXAMPLES.md) for copy-paste snippets (basic usage, theming, Next.js flash-free setup, page composition), and [`examples/basic-vite`](./examples/basic-vite) for a full runnable app.

## Local development

```bash
npm install
npm run storybook       # interactive component playground on :6006
npm run build            # emit dist/ (ESM + CJS + types + CSS)
npm run typecheck
npm run test              # vitest, jsdom
```

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for the full release checklist (versioning, npm login, publishing, post-publish verification, fixing a bad release).

## Origin

These components were extracted from `lan-site`'s internal component library. Two adaptations were made during extraction so the kit has no dependency on that app:

- `Btn`/`GhostButton`/etc. never depend on `next/navigation` — routing is left to the consumer via `href`/`onClick`.
- Legacy components that used plain global CSS classes (`Title`, `SubTitle`, `Link`, `Container`, `Burger`, `Loader`) were converted to CSS Modules to avoid class-name collisions in consuming apps.

## License

MIT
