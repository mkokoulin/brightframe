"use client";

import React from "react";
import styles from "./GuestsCounter.module.css";

export type GuestsCounterProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string | null;
  /** Replaces the default 👤 emoji icon. Pass `null` to hide it. */
  icon?: React.ReactNode | null;
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "onChange">;

export function GuestsCounter({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
  icon,
  decreaseLabel = "Decrease",
  increaseLabel = "Increase",
  className,
  ...rest
}: GuestsCounterProps) {
  const resolvedLabel = label ?? "Guests";
  const resolvedIcon = icon === undefined ? "👤" : icon;
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.title}>
        {resolvedIcon !== null && (
          <span className={styles.icon} aria-hidden="true">
            {resolvedIcon}
          </span>
        )}
        <span className={styles.label}>{resolvedLabel}</span>
      </div>

      <div className={styles.counter}>
        <button type="button" className={styles.btn} onClick={dec} aria-label={decreaseLabel}>
          –
        </button>
        <div className={styles.value}>{value}</div>
        <button type="button" className={styles.btn} onClick={inc} aria-label={increaseLabel}>
          +
        </button>
      </div>
    </div>
  );
}
