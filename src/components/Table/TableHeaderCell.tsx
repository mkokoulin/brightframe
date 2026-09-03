"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./Table.module.css";

export type TableHeaderCellProps = {
  align?: "start" | "center" | "end";
  width?: string;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  filterable?: boolean;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  highlighted?: boolean;
  onHighlightEnter?: () => void;
  onHighlightLeave?: () => void;
  /** A drag-handle element (typically a small icon button) rendered before the header content. */
  dragHandle?: React.ReactNode;
  /** A resize-handle element rendered at the cell's trailing edge, e.g. from `useColumnResize`. */
  resizeHandle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function alignClass(align: TableHeaderCellProps["align"]): string {
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

export function TableHeaderCell({
  align,
  width,
  sortable = false,
  sortDirection = null,
  onSort,
  filterable = false,
  filterValue = "",
  onFilterChange,
  filterPlaceholder = "Filter…",
  highlighted = false,
  onHighlightEnter,
  onHighlightLeave,
  dragHandle,
  resizeHandle,
  children,
  className,
}: TableHeaderCellProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterId = useId();
  const filterTriggerId = useId();
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (filterOpen) filterInputRef.current?.focus();
  }, [filterOpen]);

  useEffect(() => {
    if (!filterOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!filterContainerRef.current?.contains(e.target as Node)) setFilterOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFilterOpen(false);
        filterTriggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filterOpen]);

  const active = sortDirection !== null;
  const cls = [styles.th, highlighted ? styles.columnHighlighted : "", className].filter(Boolean).join(" ");

  return (
    <th
      scope="col"
      className={cls}
      style={width ? { width } : undefined}
      aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : sortable ? "none" : undefined}
      onMouseEnter={onHighlightEnter}
      onMouseLeave={onHighlightLeave}
    >
      <span className={[styles.thInner, alignClass(align)].filter(Boolean).join(" ")}>
        {dragHandle}

        {sortable ? (
          <button type="button" className={styles.sortBtn} onClick={onSort}>
            {children}
            <svg
              className={[styles.sortIcon, active ? styles.sortIconActive : ""].filter(Boolean).join(" ")}
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              {active && sortDirection === "desc" ? (
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        ) : (
          <span className={styles.thLabel}>{children}</span>
        )}

        {filterable && (
          <div ref={filterContainerRef} className={styles.filterWrap}>
            <button
              ref={filterTriggerRef}
              type="button"
              id={filterTriggerId}
              className={[styles.filterBtn, filterValue ? styles.filterBtnActive : ""].filter(Boolean).join(" ")}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
              aria-controls={filterOpen ? filterId : undefined}
              aria-label={`Filter ${typeof children === "string" ? children : "column"}`}
              onClick={() => setFilterOpen((o) => !o)}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1.5h10L7.5 5.8v3.7L4.5 11V5.8L1 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {filterOpen && (
              <div id={filterId} role="dialog" aria-labelledby={filterTriggerId} className={styles.filterPanel}>
                <input
                  ref={filterInputRef}
                  type="text"
                  className={styles.filterInput}
                  value={filterValue}
                  placeholder={filterPlaceholder}
                  onChange={(e) => onFilterChange?.(e.target.value)}
                />
                {filterValue && (
                  <button type="button" className={styles.filterClear} onClick={() => onFilterChange?.("")}>
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </span>

      {resizeHandle}
    </th>
  );
}
