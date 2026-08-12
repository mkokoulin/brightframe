"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

export type RevealDirection = "up" | "down" | "left" | "right";

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Which direction the content slides in from. Defaults to "up". */
  direction?: RevealDirection;
  /** Fraction of the element that must be visible before it reveals. Defaults to 0.15. */
  threshold?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children" | "style">;

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.15,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={[styles.reveal, styles[direction], visible ? styles.visible : "", className]
        .filter(Boolean)
        .join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
