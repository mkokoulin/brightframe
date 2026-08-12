import React from "react";
import styles from "./GhostButton.module.css";
import { PinIcon } from "../../icons";

export type GhostButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  targetBlank?: boolean;
  icon?: React.ReactNode;
};

export function GhostButton({
  label,
  href,
  onClick,
  className,
  targetBlank,
  icon,
}: GhostButtonProps) {
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <PinIcon />}
      </span>
      <span className={styles.text}>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        className={[styles.root, className].filter(Boolean).join(" ")}
        href={href}
        target={targetBlank ? "_blank" : undefined}
        rel={targetBlank ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={[styles.root, className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
