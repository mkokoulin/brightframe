import styles from "./Loader.module.css";

export type LoaderProps = {
  color?: string;
  /** Dims the background behind the loader (for an overlay on top of content) */
  overlay?: boolean;
  className?: string;
};

export function Loader({ color = "var(--c-accent)", overlay = true, className }: LoaderProps) {
  return (
    <div className={[styles.root, overlay ? styles.rootBg : "", className].filter(Boolean).join(" ")}>
      <svg
        width={60}
        height={60}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
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
