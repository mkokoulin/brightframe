"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./CalendarSlider.module.css";
import { MobileDatePicker, type Range } from "../MobileDatePicker/MobileDatePicker";
import { useMediaQuery } from "./useMediaQuery";

export type { Range };
export type Preset = "week" | "today" | "tomorrow" | "weekend" | "month" | "custom";

export type CalendarSliderLabels = {
  /** Steps the visible window back 7 days. */
  prevMonth: string;
  /** Steps the visible window forward 7 days. */
  nextMonth: string;
  week: string;
  today: string;
  tomorrow: string;
  weekend: string;
  month: string;
  /** Short weekday labels, indexed like Date#getDay(): [Sun, Mon, Tue, Wed, Thu, Fri, Sat]. */
  weekdays: [string, string, string, string, string, string, string];
};

export const DEFAULT_CALENDAR_SLIDER_LABELS: CalendarSliderLabels = {
  prevMonth: "Previous week",
  nextMonth: "Next week",
  week: "Week",
  today: "Today",
  tomorrow: "Tomorrow",
  weekend: "Weekend",
  month: "Show whole month",
  weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};

export type CalendarSliderProps = {
  range?: Range;
  value?: Range;
  onChange: (range: Range, preset: Preset) => void;
  locale?: string;
  onBack?: () => void;
  initialPreset?: Preset;
  labels?: Partial<CalendarSliderLabels>;
  className?: string;
};

// Left column: 13 days (624px = 13 × 48px)
// Right column: 11 days (528px = 11 × 48px), right-aligned, 48px left offset
const LEFT_COL_DAYS = 13;
const RIGHT_COL_DAYS = 11;
const WINDOW_DAYS = LEFT_COL_DAYS + RIGHT_COL_DAYS;

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function normalizeRange(r: Range): Range {
  const a = startOfDay(r.start);
  const b = startOfDay(r.end);
  return a.getTime() <= b.getTime() ? { start: a, end: b } : { start: b, end: a };
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function inRange(day: Date, r: Range) {
  const t = startOfDay(day).getTime();
  return t >= r.start.getTime() && t <= r.end.getTime();
}
function isWeekend(d: Date) {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}
function weekdayShortFromMap(d: Date, map: readonly string[]) {
  return map[d.getDay()];
}
function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function getPresetRange(preset: Exclude<Preset, "custom">, baseNow = new Date()): Range {
  const now = startOfDay(baseNow);
  if (preset === "today") return { start: now, end: now };
  if (preset === "tomorrow") {
    const t = addDays(now, 1);
    return { start: t, end: t };
  }
  if (preset === "week") {
    const dow = now.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const start = addDays(now, mondayOffset);
    return { start, end: addDays(start, 6) };
  }
  if (preset === "weekend") {
    const dow = now.getDay();
    const toSat = dow === 6 ? 0 : 6 - dow;
    const sat = addDays(now, toSat);
    return { start: sat, end: addDays(sat, 1) };
  }
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };
}

function DayCell({
  d,
  selected,
  rangeStart,
  rangeEnd,
  inside,
  onClick,
}: {
  d: Date;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inside: boolean;
  onClick: () => void;
}) {
  const isToday = isSameDay(d, TODAY);

  return (
    <div className={styles.dayOuter}>
      {(inside || rangeStart || rangeEnd) && (
        <div
          className={[
            styles.rangeBar,
            inside && !rangeStart && !rangeEnd ? styles.rangeBarMiddle : "",
            rangeStart && !rangeEnd ? styles.rangeBarStart : "",
            rangeEnd && !rangeStart ? styles.rangeBarEnd : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}

      <button
        type="button"
        className={[styles.dayCell, selected ? styles.daySelected : ""].filter(Boolean).join(" ")}
        onClick={onClick}
        aria-current={isToday ? "date" : undefined}
        aria-pressed={selected}
      >
        <span className={[styles.dayNumber, selected ? styles.dayNumberSelected : ""].join(" ")}>{d.getDate()}</span>
      </button>
    </div>
  );
}

function ColumnGrid({
  dates,
  normalized,
  onPick,
  weekdayMap,
}: {
  dates: Date[];
  align: "left" | "right";
  normalized: Range;
  onPick: (d: Date) => void;
  weekdayMap: readonly string[];
}) {
  const isSingleDay = isSameDay(normalized.start, normalized.end);

  return (
    <div>
      <div className={styles.daysRow}>
        {dates.map((d) => (
          <div key={`wd-${d.toISOString()}`} className={[styles.weekday, isWeekend(d) ? styles.weekend : ""].join(" ")}>
            {weekdayShortFromMap(d, weekdayMap)}
          </div>
        ))}
      </div>

      <div className={styles.daysRow}>
        {dates.map((d) => {
          const selStart = isSameDay(d, normalized.start);
          const selEnd = isSameDay(d, normalized.end);
          const selected = selStart || selEnd;
          const rangeStart = selStart && !isSingleDay;
          const rangeEnd = selEnd && !isSingleDay;
          const inside = !isSingleDay && inRange(d, normalized) && !selected;

          return (
            <DayCell
              key={d.toISOString()}
              d={d}
              selected={selected}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              inside={inside}
              onClick={() => onPick(d)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function CalendarSlider(props: CalendarSliderProps) {
  const { locale = "en-US", onChange, initialPreset = "custom", className } = props;
  const L = { ...DEFAULT_CALENDAR_SLIDER_LABELS, ...props.labels };

  const inputRange = props.value ?? props.range;
  if (!inputRange) throw new Error("CalendarSlider: provide either `range` or `value` prop");

  const normalized = useMemo(() => normalizeRange(inputRange), [inputRange]);

  const [windowStart, setWindowStart] = useState<Date>(() => startOfDay(normalized.start));
  const [activePreset, setActivePreset] = useState<Preset>(initialPreset);
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [mobilePicker, setMobilePicker] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const winEnd = addDays(windowStart, WINDOW_DAYS - 1);
    const minSel = normalized.start.getTime() < normalized.end.getTime() ? normalized.start : normalized.end;
    const maxSel = normalized.start.getTime() > normalized.end.getTime() ? normalized.start : normalized.end;
    if (maxSel < windowStart || minSel > winEnd) {
      setWindowStart(startOfDay(minSel));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized.start, normalized.end]); // windowStart intentionally not a dependency

  const dates = useMemo(() => {
    return Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(windowStart, i));
  }, [windowStart]);

  const leftDates = dates.slice(0, LEFT_COL_DAYS);
  const rightDates = dates.slice(LEFT_COL_DAYS);

  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long" }), [locale]);
  const leftMonthLabel = capitalize(monthFmt.format(leftDates[0]));
  const rightMonthLabel = capitalize(monthFmt.format(rightDates[0]));

  const shiftWindow = (dir: -1 | 1) => {
    setWindowStart((d) => addDays(d, dir * 7));
    setActivePreset("custom");
    setPendingStart(null);
  };

  const applyPreset = (preset: Exclude<Preset, "custom">) => {
    const r = normalizeRange(getPresetRange(preset));
    setActivePreset(preset);
    setPendingStart(null);
    setWindowStart((cur) => {
      const winEnd = addDays(cur, WINDOW_DAYS - 1);
      if (r.start < cur || r.start > winEnd) return startOfDay(r.start);
      return cur;
    });
    onChange(r, preset);
  };

  const handleDayClick = (d: Date) => {
    setActivePreset("custom");
    if (pendingStart) {
      const r = normalizeRange({ start: pendingStart, end: d });
      setPendingStart(null);
      onChange(r, "custom");
      return;
    }
    setPendingStart(startOfDay(d));
    onChange({ start: startOfDay(d), end: startOfDay(d) }, "custom");
  };

  const presets: { preset: Exclude<Preset, "custom">; label: string }[] = [
    { preset: "week", label: L.week },
    { preset: "today", label: L.today },
    { preset: "tomorrow", label: L.tomorrow },
    { preset: "weekend", label: L.weekend },
    { preset: "month", label: L.month },
  ];

  return (
    <div className={[styles.block, className].filter(Boolean).join(" ")}>
      <div className={styles.root}>
        <div className={styles.colLeft}>
          <div className={styles.selectionRow}>
            <button type="button" className={styles.iconBtn} onClick={() => shiftWindow(-1)} aria-label={L.prevMonth}>
              <span className={styles.chevronLeft} aria-hidden="true" />
            </button>

            <div className={styles.monthPill}>{leftMonthLabel}</div>

            <div className={styles.iconBtnGhost} aria-hidden="true" />
          </div>

          <ColumnGrid dates={leftDates} align="left" normalized={normalized} onPick={handleDayClick} weekdayMap={L.weekdays} />
        </div>

        <div className={styles.colRight}>
          <div className={styles.selectionRow}>
            <div className={styles.iconBtnGhost} aria-hidden="true" />

            <div className={styles.monthPill}>{rightMonthLabel}</div>

            <button type="button" className={styles.iconBtn} onClick={() => shiftWindow(1)} aria-label={L.nextMonth}>
              <span className={styles.chevronRight} aria-hidden="true" />
            </button>
          </div>

          <ColumnGrid
            dates={rightDates}
            align="right"
            normalized={normalized}
            onPick={handleDayClick}
            weekdayMap={L.weekdays}
          />
        </div>
      </div>

      {isMobile && (
        <button type="button" className={styles.mobileDateBtn} onClick={() => setMobilePicker(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 1v2M11 1v2M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {normalized.start.toLocaleDateString(locale, { day: "numeric", month: "short" })}
          {" — "}
          {normalized.end.toLocaleDateString(locale, { day: "numeric", month: "short" })}
        </button>
      )}

      <div className={styles.filters}>
        {presets.map(({ preset, label }) => (
          <button
            key={preset}
            type="button"
            className={[styles.filterBtn, activePreset === preset ? styles.filterActive : ""].join(" ")}
            onClick={() => applyPreset(preset)}
          >
            {label}
          </button>
        ))}
      </div>

      <MobileDatePicker
        open={mobilePicker}
        onClose={() => setMobilePicker(false)}
        value={normalized}
        onChange={(r) => {
          setActivePreset("custom");
          onChange(r, "custom");
        }}
        locale={locale}
      />
    </div>
  );
}
