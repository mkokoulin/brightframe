"use client";

import React from "react";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** Rendered between items. Defaults to a chevron icon. */
  separator?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

const DEFAULT_SEPARATOR = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Breadcrumb({ items, separator = DEFAULT_SEPARATOR, className, ...rest }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={[styles.nav, className].filter(Boolean).join(" ")} {...rest}>
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className={styles.link} href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className={styles.linkButton} onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
