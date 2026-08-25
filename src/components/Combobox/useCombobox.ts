"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";

export type UseComboboxOption = {
  value: string;
  label: string;
};

export type UseComboboxOptions<T extends UseComboboxOption = UseComboboxOption> = {
  options: T[];
  value: string;
  onChange: (value: string) => void;
  /** Controlled open state — mirrors DropdownMenu's API. Uncontrolled (internal state) if omitted. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Defaults to a case-insensitive substring match on `option.label`. */
  filter?: (option: T, query: string) => boolean;
};

export type UseComboboxReturn<T extends UseComboboxOption = UseComboboxOption> = {
  open: boolean;
  query: string;
  focusedIndex: number;
  filteredOptions: T[];
  selectedOption: T | undefined;
  select: (option: T) => void;
  /** Closes the list and reverts the typed query back to the selected option's label. */
  close: () => void;
  toggle: () => void;
  containerRef: RefObject<HTMLDivElement>;
  ids: { input: string; list: string };
  getInputProps: () => {
    id: string;
    role: "combobox";
    "aria-expanded": boolean;
    "aria-haspopup": "listbox";
    "aria-controls": string;
    autoComplete: "off";
    value: string;
    onFocus: () => void;
    onChange: (e: { target: { value: string } }) => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  getListProps: () => { id: string; role: "listbox" };
  getOptionProps: (
    option: T,
    index: number,
  ) => {
    role: "option";
    "aria-selected": boolean;
    onPointerDown: (e: { preventDefault: () => void }) => void;
    onPointerEnter: () => void;
  };
};

const defaultFilter = <T extends UseComboboxOption>(option: T, query: string) =>
  option.label.toLowerCase().includes(query);

/**
 * Headless logic for a filterable, single-select combobox: open/closed state, live
 * filtering, keyboard navigation (Escape/ArrowUp/ArrowDown/Enter), revert-on-Escape,
 * and close-on-outside-click. Renders nothing — pair its prop getters with your own
 * markup, or use the styled `Combobox` component, which is built on this hook.
 */
export function useCombobox<T extends UseComboboxOption = UseComboboxOption>({
  options,
  value,
  onChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  filter = defaultFilter,
}: UseComboboxOptions<T>): UseComboboxReturn<T> {
  const inputId = useId();
  const listId = `${inputId}-list`;

  const selectedOption = options.find((o) => o.value === value);

  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const [query, setQuery] = useState(selectedOption?.label ?? "");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the displayed text in sync when the selected value changes from outside.
  useEffect(() => {
    if (!open) setQuery(selectedOption?.label ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!open) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => filter(o, q));
  }, [options, query, open, filter]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery(selectedOption?.label ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const select = useCallback(
    (option: T) => {
      onChange(option.value);
      setQuery(option.label);
      setOpen(false);
      // The input never actually loses focus during a select — pointerdown on an option
      // preventDefaults the browser's focus shift, and keyboard Enter fires from the input
      // itself — so no need to refocus. Doing so would re-trigger onFocus's setOpen(true).
    },
    [onChange, setOpen],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setOpen(true);
          setFocusedIndex(0);
        }
        return;
      }
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[focusedIndex]) select(filteredOptions[focusedIndex]);
          break;
      }
    },
    [open, close, filteredOptions, focusedIndex, select, setOpen],
  );

  const getInputProps = useCallback(
    () => ({
      id: inputId,
      role: "combobox" as const,
      "aria-expanded": open,
      "aria-haspopup": "listbox" as const,
      "aria-controls": listId,
      autoComplete: "off" as const,
      value: query,
      onFocus: () => {
        setOpen(true);
        setFocusedIndex(Math.max(0, options.findIndex((o) => o.value === value)));
      },
      onChange: (e: { target: { value: string } }) => {
        setQuery(e.target.value);
        setOpen(true);
        setFocusedIndex(0);
      },
      onKeyDown,
    }),
    [inputId, open, listId, query, options, value, onKeyDown, setOpen],
  );

  const getListProps = useCallback(() => ({ id: listId, role: "listbox" as const }), [listId]);

  const getOptionProps = useCallback(
    (option: T, index: number) => ({
      role: "option" as const,
      "aria-selected": option.value === value,
      onPointerDown: (e: { preventDefault: () => void }) => {
        e.preventDefault();
        select(option);
      },
      onPointerEnter: () => setFocusedIndex(index),
    }),
    [value, select],
  );

  return {
    open,
    query,
    focusedIndex,
    filteredOptions,
    selectedOption,
    select,
    close,
    toggle,
    containerRef,
    ids: { input: inputId, list: listId },
    getInputProps,
    getListProps,
    getOptionProps,
  };
}
