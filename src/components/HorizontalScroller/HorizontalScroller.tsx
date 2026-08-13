"use client";

import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import styles from "./HorizontalScroller.module.css";

export type HorizontalScrollerProps = {
  children: ReactNode;
  /** Show the prev/next arrow controls. Defaults to true. */
  arrows?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * A horizontally scrollable row (native scroll + scroll-snap) with edge
 * arrow buttons that page the row and a fade mask over hidden content.
 */
export function HorizontalScroller({
  children,
  arrows = true,
  prevLabel = "Scroll left",
  nextLabel = "Scroll right",
  className,
  ...rest
}: HorizontalScrollerProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateEdges = () => {
    const row = rowRef.current;
    if (!row) return;
    setCanScrollPrev(row.scrollLeft > 1);
    setCanScrollNext(row.scrollLeft + row.clientWidth < row.scrollWidth - 1);
  };

  useEffect(() => {
    updateEdges();
    const row = rowRef.current;
    if (!row) return;

    const observer = new ResizeObserver(updateEdges);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  const scrollByPage = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.row} ref={rowRef} onScroll={updateEdges}>
        {children}
      </div>

      {arrows && canScrollPrev ? <div className={[styles.fade, styles.fadeLeft].join(" ")} aria-hidden="true" /> : null}
      {arrows && canScrollNext ? <div className={[styles.fade, styles.fadeRight].join(" ")} aria-hidden="true" /> : null}

      {arrows && canScrollPrev ? (
        <button type="button" className={[styles.navBtn, styles.navBtnLeft].join(" ")} aria-label={prevLabel} onClick={() => scrollByPage(-1)}>
          <ChevronLeft />
        </button>
      ) : null}
      {arrows && canScrollNext ? (
        <button type="button" className={[styles.navBtn, styles.navBtnRight].join(" ")} aria-label={nextLabel} onClick={() => scrollByPage(1)}>
          <ChevronRight />
        </button>
      ) : null}
    </div>
  );
}
