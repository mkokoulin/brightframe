"use client";

import React from "react";
import styles from "./Skeleton.module.css";

export type SkeletonVariant = "text" | "circle" | "rect";

export type SkeletonProps = {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  /** Number of text lines when `variant="text"`. The last line renders shorter. Defaults to 1. */
  lines?: number;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children" | "style">;

export function Skeleton({ variant = "text", width, height, lines = 1, className, ...rest }: SkeletonProps) {
  if (variant === "text" && lines > 1) {
    return (
      <div className={[styles.group, className].filter(Boolean).join(" ")} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={[styles.skeleton, styles.text].join(" ")}
            style={{ width: i === lines - 1 ? "70%" : width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={[styles.skeleton, styles[variant], className].filter(Boolean).join(" ")}
      style={{ width, height }}
      aria-hidden="true"
      {...rest}
    />
  );
}
