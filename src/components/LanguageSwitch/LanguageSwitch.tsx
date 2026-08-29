"use client";

import React from "react";
import styles from "./LanguageSwitch.module.css";

export type LanguageOption = {
  code: string;
  label: string;
};

const DEFAULT_OPTIONS: LanguageOption[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "hy", label: "HY" },
];

export type LanguageSwitchProps = {
  value: string;
  onChange: (code: string) => void;
  /** Defaults to RU / EN / HY. */
  options?: LanguageOption[];
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "onChange">;

export function LanguageSwitch({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
  "aria-label": ariaLabel = "Language",
  ...rest
}: LanguageSwitchProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {options.map((opt) => {
        const active = opt.code === value;
        return (
          <button
            key={opt.code}
            type="button"
            className={[styles.item, active && styles.active].filter(Boolean).join(" ")}
            aria-pressed={active}
            onClick={() => onChange(opt.code)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
