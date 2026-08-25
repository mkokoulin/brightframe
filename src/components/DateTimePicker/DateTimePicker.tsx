"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DateTimePicker.module.css";

export type DateTimePickerLabels = {
  /** Full month names, January first. */
  months: [string, string, string, string, string, string, string, string, string, string, string, string];
  /** Short weekday labels, Monday first. */
  weekdays: [string, string, string, string, string, string, string];
  today: string;
  pickTime: string;
  pickDate: string;
  done: string;
  timeLabel: string;
};

export const DEFAULT_DATE_TIME_PICKER_LABELS: DateTimePickerLabels = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  today: "Today",
  pickTime: "Pick time",
  pickDate: "Pick date",
  done: "Done",
  timeLabel: "Time",
};

export type DateTimePickerProps = {
  value?: Date;
  onChange: (date: Date) => void;

  disabled?: boolean;

  // date constraints
  minDate?: Date;
  maxDate?: Date;
  disableDate?: (d: Date) => boolean;

  // time constraints
  disableTime?: (h: number, m: number) => boolean;

  timezoneLabel?: string;
  labels?: Partial<DateTimePickerLabels>;
  className?: string;
};

type Panel = "date" | "time";

function clampToDayStart(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDateWithMonths(d: Date, months: readonly string[]) {
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function isDateDisabled(d: Date, opts: { minDate?: Date; maxDate?: Date; disableDate?: (d: Date) => boolean }) {
  const day = clampToDayStart(d);
  if (opts.minDate && day < clampToDayStart(opts.minDate)) return true;
  if (opts.maxDate && day > clampToDayStart(opts.maxDate)) return true;
  if (opts.disableDate && opts.disableDate(day)) return true;
  return false;
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  disableDate,
  disableTime,
  timezoneLabel,
  labels,
  className,
}: DateTimePickerProps) {
  const L = { ...DEFAULT_DATE_TIME_PICKER_LABELS, ...labels };

  const selected = value ?? new Date();

  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("date");

  // month currently shown in the calendar
  const [viewMonth, setViewMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));

  const rootRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(t)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  // sync the shown month when the external value changes
  useEffect(() => {
    setViewMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.getFullYear(), selected.getMonth()]);

  const weeks = useMemo(() => {
    const first = new Date(viewMonth);
    const startWeekday = (first.getDay() + 6) % 7; // Monday = 0
    const start = new Date(first);
    start.setDate(first.getDate() - startWeekday);

    const out: Date[][] = [];
    const cur = new Date(start);

    for (let w = 0; w < 6; w++) {
      const row: Date[] = [];
      for (let i = 0; i < 7; i++) {
        row.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      out.push(row);
    }
    return out;
  }, [viewMonth]);

  const dateLabel = formatDateWithMonths(selected, L.months);
  const timeLabel = formatTime(selected);

  const dateDisabled = (d: Date) => isDateDisabled(d, { minDate, maxDate, disableDate });

  const setDatePart = (day: Date) => {
    const next = new Date(selected);
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    onChange(next);
  };

  const setTimePart = (h: number, m: number) => {
    const next = new Date(selected);
    next.setHours(h, m, 0, 0);
    onChange(next);
  };

  const timeOptions = useMemo(() => {
    const step = 15;
    const list: { h: number; m: number; disabled: boolean }[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += step) {
        const dis = disableTime ? disableTime(h, m) : false;
        list.push({ h, m, disabled: dis });
      }
    }
    return list;
  }, [disableTime]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- listens for Escape bubbling from the focusable buttons/dialog inside, not itself interactive
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) setOpen(false);
      }}
    >
      <div className={styles.tabGroup} data-disabled={disabled || undefined}>
        <button
          type="button"
          className={styles.tab}
          data-active={panel === "date"}
          disabled={disabled}
          aria-pressed={panel === "date"}
          aria-expanded={open}
          onClick={() => {
            setPanel("date");
            setOpen(true);
          }}
        >
          <span className={styles.icon} aria-hidden>
            📅
          </span>
          <span className={styles.tabText}>{dateLabel}</span>
        </button>

        <button
          type="button"
          className={styles.tab}
          data-active={panel === "time"}
          disabled={disabled}
          aria-pressed={panel === "time"}
          aria-expanded={open}
          onClick={() => {
            setPanel("time");
            setOpen(true);
          }}
        >
          <span className={styles.icon} aria-hidden>
            ⏰
          </span>
          <span className={styles.tabText}>{timeLabel}</span>
        </button>
      </div>

      <div className={styles.dropdown} data-open={open}>
        <div className={styles.dropdownInner}>
          {panel === "date" ? (
            <div className={styles.calendar}>
              <div className={styles.calHeader}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                >
                  ←
                </button>

                <div className={styles.monthTitle}>
                  {L.months[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </div>

                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                >
                  →
                </button>
              </div>

              <div className={styles.weekdays}>
                {L.weekdays.map((w, i) => (
                  <span key={`${w}-${i}`}>{w}</span>
                ))}
              </div>

              <div className={styles.grid}>
                {weeks.map((row, idx) => (
                  <React.Fragment key={idx}>
                    {row.map((d) => {
                      const inMonth = d.getMonth() === viewMonth.getMonth();
                      const isSel = sameDay(d, selected);
                      const isToday = sameDay(d, new Date());
                      const dis = dateDisabled(d);
                      return (
                        <button
                          key={d.toISOString()}
                          type="button"
                          className={styles.day}
                          data-out={!inMonth}
                          data-selected={isSel}
                          data-today={!isSel && isToday}
                          disabled={dis}
                          onClick={() => setDatePart(d)}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              <div className={styles.footerRow}>
                <button
                  type="button"
                  className={styles.quickBtn}
                  onClick={() => {
                    const today = new Date();
                    if (!dateDisabled(today)) setDatePart(today);
                  }}
                >
                  {L.today}
                </button>

                <button
                  type="button"
                  className={styles.quickBtn}
                  onClick={() => {
                    setPanel("time");
                  }}
                >
                  {L.pickTime}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.timePanel}>
              <div className={styles.timeHeader}>
                <div className={styles.timeTitle}>
                  {L.timeLabel} {timezoneLabel ? <span className={styles.tz}>({timezoneLabel})</span> : null}
                </div>
              </div>

              <div className={styles.timeList}>
                {timeOptions.map((opt) => {
                  const active = selected.getHours() === opt.h && selected.getMinutes() === opt.m;
                  return (
                    <button
                      key={`${opt.h}:${opt.m}`}
                      type="button"
                      className={styles.timeItem}
                      data-active={active}
                      disabled={opt.disabled}
                      onClick={() => setTimePart(opt.h, opt.m)}
                    >
                      {pad2(opt.h)}:{pad2(opt.m)}
                    </button>
                  );
                })}
              </div>

              <div className={styles.footerRow}>
                <button type="button" className={styles.quickBtn} onClick={() => setPanel("date")}>
                  {L.pickDate}
                </button>
                <button type="button" className={styles.quickBtn} onClick={() => setOpen(false)}>
                  {L.done}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
