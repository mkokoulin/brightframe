"use client";

import React from "react";
import { QuestionIcon } from "../../icons/QuestionIcon";
import styles from "./InfoTooltip.module.css";

export type InfoTooltipPosition = "top" | "bottom" | "left" | "right";

export type InfoTooltipProps = {
  label: string;
  /** Which side of the trigger the bubble opens on. Defaults to "top". */
  position?: InfoTooltipPosition;
  /** Replaces the default question-mark trigger icon. */
  icon?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children">;

export function InfoTooltip({ label, position = "top", icon, className, ...rest }: InfoTooltipProps) {
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
    <span ref={wrapRef} className={cls} {...rest}>
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
        {icon ?? <QuestionIcon active={open} />}
      </button>

      {open && (
        <span role="tooltip" className={[styles.bubble, styles[position]].join(" ")}>
          {label}
        </span>
      )}
    </span>
  );
}
