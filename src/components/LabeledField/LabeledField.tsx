import React, { useId } from "react";
import { IMaskInput } from "react-imask";
import styles from "./LabeledField.module.css";

export type LabeledFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  error?: string;
  prefix?: string;
  maxLength?: number;
  mask?: string;
  className?: string;
};

export function LabeledField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  autoComplete,
  error,
  prefix,
  maxLength,
  mask,
  className,
}: LabeledFieldProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  const inputValue = prefix && value.startsWith(prefix) ? value.slice(prefix.length) : value;
  const handleChange = (raw: string) => {
    let cleaned = raw;
    if (prefix) {
      while (cleaned.startsWith(prefix)) cleaned = cleaned.slice(prefix.length);
    }
    onChange(prefix ? prefix + cleaned : cleaned);
  };

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.row} ${error ? styles.rowError : ""}`}>
        <div className={styles.inner}>
          {prefix && (
            <>
              <span className={styles.prefix} aria-hidden="true">
                {prefix}
              </span>
              <span className={styles.prefixDivider} aria-hidden="true" />
            </>
          )}
          {mask ? (
            <IMaskInput
              id={id}
              className={styles.input}
              mask={mask}
              value={inputValue}
              onAccept={(v: string) => handleChange(v)}
              onBlur={onBlur}
              placeholder={placeholder}
              type={type}
              autoComplete={autoComplete}
              inputMode="numeric"
              aria-invalid={!!error}
              aria-describedby={errorId}
            />
          ) : (
            <input
              id={id}
              className={styles.input}
              value={inputValue}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              type={type}
              autoComplete={autoComplete}
              maxLength={maxLength}
              aria-invalid={!!error}
              aria-describedby={errorId}
            />
          )}
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
