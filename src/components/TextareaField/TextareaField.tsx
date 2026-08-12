import React, { useId } from "react";
import styles from "./TextareaField.module.css";

export type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  className?: string;
};

export function TextareaField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 3,
  error,
  className,
}: TextareaFieldProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.row} ${error ? styles.rowError : ""}`}>
        <div className={styles.inner}>
          <textarea
            id={id}
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={!!error}
            aria-describedby={errorId}
          />
        </div>
      </div>
      {error && (
        <div id={errorId} className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
