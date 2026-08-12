import React from "react";
import styles from "./SubmitButton.module.css";

export type SubmitButtonVariant = "accent" | "brand" | "ghost";

export type SubmitButtonProps = {
  children?: React.ReactNode;
  variant?: SubmitButtonVariant;
  /** Stretches to the width of its container. Defaults to true. */
  fullWidth?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function SubmitButton({
  children,
  className,
  disabled,
  variant = "accent",
  fullWidth = true,
  ...rest
}: SubmitButtonProps) {
  const cls = [styles.btn, styles[variant], fullWidth ? styles.fullWidth : "", className].filter(Boolean).join(" ");
  return (
    <button className={cls} type="submit" disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
