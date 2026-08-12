import { useState } from "react";
import {
  ThemeProvider,
  useTheme,
  Container,
  Eyebrow,
  Title,
  SubTitle,
  SectionHeading,
  Btn,
  GhostButton,
  Card,
  Tag,
  InfoTooltip,
  InfoCards,
  DayBadge,
  Loader,
  Link,
  Burger,
} from "haloui";

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, a11y, setA11y } = useTheme();

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Tag variant="neutral">{resolvedTheme}</Tag>
      <Btn size="sm" variant={theme === "light" ? "primary" : "secondary"} onClick={() => setTheme("light")}>
        Light
      </Btn>
      <Btn size="sm" variant={theme === "dark" ? "primary" : "secondary"} onClick={() => setTheme("dark")}>
        Dark
      </Btn>
      <Btn size="sm" variant={theme === "system" ? "primary" : "secondary"} onClick={() => setTheme("system")}>
        System
      </Btn>
      <Btn
        size="sm"
        variant={a11y === "visually-impaired" ? "danger" : "ghost"}
        onClick={() => setA11y(a11y === "visually-impaired" ? "default" : "visually-impaired")}
      >
        A11y
      </Btn>
    </div>
  );
}

function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Container style={{ minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid var(--c-border-soft)",
        }}
      >
        <strong>haloui example</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ThemeToggle />
          <Burger open={menuOpen} setOpen={setMenuOpen} />
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px", display: "flex", flexDirection: "column", gap: 48 }}>
        <section>
          <Eyebrow>Coworking</Eyebrow>
          <Title>Letters and Numbers</Title>
          <SubTitle>Workspaces and meeting rooms</SubTitle>
        </section>

        <section>
          <SectionHeading title="Our plans" subtitle="Flexible options for any work rhythm" />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Card variant="elevated" radius="lg" hover style={{ padding: 24, width: 260 }}>
              <Tag variant="accent">Popular</Tag>
              <p style={{ margin: "12px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ fontSize: 21 }}>70 000 ֏</strong>
                <InfoTooltip label="5 000 ֏ discount when renewing your subscription" />
              </p>
              <Btn variant="primary" fullWidth>
                Register
              </Btn>
            </Card>

            <Card variant="outlined" radius="lg" style={{ padding: 24, width: 260 }}>
              <Tag variant="neutral">Day pass</Tag>
              <p style={{ margin: "12px 0", fontSize: 21, fontWeight: 700 }}>5 000 ֏</p>
              <Btn variant="secondary" fullWidth>
                Book a day
              </Btn>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeading title="What's included" />
          <InfoCards
            items={[
              { id: "1", icon: "building", title: "Meeting Rooms", description: "Cozy rooms for up to 20 people.", href: "#", linkText: "Learn more →" },
              { id: "2", icon: "wallet", title: "Flexible Plans", description: "Choose what suits you best.", href: "#", linkText: "See prices →" },
              { id: "3", icon: "map", title: "City Center", description: "Near the metro and major landmarks." },
              { id: "4", icon: "hearts", title: "Vibrant Community", description: "Regular events and meetups.", href: "#", linkText: "All events →" },
            ]}
          />
        </section>

        <section>
          <SectionHeading title="Upcoming" />
          <div style={{ display: "flex", gap: 16 }}>
            <DayBadge date={new Date(2026, 7, 14)} />
            <DayBadge date={new Date(2026, 7, 15)} />
          </div>
        </section>

        <section style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <GhostButton label="How to find us" onClick={() => {}} />
          <Link href="#">Read the FAQ</Link>
          <Btn variant="ghost" onClick={() => setLoading((v) => !v)}>
            Toggle loader
          </Btn>
        </section>

        {loading && (
          <div style={{ position: "relative", height: 120 }}>
            <Loader />
          </div>
        )}
      </main>
    </Container>
  );
}

export function App() {
  return (
    <ThemeProvider storageKey="haloui-example">
      <Page />
    </ThemeProvider>
  );
}
