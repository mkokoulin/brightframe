import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useColumnResize } from "./useColumnResize";

function keyDown(key: string) {
  return { key, preventDefault: () => {} } as unknown as React.KeyboardEvent;
}

describe("useColumnResize", () => {
  it("starts with nothing being dragged", () => {
    const { result } = renderHook(() => useColumnResize({ onResize: vi.fn() }));
    expect(result.current.resizingColumnId).toBeNull();
  });

  it("grows the column by `step` on ArrowRight and shrinks it on ArrowLeft", () => {
    const onResize = vi.fn();
    const { result } = renderHook(() => useColumnResize({ onResize }));
    result.current.getResizeHandleProps("name", 160).onKeyDown(keyDown("ArrowRight"));
    expect(onResize).toHaveBeenCalledWith("name", 170);

    result.current.getResizeHandleProps("name", 160).onKeyDown(keyDown("ArrowLeft"));
    expect(onResize).toHaveBeenCalledWith("name", 150);
  });

  it("does not shrink past minWidth", () => {
    const onResize = vi.fn();
    const { result } = renderHook(() => useColumnResize({ onResize, minWidth: 60, step: 10 }));
    result.current.getResizeHandleProps("name", 65).onKeyDown(keyDown("ArrowLeft"));
    expect(onResize).toHaveBeenCalledWith("name", 60);
  });

  it("does not grow past maxWidth", () => {
    const onResize = vi.fn();
    const { result } = renderHook(() => useColumnResize({ onResize, maxWidth: 300, step: 10 }));
    result.current.getResizeHandleProps("name", 295).onKeyDown(keyDown("ArrowRight"));
    expect(onResize).toHaveBeenCalledWith("name", 300);
  });

  it("jumps to minWidth on Home and maxWidth on End", () => {
    const onResize = vi.fn();
    const { result } = renderHook(() => useColumnResize({ onResize, minWidth: 60, maxWidth: 400 }));
    result.current.getResizeHandleProps("name", 200).onKeyDown(keyDown("Home"));
    expect(onResize).toHaveBeenLastCalledWith("name", 60);

    result.current.getResizeHandleProps("name", 200).onKeyDown(keyDown("End"));
    expect(onResize).toHaveBeenLastCalledWith("name", 400);
  });

  it("ignores End when no maxWidth is set", () => {
    const onResize = vi.fn();
    const { result } = renderHook(() => useColumnResize({ onResize }));
    result.current.getResizeHandleProps("name", 200).onKeyDown(keyDown("End"));
    expect(onResize).not.toHaveBeenCalled();
  });

  it("exposes separator role and current value as aria attributes", () => {
    const { result } = renderHook(() => useColumnResize({ onResize: vi.fn(), minWidth: 60, maxWidth: 400 }));
    const props = result.current.getResizeHandleProps("name", 180, "Name");
    expect(props.role).toBe("separator");
    expect(props["aria-orientation"]).toBe("vertical");
    expect(props["aria-valuenow"]).toBe(180);
    expect(props["aria-valuemin"]).toBe(60);
    expect(props["aria-valuemax"]).toBe(400);
    expect(props["aria-label"]).toBe("Resize Name column");
  });

  it("marks the dragged column via resizingColumnId on pointer down", () => {
    const { result } = renderHook(() => useColumnResize({ onResize: vi.fn() }));
    act(() =>
      result.current
        .getResizeHandleProps("guests", 160)
        .onPointerDown({ preventDefault: () => {}, clientX: 100 } as unknown as React.PointerEvent),
    );
    expect(result.current.resizingColumnId).toBe("guests");
  });
});
