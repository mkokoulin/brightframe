import React from "react";
import styles from "./Tag.module.css";

export type TagVariant =
  | "brand"
  | "accent"
  | "neutral"
  | "error"
  | "outline"
  | "blue"
  | "orange"
  | "green"
  | "purple";
export type TagSize = "sm" | "md" | "lg";

export type TagProps = {
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

export function Tag({
  variant = "brand",
  size = "md",
  className,
  children,
  ...rest
}: TagProps) {
  const cls = [styles.tag, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
