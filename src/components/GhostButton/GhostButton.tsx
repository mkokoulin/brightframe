import React from "react";
import styles from "./GhostButton.module.css";
import { PinIcon } from "../../icons";

export type GhostButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  label: string;
  size?: GhostButtonSize;
  targetBlank?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

type ButtonVariant = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "type"> & { href?: undefined };

type AnchorVariant = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

export type GhostButtonProps = ButtonVariant | AnchorVariant;

export function GhostButton({
  label,
  href,
  size = "md",
  className,
  targetBlank,
  icon,
  ...rest
}: GhostButtonProps) {
  const cls = [styles.root, styles[size], className].filter(Boolean).join(" ");

  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <PinIcon />}
      </span>
      <span className={styles.text}>{label}</span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        className={cls}
        href={href}
        target={targetBlank ? "_blank" : undefined}
        rel={targetBlank ? "noreferrer" : undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
