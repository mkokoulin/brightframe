import { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./BorderBeam.module.css";

export type BorderBeamSize = "compact" | "default" | "extended";

export type BorderBeamProps = {
  children: ReactNode;
  className?: string;
  /** Gradient stops the beam sweeps through. Defaults to a brand → accent sweep. */
  colors?: [string, string];
  /** Seconds for one full loop around the border. Defaults to 6. */
  duration?: number;
  /** Length of the visible beam arc. Defaults to "default". */
  size?: BorderBeamSize;
  /** Beam stroke width in px. Defaults to 1.5 (matches `--border-width-15`). */
  lineWidth?: number;
  /** Corner radius the beam ring follows — should match the wrapped content's own radius. Defaults to `var(--radius-lg)`. */
  radius?: string | number;
  /** Only animate the beam while the container is hovered. Defaults to false (always animates). */
  triggerOnHover?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children" | "color">;

const ARC_DEGREES: Record<BorderBeamSize, number> = {
  compact: 60,
  default: 100,
  extended: 160,
};

export function BorderBeam({
  children,
  className,
  colors = ["var(--c-brand)", "var(--c-accent)"],
  duration = 6,
  size = "default",
  lineWidth = 1.5,
  radius = "var(--radius-lg)",
  triggerOnHover = false,
  style,
  ...rest
}: BorderBeamProps) {
  const vars = {
    ...style,
    "--bf-color-1": colors[0],
    "--bf-color-2": colors[1],
    "--bf-duration": `${duration}s`,
    "--bf-line-width": `${lineWidth}px`,
    "--bf-radius": typeof radius === "number" ? `${radius}px` : radius,
    "--bf-arc": `${ARC_DEGREES[size]}deg`,
  } as CSSProperties;

  return (
    <div
      className={[styles.wrapper, triggerOnHover ? styles.hoverOnly : "", className].filter(Boolean).join(" ")}
      style={vars}
      {...rest}
    >
      {children}
      <span className={styles.beam} aria-hidden="true" />
    </div>
  );
}
