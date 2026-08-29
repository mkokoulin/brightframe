"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../a11y";
import styles from "./MobileDatePicker.module.css";

export type Range = { start: Date; end: Date };

type Step = "selectStart" | "selectEnd";

export type MobileDatePickerLabels = {
  close: string;
  reset: string;
  apply: string;
  hintSingle: string;
  hintRangeStart: string;
  hintRangeEnd: string;
  prevMonth: string;
  nextMonth: string;
};

export const DEFAULT_MOBILE_DATE_PICKER_LABELS: MobileDatePickerLabels = {
  close: "Close",
  reset: "Reset",
  apply: "Apply",
  hintSingle: "Select a date",
  hintRangeStart: "Select a start date",
  hintRangeEnd: "Select an end date",
  prevMonth: "Previous month",
  nextMonth: "Next month",
};

export type MobileDatePickerProps = {
  open: boolean;
  onClose: () => void;
  value: Range;
  onChange: (range: Range) => void;
  mode?: "single" | "range";
  minDate?: Date;
  /** BCP 47 locale used to format month/weekday/chip text, e.g. "en-US" or "ru-RU". */
  locale?: string;
  labels?: Partial<MobileDatePickerLabels>;
  /** Extra class applied to the bottom sheet (not the overlay). */
  className?: string;
};

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

function sod(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function inRange(d: Date, s: Date, e: Date) {
  const t = d.getTime();
  return t >= s.getTime() && t <= e.getTime();
}
function normalize(a: Date, b: Date): Range {
  const x = sod(a),
    y = sod(b);
  return x.getTime() <= y.getTime() ? { start: x, end: y } : { start: y, end: x };
}
function buildCells(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startWd = (first.getDay() + 6) % 7; // Mon = 0
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWd; i++) cells.push(null);
  for (let d = 1; d <= lastDate; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function getMonthName(year: number, month: number, locale: string): string {
  const s = new Date(year, month, 1).toLocaleString(locale, { month: "long" });
  return capitalize(s);
}
function fmtChip(d: Date, locale: string): string {
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}
/** 1970-01-05 was a Monday — used as a locale-agnostic reference week. */
function buildWeekdayLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  return Array.from({ length: 7 }, (_, i) => capitalize(fmt.format(new Date(1970, 0, 5 + i))));
}

export function MobileDatePicker({
  open,
  onClose,
  value,
  onChange,
  mode = "range",
  minDate,
  locale = "en-US",
  labels,
  className,
}: MobileDatePickerProps) {
  const L = { ...DEFAULT_MOBILE_DATE_PICKER_LABELS, ...labels };
  const weekdays = useMemo(() => buildWeekdayLabels(locale), [locale]);

  const sheetRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useFocusTrap(sheetRef, open && mounted);
  const [draft, setDraft] = useState<Range>(() => normalize(value.start, value.end));
  const [step, setStep] = useState<Step>("selectStart");
  const [anchor, setAnchor] = useState<Date | null>(null);

  const [firstMonth, setFirstMonth] = useState<{ year: number; month: number }>(() => ({
    year: value.start.getFullYear(),
    month: value.start.getMonth(),
  }));

  // Re-init when picker opens so Cancel discards any in-progress selection
  useEffect(() => {
    if (open) {
      const norm = normalize(value.start, value.end);
      setDraft(norm);
      setStep("selectStart");
      setAnchor(null);
      setFirstMonth({ year: norm.start.getFullYear(), month: norm.start.getMonth() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // value intentionally excluded: re-init only on open, not on every external change

  const minDateMs = useMemo(() => (minDate ? sod(minDate).getTime() : null), [minDate]);

  const months = useMemo(() => {
    const result: { year: number; month: number }[] = [];
    let { year, month } = firstMonth;
    for (let i = 0; i < 2; i++) {
      result.push({ year, month });
      month++;
      if (month === 12) {
        month = 0;
        year++;
      }
    }
    return result;
  }, [firstMonth]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleDayClick(d: Date) {
    const day = sod(d);
    if (mode === "single") {
      const r = { start: day, end: day };
      setDraft(r);
      onChange(r);
      onClose();
      return;
    }
    if (step === "selectStart") {
      setAnchor(day);
      setDraft({ start: day, end: day });
      setStep("selectEnd");
    } else {
      const r = normalize(anchor!, day);
      setDraft(r);
      setAnchor(null);
      setStep("selectStart");
    }
  }

  function handleApply() {
    onChange(draft);
    onClose();
  }

  function handleReset() {
    const today = sod(new Date());
    setDraft({ start: today, end: today });
    setStep("selectStart");
    setAnchor(null);
    setFirstMonth({ year: today.getFullYear(), month: today.getMonth() });
  }

  function prev() {
    setFirstMonth(({ year, month }) => (month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }));
  }
  function next() {
    setFirstMonth(({ year, month }) => (month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }));
  }

  if (!open || !mounted) return null;

  const isSingleDay = sameDay(draft.start, draft.end);
  // While picking end date: show anchor as start, "—" as end
  const chipStart = step === "selectEnd" ? anchor! : draft.start;
  const chipEnd = step === "selectEnd" ? null : isSingleDay ? null : draft.end;
  const hintText = mode === "single" ? L.hintSingle : step === "selectStart" ? L.hintRangeStart : L.hintRangeEnd;

  return createPortal(
    <div className={styles.overlay} onPointerDown={onClose}>
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={hintText}
        tabIndex={-1}
        className={[styles.sheet, className].filter(Boolean).join(" ")}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Top bar: drag handle + close button */}
        <div className={styles.topBar}>
          <div className={styles.handle} />
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={L.close}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Range header: chips + hint */}
        <div className={styles.rangeHeader}>
          <div className={styles.chips}>
            {mode === "single" ? (
              <div className={[styles.chip, styles.chipIdle].join(" ")}>
                {chipStart ? fmtChip(chipStart, locale) : "—"}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className={[styles.chip, step === "selectStart" ? styles.chipActive : styles.chipIdle].join(" ")}
                  onClick={() => {
                    setStep("selectStart");
                    setAnchor(null);
                  }}
                >
                  {chipStart ? fmtChip(chipStart, locale) : "—"}
                </button>

                <svg className={styles.chipArrow} width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
                  <path
                    d="M1 5h14M10 1l5 4-5 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <button
                  type="button"
                  className={[
                    styles.chip,
                    step === "selectEnd" ? styles.chipActive : styles.chipIdle,
                    !chipEnd ? styles.chipEmpty : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (chipStart) {
                      setAnchor(draft.start);
                      setStep("selectEnd");
                    }
                  }}
                >
                  {chipEnd ? fmtChip(chipEnd, locale) : "—"}
                </button>
              </>
            )}
          </div>

          <p className={styles.hint}>{hintText}</p>
        </div>

        {/* Scrollable calendar */}
        <div className={styles.scrollArea}>
          {months.map(({ year, month }, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === months.length - 1;
            const cells = buildCells(year, month);
            const isRangeSingle = sameDay(draft.start, draft.end);

            return (
              <div key={`${year}-${month}`} className={styles.monthBlock}>
                <div className={styles.monthHeader}>
                  <button
                    type="button"
                    className={[styles.navBtn, !isFirst ? styles.navBtnHidden : ""].filter(Boolean).join(" ")}
                    onClick={prev}
                    tabIndex={isFirst ? 0 : -1}
                    aria-label={L.prevMonth}
                  >
                    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden>
                      <path
                        d="M7 1L1 6.5L7 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className={styles.monthTitle}>{getMonthName(year, month, locale)}</div>

                  <button
                    type="button"
                    className={[styles.navBtn, !isLast ? styles.navBtnHidden : ""].filter(Boolean).join(" ")}
                    onClick={next}
                    tabIndex={isLast ? 0 : -1}
                    aria-label={L.nextMonth}
                  >
                    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden>
                      <path
                        d="M1 1L7 6.5L1 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className={styles.weekdays}>
                  {weekdays.map((w, i) => (
                    <div key={`${w}-${i}`} className={styles.weekdayLabel}>
                      {w}
                    </div>
                  ))}
                </div>

                <div className={styles.daysGrid}>
                  {cells.map((d, i) => {
                    if (!d) return <div key={`e-${i}`} />;

                    const isToday = sameDay(d, TODAY);
                    const isStart = sameDay(d, draft.start);
                    const isEnd = sameDay(d, draft.end);
                    const isSel = isStart || isEnd;
                    const isMiddle = !isRangeSingle && inRange(d, draft.start, draft.end) && !isSel;
                    const showBarStart = isStart && !isRangeSingle;
                    const showBarEnd = isEnd && !isRangeSingle;
                    const isDisabled = minDateMs !== null ? sod(d).getTime() < minDateMs : false;

                    return (
                      <div key={d.toISOString()} className={styles.dayOuter}>
                        {(showBarStart || showBarEnd || isMiddle) && (
                          <div
                            className={[
                              styles.rangeBar,
                              showBarStart ? styles.rangeBarStart : "",
                              showBarEnd ? styles.rangeBarEnd : "",
                              isMiddle ? styles.rangeBarMiddle : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          />
                        )}
                        <button
                          type="button"
                          className={[
                            styles.dayBtn,
                            isSel ? styles.daySelected : "",
                            isToday && !isSel ? styles.dayToday : "",
                            isDisabled ? styles.dayDisabled : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => !isDisabled && handleDayClick(d)}
                          aria-current={isToday ? "date" : undefined}
                          aria-pressed={isSel}
                          disabled={isDisabled}
                        >
                          {d.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            {L.reset}
          </button>
          <button type="button" className={styles.applyBtn} onClick={handleApply}>
            {L.apply}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
