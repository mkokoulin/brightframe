import { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Badge.module.css";

export type BadgeCorner = "top-right" | "top-left" | "bottom-right" | "bottom-left";

const CORNER_CLASS: Record<BadgeCorner, string> = {
  "top-right": styles.topRight,
  "top-left": styles.topLeft,
  "bottom-right": styles.bottomRight,
  "bottom-left": styles.bottomLeft,
};

export type BadgeProps = {
  /** Tag to render. Defaults to "div". */
  as?: ElementType;
  /** Which corner to pin to. Requires the parent to be `position: relative`. Defaults to "top-right". */
  corner?: BadgeCorner;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Pins its children (typically a `<Tag>`) to a corner of a `position: relative`
 * parent — e.g. a discount ribbon on a pricing card.
 */
export function Badge({
  as: Tag = "div",
  corner = "top-right",
  className,
  children,
  ...rest
}: PropsWithChildren<BadgeProps>) {
  return (
    <Tag className={[styles.badge, CORNER_CLASS[corner], className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
