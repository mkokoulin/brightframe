import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Fab.module.css";

export type FabVariant = "brand" | "accent" | "danger" | "surface";
export type FabSize = "sm" | "md" | "lg";

export type FabProps = {
  variant?: FabVariant;
  size?: FabSize;
  /** Accessible label — required since the button is icon-only. */
  label: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">;

/**
 * Circular icon-only button. Doesn't self-position — place it with `style`
 * (e.g. `style={{ position: "fixed", bottom: 24, right: 24 }}`) for a floating
 * corner button, or render it inline.
 */
export function Fab({
  variant = "brand",
  size = "md",
  label,
  className,
  children,
  ...rest
}: PropsWithChildren<FabProps>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[styles.fab, styles[variant], styles[size], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
