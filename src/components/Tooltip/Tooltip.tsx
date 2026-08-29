"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./Tooltip.module.css";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
  /** Bubble content. */
  content: React.ReactNode;
  /** Which side of the trigger the bubble opens on. Defaults to "top". */
  position?: TooltipPosition;
  /** Delay in ms before the bubble appears on hover. Defaults to 0. */
  delay?: number;
  disabled?: boolean;
  /** The trigger — anything hoverable/focusable (text, an icon, a `<Btn>`, ...). */
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ content, position = "top", delay = 0, disabled = false, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tooltipId = useId();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function show() {
    if (disabled) return;
    clearTimeout(timeoutRef.current);
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(true);
    }
  }

  function hide() {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }

  // aria-describedby has to live on the focusable trigger itself, not this wrapping
  // span — screen readers only resolve it against whatever element actually has focus,
  // so putting it here would announce nothing.
  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby": open ? tooltipId : undefined,
      })
    : children;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- listens for hover/focus bubbling from the focusable trigger inside, not itself interactive
    <span
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") hide();
      }}
    >
      {trigger}
      {open && !disabled && (
        <span id={tooltipId} role="tooltip" className={[styles.bubble, styles[position]].join(" ")}>
          {content}
        </span>
      )}
    </span>
  );
}
