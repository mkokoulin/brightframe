"use client";

import styles from "./Combobox.module.css";
import { useCombobox } from "./useCombobox";

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
  emptyMessage = "Nothing found",
  className,
}: ComboboxProps) {
  const { open, filteredOptions, focusedIndex, containerRef, ids, getInputProps, getListProps, getOptionProps } =
    useCombobox({ options, value, onChange });

  const errorId = error ? `${ids.input}-error` : undefined;

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <label htmlFor={ids.input} className={styles.label}>
        {label}
      </label>
      <div ref={containerRef} className={styles.container}>
        <input
          type="text"
          aria-describedby={errorId}
          className={[styles.input, error ? styles.inputError : ""].filter(Boolean).join(" ")}
          placeholder={placeholder}
          {...getInputProps()}
        />

        {open && (
          <ul {...getListProps()} aria-label={label} className={styles.panel}>
            {filteredOptions.length === 0 ? (
              <li className={styles.empty}>{emptyMessage}</li>
            ) : (
              filteredOptions.map((opt, idx) => (
                <li
                  key={opt.value}
                  {...getOptionProps(opt, idx)}
                  className={[
                    styles.option,
                    opt.value === value ? styles.optionSelected : "",
                    idx === focusedIndex ? styles.optionFocused : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {opt.label}
                  {opt.value === value && (
                    <svg className={styles.optionTick} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5l3.2 3.2L13 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
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
