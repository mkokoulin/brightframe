"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./DropdownMenu.module.css";

export type DropdownMenuItem = {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  /** Styles the item for a destructive action, e.g. "Delete". */
  danger?: boolean;
};

export type DropdownMenuEntry = DropdownMenuItem | "separator";

export type DropdownMenuAlign = "start" | "end";

export type DropdownMenuProps = {
  trigger: React.ReactNode;
  items: DropdownMenuEntry[];
  align?: DropdownMenuAlign;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  className?: string;
};

export function DropdownMenu({
  trigger,
  items,
  align = "start",
  open,
  defaultOpen = false,
  onOpenChange,
  triggerClassName,
  className,
}: DropdownMenuProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledEntries = items
    .map((item, idx) => ({ item, idx }))
    .filter((x): x is { item: DropdownMenuItem; idx: number } => x.item !== "separator" && !x.item.disabled);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(
    (refocus: boolean) => {
      setOpen(false);
      if (refocus) triggerRef.current?.focus();
    },
    [setOpen],
  );

  const focusIndex = useCallback((idx: number) => {
    itemRefs.current[idx]?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (enabledEntries.length > 0) focusIndex(enabledEntries[0].idx);

    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) close(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    // Enter/Space are left to the native button click (which toggles via onClick) — only
    // arrow keys get special handling here, since browsers don't open menus for those.
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onMenuKeyDown(e: React.KeyboardEvent, currentIdx: number) {
    const n = enabledEntries.length;
    if (n === 0) return;
    const posInEnabled = enabledEntries.findIndex((x) => x.idx === currentIdx);

    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusIndex(enabledEntries[(posInEnabled + 1) % n].idx);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusIndex(enabledEntries[(posInEnabled - 1 + n) % n].idx);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusIndex(enabledEntries[0].idx);
    } else if (e.key === "End") {
      e.preventDefault();
      focusIndex(enabledEntries[n - 1].idx);
    } else if (e.key === "Tab") {
      close(false);
    }
  }

  function select(item: DropdownMenuItem) {
    item.onSelect?.();
    close(true);
  }

  return (
    <div ref={containerRef} className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <button
        ref={triggerRef}
        type="button"
        className={[styles.trigger, triggerClassName].filter(Boolean).join(" ")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </button>

      {isOpen && (
        <div role="menu" className={[styles.menu, styles[align]].join(" ")}>
          {items.map((entry, idx) =>
            entry === "separator" ? (
              <div key={`sep-${idx}`} className={styles.separator} role="separator" />
            ) : (
              <button
                key={entry.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                role="menuitem"
                className={[styles.item, entry.danger ? styles.danger : ""].filter(Boolean).join(" ")}
                disabled={entry.disabled}
                tabIndex={-1}
                onClick={() => select(entry)}
                onKeyDown={(e) => onMenuKeyDown(e, idx)}
              >
                {entry.icon && (
                  <span className={styles.icon} aria-hidden="true">
                    {entry.icon}
                  </span>
                )}
                {entry.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
