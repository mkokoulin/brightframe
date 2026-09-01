"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Table.module.css";

export type TableCellProps = {
  align?: "start" | "center" | "end";
  highlighted?: boolean;
  /** Renders `children` inside a clickable/keyboard-operable trigger that swaps to an input when `editing`. */
  editable?: boolean;
  editing?: boolean;
  editValue?: string;
  onEditStart?: () => void;
  onEditChange?: (value: string) => void;
  onEditCommit?: (value: string) => void;
  onEditCancel?: () => void;
  /** aria-label for the edit trigger, e.g. "Edit Guest". */
  editLabel?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "className" | "align">;

function alignClass(align: TableCellProps["align"]): string {
  switch (align) {
    case "start":
      return styles["align-start"];
    case "center":
      return styles["align-center"];
    case "end":
      return styles["align-end"];
    default:
      return "";
  }
}

export function TableCell({
  align,
  highlighted = false,
  editable = false,
  editing = false,
  editValue = "",
  onEditStart,
  onEditChange,
  onEditCommit,
  onEditCancel,
  editLabel = "Edit",
  children,
  className,
  ...rest
}: TableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const cls = [styles.td, alignClass(align), highlighted ? styles.columnHighlighted : "", className]
    .filter(Boolean)
    .join(" ");

  if (!editable) {
    return (
      <td className={cls} {...rest}>
        {children}
      </td>
    );
  }

  return (
    <td className={cls} {...rest}>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          className={styles.editInput}
          value={editValue}
          onChange={(e) => onEditChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEditCommit?.(editValue);
            } else if (e.key === "Escape") {
              e.preventDefault();
              onEditCancel?.();
            }
          }}
          onBlur={() => onEditCommit?.(editValue)}
        />
      ) : (
        <button type="button" className={styles.editTrigger} onClick={onEditStart} aria-label={editLabel}>
          {children}
        </button>
      )}
    </td>
  );
}
