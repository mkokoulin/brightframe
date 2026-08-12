"use client";

import React, { useId, useRef, useState, useEffect, useCallback } from "react";
import styles from "./SelectField.module.css";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  className?: string;
};

export function SelectField({ label, value, onChange, options, error, placeholder, className }: SelectFieldProps) {
  const id = useId();
  const listId = `${id}-list`;
  const errorId = error ? `${id}-error` : undefined;

  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  function toggle() {
    if (open) {
      close();
    } else {
      setOpen(true);
      setFocusedIdx(Math.max(0, options.findIndex((o) => o.value === value)));
    }
  }

  function select(v: string) {
    onChange(v);
    close();
    triggerRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        toggle();
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIdx >= 0) select(options[focusedIdx].value);
        break;
    }
  }

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div ref={containerRef} className={styles.container}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-describedby={errorId}
          className={[styles.trigger, open && styles.triggerOpen, error && styles.triggerError]
            .filter(Boolean)
            .join(" ")}
          onClick={toggle}
          onKeyDown={onKeyDown}
        >
          <span className={selectedLabel ? styles.valueText : styles.placeholder}>
            {selectedLabel || placeholder || "—"}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (
          <ul id={listId} role="listbox" aria-label={label} className={styles.panel}>
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={[
                  styles.option,
                  opt.value === value && styles.optionSelected,
                  idx === focusedIdx && styles.optionFocused,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onPointerDown={(e) => {
                  e.preventDefault();
                  select(opt.value);
                }}
                onPointerEnter={() => setFocusedIdx(idx)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div id={errorId} className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={[styles.chevron, open && styles.chevronOpen].filter(Boolean).join(" ")}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
