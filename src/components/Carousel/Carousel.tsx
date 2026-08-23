"use client";

import { Children, HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.css";

export type CarouselProps = {
  /** One or more slides. */
  children: ReactNode;
  /** Show the prev/next arrow buttons. Defaults to true. */
  arrows?: boolean;
  /** Show dot pagination. Defaults to false. */
  dots?: boolean;
  /** Show a "current / total" counter pill in the bottom-right corner. Defaults to false. */
  counter?: boolean;
  /** Auto-advance interval in ms. Omit to disable autoplay. Paused on hover/focus and when the user prefers reduced motion. */
  autoplayInterval?: number;
  /** Controlled active slide index. */
  index?: number;
  /** Uncontrolled initial slide index. Defaults to 0. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
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

export function Carousel({
  children,
  arrows = true,
  dots = false,
  counter = false,
  autoplayInterval,
  index,
  defaultIndex = 0,
  onIndexChange,
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
  className,
  ...rest
}: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;

  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
  const active = index ?? uncontrolledIndex;
  const [paused, setPaused] = useState(false);

  const goTo = (next: number) => {
    const wrapped = ((next % count) + count) % count;
    if (index === undefined) setUncontrolledIndex(wrapped);
    onIndexChange?.(wrapped);
  };

  const savedGoTo = useRef(goTo);
  savedGoTo.current = goTo;

  useEffect(() => {
    if (!autoplayInterval || count <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => savedGoTo.current(active + 1), autoplayInterval);
    return () => window.clearInterval(id);
  }, [autoplayInterval, count, paused, active]);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      {...rest}
    >
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, i) => (
            <div className={styles.slide} key={i} role="group" aria-roledescription="slide" aria-hidden={i !== active}>
              {slide}
            </div>
          ))}
        </div>

        {arrows && count > 1 ? (
          <>
            <button type="button" className={[styles.navBtn, styles.navBtnLeft].join(" ")} aria-label={prevLabel} onClick={() => goTo(active - 1)}>
              <ChevronLeft />
            </button>
            <button type="button" className={[styles.navBtn, styles.navBtnRight].join(" ")} aria-label={nextLabel} onClick={() => goTo(active + 1)}>
              <ChevronRight />
            </button>
          </>
        ) : null}

        {counter && count > 1 ? (
          <div className={styles.counter}>
            {active + 1} / {count}
          </div>
        ) : null}
      </div>

      {dots && count > 1 ? (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={[styles.dot, i === active ? styles.dotActive : ""].filter(Boolean).join(" ")}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
