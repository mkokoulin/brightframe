"use client";

import React from "react";
import styles from "./Tag.module.css";

export type TagVariant =
  | "brand"
  | "accent"
  | "neutral"
  | "error"
  | "outline"
  | "blue"
  | "orange"
  | "green"
  | "purple";
export type TagSize = "sm" | "md" | "lg";

export type TagProps = {
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
  children?: React.ReactNode;
  /** Shows a small remove button and fires when it's clicked. Omit for a plain, non-dismissible tag. */
  onDismiss?: () => void;
  /** aria-label for the remove button. Defaults to `Remove {children}` when children is a string. */
  dismissLabel?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export function Tag({
  variant = "brand",
  size = "md",
  className,
  children,
  onDismiss,
  dismissLabel,
  ...rest
}: TagProps) {
  const cls = [styles.tag, styles[variant], styles[size], onDismiss && styles.dismissible, className]
    .filter(Boolean)
    .join(" ");
  const label = dismissLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");

  return (
    <span className={cls} {...rest}>
      {children}
      {onDismiss ? (
        <button
          type="button"
          className={styles.dismissBtn}
          onClick={onDismiss}
          aria-label={label}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
