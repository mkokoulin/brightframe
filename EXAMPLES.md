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

## 7. Responsive grid layout

`Grid`/`GridItem` are CSS Grid wrappers — column count, gap, and per-item spans can all vary by breakpoint (`base` < 640px, `sm` ≥ 640px, `md` ≥ 768px, `lg` ≥ 1024px, `xl` ≥ 1280px), with no JS resize listeners involved.

```tsx
import { Grid, GridItem, Card } from "brightframe";

function CardGrid() {
  return (
    // 1 column on mobile, 2 on tablet, 4 on desktop
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={16}>
      {items.map((item) => (
        <GridItem key={item.id}>
          <Card variant="elevated">{item.title}</Card>
        </GridItem>
      ))}
    </Grid>
  );
}

function DashboardLayout() {
  return (
    // 12-col grid; hero takes the full row on mobile, 8/12 on tablet+
    <Grid columns={12} gap={16}>
      <GridItem span={{ base: 12, md: 8 }}>{/* main content */}</GridItem>
      <GridItem span={{ base: 12, md: 4 }}>{/* sidebar */}</GridItem>
    </Grid>
  );
}
```

## 8. A page shell: Navbar + Footer

```tsx
import { Navbar, NavbarItem, Footer, FooterColumn, Burger } from "brightframe";
import { useState } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Navbar
      brand={<img src="/logo.svg" alt="Acme" height={32} />}
      actions={<Burger open={menuOpen} setOpen={setMenuOpen} />}
    >
      <NavbarItem href="/" active>
        Home
      </NavbarItem>
      <NavbarItem href="/coworking">Coworking</NavbarItem>
      <NavbarItem href="/events">Events</NavbarItem>
    </Navbar>
  );
}

function SiteFooter() {
  return (
    <Footer>
      <FooterColumn title="About">
        <a href="/coworking">Coworking</a>
        <a href="/events">Events</a>
      </FooterColumn>
      <FooterColumn title="Contacts">
        <a href="mailto:hello@example.com">hello@example.com</a>
      </FooterColumn>
    </Footer>
  );
}
```

## 9. Pricing card with a discount ribbon, and an empty state

```tsx
import { Card, Badge, Tag, EmptyState, Btn } from "brightframe";

function PricingCard() {
  return (
    <Card variant="outlined" style={{ position: "relative", padding: 24 }}>
      <Badge>
        <Tag variant="accent" size="sm">-20%</Tag>
      </Badge>
      <p style={{ fontWeight: 700, fontSize: 21 }}>60 000 ֏</p>
    </Card>
  );
}

function NoReviewsYet() {
  return (
    <EmptyState
      title="No reviews yet"
      description="Be the first to share your experience"
      action={<Btn variant="secondary" pill>Leave a review</Btn>}
    />
  );
}
```

## 10. Image carousel and a horizontal card scroller

```tsx
import { Carousel, HorizontalScroller, ActionCard } from "brightframe";

function Hero() {
  return (
    <Carousel>
      <img src="/photo-1.jpg" alt="" />
      <img src="/photo-2.jpg" alt="" />
    </Carousel>
  );
}

function EventsRow({ events }) {
  return (
    <HorizontalScroller>
      {events.map((e) => (
        <ActionCard key={e.id} title={e.title} description={e.time} href={e.href} style={{ width: 240 }} />
      ))}
    </HorizontalScroller>
  );
}
```

## Runnable app

[`examples/basic-vite`](./examples/basic-vite) wires all of the above together in a real Vite project that installs `brightframe` the same way a consumer would (`npm install`, importing from `dist/`). See its README for how to run it.
