"use client";

import { ButtonHTMLAttributes, CSSProperties } from "react";
import styles from "./Burger.module.css";

export type BurgerSize = "sm" | "md" | "lg";

export type BurgerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  size?: BurgerSize;
  /** Overrides the line color (defaults to the --c-brand token). */
  color?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "type">;

export function Burger({ open, setOpen, size = "md", color, className, ...rest }: BurgerProps) {
  const lineCls = [styles.line, open ? styles.lineOpen : ""].filter(Boolean).join(" ");
  const style = color ? ({ "--burger-color": color } as CSSProperties) : undefined;

  return (
    <button
      type="button"
      className={[styles.burger, size !== "md" ? styles[size] : "", className].filter(Boolean).join(" ")}
      style={style}
      aria-pressed={open}
      aria-label="Menu"
      onClick={() => setOpen(!open)}
      {...rest}
    >
      <span className={lineCls} />
      <span className={lineCls} />
      <span className={lineCls} />
    </button>
  );
}
