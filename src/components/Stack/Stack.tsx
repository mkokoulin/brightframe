import { CSSProperties, ElementType, HTMLAttributes, PropsWithChildren } from "react";
import type { Responsive, Breakpoint } from "../Grid/Grid";
import styles from "./Stack.module.css";

/** A step on the kit's spacing scale (see --space-* in tokens.css). Token suffix = its pixel value. */
export type SpaceValue = 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 20 | 24 | 32 | 40 | 48 | 64;

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

const toSpace = (v: SpaceValue) => `var(--space-${v})`;
const toDirection = (v: "row" | "column") => v;

export type StackProps = {
  /** Tag to render (e.g. "section", "ul"). Defaults to "div". */
  as?: ElementType;
  /** Flex direction, single value or per-breakpoint. Defaults to "column". */
  direction?: Responsive<"row" | "column">;
  /** Gap between children, taken from the spacing scale. Single value or per-breakpoint. Defaults to 0. */
  gap?: Responsive<SpaceValue>;
  /** Allow children to wrap onto new lines. Defaults to false. */
  wrap?: boolean;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
} & HTMLAttributes<HTMLDivElement>;

export function Stack({
  as: Tag = "div",
  direction = "column",
  gap = 0,
  wrap = false,
  align,
  justify,
  className,
  style,
  children,
  ...rest
}: PropsWithChildren<StackProps>) {
  const vars = {
    ...responsiveVars("stack-direction", direction, toDirection),
    ...responsiveVars("stack-gap", gap, toSpace),
    alignItems: align,
    justifyContent: justify,
    ...style,
  } as CSSProperties;

  return (
    <Tag className={[styles.stack, wrap ? styles.wrap : "", className].filter(Boolean).join(" ")} style={vars} {...rest}>
      {children}
    </Tag>
  );
}
