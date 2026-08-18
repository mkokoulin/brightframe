"use client";

import React, { useId } from "react";
import styles from "./Switch.module.css";

export type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "onChange" | "className" | "id" | "role"
>;

export function Switch({ checked, onChange, label, className, disabled, ...rest }: SwitchProps) {
  const id = useId();

  return (
    <label className={[styles.row, disabled ? styles.disabled : "", className].filter(Boolean).join(" ")} htmlFor={id}>
      <span className={styles.track}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          {...rest}
        />
        <span className={styles.fill} aria-hidden="true" />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      {label && <span className={styles.text}>{label}</span>}
    </label>
  );
}
