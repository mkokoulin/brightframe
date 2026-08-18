"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./Combobox.module.css";

export type ComboboxOption = {
  value: string;
  label: string;
};

export type ComboboxProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  error?: string;
  /** Shown in the list when filtering yields no matches. */
  emptyMessage?: string;
  className?: string;
};

export function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  emptyMessage = "No matches",
  className,
}: ComboboxProps) {
  const id = useId();
  const listId = `${id}-list`;
  const errorId = error ? `${id}-error` : undefined;

  const selectedOption = options.find((o) => o.value === value);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selectedOption?.label ?? "");
  const [focusedIdx, setFocusedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the displayed text in sync when the selected value changes from outside.
  useEffect(() => {
    if (!open) setQuery(selectedOption?.label ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const filtered = useMemo(() => {
    if (!open) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, open]);

  function closeAndRevert() {
    setOpen(false);
    setQuery(selectedOption?.label ?? "");
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) closeAndRevert();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedOption]);

  function select(opt: ComboboxOption) {
    onChange(opt.value);
    setQuery(opt.label);
    setOpen(false);
    // The input never actually loses focus during a select — pointerdown on an option
    // preventDefaults the browser's focus shift, and keyboard Enter fires from the input
    // itself — so no need to refocus. Doing so would re-trigger onFocus's setOpen(true).
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setOpen(true);
        setFocusedIdx(0);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closeAndRevert();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[focusedIdx]) select(filtered[focusedIdx]);
        break;
    }
  }

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div ref={containerRef} className={styles.container}>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-describedby={errorId}
          autoComplete="off"
          className={[styles.input, error ? styles.inputError : ""].filter(Boolean).join(" ")}
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            setOpen(true);
            setFocusedIdx(Math.max(0, options.findIndex((o) => o.value === value)));
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setFocusedIdx(0);
          }}
          onKeyDown={onKeyDown}
        />

        {open && (
          <ul id={listId} role="listbox" aria-label={label} className={styles.panel}>
            {filtered.length === 0 ? (
              <li className={styles.empty}>{emptyMessage}</li>
            ) : (
              filtered.map((opt, idx) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={[
                    styles.option,
                    opt.value === value ? styles.optionSelected : "",
                    idx === focusedIdx ? styles.optionFocused : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                  onPointerEnter={() => setFocusedIdx(idx)}
                >
                  {opt.label}
                </li>
              ))
            )}
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
