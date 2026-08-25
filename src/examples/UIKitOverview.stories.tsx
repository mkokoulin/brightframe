import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Btn } from "../components/Btn/Btn";
import { GhostButton } from "../components/GhostButton/GhostButton";
import { SubmitButton } from "../components/SubmitButton/SubmitButton";
import { LabeledField } from "../components/LabeledField/LabeledField";
import { TextareaField } from "../components/TextareaField/TextareaField";
import { SelectField, type SelectOption } from "../components/SelectField/SelectField";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { Switch } from "../components/Switch/Switch";
import { RadioGroup, type RadioOption } from "../components/RadioGroup/RadioGroup";
import { Accordion } from "../components/Accordion/Accordion";
import { Tabs } from "../components/Tabs/Tabs";
import { Card } from "../components/Card/Card";
import { ActionCard } from "../components/ActionCard/ActionCard";
import { Combobox } from "../components/Combobox/Combobox";
import { DropdownMenu } from "../components/DropdownMenu/DropdownMenu";
import { Tag } from "../components/Tag/Tag";
import { Skeleton } from "../components/Skeleton/Skeleton";
import { Pagination } from "../components/Pagination/Pagination";
import { DateTimePicker } from "../components/DateTimePicker/DateTimePicker";
import { Alert } from "../components/Alert/Alert";
import { Navbar, NavbarItem } from "../components/Navbar/Navbar";
import { Burger } from "../components/Burger/Burger";
import { Drawer } from "../components/Drawer/Drawer";
import { Modal } from "../components/Modal/Modal";
import { ToastProvider, useToast } from "../components/Toast/Toast";
import { Carousel } from "../components/Carousel/Carousel";
import { HorizontalScroller } from "../components/HorizontalScroller/HorizontalScroller";
import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";
import { Footer, FooterColumn } from "../components/Footer/Footer";
import { Fab } from "../components/Fab/Fab";
import { Loader } from "../components/Loader/Loader";
import { Progress } from "../components/Progress/Progress";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { InfoTooltip } from "../components/InfoTooltip/InfoTooltip";
import { Popover } from "../components/Popover/Popover";
import { Slider } from "../components/Slider/Slider";
import { GuestsCounter } from "../components/GuestsCounter/GuestsCounter";
import { TimeRangePicker } from "../components/TimeRangePicker/TimeRangePicker";
import { Avatar } from "../components/Avatar/Avatar";
import { DayBadge } from "../components/DayBadge/DayBadge";
import { FormCard } from "../components/FormCard/FormCard";
import { Eyebrow } from "../components/Eyebrow/Eyebrow";
import { Title } from "../components/Title/Title";
import { SubTitle } from "../components/SubTitle/SubTitle";
import { Link } from "../components/Link/Link";
import { SectionHeading } from "../components/SectionHeading/SectionHeading";
import { Divider } from "../components/Divider/Divider";
import { CalendarSlider, type Range as CalendarRange } from "../components/CalendarSlider/CalendarSlider";
import { FormDatePicker, toYMD } from "../components/FormDatePicker/FormDatePicker";
import { MobileDatePicker } from "../components/MobileDatePicker/MobileDatePicker";
import { SegmentedBar, SegmentedItem } from "../components/SegmentedBar/SegmentedBar";
import { Container } from "../components/Container/Container";
import { Grid, GridItem } from "../components/Grid/Grid";
import { Stack } from "../components/Stack/Stack";
import { Spacer } from "../components/Spacer/Spacer";
import { Reveal } from "../components/Reveal/Reveal";

/**
 * A single scrollable specimen page mirroring `design_handoff_brightframe_v2/UI Kit.dc.html`'s
 * structure (sticky header + theme switch, hero, token strip, 20 numbered sections) — but built
 * entirely from the real, shipped components instead of the prototype's inline-styled mockup.
 * Doubles as an integration check that everything touched across the redesign still composes.
 */

// ────────────────────────────────────────────────────────────────────────
// Theme switch — sets the same two document attributes Storybook's own
// toolbar decorator does (see .storybook/preview.tsx), so it works without
// nesting a second ThemeProvider inside a story (which would fight the
// decorator for control of the same attributes).
// ────────────────────────────────────────────────────────────────────────

type PageTheme = "light" | "dark" | "a11y";

function useLocalTheme() {
  const [theme, setTheme] = useState<PageTheme>("light");
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme === "dark" ? "dark" : "");
    root.setAttribute("data-a11y", theme === "a11y" ? "visually-impaired" : "");
    return () => {
      root.removeAttribute("data-theme");
      root.removeAttribute("data-a11y");
    };
  }, [theme]);
  return [theme, setTheme] as const;
}

function ThemeSwitch({ theme, onChange }: { theme: PageTheme; onChange: (t: PageTheme) => void }) {
  const options: { value: PageTheme; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "a11y", label: "A+A" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, padding: 4, background: "var(--c-surface-2)", borderRadius: "var(--radius-999)" }}>
      {options.map((opt) => {
        const active = opt.value === theme;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              minHeight: 34,
              padding: "0 16px",
              border: "none",
              borderRadius: "var(--radius-999)",
              background: active ? "var(--c-surface)" : "transparent",
              boxShadow: active ? "var(--c-shadow-sm)" : "none",
              color: active ? "var(--c-text-1)" : "var(--c-text-2)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-size-12)",
              fontWeight: "var(--font-weight-600)",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Shared section chrome
// ────────────────────────────────────────────────────────────────────────

// `heading`/`description` are the actual copy from design_handoff_brightframe_v2/UI Kit.dc.html's
// per-section eyebrow/headline/description rows, not invented text — see the "corrected against
// the actual prototype file" changelog entry for why that distinction matters here.
function SectionBlock({
  id,
  index,
  title,
  heading,
  description,
  children,
}: {
  id: string;
  index: string;
  title: string;
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ padding: "48px 0", borderTop: "1px solid var(--c-border-soft)" }}>
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-700)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 8 }}>
              {index} — {title}
            </div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-700)", color: "var(--c-text-1)" }}>
              {heading}
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 14, lineHeight: 1.6, color: "var(--c-text-2)" }}>{description}</p>
        </div>
        {children}
      </Container>
    </section>
  );
}

function Specimen({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 24, background: "var(--c-surface)", border: "1px solid var(--c-border-soft)", borderRadius: "var(--radius-lg)" }}>
      {label && (
        <div style={{ marginBottom: 14, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-11)", fontWeight: 700, letterSpacing: "var(--letter-spacing-10)", textTransform: "uppercase", color: "var(--c-text-3)" }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

// Visually matches Btn's `secondary` variant, but as a `<span>` — for use as the
// `trigger` of DropdownMenu/Popover, which already render their own `<button>` around
// whatever `trigger` is, so passing a real `<Btn>` here would nest two <button>s.
function FakeButtonLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 36,
        padding: "0 18px",
        borderRadius: "var(--radius-999)",
        border: "1px solid var(--c-border)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--font-size-13)",
        fontWeight: "var(--font-weight-700)",
        color: "var(--c-text-1)",
      }}
    >
      {children}
    </span>
  );
}

const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 };

// The prototype calls out a short editorial rule under several sections (accordion,
// header nav) — a small labelled aside, distinct from the `Specimen` demo cards.
function RuleNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, padding: "14px 18px", background: "var(--c-brand-soft)", borderRadius: "var(--radius-md)" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-11)", fontWeight: 700, letterSpacing: "var(--letter-spacing-10)", textTransform: "uppercase", color: "var(--c-brand)", marginBottom: 4 }}>
        Rule
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--c-text-2)" }}>{children}</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 01 Buttons
// ────────────────────────────────────────────────────────────────────────

const BUTTON_GROUPS: { title: string; note: string; variant: React.ComponentProps<typeof Btn>["variant"]; label: string }[] = [
  { title: "Primary", note: "one per screen", variant: "primary", label: "Book a desk" },
  { title: "Secondary", note: "next to the primary", variant: "secondary", label: "See the plans" },
  { title: "Quiet", note: "in dense lists", variant: "ghost", label: "Learn more" },
  { title: "Danger", note: "deletion only", variant: "danger", label: "Cancel the booking" },
];

const groupCardStyle: React.CSSProperties = { padding: 24, background: "var(--c-surface)", border: "1px solid var(--c-border-soft)", borderRadius: "var(--radius-lg)" };
const groupHeadStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 };
const groupTitleStyle: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: "var(--font-size-15)", fontWeight: "var(--font-weight-700)", color: "var(--c-text-1)" };
const groupNoteStyle: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: "var(--font-size-12)", color: "var(--c-text-3)" };

function ButtonsSection() {
  const [loading, setLoading] = useState(false);
  return (
    <SectionBlock
      id="buttons"
      index="01"
      title="Buttons"
      heading="Four variants, three sizes"
      description="Primary is a solid accent fill, secondary is outlined, quiet has no background, danger is for deletion only. Heights 36/44/52px, never below 44 on mobile."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 20 }}>
        {BUTTON_GROUPS.map((g) => (
          <div key={g.title} style={groupCardStyle}>
            <div style={groupHeadStyle}>
              <span style={groupTitleStyle}>{g.title}</span>
              <span style={groupNoteStyle}>{g.note}</span>
            </div>
            <Stack gap={10}>
              <Btn variant={g.variant} size="sm">{g.label}</Btn>
              <Btn variant={g.variant} size="md">{g.label}</Btn>
              <Btn variant={g.variant} size="lg">{g.label}</Btn>
              <Btn variant={g.variant} disabled>Disabled</Btn>
            </Stack>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        <Specimen label="Icon buttons">
          <div style={row}>
            <Btn iconOnly aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </Btn>
            <Btn iconOnly aria-label="Calendar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            </Btn>
            <Btn iconOnly aria-label="Favorite">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20.5s-7.5-4.6-9.7-9C.6 8 2 4.5 5.4 4.1 8 3.8 10 5 12 7.5 14 5 16 3.8 18.6 4.1 22 4.5 23.4 8 21.7 11.5c-2.2 4.4-9.7 9-9.7 9Z" />
              </svg>
            </Btn>
            <Btn iconOnly aria-label="More">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="19" cy="12" r="1.8" />
              </svg>
            </Btn>
          </div>
        </Specimen>
        <Specimen label="Loading state">
          <Stack gap={10}>
            <Btn
              loading={loading}
              loadingLabel="Sending"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1600);
              }}
            >
              Send the request
            </Btn>
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>
              The button width is fixed before the click so the layout does not shift.
            </p>
          </Stack>
        </Specimen>
        <Specimen label="Keyboard focus">
          <Stack gap={10}>
            <Btn variant="secondary" style={{ outline: "2px solid var(--c-brand)", outlineOffset: 3 }}>
              This is :focus-visible
            </Btn>
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>
              One rule across the kit: a 2px accent outline at 3px offset. The browser&rsquo;s blue ring is never used.
            </p>
          </Stack>
        </Specimen>
        <Specimen label="Also in the kit">
          <div style={row}>
            <GhostButton label="View on map" />
            <SubmitButton style={{ width: 160 }}>Submit</SubmitButton>
          </div>
        </Specimen>
      </div>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 02 Fields and forms
// ────────────────────────────────────────────────────────────────────────

const PLAN_OPTIONS: SelectOption[] = [
  { value: "day", label: "Day pass" },
  { value: "10day", label: "10-day pass" },
  { value: "desk", label: "Dedicated desk" },
];
const DURATION_OPTIONS: RadioOption[] = [
  { value: "1h", label: "One hour" },
  { value: "half", label: "Half day" },
  { value: "full", label: "Full day" },
];

function FormsSection() {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState("10day");
  const [duration, setDuration] = useState("half");
  const [parking, setParking] = useState(true);
  const [guest, setGuest] = useState(false);
  const [monitor, setMonitor] = useState(false);
  const [eventsEmail, setEventsEmail] = useState(true);
  const [visitDate, setVisitDate] = useState("2026-08-23");
  const [visitDateTime, setVisitDateTime] = useState(new Date(2026, 7, 23, 10, 0));
  return (
    <SectionBlock
      id="forms"
      index="02"
      title="Fields and forms"
      heading="Label above, hint below"
      description="Every field is 48px tall at the same radius. The error takes the hint's place, so the form does not jump on validation."
    >
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Text + textarea">
          <Stack gap={16}>
            <div>
              <LabeledField label="Name" value={name} onChange={setName} placeholder="Jane Doe" />
              <p style={{ margin: "6px 0 0", fontSize: "var(--font-size-13)", color: "var(--c-text-3)" }}>Appears in the booking email</p>
            </div>
            <LabeledField label="Email" value="jane@" onChange={() => {}} error="This address looks incomplete" />
            <TextareaField label="Comment" value={notes} onChange={setNotes} rows={3} placeholder="Anything we should know?" />
          </Stack>
        </Specimen>
        <Specimen label="Select, checkbox, switch, radio">
          <Stack gap={16}>
            <SelectField label="Plan" value={plan} onChange={setPlan} options={PLAN_OPTIONS} />
            <RadioGroup options={DURATION_OPTIONS} value={duration} onChange={setDuration} label="Meeting room" direction="horizontal" />
            <Stack gap={8}>
              <Checkbox checked={parking} onChange={setParking} label="I need parking" />
              <Checkbox checked={guest} onChange={setGuest} label="Bringing a guest" />
              <Checkbox checked={monitor} onChange={setMonitor} label="I need a monitor" />
            </Stack>
            <Switch checked={eventsEmail} onChange={setEventsEmail} label="Email me about events" />
          </Stack>
        </Specimen>
      </div>
      <Specimen label="Input types · text, date, date+time">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <LabeledField label="Guest name" value={name} onChange={setName} placeholder="Jane Doe" />
          <FormDatePicker label="Date of visit" value={visitDate} onChange={setVisitDate} />
          <div>
            <span style={{ display: "block", marginBottom: 6, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-13)", fontWeight: 700, color: "var(--c-text-1)" }}>
              Date and time
            </span>
            <DateTimePicker value={visitDateTime} onChange={setVisitDateTime} />
          </div>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--c-text-2)" }}>
          Date and time always open the kit&rsquo;s own calendar and time-slot panels — never the browser&rsquo;s native picker, so they look the
          same on every platform.
        </p>
      </Specimen>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 03 Accordion / 04 Tabs
// ────────────────────────────────────────────────────────────────────────

function AccordionSection() {
  return (
    <SectionBlock
      id="accordion"
      index="03"
      title="Accordion"
      heading="Exactly one section is open"
      description="The whole row is the button, reachable by mouse and keyboard. The sign on the right rotates instead of swapping for another icon."
    >
      <Specimen>
        <Accordion
          defaultValue={["a"]}
          items={[
            {
              id: "a",
              title: "How to book a desk",
              content:
                "Pick a plan, a date and a time on the booking page. Confirmation arrives by email, and a reminder comes through Telegram an hour before you start.",
            },
            { id: "b", title: "What the pass includes", content: "Desk access, wifi, coffee, and one meeting-room hour a day." },
            { id: "c", title: "Can I come in with a laptop at the weekend", content: "Yes — the venue runs by advance booking only on Sundays." },
            { id: "d", title: "Is there a discount for teams", content: "Yes, from 3 seats — contact us for pricing." },
          ]}
        />
        <RuleNote>A section title fits one line on desktop. If it does not, it is not a question but a documentation page.</RuleNote>
      </Specimen>
    </SectionBlock>
  );
}

const MOBILE_TAB_ITEMS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Coworking",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    label: "Events",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    label: "Blog",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12l4 4v12H4z" />
        <path d="M8 10h8M8 14h8M8 18h5" />
      </svg>
    ),
  },
  {
    label: "More",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="19" cy="12" r="1.8" />
      </svg>
    ),
  },
];

function TabsSection() {
  const [active, setActive] = useState("Home");
  const tabItems = [
    {
      id: "desks",
      label: "Desks",
      content: (
        <p style={{ color: "var(--c-text-2)" }}>
          Twenty-eight desks in the open hall and eight in the quiet room. Every desk has a monitor, an adjustable top and a socket on the surface.
        </p>
      ),
    },
    { id: "rooms", label: "Meeting rooms", content: <p style={{ color: "var(--c-text-2)" }}>Two rooms, bookable by the hour from the app.</p> },
    { id: "cafe", label: "Café", content: <p style={{ color: "var(--c-text-2)" }}>Coffee, tea and light snacks — free for pass holders.</p> },
  ];
  return (
    <SectionBlock
      id="tabs"
      index="04"
      title="Tabs"
      heading="Two kinds: pills and underline"
      description="Pills switch content inside a block; the underline navigates between parts of a page."
    >
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Pills">
          <Tabs items={tabItems} variant="pill" />
        </Specimen>
        <Specimen label="Underline">
          <Tabs items={tabItems} variant="line" />
        </Specimen>
      </div>
      <Specimen label="Icon tabs · mobile bar">
        <div style={{ display: "flex", justifyContent: "space-around", padding: "4px 0" }}>
          {MOBILE_TAB_ITEMS.map((item) => {
            const isActive = item.label === active;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActive(item.label)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  width: 64,
                  height: 64,
                  border: "none",
                  background: "none",
                  color: isActive ? "var(--c-brand)" : "var(--c-text-3)",
                  cursor: "pointer",
                }}
              >
                {item.icon}
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--font-size-11)",
                    lineHeight: "14px",
                    fontWeight: isActive ? 700 : 400,
                    padding: "1px 8px",
                    borderRadius: "var(--radius-999)",
                    background: isActive ? "var(--c-brand-soft)" : "transparent",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--c-text-2)" }}>
          Icon above label. The current section takes the accent pill on its label and tints its glyph to match; the rest stay neutral. Targets are
          64px tall.
        </p>
      </Specimen>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 05 Cards
// ────────────────────────────────────────────────────────────────────────

function FeatureRow({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--c-text-2)" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {children}
    </li>
  );
}

const PRICING_PLANS: {
  eyebrow: string;
  featured?: boolean;
  price: string;
  description: string;
  features: string[];
  cta: string;
}[] = [
  {
    eyebrow: "One-off",
    price: "5 000 ֏",
    description: "A day in the open hall, coffee included.",
    features: ["Any free desk", "Kitchen and printer", "Wi-Fi 500 Mbit"],
    cta: "Choose",
  },
  {
    eyebrow: "Pass",
    featured: true,
    price: "38 000 ֏",
    description: "Ten days a month, an hour of meeting room a day.",
    features: ["Ten days a month", "Meeting room 1h/day", "50 printed pages"],
    cta: "Get the pass",
  },
  {
    eyebrow: "Dedicated desk",
    price: "95 000 ֏",
    description: "Your own desk, locker and mailing address.",
    features: ["Assigned desk", "A locker with a key", "A guest once a week"],
    cta: "Talk to us",
  },
];

const EVENT_CARDS: { day: string; month: string; tag: string; free?: boolean; title: string; meta: string }[] = [
  { day: "14", month: "MAR", tag: "Meetup", free: true, title: "How to read logs and not panic", meta: "19:00 · hall · 24 seats" },
  { day: "22", month: "MAR", tag: "Members", title: "Sunday breakfast for residents", meta: "11:00 · café" },
];

function CardsSection() {
  return (
    <SectionBlock
      id="cards"
      index="05"
      title="Cards"
      heading="Plans and events on one frame"
      description="Identical fields, one button height in the footer, and the featured plan differs by background rather than size, so the grid holds."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 20 }}>
        {PRICING_PLANS.map((plan) => (
          <Card key={plan.eyebrow} variant={plan.featured ? "elevated" : "outlined"} radius="lg" hover style={{ padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-13)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--letter-spacing-10)", color: "var(--c-text-3)" }}>
                {plan.eyebrow}
              </span>
              {plan.featured && <Tag variant="purple" size="sm">Most popular</Tag>}
            </div>
            <div style={{ marginTop: 12, fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 700, color: "var(--c-text-1)" }}>{plan.price}</div>
            <p style={{ margin: "4px 0 16px", color: "var(--c-text-2)", fontSize: 15 }}>{plan.description}</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {plan.features.map((f) => (
                <FeatureRow key={f}>{f}</FeatureRow>
              ))}
            </ul>
            <Btn variant={plan.featured ? "primary" : "secondary"} style={{ marginTop: 20, width: "100%" }}>
              {plan.cta}
            </Btn>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 20 }}>
        {EVENT_CARDS.map((ev) => (
          <Card key={ev.title} variant="outlined" radius="lg" style={{ padding: 20, display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "var(--c-text-1)", lineHeight: 1.1 }}>{ev.day}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "var(--c-text-3)", textTransform: "uppercase" }}>{ev.month}</div>
            </div>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <Tag variant="blue" size="sm">{ev.tag}</Tag>
                {ev.free && <Tag variant="green" size="sm">Free</Tag>}
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "var(--c-text-1)" }}>{ev.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--c-text-3)" }}>{ev.meta}</p>
            </div>
          </Card>
        ))}
      </div>
      <Specimen label="Skeleton">
        <Stack gap={10}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rect" height={80} />
          <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>Same radius and same line height as the real card, so the swap does not flash.</p>
        </Stack>
      </Specimen>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 06 Data
// ────────────────────────────────────────────────────────────────────────

const BOOKING_ROWS: { guest: string; plan: string; date: string; status: string; statusVariant: React.ComponentProps<typeof Tag>["variant"] }[] = [
  { guest: "Aram Petrosyan", plan: "1day", date: "12 March", status: "Active", statusVariant: "green" },
  { guest: "Irina Sokolova", plan: "30days", date: "12 March", status: "Pass", statusVariant: "blue" },
  { guest: "David Hovhannisyan", plan: "4hours", date: "13 March", status: "Awaiting payment", statusVariant: "orange" },
  { guest: "Maria Klimenko", plan: "lan+", date: "13 March", status: "Active", statusVariant: "green" },
];

function RemovableTag({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <Tag variant="outline">
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {children}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
          style={{ border: "none", background: "none", padding: 0, cursor: "pointer", color: "inherit", lineHeight: 1, fontSize: 14 }}
        >
          ×
        </button>
      </span>
    </Tag>
  );
}

function DataSection() {
  const [plan, setPlan] = useState("7days");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(["Meeting room", "Quiet room", "Parking", "Guest"]);
  return (
    <SectionBlock
      id="data"
      index="06"
      title="Dropdown, badges, table"
      heading="Data and labels"
      description="Badges take four ready background/text pairs from the tokens. The table holds one row density, and pagination never changes the block height."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 20 }}>
        <Specimen label="Dropdown with its own list">
          <Combobox
            label="Pass"
            value={plan}
            onChange={setPlan}
            options={[
              { value: "1hour", label: "1 hour" },
              { value: "4hours", label: "4 hours" },
              { value: "1day", label: "1 day" },
              { value: "7days", label: "7-day pass" },
              { value: "30days", label: "30 days" },
              { value: "lan+", label: "lan+" },
            ]}
          />
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--c-text-2)" }}>
            Opens on click and Enter, closes on Escape and on selection. For three short options use the segmented control instead.
          </p>
        </Specimen>
        <Specimen label="Dropdown menu">
          <DropdownMenu
            trigger={<FakeButtonLabel>Actions ▾</FakeButtonLabel>}
            items={[
              { id: "edit", label: "Edit" },
              { id: "dup", label: "Duplicate" },
              "separator",
              { id: "del", label: "Delete", danger: true },
            ]}
          />
        </Specimen>
        <Specimen label="Badges and tags">
          <Stack gap={10}>
            <div style={row}>
              <Tag variant="green">Active</Tag>
              <Tag variant="orange">Awaiting payment</Tag>
            </div>
            <div style={row}>
              <Tag variant="blue">Pass</Tag>
              <Tag variant="purple">Event</Tag>
              {filters.map((f) => (
                <RemovableTag key={f} onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}>
                  {f}
                </RemovableTag>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>A badge reports status and is not clickable. A tag with a cross is a filter and can be removed.</p>
          </Stack>
        </Specimen>
      </div>
      <Specimen label="Bookings this week · 12 bookings · March">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
            <thead>
              <tr>
                {["Guest", "Plan", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0 0 10px",
                      fontSize: "var(--font-size-11)",
                      fontWeight: 700,
                      letterSpacing: "var(--letter-spacing-10)",
                      textTransform: "uppercase",
                      color: "var(--c-text-3)",
                      borderBottom: "1px solid var(--c-border-soft)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKING_ROWS.map((r) => (
                <tr key={r.guest}>
                  <td style={{ padding: "12px 0", fontSize: 14, color: "var(--c-text-1)", borderBottom: "1px solid var(--c-border-soft)" }}>{r.guest}</td>
                  <td style={{ padding: "12px 0", fontSize: 14, color: "var(--c-text-2)", borderBottom: "1px solid var(--c-border-soft)" }}>{r.plan}</td>
                  <td style={{ padding: "12px 0", fontSize: 14, color: "var(--c-text-2)", borderBottom: "1px solid var(--c-border-soft)" }}>{r.date}</td>
                  <td style={{ padding: "12px 0", borderBottom: "1px solid var(--c-border-soft)" }}>
                    <Tag variant={r.statusVariant} size="sm">{r.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16 }}>
          <Pagination page={page} totalPages={3} onChange={setPage} />
        </div>
      </Specimen>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 07 Calendar and alerts
// ────────────────────────────────────────────────────────────────────────

const CALENDAR_LEGEND: { swatch: React.CSSProperties; label: string }[] = [
  { swatch: { background: "var(--c-brand)" }, label: "Selected" },
  { swatch: { background: "transparent", border: "2px solid var(--c-brand)" }, label: "Today" },
  { swatch: { background: "var(--c-surface-2)" }, label: "Closed" },
];

function CalendarAlertsSection() {
  const [date, setDate] = useState(new Date());
  return (
    <SectionBlock
      id="calendar"
      index="07"
      title="Calendar and alerts"
      heading="Day picking and messages"
      description="Unavailable days read as such before you click. The alert lives in the page flow; the toast sits above it and leaves on its own."
    >
      <div style={grid2}>
        <Specimen label="DateTimePicker">
          <DateTimePicker value={date} onChange={setDate} disableDate={(d) => d.getDay() === 0} />
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {CALENDAR_LEGEND.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "var(--radius-999)", ...item.swatch }} />
                <span style={{ fontSize: 12, color: "var(--c-text-2)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Specimen>
        <Specimen label="Alerts">
          <Stack gap={10}>
            <Alert variant="success" title="Booking confirmed">Desk 14 in the open hall, 12 March from 10:00.</Alert>
            <Alert variant="warning" title="Awaiting payment">The pass activates once payment clears; the link has been sent on Telegram.</Alert>
            <Alert variant="info" title="Schedule change">On Sunday the venue runs by advance booking only.</Alert>
            <Alert variant="error" title="Payment failed">The bank declined the payment. Try another card or write to us.</Alert>
          </Stack>
        </Specimen>
      </div>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 08 Header and navigation / 09 Overlays
// ────────────────────────────────────────────────────────────────────────

function NavSection() {
  const [open, setOpen] = useState(false);
  return (
    <SectionBlock
      id="nav"
      index="08"
      title="Header and navigation"
      heading="One header, two states"
      description="On desktop, links in a row and one primary button. On mobile the same sections move into a sheet and the button stays visible."
    >
      <Stack gap={20}>
        <Specimen label="Default — scrolls with the page, try it">
          <div style={{ border: "1px solid var(--c-border-soft)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <Navbar brand={<strong style={{ fontFamily: "var(--font-sans)" }}>LAN</strong>} actions={<Btn size="sm">Book a desk</Btn>}>
              <NavbarItem active>Coworking</NavbarItem>
              <NavbarItem>Events</NavbarItem>
              <NavbarItem>Education</NavbarItem>
              <NavbarItem>Blog</NavbarItem>
              <Burger open={open} setOpen={setOpen} size="sm" />
            </Navbar>
          </div>
        </Specimen>
        <Specimen label="Scrolled state: shorter, with a shadow">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 20px",
              border: "1px solid var(--c-border-soft)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--c-shadow-sm)",
            }}
          >
            <strong style={{ fontFamily: "var(--font-sans)" }}>LAN</strong>
            <Btn size="sm">Book a desk</Btn>
          </div>
        </Specimen>
        <RuleNote>No more than five sections in a row. Everything else goes under &ldquo;More&rdquo;, not into smaller type.</RuleNote>
      </Stack>
    </SectionBlock>
  );
}

function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <SectionBlock
      id="overlays"
      index="09"
      title="Overlays"
      heading="Modal, drawer and toast"
      description="A modal for a short confirmation, a drawer for a form on mobile, a toast for the outcome. All close on backdrop click and Escape."
    >
      <div style={row}>
        <Btn variant="secondary" onClick={() => setModalOpen(true)}>Open the modal</Btn>
        <Btn variant="secondary" onClick={() => setDrawerOpen(true)}>Open the drawer</Btn>
        <ToastDemoButton />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm booking" footer={
        <>
          <Btn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => setModalOpen(false)}>Confirm</Btn>
        </>
      }>
        <p>You're about to book the meeting room for 10:00–11:00 today.</p>
      </Modal>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" title="Filters">
        <p style={{ color: "var(--c-text-2)" }}>Drawer body content goes here.</p>
      </Drawer>
    </SectionBlock>
  );
}

function ToastDemoButton() {
  const { toast } = useToast();
  return (
    <Btn variant="secondary" onClick={() => toast({ variant: "success", title: "Saved", description: "Your changes were saved." })}>
      Show a toast
    </Btn>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 10 Site blocks / 11 Media
// ────────────────────────────────────────────────────────────────────────

function SiteBlocksSection() {
  const imgSlot: React.CSSProperties = {
    height: 120,
    borderRadius: "var(--radius-md)",
    background: "var(--c-brand-soft)",
    marginBottom: 14,
  };
  return (
    <SectionBlock
      id="site"
      index="10"
      title="Site blocks"
      heading="Discounted plan, event, service, post"
      description="The four cards that appear most often across the site. One radius, one button height, and the discount badge never stretches the card."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        <Card variant="outlined" radius="lg" style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag variant="green" size="sm">−20%</Tag>
            <Tag variant="outline" size="sm">30d</Tag>
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "var(--c-text-1)" }}>30days</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "6px 0 14px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "var(--c-text-1)" }}>60 000 ֏</span>
            <span style={{ fontSize: 14, color: "var(--c-text-3)", textDecoration: "line-through" }}>75 000 ֏</span>
          </div>
          <ul style={{ listStyle: "none", margin: "0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <FeatureRow>Dedicated desk</FeatureRow>
            <FeatureRow>Meeting room 10h</FeatureRow>
            <FeatureRow>Storage</FeatureRow>
          </ul>
          <Btn variant="primary" style={{ width: "100%" }}>Get the pass</Btn>
        </Card>
        <Card variant="outlined" radius="lg" style={{ padding: 20 }}>
          <div style={imgSlot} />
          <Tag variant="blue" size="sm">14 March</Tag>
          <p style={{ margin: "10px 0 0", fontWeight: 700, fontSize: 16, color: "var(--c-text-1)" }}>Film night in the LAN garden</p>
          <p style={{ margin: "4px 0 14px", fontSize: 14, color: "var(--c-text-2)" }}>Screening &ldquo;Rent-a-Cat&rdquo;; blanket and tea provided.</p>
          <div style={row}>
            <Btn variant="primary" size="sm">Register</Btn>
            <Btn variant="ghost" size="sm">Details</Btn>
          </div>
        </Card>
        <ActionCard
          icon={<span style={{ fontSize: 22 }}>◍</span>}
          title="Souvenir shop"
          description="Exclusive gifts and keepsakes from our partners."
          href="#"
        />
        <Card variant="outlined" radius="lg" style={{ padding: 20 }}>
          <div style={imgSlot} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-11)", fontWeight: 700, letterSpacing: "var(--letter-spacing-10)", textTransform: "uppercase", color: "var(--c-text-3)" }}>
            Blog · 6 March
          </span>
          <p style={{ margin: "8px 0 4px", fontWeight: 700, fontSize: 16, color: "var(--c-text-1)" }}>How our garden is built and why work goes better in it</p>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--c-text-2)" }}>Four observations on what changes when a desk moves outdoors.</p>
          <Link variant="brand" underline={false} href="#">Read →</Link>
        </Card>
      </div>
    </SectionBlock>
  );
}

const PARTNER_NAMES = [
  "Krasilnikov Catering",
  "Coffochka",
  "Smoky EVN",
  "Tasty Coffee Roasters",
  "Gluten Free Bakery",
  "Bold Garage Wines",
  "Northern Terroir",
  "Idram",
];

const PARTNER_BADGE_COLORS = [
  { bg: "var(--c-badge-blue-bg)", text: "var(--c-badge-blue-text)" },
  { bg: "var(--c-badge-orange-bg)", text: "var(--c-badge-orange-text)" },
  { bg: "var(--c-badge-green-bg)", text: "var(--c-badge-green-text)" },
  { bg: "var(--c-badge-purple-bg)", text: "var(--c-badge-purple-text)" },
];

function partnerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MediaSection() {
  const cardStyle: React.CSSProperties = {
    height: 120,
    borderRadius: "var(--radius-lg)",
    background: "var(--c-brand-soft)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--c-brand)",
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
  };
  return (
    <SectionBlock
      id="media"
      index="11"
      title="Media"
      heading="Gallery, map, partner ticker"
      description="The gallery moves by dots and arrows, and the counter stays visible. The partner ticker pauses on hover."
    >
      <Stack gap={20}>
        <Specimen label="Gallery carousel">
          <Carousel dots counter>
            <div style={{ ...cardStyle, height: 200 }}>Slide 1</div>
            <div style={{ ...cardStyle, height: 200 }}>Slide 2</div>
            <div style={{ ...cardStyle, height: 200 }}>Slide 3</div>
          </Carousel>
        </Specimen>
        <Specimen label="How to find us">
          <div style={{ ...cardStyle, height: 140, marginBottom: 14 }}>Map</div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--c-text-1)" }}>Yerevan, 35G Tumanyan St</p>
          <Link variant="brand" underline={false} href="#" style={{ marginTop: 6, display: "inline-block" }}>
            Directions →
          </Link>
        </Specimen>
        <Specimen label="Partner ticker · pauses on hover">
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                gap: 32,
                width: "max-content",
                animation: "brightframe-ticker 18s linear infinite",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
              onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
            >
              {[...PARTNER_NAMES, ...PARTNER_NAMES].map((name, i) => {
                const color = PARTNER_BADGE_COLORS[i % PARTNER_BADGE_COLORS.length];
                return (
                  <span key={`${name}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: "var(--radius-8)",
                        background: color.bg,
                        color: color.text,
                        fontFamily: "var(--font-sans)",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {partnerInitials(name)}
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--c-text-3)" }}>{name}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <style>{`@keyframes brightframe-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </Specimen>
        <Specimen label="Horizontal scroller">
          <HorizontalScroller label="Rooms">
            {["Room A", "Room B", "Room C", "Room D", "Room E"].map((r) => (
              <div key={r} style={{ ...cardStyle, width: 220 }}>{r}</div>
            ))}
          </HorizontalScroller>
        </Specimen>
      </Stack>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 12 Utility / 13 Feedback
// ────────────────────────────────────────────────────────────────────────

function LanguageSwitch() {
  const [lang, setLang] = useState("EN");
  return (
    <div style={{ display: "inline-flex", gap: 2, padding: 4, background: "var(--c-surface-2)", borderRadius: "var(--radius-999)" }}>
      {["RU", "EN", "HY"].map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            style={{
              minHeight: 32,
              padding: "0 14px",
              border: "none",
              borderRadius: "var(--radius-999)",
              background: active ? "var(--c-surface)" : "transparent",
              boxShadow: active ? "var(--c-shadow-sm)" : "none",
              color: active ? "var(--c-text-1)" : "var(--c-text-2)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-size-13)",
              fontWeight: "var(--font-weight-700)",
              cursor: "pointer",
            }}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}

const SOCIAL_LINKS = ["TG", "IG", "FB"];

function UtilitySection() {
  return (
    <SectionBlock
      id="service"
      index="12"
      title="Utility elements"
      heading="Breadcrumbs, languages, A+A mode, footer"
      description="The low-vision mode is not a separate layout but a third theme on the same tokens: white ground, black borders, larger type. It switches in the header."
    >
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Breadcrumbs">
          <Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Education", href: "#" }, { label: "Armenian courses" }]} />
        </Specimen>
        <Specimen label="Language">
          <Stack gap={10}>
            <LanguageSwitch />
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>Three interface languages: Russian, English, Armenian.</p>
          </Stack>
        </Specimen>
      </div>
      <Specimen label="Back-to-top button">
        <div style={row}>
          <Fab label="Back to top" variant="brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </Fab>
          <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>Appears after the first screen, bottom right, above the content.</p>
        </div>
      </Specimen>
      <div style={{ marginTop: 20 }}>
        <Footer>
          <FooterColumn title="The venue">
            <a href="#">About the space</a>
            <a href="#">Coworking</a>
            <a href="#">Events</a>
            <a href="#">Education</a>
          </FooterColumn>
          <FooterColumn title="Services">
            <a href="#">Street kitchen</a>
            <a href="#">Storage</a>
            <a href="#">Venue rental</a>
            <a href="#">Souvenir shop</a>
          </FooterColumn>
          <FooterColumn title="Partnering">
            <a href="#">Partners</a>
            <a href="#">Initiatives</a>
            <a href="#">Jobs</a>
            <a href="#">Blog</a>
          </FooterColumn>
          <FooterColumn title="Contacts">
            <span>Yerevan, 35G Tumanyan St</span>
            <span>+374 94 601 303</span>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s} href="#" style={{ fontWeight: 700 }}>{s}</a>
              ))}
            </div>
          </FooterColumn>
        </Footer>
      </div>
    </SectionBlock>
  );
}

function FeedbackSection() {
  const [progress, setProgress] = useState(60);
  return (
    <SectionBlock
      id="feedback"
      index="13"
      title="Feedback"
      heading="Loader, Progress, EmptyState, Tooltip, Popover"
      description="Progress and loader are orange, as in the kit. The tooltip lives on four sides; the popover opens on click and closes on Escape."
    >
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Progress · sm / md / lg">
          <Stack gap={14}>
            <Progress value={progress} size="sm" />
            <Progress value={progress} size="md" showLabel />
            <Progress value={progress} size="lg" />
            <div style={row}>
              <Btn variant="secondary" size="sm" onClick={() => setProgress((v) => Math.max(0, v - 10))}>−10%</Btn>
              <Btn variant="secondary" size="sm" onClick={() => setProgress((v) => Math.min(100, v + 10))}>+10%</Btn>
            </div>
          </Stack>
        </Specimen>
        <Specimen label="Loader · sm / md / lg">
          <Stack gap={16}>
            <div style={row}>
              <div style={{ position: "relative", width: 48, height: 48 }}>
                <Loader size="sm" overlay={false} />
              </div>
              <div style={{ position: "relative", width: 76, height: 76 }}>
                <Loader size="md" overlay={false} />
              </div>
              <div style={{ position: "relative", width: 112, height: 112, borderRadius: "var(--radius-md)", background: "var(--c-brand-soft)" }}>
                <Loader size="sm" />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>The third is the dimmed variant over content, for loading inside a block.</p>
          </Stack>
        </Specimen>
      </div>
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Empty state">
          <EmptyState
            title="No bookings yet"
            description="Pick a date and a plan — the booking will appear here and arrive by email."
            action={<Btn size="sm">Book a desk</Btn>}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            }
          />
        </Specimen>
        <Specimen label="Tooltip · four sides">
          <Stack gap={14}>
            <div style={row}>
              <Tooltip content="Top" position="top"><Btn variant="secondary" size="sm">Top</Btn></Tooltip>
              <Tooltip content="Bottom" position="bottom"><Btn variant="secondary" size="sm">Bottom</Btn></Tooltip>
              <Tooltip content="Left" position="left"><Btn variant="secondary" size="sm">Left</Btn></Tooltip>
              <Tooltip content="Right" position="right"><Btn variant="secondary" size="sm">Right</Btn></Tooltip>
            </div>
            <div style={row}>
              <span style={{ fontSize: 14, color: "var(--c-text-2)" }}>Pass price</span>
              <InfoTooltip label="Prices include VAT." />
            </div>
          </Stack>
        </Specimen>
      </div>
      <Specimen label="Popover">
        <Popover trigger={<FakeButtonLabel>What the plan includes</FakeButtonLabel>}>
          <p style={{ margin: 0, color: "var(--c-text-2)" }}>Closes on outside click and Escape, and focus returns to the button.</p>
        </Popover>
      </Specimen>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 14 Picking and bookings
// ────────────────────────────────────────────────────────────────────────

const AVATAR_NAMES = ["Aram Petrosyan", "Irina Sokolova", "David Hovhannisyan", "Maria Klimenko", "Anna Sargsyan"];

function PickingSection() {
  const [duration, setDuration] = useState(4);
  const [budget, setBudget] = useState<[number, number]>([20000, 60000]);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [date, setDate] = useState(toYMD(new Date()));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");

  const dayThu = new Date(2026, 2, 12);
  const dayFri = new Date(2026, 2, 13);
  const daySat = new Date(2026, 2, 14);

  return (
    <SectionBlock
      id="inputs"
      index="14"
      title="Picking and bookings"
      heading="Slider, counter, time, avatars"
      description="The blocks a booking form is built from: price range, guest count, time range and day of the week."
    >
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Duration / budget">
          <Stack gap={20}>
            <Slider value={duration} onChange={(v) => setDuration(v as number)} min={1} max={12} showValue label="Duration" formatValue={(v) => `${v}h`} />
            <Slider
              value={budget}
              onChange={(v) => setBudget(v as [number, number])}
              min={0}
              max={100000}
              step={1000}
              label="Budget"
              showValue
              formatValue={(v) => `${v.toLocaleString("en-US")} ֏`}
            />
          </Stack>
        </Specimen>
        <Specimen label="Guest counter">
          <Stack gap={16}>
            <GuestsCounter value={guests} onChange={setGuests} label="Guests" />
            <GuestsCounter value={rooms} onChange={setRooms} label="Meeting rooms" />
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>
              Buttons are 40×40 and the value has a fixed width, so the row does not shift going from 9 to 10.
            </p>
          </Stack>
        </Specimen>
      </div>
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Time range">
          <Stack gap={10}>
            <TimeRangePicker
              date={date}
              onDateChange={setDate}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
            />
            <p style={{ margin: 0, fontSize: 13, color: "var(--c-text-2)" }}>Slots of 30 minutes, the chosen one orange. Duration is calculated for you.</p>
          </Stack>
        </Specimen>
        <Specimen label="Avatars · xs → xl">
          <Stack gap={14}>
            <div style={row}>
              <Avatar name={AVATAR_NAMES[0]} size="xs" />
              <Avatar name={AVATAR_NAMES[1]} size="sm" />
              <Avatar name={AVATAR_NAMES[2]} size="md" />
              <Avatar name={AVATAR_NAMES[3]} size="lg" />
              <Avatar name={AVATAR_NAMES[4]} size="xl" />
            </div>
            <div style={{ display: "flex" }}>
              {AVATAR_NAMES.slice(0, 2).map((n, i) => (
                <div key={n} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                  <Avatar name={n} size="md" />
                </div>
              ))}
              <div
                style={{
                  marginLeft: -10,
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-999)",
                  background: "var(--c-surface-2)",
                  border: "2px solid var(--c-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--c-text-2)",
                }}
              >
                +7
              </div>
            </div>
          </Stack>
        </Specimen>
      </div>
      <Specimen label="Day · default, compact, weekend">
        <div style={row}>
          <DayBadge date={dayThu} locale="en-US" />
          <DayBadge date={dayFri} locale="en-US" size="compact" />
          <DayBadge date={daySat} locale="en-US" />
        </div>
      </Specimen>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginTop: 20 }}>
        <Specimen label="Form card">
          <FormCard>
            <Stack gap={14}>
              <SubTitle as="h3" style={{ fontSize: 18, margin: 0 }}>Leave a request</SubTitle>
              <Btn variant="primary" style={{ width: "100%" }}>Send</Btn>
            </Stack>
          </FormCard>
        </Specimen>
        <Specimen label="Horizontal scroller with arrows">
          <HorizontalScroller label="Pricing tiers">
            {[
              { label: "1 hour", price: "1 300 ֏" },
              { label: "4 hours", price: "3 000 ֏" },
              { label: "1 day", price: "5 000 ֏" },
              { label: "7 days", price: "20 000 ֏" },
              { label: "30 days", price: "60 000 ֏" },
              { label: "lan+", price: "96 000 ֏" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  width: 140,
                  padding: 16,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--c-border-soft)",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, color: "var(--c-text-1)" }}>{item.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--c-text-3)" }}>{item.price}</p>
              </div>
            ))}
          </HorizontalScroller>
        </Specimen>
      </div>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 15 Typography
// ────────────────────────────────────────────────────────────────────────

const TYPE_SCALE: { token: string; spec: string; sample: React.ReactNode }[] = [
  { token: "display", spec: "58 · 700 · 1.05", sample: <span style={{ fontFamily: "var(--font-sans)", fontSize: 40, fontWeight: 700, lineHeight: 1.05 }}>Work where the garden is</span> },
  { token: "h1", spec: "40 · 700 · 1.1 · caps", sample: <Title as="h1" style={{ margin: 0, fontSize: 32 }}>One set of rules</Title> },
  { token: "h2", spec: "34 · 700 · 1.15", sample: <SubTitle as="h2" style={{ margin: 0, fontSize: 26 }}>Plans and events</SubTitle> },
  { token: "h3", spec: "24 · 700 · 1.25", sample: <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700 }}>Booking confirmed</span> },
  { token: "h4", spec: "19 · 700 · 1.3", sample: <span style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700 }}>What the pass includes</span> },
  { token: "section-heading", spec: "36 · 400 · 1.2 · accent", sample: <span style={{ fontFamily: "var(--font-sans)", fontSize: 24, fontWeight: 400, color: "var(--c-brand)" }}>Day picking and messages</span> },
  { token: "lead", spec: "18 · 400 · 1.7", sample: <span style={{ fontSize: 16, lineHeight: 1.7, color: "var(--c-text-2)" }}>A note under the heading: one or two lines, then the content.</span> },
  { token: "body", spec: "16 · 400 · 1.7", sample: <span style={{ fontSize: 16, lineHeight: 1.7, color: "var(--c-text-1)" }}>Ten working days within a calendar month, coffee and an hour of meeting room a day.</span> },
  { token: "body-sm", spec: "15 · 400 · 1.6", sample: <span style={{ fontSize: 15, lineHeight: 1.6, color: "var(--c-text-2)" }}>Interface text inside cards, fields and table rows.</span> },
  { token: "label", spec: "13 · 700 · 1.4", sample: <span style={{ fontSize: 13, fontWeight: 700, color: "var(--c-text-1)" }}>Date of visit</span> },
  { token: "caption", spec: "13 · 400 · 1.5", sample: <span style={{ fontSize: 13, color: "var(--c-text-3)" }}>Appears in the booking email</span> },
  { token: "overline", spec: "11 · 700 · 0.12em · caps", sample: <Eyebrow>What&rsquo;s in the kit</Eyebrow> },
];

function TypographySection() {
  return (
    <SectionBlock
      id="type"
      index="15"
      title="Text and dividers"
      heading="Eyebrow, headings, links"
      description="Four text levels and three kinds of link. The divider can carry a label, which is how long forms are split."
    >
      <Specimen label="Type scale · token · specimen · size · weight · leading">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {TYPE_SCALE.map((row) => (
                <tr key={row.token}>
                  <td style={{ padding: "12px 16px 12px 0", borderBottom: "1px solid var(--c-border-soft)", whiteSpace: "nowrap" }}>
                    <code style={{ fontSize: 12, color: "var(--c-text-3)" }}>{row.token}</code>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--c-border-soft)", width: "60%" }}>{row.sample}</td>
                  <td style={{ padding: "12px 0", borderBottom: "1px solid var(--c-border-soft)", whiteSpace: "nowrap", textAlign: "right", fontSize: 12, color: "var(--c-text-3)" }}>
                    {row.spec}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Specimen>
      <div style={{ marginTop: 20 }}>
        <Specimen label="SectionHeading">
          <SectionHeading title="Section heading" subtitle="A note under the section heading: one or two lines, then the content." />
        </Specimen>
      </div>
      <div style={{ ...grid2, marginTop: 20 }}>
        <Specimen label="Weights · PT Sans">
          <Stack gap={8}>
            <p style={{ margin: 0, fontWeight: 400 }}>Regular 400 — body text and long copy</p>
            <p style={{ margin: 0, fontWeight: 400, fontStyle: "italic" }}>Italic 400 — quotes and captions</p>
            <p style={{ margin: 0, fontWeight: 700 }}>Bold 700 — headings and labels</p>
            <p style={{ margin: 0, fontWeight: 700, fontStyle: "italic" }}>Bold italic 700 — rare emphasis</p>
          </Stack>
        </Specimen>
        <Specimen label="Links">
          <Stack gap={10}>
            <p style={{ margin: 0 }}><Link variant="default" href="#">A plain link in running text</Link></p>
            <p style={{ margin: 0 }}><Link variant="muted" href="#">Muted — in footnotes</Link></p>
            <p style={{ margin: 0 }}><Link variant="brand" href="#">Accent — a call to action</Link></p>
            <p style={{ margin: 0 }}><Link variant="brand" underline={false} href="#">No underline — in navigation</Link></p>
          </Stack>
        </Specimen>
      </div>
      <div style={{ marginTop: 20 }}>
        <Specimen label="Dividers">
          <Stack gap={16}>
            <Divider />
            <Divider label="or sign in with a link" />
          </Stack>
        </Specimen>
      </div>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 16 Dates / 17 Search and switches
// ────────────────────────────────────────────────────────────────────────

function DatesSection() {
  const [range, setRange] = useState<CalendarRange>({ start: new Date(), end: new Date() });
  const [formDate, setFormDate] = useState(toYMD(new Date()));
  const [combinedDate, setCombinedDate] = useState(new Date(2026, 2, 12, 10, 0));
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <SectionBlock
      id="dates"
      index="16"
      title="Dates"
      heading="Day strip, date and time picking"
      description="The first click sets the start of the period, the second the end. Weekends are labelled red and the range is a band under the days."
    >
      <Stack gap={20}>
        <Specimen label="Day strip · CalendarSlider">
          <CalendarSlider value={range} onChange={(r) => setRange(r)} locale="en-US" />
        </Specimen>
        <div style={grid2}>
          <Specimen label="Date and time in one control">
            <DateTimePicker value={combinedDate} onChange={setCombinedDate} />
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--c-text-2)" }}>Two tabs inside one pill: date and time open the same panel.</p>
          </Specimen>
          <Specimen label="Date in a form">
            <FormDatePicker label="Date of visit" value={formDate} onChange={setFormDate} />
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--c-text-2)" }}>Format YYYY-MM-DD, earliest date is today.</p>
          </Specimen>
        </div>
        <Specimen label="Date in a mobile sheet">
          <Btn variant="secondary" onClick={() => setSheetOpen(true)}>12 March 2026</Btn>
          <MobileDatePicker
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            value={{ start: new Date(2026, 2, 12), end: new Date(2026, 2, 12) }}
            onChange={() => {}}
            mode="single"
            locale="en-US"
          />
        </Specimen>
      </Stack>
    </SectionBlock>
  );
}

function SearchSection() {
  const [room, setRoom] = useState("");
  return (
    <SectionBlock
      id="pickers"
      index="17"
      title="Search and switches"
      heading="Combobox and segmented bar"
      description="The combobox filters as you type; arrows and Enter work from the keyboard. The segmented bar is for compound filters."
    >
      <div style={{ ...grid2, marginBottom: 20 }}>
        <Specimen label="Combobox">
          <Combobox
            label="Room"
            value={room}
            onChange={setRoom}
            options={[
              { value: "quiet", label: "Quiet room" },
              { value: "meeting", label: "Meeting room" },
              { value: "hall", label: "Hall" },
            ]}
          />
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--c-text-2)" }}>Closing without a choice restores the text to the selected value.</p>
        </Specimen>
        <Specimen label="Segmented bar">
          <SegmentedBar>
            <SegmentedItem icon={<span>▤</span>}>12 March</SegmentedItem>
            <SegmentedItem icon={<span>◔</span>}>10:00 – 14:00</SegmentedItem>
            <SegmentedItem icon={<span>◍</span>}>2</SegmentedItem>
          </SegmentedBar>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--c-text-2)" }}>Built from parts — date, time, guests — and each part is clickable on its own.</p>
        </Specimen>
      </div>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 18 Layout / 19 Assembly example / 20 Poster
// ────────────────────────────────────────────────────────────────────────

function LayoutSection() {
  const [revealKey, setRevealKey] = useState(0);
  const tintBox: React.CSSProperties = { background: "var(--c-brand-soft)", borderRadius: 8, padding: 12, textAlign: "center" };
  return (
    <SectionBlock
      id="layout"
      index="18"
      title="Layout"
      heading="Container, grid, stack, spacer, reveal"
      description="Invisible components: they set the width, the grid step and the rhythm of spacing. Shown on a tint so they can be seen."
    >
      <Stack gap={20}>
        <Specimen label="Container · 1200px with edge padding">
          <div style={{ background: "var(--c-surface-2)", borderRadius: "var(--radius-md)", padding: "20px 0" }}>
            <Container>
              <div style={{ ...tintBox, padding: 16 }}>Content is centred and the width is capped</div>
            </Container>
          </div>
        </Specimen>
        <Specimen label="Grid · 12 columns, gap 16">
          <Grid gap={16}>
            <GridItem span={6} style={tintBox}>span 6</GridItem>
            <GridItem span={3} style={tintBox}>span 3</GridItem>
            <GridItem span={3} style={tintBox}>span 3</GridItem>
            <GridItem span={4} style={tintBox}>span 4</GridItem>
            <GridItem span={4} style={tintBox}>span 4</GridItem>
            <GridItem span={4} style={tintBox}>span 4</GridItem>
          </Grid>
        </Specimen>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          <Specimen label="Stack · column, gap 8">
            <Stack gap={8}>
              <div style={{ ...tintBox, padding: "8px 12px" }}>First</div>
              <div style={{ ...tintBox, padding: "8px 12px" }}>Second</div>
              <div style={{ ...tintBox, padding: "8px 12px" }}>Third</div>
            </Stack>
          </Specimen>
          <Specimen label="Stack · row, gap 16">
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ ...tintBox, padding: "8px 12px" }}>One</div>
              <div style={{ ...tintBox, padding: "8px 12px" }}>Two</div>
              <div style={{ ...tintBox, padding: "8px 12px" }}>Three</div>
            </div>
          </Specimen>
          <Specimen label="Spacer · scale 4 → 64">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 64, marginBottom: 12 }}>
              {([8, 16, 24, 40, 64] as const).map((size) => (
                <div key={size} title={`${size}px`} style={{ width: 12, height: size, background: "var(--c-accent)", borderRadius: 2 }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "var(--radius-999)", background: "var(--c-text-3)" }} />
              <Spacer axis="horizontal" size={32} />
              <div style={{ width: 8, height: 8, borderRadius: "var(--radius-999)", background: "var(--c-text-3)" }} />
            </div>
          </Specimen>
        </div>
        <Specimen label="Reveal on scroll">
          <div style={{ display: "flex", gap: 12 }} key={revealKey}>
            <Reveal>
              <div style={{ ...tintBox, padding: "8px 12px" }}>Block one</div>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ ...tintBox, padding: "8px 12px" }}>Block two</div>
            </Reveal>
          </div>
          <Btn variant="ghost" size="sm" style={{ marginTop: 12 }} onClick={() => setRevealKey((k) => k + 1)}>
            Replay
          </Btn>
        </Specimen>
      </Stack>
    </SectionBlock>
  );
}

function PointerSection({
  id,
  index,
  title,
  heading,
  description,
  storyPath,
  pointerNote,
}: {
  id: string;
  index: string;
  title: string;
  heading: string;
  description: string;
  storyPath: string;
  pointerNote: string;
}) {
  return (
    <SectionBlock id={id} index={index} title={title} heading={heading} description={description}>
      <Specimen>
        <p style={{ margin: 0, color: "var(--c-text-2)" }}>{pointerNote}</p>
        <p style={{ marginTop: 12 }}>
          <Link variant="brand" underline={false} href={`/?path=/story/${storyPath}`}>
            Open the full example →
          </Link>
        </p>
      </Specimen>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Header / Hero / Token strip
// ────────────────────────────────────────────────────────────────────────

// Matches the order and labels of the original prototype's own header nav
// (design_handoff_brightframe_v2/UI Kit.dc.html) rather than an abbreviated subset —
// note "Overlays" sits last there too, out of numeric order.
const NAV_LINKS: { id: string; label: string }[] = [
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "accordion", label: "Accordion" },
  { id: "tabs", label: "Tabs" },
  { id: "cards", label: "Cards" },
  { id: "data", label: "Data" },
  { id: "calendar", label: "Calendar" },
  { id: "nav", label: "Header" },
  { id: "site", label: "Blocks" },
  { id: "media", label: "Media" },
  { id: "service", label: "Utility" },
  { id: "feedback", label: "Feedback" },
  { id: "inputs", label: "Picking" },
  { id: "type", label: "Text" },
  { id: "dates", label: "Dates" },
  { id: "layout", label: "Layout" },
  { id: "poster", label: "Poster" },
  { id: "example", label: "Example" },
  { id: "overlays", label: "Overlays" },
];

function Header({ theme, setTheme }: { theme: PageTheme; setTheme: (t: PageTheme) => void }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px 28px",
        padding: "14px 40px",
        background: "color-mix(in srgb, var(--c-bg) 88%, transparent)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--c-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--c-text-1)" }}>
          brightframe
        </span>
        <Tag variant="purple" size="sm">v2 · draft</Tag>
      </div>
      <nav aria-label="Section" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {NAV_LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--c-text-2)", textDecoration: "none" }}>
            {l.label}
          </a>
        ))}
      </nav>
      <ThemeSwitch theme={theme} onChange={setTheme} />
    </header>
  );
}

function Hero() {
  const tiles = [
    { title: "One radius", body: "16px containers, 999px buttons and fields. Nothing between." },
    { title: "One height", body: "36/44/52 buttons, 48 fields." },
    { title: "One focus ring", body: "2px accent outline, 3px offset." },
    { title: "One animation", body: "150–240ms, only background, shadow and transform." },
  ];
  return (
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: 48, alignItems: "end", padding: "56px 0" }}>
        <div>
          <Eyebrow>UI-kit revision · lancoworking.am</Eyebrow>
          <Title as="h1" style={{ fontSize: 44, marginTop: 12 }}>One set of rules across the kit</Title>
          <p style={{ marginTop: 16, maxWidth: "46ch", fontSize: 18, lineHeight: 1.7, color: "var(--c-text-2)" }}>
            Every component sits on one radius grid, one spacing scale and one set of states.
            Each block below shows the variants, the sizes, and how the element behaves on
            hover, on keyboard focus and when disabled.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, border: "1px solid var(--c-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {tiles.map((t) => (
            <div key={t.title} style={{ padding: 24, background: "var(--c-surface)" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--c-text-1)" }}>{t.title}</div>
              <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "var(--c-text-2)" }}>{t.body}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function TokenStrip() {
  const swatches = ["--c-bg", "--c-surface", "--c-brand", "--c-accent", "--c-error"];
  const radii: [string, number][] = [["sm", 8], ["md", 12], ["lg", 16], ["pill", 999]];
  const spacing = [8, 16, 24, 40, 64];
  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          padding: "34px 36px",
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius-lg)",
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 10 }}>Colour</div>
          <div style={{ display: "flex", gap: 8 }}>
            {swatches.map((v) => (
              <div key={v} title={v} style={{ width: 34, height: 34, borderRadius: 12, background: `var(${v})`, boxShadow: "inset 0 0 0 1px var(--c-border)" }} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 10 }}>Radius</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            {radii.map(([name, px]) => (
              <div key={name} title={name} style={{ width: 34, height: 34, borderRadius: Math.min(px, 17), background: "var(--c-brand-soft)" }} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 10 }}>Spacing</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            {spacing.map((px) => (
              <div key={px} style={{ width: 8, height: px, background: "var(--c-brand)", borderRadius: 2 }} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 10 }}>Type</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 24, fontWeight: 700, color: "var(--c-text-1)" }}>Aa</div>
        </div>
      </div>
    </Container>
  );
}

function KitIndex() {
  const groups: { title: string; items: string[] }[] = [
    { title: "01–02 Buttons and forms", items: ["Btn", "GhostButton", "SubmitButton", "LabeledField", "TextareaField", "SelectField", "Checkbox", "Switch", "RadioGroup"] },
    { title: "03–05 Disclosure and cards", items: ["Accordion", "Tabs", "Card", "ActionCard", "InfoCards", "FormCard"] },
    { title: "06–07 Data and messages", items: ["Badge", "Tag", "Skeleton", "Pagination", "DropdownMenu", "Alert", "Toast"] },
    { title: "08–09 Navigation and overlays", items: ["Navbar", "Burger", "Breadcrumb", "Footer", "Fab", "Modal", "Drawer"] },
    { title: "11–13 Media and feedback", items: ["Carousel", "HorizontalScroller", "Loader", "Progress", "EmptyState", "Tooltip", "InfoTooltip", "Popover", "Reveal"] },
    { title: "14–17 Picking and dates", items: ["Slider", "GuestsCounter", "Avatar", "DayBadge", "SegmentedBar", "CalendarSlider", "DateTimePicker", "MobileDatePicker", "FormDatePicker", "TimeRangePicker", "Combobox"] },
    { title: "15 Text", items: ["Eyebrow", "Title", "SubTitle", "SectionHeading", "Link", "Divider"] },
    { title: "18–19 Layout and example", items: ["Container", "Grid", "GridItem", "Stack", "Spacer", "BookingForm"] },
    { title: "20 Poster", items: ["EventFilters", "EventDayGroup", "EventRow", "LanguageBadge"] },
  ];
  return (
    <Container>
      <div style={{ padding: "32px 0 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 20 }}>
          What's in the kit · and where
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "28px 24px" }}>
          {groups.map((g) => (
            <div key={g.title}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--c-text-1)", marginBottom: 12 }}>{g.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.items.map((item) => (
                  <Tag key={item} variant="neutral" size="sm">{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────

function UIKitOverview() {
  const [theme, setTheme] = useLocalTheme();
  return (
    <ToastProvider position="bottom-right">
      <div style={{ background: "var(--c-bg)", minHeight: "100%" }}>
        <Header theme={theme} setTheme={setTheme} />
        <Hero />
        <KitIndex />
        <TokenStrip />
        <ButtonsSection />
        <FormsSection />
        <AccordionSection />
        <TabsSection />
        <CardsSection />
        <DataSection />
        <CalendarAlertsSection />
        <NavSection />
        <OverlaysSection />
        <SiteBlocksSection />
        <MediaSection />
        <UtilitySection />
        <FeedbackSection />
        <PickingSection />
        <TypographySection />
        <DatesSection />
        <SearchSection />
        <LayoutSection />
        <PointerSection
          id="example"
          index="19"
          title="Assembly example"
          heading="A booking form built from these same parts"
          description="Form card, labelled fields, guest counter, date, time range and submit button — every piece is shown separately above."
          storyPath="examples-booking-form--default"
          pointerNote="A booking form built only from the parts above — FormCard shell, labelled fields, GuestsCounter, a date+time row, and a full-width primary action."
        />
        <PointerSection
          id="poster"
          index="20"
          title="Poster"
          heading="Filters and events grouped by day"
          description={'Period presets, the "upcoming only" switch and the language filter work together. Under each day sit its own events with a language badge and a registration button.'}
          storyPath="examples-events-poster--default"
          pointerNote="The /events page pattern — filter bar, day groups, and event rows composed from DayBadge, Tag, Link and Btn."
        />
      </div>
    </ToastProvider>
  );
}

const meta: Meta<typeof UIKitOverview> = {
  title: "Overview/UI Kit",
  component: UIKitOverview,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof UIKitOverview>;

export const Default: Story = {
  render: () => <UIKitOverview />,
};
