import React from "react";
import styles from "./SubmitButton.module.css";

export type SubmitButtonProps = {
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function SubmitButton({ children, className, disabled, ...rest }: SubmitButtonProps) {
  const cls = [styles.btn, className].filter(Boolean).join(" ");
  return (
    <button className={cls} type="submit" disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
