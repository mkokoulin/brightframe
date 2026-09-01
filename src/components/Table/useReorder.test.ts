import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useReorder } from "./useReorder";

function keyDown(key: string) {
  return { key, preventDefault: () => {} } as unknown as React.KeyboardEvent;
}

describe("useReorder", () => {
  it("starts with nothing grabbed", () => {
    const { result } = renderHook(() => useReorder({ count: 3, onReorder: vi.fn() }));
    expect(result.current.activeIndex).toBeNull();
    expect(result.current.overIndex).toBeNull();
  });

  it("grabs an item on Space, announces it, and sets aria-pressed", () => {
    const { result } = renderHook(() => useReorder({ count: 3, onReorder: vi.fn() }));
    act(() => result.current.getHandleProps(1).onKeyDown(keyDown(" ")));
    expect(result.current.activeIndex).toBe(1);
    expect(result.current.getHandleProps(1)["aria-pressed"]).toBe(true);
    expect(result.current.announcement).toMatch(/Grabbed/);
  });

  it("moves the grabbed item forward/backward with arrow keys, calling onReorder each step", () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useReorder({ count: 3, onReorder }));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown(" ")));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown("ArrowDown")));
    expect(onReorder).toHaveBeenCalledWith(0, 1);
    expect(result.current.activeIndex).toBe(1);

    act(() => result.current.getHandleProps(1).onKeyDown(keyDown("ArrowUp")));
    expect(onReorder).toHaveBeenCalledWith(1, 0);
    expect(result.current.activeIndex).toBe(0);
  });

  it("does not move past the first or last position", () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useReorder({ count: 2, onReorder }));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown(" ")));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown("ArrowUp")));
    expect(onReorder).not.toHaveBeenCalled();
    expect(result.current.activeIndex).toBe(0);
  });

  it("uses the horizontal axis's ArrowLeft/ArrowRight instead of ArrowUp/ArrowDown", () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useReorder({ count: 3, axis: "horizontal", onReorder }));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown(" ")));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown("ArrowDown")));
    expect(onReorder).not.toHaveBeenCalled();

    act(() => result.current.getHandleProps(0).onKeyDown(keyDown("ArrowRight")));
    expect(onReorder).toHaveBeenCalledWith(0, 1);
  });

  it("drops on a second Space/Enter and clears the grabbed state", () => {
    const { result } = renderHook(() => useReorder({ count: 3, onReorder: vi.fn() }));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown(" ")));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown("Enter")));
    expect(result.current.activeIndex).toBeNull();
    expect(result.current.announcement).toMatch(/Dropped/);
  });

  it("cancels on Escape without further reordering", () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useReorder({ count: 3, onReorder }));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown(" ")));
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown("ArrowDown")));
    act(() => result.current.getHandleProps(1).onKeyDown(keyDown("Escape")));
    expect(result.current.activeIndex).toBeNull();
    expect(result.current.announcement).toMatch(/Cancelled/);
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("uses getLabel for announcements when provided", () => {
    const { result } = renderHook(() =>
      useReorder({ count: 2, onReorder: vi.fn(), getLabel: (i) => ["Ana", "Bo"][i] }),
    );
    act(() => result.current.getHandleProps(0).onKeyDown(keyDown(" ")));
    expect(result.current.announcement).toMatch(/Grabbed Ana/);
  });
});
