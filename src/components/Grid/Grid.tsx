import React, { CSSProperties, ElementType, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Grid.module.css";

/** Breakpoints, mobile-first (min-width): sm=640, md=768, lg=1024, xl=1280. */
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

/** A single value, or per-breakpoint overrides (e.g. `{ base: 1, md: 2, lg: 4 }`). */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

const BREAKPOINTS: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

function isResponsiveMap<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === "object" && value !== null;
}

/** Builds `--{prefix}-{breakpoint}` custom properties from a Responsive<T> value. */
function responsiveVars<T>(
  prefix: string,
  value: Responsive<T> | undefined,
  format: (v: T) => string,
): Record<string, string> {
  if (value === undefined) return {};

  const vars: Record<string, string> = {};
  if (isResponsiveMap(value)) {
    for (const bp of BREAKPOINTS) {
      const v = value[bp];
      if (v !== undefined) vars[`--${prefix}-${bp}`] = format(v);
    }
  } else {
    vars[`--${prefix}-base`] = format(value);
  }
  return vars;
}

const toLength = (v: number | string) => (typeof v === "number" ? `${v}px` : v);
const toCount = (v: number) => `${v}`;

export type GridProps = {
  /** Tag to render (e.g. "section", "ul"). Defaults to "div". */
  as?: ElementType;
  /** Column count, single value or per-breakpoint. Defaults to 12. */
  columns?: Responsive<number>;
  /** Gap between cells (number = px), single value or per-breakpoint. Defaults to 16px. */
  gap?: Responsive<number | string>;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyItems"];
} & HTMLAttributes<HTMLDivElement>;

export function Grid({
  as: Tag = "div",
  columns = 12,
  gap,
  align,
  justify,
  className,
  style,
  children,
  ...rest
}: PropsWithChildren<GridProps>) {
  const vars = {
    ...responsiveVars("grid-cols", columns, toCount),
    ...responsiveVars("grid-gap", gap, toLength),
    alignItems: align,
    justifyItems: justify,
    ...style,
  } as CSSProperties;

  return (
    <Tag className={[styles.grid, className].filter(Boolean).join(" ")} style={vars} {...rest}>
      {children}
    </Tag>
  );
}

export type GridItemProps = {
  /** Tag to render. Defaults to "div". */
  as?: ElementType;
  /** Number of columns this item spans, single value or per-breakpoint. Defaults to 1. */
  span?: Responsive<number>;
} & HTMLAttributes<HTMLDivElement>;

export function GridItem({
  as: Tag = "div",
  span,
  className,
  style,
  children,
  ...rest
}: PropsWithChildren<GridItemProps>) {
  const vars = {
    ...responsiveVars("item-span", span, toCount),
    ...style,
  } as CSSProperties;

  return (
    <Tag className={[styles.item, className].filter(Boolean).join(" ")} style={vars} {...rest}>
      {children}
    </Tag>
  );
}
