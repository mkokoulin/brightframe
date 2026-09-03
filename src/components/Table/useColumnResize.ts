"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

export type UseColumnResizeOptions = {
  /** Narrowest a column can be dragged/keyed down to, in px. Defaults to 60. */
  minWidth?: number;
  /** Widest a column can be dragged/keyed up to, in px. Defaults to unbounded. */
  maxWidth?: number;
  /** px moved per Arrow key press on a focused handle. Defaults to 10. */
  step?: number;
  /** Called with the column's next width as the handle is dragged or keyed — the caller owns storing it. */
  onResize: (columnId: string, width: number) => void;
};

export type UseColumnResizeReturn = {
  /** Id of the column currently being pointer-dragged, or null. */
  resizingColumnId: string | null;
  getResizeHandleProps: (
    columnId: string,
    currentWidth: number,
    label?: string,
  ) => {
    onPointerDown: (e: ReactPointerEvent) => void;
    onKeyDown: (e: ReactKeyboardEvent) => void;
    role: "separator";
    "aria-orientation": "vertical";
    "aria-valuenow": number;
    "aria-valuemin": number;
    "aria-valuemax": number | undefined;
    "aria-label": string;
    tabIndex: number;
  };
};

/**
 * Headless pointer + keyboard resize logic for table columns (or any horizontally adjustable
 * pair of regions). Pointer dragging tracks `clientX` delta from the drag's start width. Keyboard
 * follows the WAI-ARIA APG "window splitter" pattern: a focused handle is a `role="separator"`
 * with `aria-orientation="vertical"`; Left/Right arrows adjust by `step`, Home/End jump to the
 * min/max bound. Renders nothing — pair `getResizeHandleProps` with your own handle markup.
 */
export function useColumnResize({ minWidth = 60, maxWidth, step = 10, onResize }: UseColumnResizeOptions): UseColumnResizeReturn {
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null);
  const dragRef = useRef<{ columnId: string; startX: number; startWidth: number } | null>(null);

  const clamp = useCallback((w: number) => Math.min(maxWidth ?? Infinity, Math.max(minWidth, w)), [minWidth, maxWidth]);

  useEffect(() => {
    if (!resizingColumnId) return;

    function onMove(e: PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;
      onResize(drag.columnId, clamp(drag.startWidth + (e.clientX - drag.startX)));
    }
    function onUp() {
      dragRef.current = null;
      setResizingColumnId(null);
    }

    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizingColumnId]);

  const getResizeHandleProps = useCallback(
    (columnId: string, currentWidth: number, label?: string) => ({
      onPointerDown: (e: ReactPointerEvent) => {
        e.preventDefault();
        dragRef.current = { columnId, startX: e.clientX, startWidth: currentWidth };
        setResizingColumnId(columnId);
      },
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onResize(columnId, clamp(currentWidth - step));
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onResize(columnId, clamp(currentWidth + step));
        } else if (e.key === "Home") {
          e.preventDefault();
          onResize(columnId, minWidth);
        } else if (e.key === "End" && maxWidth !== undefined) {
          e.preventDefault();
          onResize(columnId, maxWidth);
        }
      },
      role: "separator" as const,
      "aria-orientation": "vertical" as const,
      "aria-valuenow": Math.round(currentWidth),
      "aria-valuemin": minWidth,
      "aria-valuemax": maxWidth,
      "aria-label": label ? `Resize ${label} column` : "Resize column",
      tabIndex: 0,
    }),
    [clamp, minWidth, maxWidth, step, onResize],
  );

  return { resizingColumnId, getResizeHandleProps };
}
