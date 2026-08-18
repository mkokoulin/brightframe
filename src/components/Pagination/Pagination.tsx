"use client";

import React from "react";
import styles from "./Pagination.module.css";

export type PaginationLabels = {
  previous: string;
  next: string;
  /** aria-label for a page button, e.g. "Go to page 3". */
  page: (n: number) => string;
};

export const DEFAULT_PAGINATION_LABELS: PaginationLabels = {
  previous: "Previous",
  next: "Next",
  page: (n) => `Go to page ${n}`,
};

export type PaginationProps = {
  /** 1-indexed current page. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** How many page numbers to show on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  labels?: Partial<PaginationLabels>;
  className?: string;
};

function buildPageList(current: number, total: number, siblingCount: number): (number | "...")[] {
  const totalSlots = siblingCount * 2 + 5;
  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  const pages: (number | "...")[] = [1];
  if (showLeftDots) pages.push("...");
  for (let p = Math.max(leftSibling, 2); p <= Math.min(rightSibling, total - 1); p++) pages.push(p);
  if (showRightDots) pages.push("...");
  if (total > 1) pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onChange, siblingCount = 1, labels, className }: PaginationProps) {
  const L = { ...DEFAULT_PAGINATION_LABELS, ...labels };
  const pages = buildPageList(page, totalPages, siblingCount);

  function go(next: number) {
    if (next >= 1 && next <= totalPages && next !== page) onChange(next);
  }

  return (
    <nav aria-label="Pagination" className={[styles.nav, className].filter(Boolean).join(" ")}>
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            aria-label={L.previous}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
              <path d="M7 1L1 6.5L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>

        {pages.map((p, idx) =>
          p === "..." ? (
            <li key={`dots-${idx}`} className={styles.dots} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={[styles.pageBtn, p === page ? styles.active : ""].filter(Boolean).join(" ")}
                onClick={() => go(p)}
                aria-label={L.page(p)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(page + 1)}
            disabled={page >= totalPages}
            aria-label={L.next}
          >
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
              <path d="M1 1L7 6.5L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
