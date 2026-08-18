"use client";

import React, { useId } from "react";
import styles from "./RadioGroup.module.css";

export type RadioOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type RadioGroupDirection = "vertical" | "horizontal";

export type RadioGroupProps = {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** Visible group label, wired up via `aria-labelledby`. */
  label?: string;
  error?: string;
  direction?: RadioGroupDirection;
  className?: string;
};

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  error,
  direction = "vertical",
  className,
}: RadioGroupProps) {
  const groupId = useId();
  const labelId = label ? `${groupId}-label` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      {label && (
        <span id={labelId} className={styles.groupLabel}>
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={[styles.group, direction === "horizontal" ? styles.horizontal : ""].filter(Boolean).join(" ")}
      >
        {options.map((opt) => {
          const optionId = `${groupId}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optionId}
              className={[styles.row, opt.disabled ? styles.disabled : ""].filter(Boolean).join(" ")}
            >
              <span className={styles.control}>
                <input
                  id={optionId}
                  type="radio"
                  name={groupId}
                  className={styles.input}
                  value={opt.value}
                  checked={opt.value === value}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                />
                <span className={styles.dot} aria-hidden="true" />
              </span>
              <span className={styles.text}>{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <div id={errorId} className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
