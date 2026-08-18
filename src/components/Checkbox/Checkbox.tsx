"use client";

import React, { useEffect, useId, useRef } from "react";
import styles from "./Checkbox.module.css";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  /** Visually shows a dash instead of a check, for a "some selected" parent state. Doesn't change `checked`. */
  indeterminate?: boolean;
  error?: string;
  className?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "onChange" | "className" | "id"
>;

export function Checkbox({
  checked,
  onChange,
  label,
  indeterminate = false,
  error,
  className,
  disabled,
  ...rest
}: CheckboxProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <label className={[styles.row, disabled ? styles.disabled : ""].filter(Boolean).join(" ")} htmlFor={id}>
        <span className={styles.control}>
          <input
            ref={inputRef}
            id={id}
            type="checkbox"
            className={styles.input}
            checked={checked}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={errorId}
            onChange={(e) => onChange(e.target.checked)}
            {...rest}
          />
          <span className={styles.box} aria-hidden="true">
            <svg className={styles.check} width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.2 3.2L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={styles.dash} width="10" height="2" viewBox="0 0 10 2" fill="none">
              <path d="M1 1h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        {label && <span className={styles.text}>{label}</span>}
      </label>
      {error && (
        <div id={errorId} className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
