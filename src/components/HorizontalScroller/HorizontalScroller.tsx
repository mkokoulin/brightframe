"use client";

import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import styles from "./HorizontalScroller.module.css";

export type HorizontalScrollerProps = {
  children: ReactNode;
  /** Show the prev/next arrow controls. Defaults to true. */
  arrows?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  /**
   * Accessible name for the scrollable region itself (distinct from `prevLabel`/
   * `nextLabel`, which name the arrow buttons). Give each instance on a page its
   * own descriptive label (e.g. "Upcoming events") when more than one
   * `HorizontalScroller` renders at once — screen readers require landmark
   * regions on the same page to have unique names. Defaults to "Scrollable
   * content", which is fine for a single instance.
   */
  label?: string;
  className?: string;
  /** Gap between items, in px. Defaults to the kit's --space-16 token. */
  gap?: number;
  /**
   * CSS `padding` shorthand applied to the scrollable track. The track clips
   * its cross-axis overflow (an unavoidable consequence of `overflow-x: auto`
   * clipping `overflow-y` too), so item box-shadows / hover-lift transforms
   * that extend past the item's own box need this padding to not get cut off.
   */
  trackPadding?: string;
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
  label = "Scrollable content",
  className,
  gap,
  trackPadding,
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
      <div
        className={styles.row}
        ref={rowRef}
        onScroll={updateEdges}
        // Makes the scrollable track keyboard-reachable (Tab, then arrow keys scroll it
        // natively) — without this, a scrollable region with no other focusable
        // descendants is unreachable by keyboard (axe: scrollable-region-focusable).
        // `role="region"` gives it an accessible landmark name; jsx-a11y's
        // no-noninteractive-tabindex rule only recognizes widget roles as
        // justifying tabIndex, not landmark roles like "region", so this specific,
        // deliberate case is disabled rather than silencing the rule generally.
        role="region"
        aria-label={label}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        style={gap !== undefined || trackPadding !== undefined ? { gap, padding: trackPadding } : undefined}
      >
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
