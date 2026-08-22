"use client";

import React, { useId, useRef, useState } from "react";
import styles from "./Tabs.module.css";

export type TabItem = {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabsVariant = "line" | "pill";

export type TabsProps = {
  items: TabItem[];
  /** Controlled active tab id. */
  value?: string;
  /** Initial active tab id when uncontrolled. Defaults to the first enabled item. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: TabsVariant;
  fullWidth?: boolean;
  className?: string;
};

export function Tabs({ items, value, defaultValue, onChange, variant = "line", fullWidth = false, className }: TabsProps) {
  const baseId = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | undefined>(
    () => defaultValue ?? items.find((i) => !i.disabled)?.id ?? items[0]?.id,
  );
  const active = isControlled ? value : internal;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(id: string) {
    if (!isControlled) setInternal(id);
    onChange?.(id);
  }

  function onKeyDown(e: React.KeyboardEvent, idx: number) {
    const n = items.length;
    if (n === 0) return;

    let nextIdx: number;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % n;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + n) % n;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = n - 1;
    else return;

    e.preventDefault();

    const step = e.key === "ArrowLeft" || e.key === "End" ? -1 : 1;
    let tries = 0;
    while (items[nextIdx].disabled && tries < n) {
      nextIdx = (nextIdx + step + n) % n;
      tries++;
    }
    if (items[nextIdx].disabled) return;

    select(items[nextIdx].id);
    tabRefs.current[nextIdx]?.focus();
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <div
        role="tablist"
        className={[styles.list, styles[variant], fullWidth ? styles.fullWidth : ""].filter(Boolean).join(" ")}
      >
        {items.map((item, idx) => {
          const selected = item.id === active;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={[styles.tab, selected ? styles.tabSelected : ""].filter(Boolean).join(" ")}
              onClick={() => select(item.id)}
              onKeyDown={(e) => onKeyDown(e, idx)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const selected = item.id === active;
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id} role="tabpanel" id={panelId} aria-labelledby={tabId} hidden={!selected} className={styles.panel}>
            {selected ? item.content : null}
          </div>
        );
      })}
    </div>
  );
}
