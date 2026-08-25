import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCombobox, type UseComboboxOption } from "./useCombobox";

const OPTIONS: UseComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
  { value: "ist", label: "Istanbul" },
];

function keyDown(key: string) {
  return { key, preventDefault: () => {} } as unknown as React.KeyboardEvent;
}

describe("useCombobox", () => {
  it("starts closed with the selected option's label as the query", () => {
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "tbi", onChange: vi.fn() }));
    expect(result.current.open).toBe(false);
    expect(result.current.query).toBe("Tbilisi");
    expect(result.current.selectedOption?.value).toBe("tbi");
  });

  it("opens and resets focusedIndex to the selected option on getInputProps().onFocus", () => {
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "tbi", onChange: vi.fn() }));
    act(() => result.current.getInputProps().onFocus());
    expect(result.current.open).toBe(true);
    expect(result.current.focusedIndex).toBe(1);
  });

  it("filters options as the query changes, only while open", () => {
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "", onChange: vi.fn() }));
    act(() => result.current.getInputProps().onFocus());
    act(() => result.current.getInputProps().onChange({ target: { value: "ist" } }));
    expect(result.current.filteredOptions.map((o) => o.value)).toEqual(["ist"]);
  });

  it("reverts the query on close() without calling onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "tbi", onChange }));
    act(() => result.current.getInputProps().onFocus());
    act(() => result.current.getInputProps().onChange({ target: { value: "zzz" } }));
    expect(result.current.query).toBe("zzz");
    act(() => result.current.close());
    expect(result.current.query).toBe("Tbilisi");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("selects the focused option on Enter via getInputProps().onKeyDown", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "", onChange }));
    act(() => result.current.getInputProps().onFocus());
    act(() => result.current.getInputProps().onKeyDown(keyDown("ArrowDown")));
    act(() => result.current.getInputProps().onKeyDown(keyDown("Enter")));
    expect(onChange).toHaveBeenCalledWith("tbi");
    expect(result.current.open).toBe(false);
  });

  it("select() calls onChange, sets the query, and closes", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "", onChange }));
    act(() => result.current.select(OPTIONS[0]));
    expect(onChange).toHaveBeenCalledWith("yer");
    expect(result.current.query).toBe("Yerevan");
    expect(result.current.open).toBe(false);
  });

  it("supports controlled open via onOpenChange, without managing its own state", () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ open }) => useCombobox({ options: OPTIONS, value: "", onChange: vi.fn(), open, onOpenChange }),
      { initialProps: { open: false } },
    );
    act(() => result.current.toggle());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Controlled: internal state doesn't flip on its own until the consumer re-renders with open=true.
    expect(result.current.open).toBe(false);
    rerender({ open: true });
    expect(result.current.open).toBe(true);
  });

  it("getOptionProps().onPointerDown selects that option", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCombobox({ options: OPTIONS, value: "", onChange }));
    act(() => result.current.getInputProps().onFocus());
    const optionProps = result.current.getOptionProps(OPTIONS[2], 2);
    act(() => optionProps.onPointerDown({ preventDefault: () => {} }));
    expect(onChange).toHaveBeenCalledWith("ist");
  });
});
