import { CSSProperties, HTMLAttributes } from "react";
import type { SpaceValue } from "../Stack/Stack";
import styles from "./Spacer.module.css";

export type SpacerProps = {
  /** Size from the spacing scale, or "auto" to grow and push siblings apart inside a flex container. Defaults to 16. */
  size?: SpaceValue | "auto";
  /** Which dimension the size applies to. Defaults to "vertical". */
  axis?: "horizontal" | "vertical";
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/** An explicit, reusable block of space — for the odd extra gap a Stack's uniform gap can't express. */
export function Spacer({ size = 16, axis = "vertical", className, style, ...rest }: SpacerProps) {
  const isAuto = size === "auto";
  const length = isAuto ? undefined : `var(--space-${size})`;

  const vars: CSSProperties = {
    flex: isAuto ? "1 0 0px" : "0 0 auto",
    width: axis === "horizontal" ? length : undefined,
    height: axis === "vertical" ? length : undefined,
    ...style,
  };

  return (
    <div
      className={[styles.spacer, className].filter(Boolean).join(" ")}
      style={vars}
      aria-hidden="true"
      {...rest}
    />
  );
}
