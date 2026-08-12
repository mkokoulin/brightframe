import React from "react";
import styles from "./GuestsCounter.module.css";

export type GuestsCounterProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string | null;
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
};

export function GuestsCounter({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
  decreaseLabel = "Decrease",
  increaseLabel = "Increase",
  className,
}: GuestsCounterProps) {
  const resolvedLabel = label ?? "Guests";
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")}>
      <div className={styles.title}>
        <span className={styles.icon} aria-hidden="true">
          👤
        </span>
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
