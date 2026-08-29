import React from "react";
import { Avatar, type AvatarSize } from "./Avatar";
import styles from "./Avatar.module.css";

export type AvatarGroupProps = {
  /** Caps how many avatars render before the rest collapse into a "+N" avatar. */
  max?: number;
  /** Size applied to the overflow "+N" avatar; individual children keep their own size. */
  size?: AvatarSize;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function AvatarGroup({ max, size = "md", className, children, ...rest }: AvatarGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const visible = max ? items.slice(0, max) : items;
  const overflow = max && items.length > max ? items.length - max : 0;

  return (
    <div className={[styles.group, className].filter(Boolean).join(" ")} {...rest}>
      {visible.map((child, i) => {
        const el = child as React.ReactElement<{ className?: string }>;
        return (
          <span className={styles.groupItem} key={el.key ?? i}>
            {React.cloneElement(el, {
              className: [styles.ring, el.props.className].filter(Boolean).join(" "),
            })}
          </span>
        );
      })}
      {overflow > 0 ? (
        <span className={styles.groupItem}>
          <Avatar name={`+${overflow}`} alt={`${overflow} more`} size={size} className={styles.ring} />
        </span>
      ) : null}
    </div>
  );
}
