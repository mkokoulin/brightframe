"use client";

import React from "react";
import styles from "./Progress.module.css";

export type ProgressSize = "sm" | "md" | "lg";

export type ProgressProps = {
  /** Omit for an indeterminate (loading, unknown duration) bar. */
  value?: number;
  max?: number;
  size?: ProgressSize;
  /** Shows the percentage above the bar. Ignored while indeterminate. Defaults to false. */
  showLabel?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function Progress({ value, max = 100, size = "md", showLabel = false, className, ...rest }: ProgressProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? undefined : Math.min(max, Math.max(0, value));
  const percent = indeterminate ? undefined : Math.round((clamped! / max) * 100);

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      {showLabel && !indeterminate && (
        <div className={styles.labelRow}>
          <span className={styles.labelText}>{percent}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className={[styles.track, styles[size]].join(" ")}
        {...rest}
      >
        <div
          className={[styles.fill, indeterminate ? styles.indeterminate : ""].filter(Boolean).join(" ")}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
