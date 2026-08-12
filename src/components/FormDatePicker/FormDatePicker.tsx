"use client";
import React, { useId, useMemo, useState } from "react";
import styles from "./FormDatePicker.module.css";
import { MobileDatePicker, type MobileDatePickerLabels } from "../MobileDatePicker/MobileDatePicker";

export type { Range } from "../MobileDatePicker/MobileDatePicker";

export type FormDatePickerProps = {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  /** BCP 47 locale used to format the displayed date and the picker itself, e.g. "en-US" or "ru-RU". */
  locale?: string;
  pickerLabels?: Partial<MobileDatePickerLabels>;
  className?: string;
};

export function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(s: string, locale: string): string {
  if (!s) return "";
  try {
    return parseYMD(s).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

function CalendarIcon() {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 1v2M11 1v2M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function FormDatePicker({
  label,
  value,
  onChange,
  placeholder = "Select a date",
  error,
  minDate,
  locale = "en-US",
  pickerLabels,
  className,
}: FormDatePickerProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  const selectedDate = useMemo(() => {
    if (!value) return new Date();
    try {
      return parseYMD(value);
    } catch {
      return new Date();
    }
  }, [value]);

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={`${styles.row} ${error ? styles.rowError : ""}`}>
        <div className={styles.inner}>
          <button
            id={id}
            type="button"
            className={styles.trigger}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-invalid={!!error}
            aria-describedby={errorId}
          >
            <CalendarIcon />
            <span className={value ? styles.value : styles.placeholder}>
              {value ? formatDisplay(value, locale) : placeholder}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div id={errorId} className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}

      <MobileDatePicker
        mode="single"
        open={open}
        onClose={() => setOpen(false)}
        value={{ start: selectedDate, end: selectedDate }}
        onChange={(r) => onChange(toYMD(r.start))}
        minDate={minDate}
        locale={locale}
        labels={pickerLabels}
      />
    </div>
  );
}
