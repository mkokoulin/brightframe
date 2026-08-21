"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./Popover.module.css";

export type PopoverPosition = "top" | "bottom" | "left" | "right";

export type PopoverProps = {
  /** Content of the trigger button that opens/closes the popover. */
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: PopoverPosition;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  className?: string;
};

export function Popover({
  trigger,
  children,
  position = "bottom",
  open,
  defaultOpen = false,
  onOpenChange,
  triggerClassName,
  className,
}: PopoverProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const panelId = useId();
  const triggerId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={containerRef} className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={[styles.trigger, triggerClassName].filter(Boolean).join(" ")}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setOpen(!isOpen)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={triggerId}
          className={[styles.panel, styles[position]].join(" ")}
        >
          {children}
        </div>
      )}
    </div>
  );
}
