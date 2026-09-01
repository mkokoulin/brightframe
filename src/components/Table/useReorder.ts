"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

export type UseReorderOptions = {
  count: number;
  axis?: "vertical" | "horizontal";
  /** Called with the current positions to swap — the caller owns reordering its own data/columns array. */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** Noun used in default announcements, e.g. "row" or "column". */
  itemLabel?: string;
  /** Human-readable label for an item at a given index, e.g. a guest's name — used for live-region announcements. */
  getLabel?: (index: number) => string;
};

export type UseReorderReturn = {
  /** Index of the item currently being dragged/keyboard-grabbed, or null. */
  activeIndex: number | null;
  /** Current candidate drop position, or null. */
  overIndex: number | null;
  /** Text for a visually-hidden `aria-live="polite"` region — announces grab/move/drop/cancel. */
  announcement: string;
  registerItemRef: (index: number) => (el: HTMLElement | null) => void;
  getHandleProps: (index: number) => {
    onPointerDown: (e: ReactPointerEvent) => void;
    onKeyDown: (e: ReactKeyboardEvent) => void;
    "aria-pressed": boolean;
    "aria-label": string;
  };
};

/**
 * Headless pointer + keyboard reorder logic for a list of rows or columns. Pointer dragging finds
 * the closest item to the pointer by comparing bounding-rect midpoints (register each item's DOM
 * node via `registerItemRef(index)`). Keyboard follows the WAI-ARIA APG "reorderable list" pattern:
 * Space/Enter grabs the item at the handle, Arrow keys move it one position at a time (reordering
 * live, matching this hook's "report intent immediately" contract), Space/Enter drops, Escape
 * cancels. Renders nothing — pair `getHandleProps`/`registerItemRef` with your own markup.
 */
export function useReorder({
  count,
  axis = "vertical",
  onReorder,
  itemLabel = "item",
  getLabel,
}: UseReorderOptions): UseReorderReturn {
  const [pointerFrom, setPointerFrom] = useState<number | null>(null);
  const [pointerOver, setPointerOver] = useState<number | null>(null);
  const [kbdGrabbed, setKbdGrabbed] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const pointerOverRef = useRef<number | null>(null);
  const grabbedLabelRef = useRef("");

  const registerItemRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  const label = useCallback((i: number) => getLabel?.(i) ?? `${itemLabel} ${i + 1}`, [getLabel, itemLabel]);

  useEffect(() => {
    if (pointerFrom === null) return;

    function onMove(e: PointerEvent) {
      const pos = axis === "vertical" ? e.clientY : e.clientX;
      let closest = pointerFrom as number;
      let closestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const mid = axis === "vertical" ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
        const dist = Math.abs(pos - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      pointerOverRef.current = closest;
      setPointerOver(closest);
    }

    function onUp() {
      const from = pointerFrom as number;
      const to = pointerOverRef.current;
      if (to !== null && to !== from) {
        onReorder(from, to);
        setAnnouncement(`Moved ${label(from)} to position ${to + 1} of ${count}.`);
      }
      setPointerFrom(null);
      setPointerOver(null);
      pointerOverRef.current = null;
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointerFrom, axis]);

  const getHandleProps = useCallback(
    (index: number) => ({
      onPointerDown: (e: ReactPointerEvent) => {
        e.preventDefault();
        setPointerFrom(index);
        setPointerOver(index);
        pointerOverRef.current = index;
      },
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (kbdGrabbed === null) {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            grabbedLabelRef.current = label(index);
            setKbdGrabbed(index);
            setAnnouncement(`Grabbed ${grabbedLabelRef.current}. Use arrow keys to move, space to drop, escape to cancel.`);
          }
          return;
        }

        const forwardKey = axis === "vertical" ? "ArrowDown" : "ArrowRight";
        const backwardKey = axis === "vertical" ? "ArrowUp" : "ArrowLeft";

        if (e.key === forwardKey && kbdGrabbed < count - 1) {
          e.preventDefault();
          const to = kbdGrabbed + 1;
          onReorder(kbdGrabbed, to);
          setKbdGrabbed(to);
          setAnnouncement(`Moved ${grabbedLabelRef.current} to position ${to + 1} of ${count}.`);
        } else if (e.key === backwardKey && kbdGrabbed > 0) {
          e.preventDefault();
          const to = kbdGrabbed - 1;
          onReorder(kbdGrabbed, to);
          setKbdGrabbed(to);
          setAnnouncement(`Moved ${grabbedLabelRef.current} to position ${to + 1} of ${count}.`);
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setAnnouncement(`Dropped ${grabbedLabelRef.current} at position ${kbdGrabbed + 1} of ${count}.`);
          setKbdGrabbed(null);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setAnnouncement("Cancelled reordering.");
          setKbdGrabbed(null);
        }
      },
      "aria-pressed": kbdGrabbed === index,
      "aria-label": `Reorder ${label(index)}`,
    }),
    [kbdGrabbed, axis, count, onReorder, label],
  );

  return {
    activeIndex: pointerFrom ?? kbdGrabbed,
    overIndex: pointerOver ?? kbdGrabbed,
    announcement,
    registerItemRef,
    getHandleProps,
  };
}
