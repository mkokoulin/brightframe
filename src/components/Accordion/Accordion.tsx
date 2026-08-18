"use client";

import React, { useId, useState } from "react";
import styles from "./Accordion.module.css";

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Allow more than one panel open at once. Defaults to false (one at a time). */
  multiple?: boolean;
  /** Controlled list of open item ids. */
  value?: string[];
  /** Initial open item ids when uncontrolled. */
  defaultValue?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
};

export function Accordion({ items, multiple = false, value, defaultValue, onChange, className }: AccordionProps) {
  const baseId = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(() => defaultValue ?? []);
  const openIds = isControlled ? value : internal;

  function toggle(id: string) {
    const isOpen = openIds.includes(id);
    let next: string[];
    if (isOpen) {
      next = openIds.filter((x) => x !== id);
    } else {
      next = multiple ? [...openIds, id] : [id];
    }
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id} className={[styles.item, open ? styles.itemOpen : ""].filter(Boolean).join(" ")}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={headerId}
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <ChevronIcon open={open} />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={headerId} aria-hidden={!open} className={styles.panel}>
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={[styles.chevron, open ? styles.chevronOpen : ""].filter(Boolean).join(" ")}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
