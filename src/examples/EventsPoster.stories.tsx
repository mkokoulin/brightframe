import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DayBadge } from "../components/DayBadge/DayBadge";
import { Tag } from "../components/Tag/Tag";
import { Link } from "../components/Link/Link";
import { Btn } from "../components/Btn/Btn";
import { Switch } from "../components/Switch/Switch";
import { EmptyState } from "../components/EmptyState/EmptyState";

/**
 * The `/events` page pattern from the handoff's section 20 — the one section with no
 * existing component mapping in the kit (filter bar + day groups + event rows). Built here
 * as a page-level composition from existing primitives, the same way `BookingForm` composes
 * section 19's assembly example, rather than as a new shipped component.
 */

type EventLang = "ru" | "en" | "hy";

type PosterEvent = {
  id: string;
  date: Date;
  time: string;
  lang: EventLang;
  title: string;
  note?: string;
  past?: boolean;
  registrationOpen?: boolean;
};

const LANG_TAG_VARIANT: Record<EventLang, "orange" | "blue" | "purple"> = {
  ru: "orange",
  en: "blue",
  hy: "purple",
};

const LANG_LABEL: Record<EventLang, string> = { ru: "RU", en: "EN", hy: "HY" };

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

const TODAY = today();

const EVENTS: PosterEvent[] = [
  { id: "1", date: TODAY, time: "09:30", lang: "en", title: "Founders coffee", past: true, note: "Casual meetup, drop in any time." },
  { id: "2", date: TODAY, time: "18:00", lang: "ru", title: "Мастер-класс по нетворкингу", registrationOpen: true },
  { id: "3", date: addDays(TODAY, 1), time: "12:00", lang: "hy", title: "Ընկերության հանդիպում", registrationOpen: true },
  { id: "4", date: addDays(TODAY, 2), time: "19:00", lang: "en", title: "Product demo night", note: "Bring your own laptop.", registrationOpen: true },
  { id: "5", date: addDays(TODAY, 9), time: "10:00", lang: "ru", title: "Йога на крыше" },
];

type Preset = "week" | "today" | "tomorrow" | "weekend" | "month";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "weekend", label: "Weekend" },
  { value: "month", label: "Whole month" },
];

function presetMatches(preset: Preset, d: Date): boolean {
  const diffDays = Math.round((d.getTime() - TODAY.getTime()) / 86_400_000);
  if (preset === "today") return diffDays === 0;
  if (preset === "tomorrow") return diffDays === 1;
  if (preset === "week") return diffDays >= 0 && diffDays < 7;
  if (preset === "weekend") return d.getDay() === 0 || d.getDay() === 6;
  return diffDays >= 0 && diffDays < 31; // month
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function PillTrack<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        padding: 4,
        background: "var(--c-surface-2)",
        borderRadius: "var(--radius-999)",
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              height: 32,
              padding: "0 12px",
              border: "none",
              borderRadius: "var(--radius-999)",
              background: active ? "var(--c-surface)" : "transparent",
              boxShadow: active ? "var(--c-shadow-sm)" : "none",
              color: "var(--c-text-1)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-size-14)",
              fontWeight: active ? "var(--font-weight-700)" : "var(--font-weight-400)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function LanguagePills({ value, onChange }: { value: EventLang | "all"; onChange: (v: EventLang | "all") => void }) {
  const options: { value: EventLang | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
    { value: "hy", label: "HY" },
  ];
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              width: 46,
              height: 36,
              border: active ? "none" : "1px solid var(--c-border)",
              borderRadius: "var(--radius-999)",
              background: active ? "var(--c-brand)" : "transparent",
              color: active ? "var(--c-bg)" : "var(--c-text-1)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-size-13)",
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

function EventRow({ event }: { event: PosterEvent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "18px 0",
        borderBottom: "1px solid var(--c-border-soft)",
      }}
    >
      <div
        style={{
          flex: "0 0 58px",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-size-15)",
          fontWeight: "var(--font-weight-700)",
          color: "var(--c-text-1)",
        }}
      >
        {event.time}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Tag variant={LANG_TAG_VARIANT[event.lang]} size="sm">
            {LANG_LABEL[event.lang]}
          </Tag>
          {event.past && (
            <Tag variant="neutral" size="sm" style={{ background: "var(--c-surface-alt)" }}>
              Past
            </Tag>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--font-size-17)",
            lineHeight: 1.35,
            fontWeight: "var(--font-weight-700)",
            color: "var(--c-text-1)",
            opacity: event.past ? 0.55 : 1,
          }}
        >
          {event.title}
        </div>
        {event.note && (
          <p
            style={{
              margin: "4px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-size-14)",
              lineHeight: "var(--line-height-160)",
              color: "var(--c-text-2)",
            }}
          >
            {event.note}
          </p>
        )}
      </div>

      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 16 }}>
        <Link variant="brand" underline={false} href="#">
          Details →
        </Link>
        {event.registrationOpen && (
          <Btn variant="brand" size="sm" style={{ height: 40 }}>
            Register
          </Btn>
        )}
      </div>
    </div>
  );
}

function DayGroup({ date, events }: { date: Date; events: PosterEvent[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: 24, padding: "24px 0" }}>
      <DayBadge date={date} locale="en-US" />
      <div>
        {events.map((e) => (
          <EventRow key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}

function EventsPoster() {
  const [preset, setPreset] = useState<Preset>("month");
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [language, setLanguage] = useState<EventLang | "all">("all");

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      if (!presetMatches(preset, e.date)) return false;
      if (upcomingOnly && e.past) return false;
      if (language !== "all" && e.lang !== language) return false;
      return true;
    }).sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));
  }, [preset, upcomingOnly, language]);

  const groups = useMemo(() => {
    const byDay = new Map<string, PosterEvent[]>();
    for (const e of filtered) {
      const key = e.date.toDateString();
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(e);
    }
    return Array.from(byDay.entries()).map(([key, events]) => ({ date: new Date(key), events }));
  }, [filtered]);

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          padding: "18px 20px",
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <PillTrack options={PRESETS} value={preset} onChange={setPreset} />

        <Switch checked={upcomingOnly} onChange={setUpcomingOnly} label="Upcoming only" />

        <div style={{ marginLeft: "auto" }}>
          <LanguagePills value={language} onChange={setLanguage} />
        </div>
      </div>

      {/* Month heading */}
      <h2
        style={{
          margin: "24px 0 0",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-size-22)",
          fontWeight: "var(--font-weight-700)",
          color: "var(--c-text-1)",
        }}
      >
        {monthLabel(TODAY)}
      </h2>

      {/* Day groups, or empty state */}
      {groups.length > 0 ? (
        groups.map((g) => <DayGroup key={g.date.toDateString()} date={g.date} events={g.events} />)
      ) : (
        <EmptyState title="No events match your filters" description="Try a different date range or language." />
      )}
    </div>
  );
}

const meta: Meta<typeof EventsPoster> = {
  title: "Examples/Events Poster",
  component: EventsPoster,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof EventsPoster>;

export const Default: Story = {
  render: () => <EventsPoster />,
};
