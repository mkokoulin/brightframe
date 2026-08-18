import React from "react";
import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerProps = {
  orientation?: DividerOrientation;
  /** Optional label rendered in the middle of the line, e.g. "OR". Only supported horizontally. */
  label?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function Divider({ orientation = "horizontal", label, className, ...rest }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={[styles.divider, styles.vertical, className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={[styles.withLabel, className].filter(Boolean).join(" ")}
        {...rest}
      >
        <span className={styles.line} />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={[styles.divider, styles.horizontal, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
