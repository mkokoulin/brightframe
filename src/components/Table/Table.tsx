"use client";

import React, { useState } from "react";
import { Checkbox } from "../Checkbox/Checkbox";
import { Pagination } from "../Pagination/Pagination";
import { TableCell } from "./TableCell";
import { TableFooter } from "./TableFooter";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableRow } from "./TableRow";
import { useReorder } from "./useReorder";
import { useColumnResize } from "./useColumnResize";
import styles from "./Table.module.css";

const DEFAULT_COLUMN_WIDTH = 160;
const MIN_COLUMN_WIDTH = 60;

export type TableSort = { columnId: string; direction: "asc" | "desc" };

export type TableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  width?: string;
  filterable?: boolean;
  filterPlaceholder?: string;
  /** Renders this column's cells as click-to-edit. Requires `getEditValue` and `onEditCommit` to do anything. */
  editable?: boolean;
  getEditValue?: (row: T) => string;
  onEditCommit?: (row: T, newValue: string) => void;
};

export type TablePaginationConfig = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  /** Optional caption rendered above the table, e.g. "Upcoming bookings". */
  caption?: React.ReactNode;
  /** Current sort. Omit to leave sortable columns unsorted (the header button still renders, but does nothing until you wire `onSortChange`). */
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** Omit both to render without a selection column. */
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  emptyMessage?: React.ReactNode;
  className?: string;

  /** Per-column filter text, keyed by column id. Uncontrolled (self-managed) if omitted. */
  filters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;

  /** Uncontrolled (hover-driven) if omitted. */
  highlightedColumnId?: string | null;
  onHighlightColumnChange?: (columnId: string | null) => void;

  /** Adds a drag-handle column and lets rows be reordered by pointer drag or keyboard (Space to grab, arrows to move). */
  reorderableRows?: boolean;
  /** `data` is never reordered internally — reorder your own array and pass the new `data` back down. */
  onReorderRows?: (fromIndex: number, toIndex: number) => void;

  /** Same as `reorderableRows`, for column order via a drag handle in each header cell. */
  reorderableColumns?: boolean;
  onReorderColumns?: (fromIndex: number, toIndex: number) => void;

  /** Adds a drag handle at each header cell's trailing edge to resize columns by pointer drag or, when the handle is focused, Left/Right arrow keys. */
  resizableColumns?: boolean;
  /** Column widths in px, keyed by column id. Uncontrolled (self-managed, starting from `column.width` or a 160px default) if omitted. */
  columnWidths?: Record<string, number>;
  onColumnWidthsChange?: (widths: Record<string, number>) => void;

  /** Renders the real `Pagination` component inside a table footer row. */
  pagination?: TablePaginationConfig;
  /** Custom footer row content (e.g. totals), rendered above `pagination` if both are given. */
  footer?: React.ReactNode;
};

function nextDirection(current: TableSort | null | undefined, columnId: string): TableSort | null {
  if (!current || current.columnId !== columnId) return { columnId, direction: "asc" };
  if (current.direction === "asc") return { columnId, direction: "desc" };
  return null;
}

function GripIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
      <circle cx="2" cy="2" r="1.3" fill="currentColor" />
      <circle cx="6" cy="2" r="1.3" fill="currentColor" />
      <circle cx="2" cy="7" r="1.3" fill="currentColor" />
      <circle cx="6" cy="7" r="1.3" fill="currentColor" />
      <circle cx="2" cy="12" r="1.3" fill="currentColor" />
      <circle cx="6" cy="12" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function Table<T>({
  columns,
  data,
  getRowId,
  caption,
  sort,
  onSortChange,
  selectedRowIds,
  onSelectedRowIdsChange,
  emptyMessage = "No data",
  className,
  filters,
  onFiltersChange,
  highlightedColumnId,
  onHighlightColumnChange,
  reorderableRows = false,
  onReorderRows,
  reorderableColumns = false,
  onReorderColumns,
  resizableColumns = false,
  columnWidths,
  onColumnWidthsChange,
  pagination,
  footer,
}: TableProps<T>) {
  const selectable = selectedRowIds !== undefined && onSelectedRowIdsChange !== undefined;
  const rowIds = data.map((row, i) => getRowId(row, i));
  const selectedSet = new Set(selectedRowIds);
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id));
  const someSelected = !allSelected && rowIds.some((id) => selectedSet.has(id));

  const highlightControlled = highlightedColumnId !== undefined;
  const [internalHighlight, setInternalHighlight] = useState<string | null>(null);
  const activeHighlight = highlightControlled ? (highlightedColumnId as string | null) : internalHighlight;
  function setHighlight(id: string | null) {
    if (!highlightControlled) setInternalHighlight(id);
    onHighlightColumnChange?.(id);
  }

  const filtersControlled = filters !== undefined;
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});
  const activeFilters = filtersControlled ? (filters as Record<string, string>) : internalFilters;
  function setFilter(columnId: string, value: string) {
    const next = { ...activeFilters, [columnId]: value };
    if (!filtersControlled) setInternalFilters(next);
    onFiltersChange?.(next);
  }

  const columnWidthsControlled = columnWidths !== undefined;
  const [internalColumnWidths, setInternalColumnWidths] = useState<Record<string, number>>({});
  const activeColumnWidths = columnWidthsControlled ? (columnWidths as Record<string, number>) : internalColumnWidths;
  function setColumnWidth(columnId: string, width: number) {
    const next = { ...activeColumnWidths, [columnId]: width };
    if (!columnWidthsControlled) setInternalColumnWidths(next);
    onColumnWidthsChange?.(next);
  }
  function effectiveWidth(col: TableColumn<T>): number {
    return activeColumnWidths[col.id] ?? (col.width ? parseInt(col.width, 10) || DEFAULT_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH);
  }
  const columnResize = useColumnResize({ minWidth: MIN_COLUMN_WIDTH, onResize: setColumnWidth });

  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string; value: string } | null>(null);

  function startEdit(rowId: string, columnId: string, value: string) {
    setEditingCell({ rowId, columnId, value });
  }
  function commitEdit(row: T, column: TableColumn<T>) {
    setEditingCell((prev) => {
      if (prev) column.onEditCommit?.(row, prev.value);
      return null;
    });
  }
  function cancelEdit() {
    setEditingCell(null);
  }

  function toggleAll(checked: boolean) {
    onSelectedRowIdsChange?.(checked ? rowIds : []);
  }
  function toggleRow(id: string, checked: boolean) {
    if (!selectedRowIds || !onSelectedRowIdsChange) return;
    onSelectedRowIdsChange(checked ? [...selectedRowIds, id] : selectedRowIds.filter((x) => x !== id));
  }

  const rowReorder = useReorder({
    count: data.length,
    axis: "vertical",
    onReorder: (from, to) => onReorderRows?.(from, to),
    itemLabel: "row",
  });

  const columnReorder = useReorder({
    count: columns.length,
    axis: "horizontal",
    onReorder: (from, to) => onReorderColumns?.(from, to),
    itemLabel: "column",
    getLabel: (i) => (typeof columns[i]?.header === "string" ? (columns[i].header as string) : `column ${i + 1}`),
  });

  const colCount = columns.length + (selectable ? 1 : 0) + (reorderableRows ? 1 : 0);

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {reorderableRows && <th scope="col" className={styles.dragHandleCell} aria-hidden="true" />}
            {selectable && (
              <th scope="col" className={styles.checkboxCell}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col, colIndex) => (
              <TableHeaderCell
                key={col.id}
                align={col.align}
                width={resizableColumns ? `${effectiveWidth(col)}px` : col.width}
                sortable={col.sortable}
                sortDirection={sort?.columnId === col.id ? sort.direction : null}
                onSort={() => onSortChange?.(nextDirection(sort, col.id))}
                filterable={col.filterable}
                filterValue={activeFilters[col.id] ?? ""}
                onFilterChange={(v) => setFilter(col.id, v)}
                filterPlaceholder={col.filterPlaceholder}
                highlighted={activeHighlight === col.id}
                onHighlightEnter={() => setHighlight(col.id)}
                onHighlightLeave={() => setHighlight(null)}
                dragHandle={
                  reorderableColumns ? (
                    <button
                      type="button"
                      ref={columnReorder.registerItemRef(colIndex)}
                      className={styles.dragHandle}
                      {...columnReorder.getHandleProps(colIndex)}
                    >
                      <GripIcon />
                    </button>
                  ) : undefined
                }
                resizeHandle={
                  resizableColumns ? (
                    <div
                      className={styles.resizeHandle}
                      {...columnResize.getResizeHandleProps(
                        col.id,
                        effectiveWidth(col),
                        typeof col.header === "string" ? col.header : col.id,
                      )}
                    />
                  ) : undefined
                }
              >
                {col.header}
              </TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={colCount}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const id = rowIds[i];
              const selected = selectedSet.has(id);
              const dragging = rowReorder.activeIndex === i;
              const overHere = rowReorder.overIndex === i && rowReorder.activeIndex !== null && rowReorder.activeIndex !== i;
              const dropIndicator: "before" | "after" | null = overHere
                ? i < (rowReorder.activeIndex as number)
                  ? "before"
                  : "after"
                : null;

              return (
                <TableRow key={id} selected={selected} dragging={dragging} dropIndicator={dropIndicator}>
                  {reorderableRows && (
                    <td className={styles.dragHandleCell}>
                      <button
                        type="button"
                        ref={rowReorder.registerItemRef(i)}
                        className={styles.dragHandle}
                        {...rowReorder.getHandleProps(i)}
                      >
                        <GripIcon />
                      </button>
                    </td>
                  )}
                  {selectable && (
                    <td className={styles.checkboxCell}>
                      <Checkbox checked={selected} onChange={(checked) => toggleRow(id, checked)} aria-label="Select row" />
                    </td>
                  )}
                  {columns.map((col) => {
                    const isEditingThis = editingCell?.rowId === id && editingCell?.columnId === col.id;
                    const currentValue = col.getEditValue?.(row) ?? "";
                    return (
                      <TableCell
                        key={col.id}
                        align={col.align}
                        highlighted={activeHighlight === col.id}
                        editable={col.editable}
                        editing={isEditingThis}
                        editValue={isEditingThis ? editingCell.value : currentValue}
                        onEditStart={() => startEdit(id, col.id, currentValue)}
                        onEditChange={(v) => setEditingCell((prev) => (prev ? { ...prev, value: v } : prev))}
                        onEditCommit={() => commitEdit(row, col)}
                        onEditCancel={cancelEdit}
                        editLabel={`Edit ${typeof col.header === "string" ? col.header : col.id}: ${currentValue}`}
                      >
                        {col.cell(row, i)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </tbody>
        {(footer || pagination) && (
          <TableFooter>
            {footer && (
              <tr>
                <td colSpan={colCount} className={styles.footerContent}>
                  {footer}
                </td>
              </tr>
            )}
            {pagination && (
              <tr>
                <td colSpan={colCount} className={styles.footerPagination}>
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onChange={pagination.onChange}
                    siblingCount={pagination.siblingCount}
                  />
                </td>
              </tr>
            )}
          </TableFooter>
        )}
      </table>

      {(reorderableRows || reorderableColumns) && (
        <div role="status" aria-live="polite" aria-atomic="true" className={styles.visuallyHidden}>
          {rowReorder.announcement || columnReorder.announcement}
        </div>
      )}
    </div>
  );
}
