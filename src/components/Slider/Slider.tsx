"use client";

import React, { useId } from "react";
import styles from "./Slider.module.css";

export type SliderValue = number | [number, number];

export type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  /** A single number for one thumb, or a `[min, max]` tuple for a two-thumb range slider. */
  value: SliderValue;
  onChange: (value: SliderValue) => void;
  label?: string;
  /** Shows the current value(s) next to the label. Defaults to false. */
  showValue?: boolean;
  formatValue?: (v: number) => string;
  disabled?: boolean;
  className?: string;
};

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  showValue = false,
  formatValue = (v) => String(v),
  disabled = false,
  className,
}: SliderProps) {
  const id = useId();
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  if (!Array.isArray(value)) {
    return (
      <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
        {(label || showValue) && (
          <div className={styles.labelRow}>
            {label && (
              <label htmlFor={id} className={styles.label}>
                {label}
              </label>
            )}
            {showValue && <span className={styles.valueText}>{formatValue(value)}</span>}
          </div>
        )}
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct(value)}%` }} />
          <input
            id={id}
            type="range"
            className={styles.input}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      </div>
    );
  }

  const [lo, hi] = value;

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.valueText}>
              {formatValue(lo)} – {formatValue(hi)}
            </span>
          )}
        </div>
      )}
      <div className={styles.track}>
        <div className={styles.fill} style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <input
          type="range"
          aria-label={label ? `${label} minimum` : "Minimum"}
          className={[styles.input, styles.inputMin].join(" ")}
          min={min}
          max={hi}
          step={step}
          value={lo}
          disabled={disabled}
          onChange={(e) => onChange([Number(e.target.value), hi])}
        />
        <input
          type="range"
          aria-label={label ? `${label} maximum` : "Maximum"}
          className={[styles.input, styles.inputMax].join(" ")}
          min={lo}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          onChange={(e) => onChange([lo, Number(e.target.value)])}
        />
      </div>
    </div>
  );
}
