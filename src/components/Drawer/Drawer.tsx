"use client";

import React, { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Drawer.module.css";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  placement?: DrawerPlacement;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeLabel?: string;
  className?: string;
};

export function Drawer({
  open,
  onClose,
  placement = "right",
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  closeLabel = "Close",
  className,
}: DrawerProps) {
  const titleId = useId();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onPointerDown={() => {
        if (closeOnOverlayClick) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={[styles.panel, styles[placement], className].filter(Boolean).join(" ")}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title ? (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={closeLabel}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
