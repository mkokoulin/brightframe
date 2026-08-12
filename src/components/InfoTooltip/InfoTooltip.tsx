"use client";

import React from "react";
import { QuestionIcon } from "../../icons/QuestionIcon";
import styles from "./InfoTooltip.module.css";

export type InfoTooltipProps = {
  label: string;
  className?: string;
};

export function InfoTooltip({ label, className }: InfoTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const cls = [styles.wrap, className].filter(Boolean).join(" ");

  return (
    <span ref={wrapRef} className={cls}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
      >
        <QuestionIcon active={open} />
      </button>

      {open && (
        <span role="tooltip" className={styles.bubble}>
          {label}
        </span>
      )}
    </span>
  );
}
