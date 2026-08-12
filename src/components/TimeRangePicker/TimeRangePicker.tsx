"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TimeRangePicker.module.css";
import {
  buildSlots,
  formatDuration,
  toMinutes,
  toTime,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_DURATION_UNIT_LABELS,
  type BusinessHours,
  type DurationUnitLabels,
} from "./timeSlots";
import { MobileDatePicker, type MobileDatePickerLabels } from "../MobileDatePicker/MobileDatePicker";
import { parseYMD, toYMD } from "../FormDatePicker/FormDatePicker";

export type TimeRangePickerProps = {
  date: string;
  onDateChange: (v: string) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (v: string) => void;
  onEndTimeChange: (v: string) => void;
  /** BCP 47 locale used to format the date button and the date picker, e.g. "en-US" or "ru-RU". */
  locale?: string;
  businessHours?: BusinessHours;
  startLabel?: string;
  endLabel?: string;
  durationUnitLabels?: DurationUnitLabels;
  datePickerLabels?: Partial<MobileDatePickerLabels>;
  className?: string;
};

type OpenPanel = "start" | "end" | null;

function fmtDateBtn(s: string, locale: string): string {
  if (!s) return "—";
  try {
    return parseYMD(s).toLocaleDateString(locale, { day: "numeric", month: "short" });
  } catch {
    return s;
  }
}

export function TimeRangePicker({
  date,
  onDateChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  locale = "en-US",
  businessHours = DEFAULT_BUSINESS_HOURS,
  startLabel = "Start",
  endLabel = "End",
  durationUnitLabels = DEFAULT_DURATION_UNIT_LABELS,
  datePickerLabels,
  className,
}: TimeRangePickerProps) {
  const slots = useMemo(() => buildSlots(businessHours), [businessHours]);
  const [mobileDateOpen, setMobileDateOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const endBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);

  const startOptions = useMemo(() => slots.filter((s) => toMinutes(s) < endMin), [slots, endMin]);
  const endOptions = useMemo(() => slots.filter((s) => toMinutes(s) > startMin), [slots, startMin]);

  const durationLabel = formatDuration(endMin - startMin, durationUnitLabels);

  const selectedDate = useMemo(() => {
    try {
      return parseYMD(date);
    } catch {
      return new Date();
    }
  }, [date]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!openPanel) return;

    function onDocDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenPanel(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPanel(null);
    }

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openPanel]);

  // Scroll active slot into view when panel opens
  useEffect(() => {
    if (!openPanel || !panelRef.current) return;
    const active = panelRef.current.querySelector<HTMLElement>("[data-active=true]");
    active?.scrollIntoView({ block: "nearest" });
  }, [openPanel]);

  function togglePanel(which: OpenPanel) {
    setOpenPanel((cur) => (cur === which ? null : which));
  }

  function pickStart(slot: string) {
    const nextStartMin = toMinutes(slot);
    onStartTimeChange(slot);
    if (toMinutes(endTime) <= nextStartMin) {
      onEndTimeChange(toTime(Math.min(businessHours.closeHour * 60, nextStartMin + businessHours.stepMin)));
    }
    setOpenPanel("end");
    setTimeout(() => endBtnRef.current?.focus(), 0);
  }

  function pickEnd(slot: string) {
    onEndTimeChange(slot);
    setOpenPanel(null);
  }

  function pickSlot(slot: string) {
    if (openPanel === "start") pickStart(slot);
    else pickEnd(slot);
  }

  const activeSlots = openPanel === "start" ? startOptions : endOptions;
  const activeValue = openPanel === "start" ? startTime : endTime;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} ref={rootRef}>
      <div className={styles.group}>
        <div className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            📅
          </span>
          <button
            type="button"
            className={styles.dateInput}
            onClick={() => {
              setOpenPanel(null);
              setMobileDateOpen(true);
            }}
          >
            {fmtDateBtn(date, locale)}
          </button>
        </div>

        <div className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            ⏰
          </span>
          <div className={styles.range}>
            <button
              ref={startBtnRef}
              type="button"
              className={`${styles.timeBtn} ${openPanel === "start" ? styles.timeBtnActive : ""}`}
              onClick={() => togglePanel("start")}
              aria-expanded={openPanel === "start"}
              aria-haspopup="listbox"
            >
              {startTime}
            </button>

            <span className={styles.dash} aria-hidden="true">
              –
            </span>

            <button
              ref={endBtnRef}
              type="button"
              className={`${styles.timeBtn} ${openPanel === "end" ? styles.timeBtnActive : ""}`}
              onClick={() => togglePanel("end")}
              aria-expanded={openPanel === "end"}
              aria-haspopup="listbox"
            >
              {endTime}
            </button>

            <span className={styles.duration}>{durationLabel}</span>
          </div>
        </div>
      </div>

      {openPanel && (
        <div
          ref={panelRef}
          className={styles.panel}
          role="listbox"
          aria-label={openPanel === "start" ? startLabel : endLabel}
        >
          <div className={styles.panelLabel}>{openPanel === "start" ? startLabel : endLabel}</div>
          <div className={styles.slots}>
            {activeSlots.map((slot) => {
              const isActive = slot === activeValue;
              return (
                <button
                  key={slot}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  className={`${styles.slot} ${isActive ? styles.slotActive : ""}`}
                  onClick={() => pickSlot(slot)}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <MobileDatePicker
        mode="single"
        open={mobileDateOpen}
        onClose={() => setMobileDateOpen(false)}
        value={{ start: selectedDate, end: selectedDate }}
        onChange={(r) => onDateChange(toYMD(r.start))}
        locale={locale}
        labels={datePickerLabels}
      />
    </div>
  );
}
