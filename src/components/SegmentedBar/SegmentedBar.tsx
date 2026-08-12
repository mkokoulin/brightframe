import React from "react";
import styles from "./SegmentedBar.module.css";

export type SegmentedBarProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function SegmentedBar({ children, className, ...rest }: SegmentedBarProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

export type SegmentedItemProps = {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  grow?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style">;

export function SegmentedItem({ icon, children, grow = true, className, ...rest }: SegmentedItemProps) {
  return (
    <div className={[styles.item, className].filter(Boolean).join(" ")} style={{ flex: grow ? 1 : undefined }} {...rest}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </div>
  );
}
