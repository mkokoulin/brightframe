import { HTMLAttributes } from "react";
import styles from "./Loader.module.css";

export type LoaderSize = "sm" | "md" | "lg";

const SIZE_PX: Record<LoaderSize, number> = {
  sm: 32,
  md: 60,
  lg: 96,
};

export type LoaderProps = {
  color?: string;
  /** Dims the background behind the loader (for an overlay on top of content) */
  overlay?: boolean;
  size?: LoaderSize;
  /** Accessible name announced by screen readers. Defaults to "Loading". */
  label?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

export function Loader({
  color = "var(--c-accent)",
  overlay = true,
  size = "md",
  label = "Loading",
  className,
  ...rest
}: LoaderProps) {
  const px = SIZE_PX[size];

  return (
    <div
      role="status"
      aria-label={label}
      className={[styles.root, overlay ? styles.rootBg : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <svg
        width={px}
        height={px}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        aria-hidden="true"
        style={{ background: "none" }}
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke={color}
          strokeWidth="5"
          r="35"
          strokeDasharray="165"
          strokeDashoffset="165"
          className={styles.circle}
        />
      </svg>
    </div>
  );
}
