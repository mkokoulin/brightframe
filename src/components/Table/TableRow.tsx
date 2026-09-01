"use client";

import React from "react";
import styles from "./Table.module.css";

export type TableRowProps = {
  selected?: boolean;
  highlighted?: boolean;
  dragging?: boolean;
  /** Shows a drop-target indicator line above/below this row during a drag reorder. */
  dropIndicator?: "before" | "after" | null;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLTableRowElement>, "className">;

export function TableRow({
  selected = false,
  highlighted = false,
  dragging = false,
  dropIndicator = null,
  children,
  className,
  ...rest
}: TableRowProps) {
  const cls = [
    styles.tr,
    selected ? styles.selected : "",
    highlighted ? styles.rowHighlighted : "",
    dragging ? styles.dragging : "",
    dropIndicator === "before" ? styles.dropBefore : "",
    dropIndicator === "after" ? styles.dropAfter : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={cls} {...rest}>
      {children}
    </tr>
  );
}
