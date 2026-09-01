"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a ref'd element's own inline size is at or below `maxWidth`,
 * via ResizeObserver — mirrors the component's `@container` breakpoints so
 * JS-rendered fallbacks (e.g. swapping in a compact button) agree with the
 * CSS instead of reacting to the viewport, which is wrong once the component
 * sits in a narrower container than the viewport (a sidebar, a grid column, …).
 */
export function useContainerNarrow<T extends HTMLElement>(maxWidth: number) {
  const ref = useRef<T>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const update = (width: number) => setNarrow(width <= maxWidth);
    update(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [maxWidth]);

  return { ref, narrow };
}
