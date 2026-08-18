"use client";

import React from "react";
import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "error";

export type AlertProps = {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Replaces the default per-variant icon. Pass `null` to hide the icon entirely. */
  icon?: React.ReactNode | null;
  /** Shows a close button and fires when it's clicked. Omit to render a non-dismissible alert. */
  onDismiss?: () => void;
  closeLabel?: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children" | "title">;

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  info: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.9" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 9.2l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2.5l7.5 13h-15L9 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 7.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13.5" r="0.9" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onDismiss,
  closeLabel = "Dismiss",
  className,
  ...rest
}: AlertProps) {
  const role = variant === "error" || variant === "warning" ? "alert" : "status";
  const resolvedIcon = icon === null ? null : (icon ?? DEFAULT_ICONS[variant]);

  return (
    <div role={role} className={[styles.alert, styles[variant], className].filter(Boolean).join(" ")} {...rest}>
      {resolvedIcon && (
        <span className={styles.icon} aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.closeBtn} onClick={onDismiss} aria-label={closeLabel}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
