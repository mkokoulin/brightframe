"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Tooltip } from "../Tooltip";
import styles from "./LikeButton.module.css";

export type LikeButtonProps = {
  /** Whether the current viewer has liked this item. */
  liked: boolean;
  /** Total like count to display next to the icon. */
  count: number;
  /** Called on click — the component holds no state of its own; the caller
   * owns the optimistic update / request and passes the resulting `liked`/`count` back down. */
  onToggle: () => void;
  /** Accessible name while unliked. Defaults to "Like". */
  likeLabel?: string;
  /** Accessible name while liked. Defaults to "Unlike". */
  unlikeLabel?: string;
  /** Optional tooltip content shown on hover/focus, e.g. explaining what liking does. */
  tooltip?: ReactNode;
  className?: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "onClick" | "children" | "type" | "aria-label" | "aria-pressed"
>;

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
    <path
      d="M12 20.5c-.3 0-.6-.1-.8-.3C7.8 17.6 4 14.1 4 9.9 4 7.2 6.1 5 8.7 5c1.3 0 2.6.6 3.3 1.6C12.7 5.6 14 5 15.3 5 17.9 5 20 7.2 20 9.9c0 4.2-3.8 7.7-7.2 10.3-.2.2-.5.3-.8.3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * A heart-shaped like/favorite toggle with a count, for use on cards or list
 * items. Fully controlled — no internal state, no data fetching. Wrap the
 * item it belongs to yourself; this component only renders the button.
 *
 * `onClick`'s propagation is stopped internally, since this is most often
 * nested inside a larger clickable card.
 */
export function LikeButton({
  liked,
  count,
  onToggle,
  likeLabel = "Like",
  unlikeLabel = "Unlike",
  tooltip,
  className,
  disabled,
  ...rest
}: LikeButtonProps) {
  const button = (
    <button
      type="button"
      className={[styles.likeButton, liked ? styles.likeButtonActive : "", className].filter(Boolean).join(" ")}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? unlikeLabel : likeLabel}
      {...rest}
    >
      <HeartIcon filled={liked} />
      <span className={styles.count}>{count}</span>
    </button>
  );

  return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
}
