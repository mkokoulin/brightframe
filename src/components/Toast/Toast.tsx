"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type ToastOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  /** ms before auto-dismiss. 0 disables auto-dismiss. Defaults to the provider's `defaultDuration`. */
  duration?: number;
};

type ToastRecord = Required<Pick<ToastOptions, "variant" | "duration">> &
  Pick<ToastOptions, "title" | "description"> & { id: string };

export type ToastContextValue = {
  /** Shows a toast and returns its id (pass to `dismiss` to remove it early). */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProviderProps = {
  children: React.ReactNode;
  position?: ToastPosition;
  /** Default ms before auto-dismiss when a toast doesn't specify its own `duration`. Defaults to 4000. */
  defaultDuration?: number;
};

const ICONS: Record<ToastVariant, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.9" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 9.2l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2.5l7.5 13h-15L9 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 7.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13.5" r="0.9" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

function ToastItem({ record, onDismiss }: { record: ToastRecord; onDismiss: () => void }) {
  const role = record.variant === "error" || record.variant === "warning" ? "alert" : "status";
  return (
    <div role={role} className={[styles.toast, styles[record.variant]].join(" ")}>
      <span className={styles.icon} aria-hidden="true">
        {ICONS[record.variant]}
      </span>
      <div className={styles.body}>
        {record.title && <div className={styles.title}>{record.title}</div>}
        {record.description && <div className={styles.description}>{record.description}</div>}
      </div>
      <button type="button" className={styles.closeBtn} onClick={onDismiss} aria-label="Dismiss notification">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Provides `useToast()` to the subtree and renders the notification stack in a portal.
 * Mount once near the root of the app, inside (or alongside) `<ThemeProvider>`.
 */
export function ToastProvider({ children, position = "bottom-right", defaultDuration = 4000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const idRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${++idRef.current}`;
      const duration = options.duration ?? defaultDuration;
      const record: ToastRecord = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "info",
        duration,
      };
      setToasts((prev) => [...prev, record]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [defaultDuration, dismiss],
  );

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className={[styles.viewport, styles[position]].join(" ")} role="region" aria-live="polite" aria-label="Notifications">
            {toasts.map((t) => (
              <ToastItem key={t.id} record={t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

/** Reads `toast()`/`dismiss()`/`dismissAll()` from the nearest `<ToastProvider>`. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast() must be used within a <ToastProvider>.");
  return ctx;
}
