"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "./Btn.module.css";

export type BtnVariant = "primary" | "secondary" | "brand" | "ghost" | "danger" | "external" | "white";
export type BtnSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: BtnVariant;
  size?: BtnSize;
  pill?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Renders a fixed 44×44 icon-only button (transparent, bordered, brand-tinted hover) instead of a labelled one. Pass the icon as `children`. */
  iconOnly?: boolean;
  /** Shows a spinner and disables the button. Its rendered width is locked to its pre-loading width so the layout doesn't shift. */
  loading?: boolean;
  /** Replaces `children` while `loading` is true (e.g. "Sending" for a "Send the request" button). Defaults to keeping the original label. */
  loadingLabel?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = BaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
  href?: undefined;
};

type AnchorProps = BaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
  href: string;
};

export type BtnProps = ButtonProps | AnchorProps;

export function Btn({
  variant = "primary",
  size = "md",
  pill = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  iconOnly = false,
  loading = false,
  loadingLabel,
  className,
  children,
  href,
  style,
  ...rest
}: BtnProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number>();

  // Measured only while idle, so the value locked in via `loading` reflects the
  // button's own pre-loading width rather than the (usually narrower) spinner state.
  useLayoutEffect(() => {
    if (!loading && ref.current) setNaturalWidth(ref.current.offsetWidth);
  }, [loading, children, loadingLabel]);

  const cls = [
    styles.btn,
    iconOnly ? styles.iconOnly : styles[variant],
    styles[size],
    pill ? styles.pill : "",
    fullWidth ? styles.fullWidth : "",
    className,
  ].filter(Boolean).join(" ");

  const mergedStyle: React.CSSProperties = {
    ...(loading && naturalWidth ? { minWidth: naturalWidth } : null),
    ...style,
  };

  const label = loading && loadingLabel !== undefined ? loadingLabel : children;

  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && iconLeft && (
        <span className={styles.icon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {iconOnly ? (!loading ? children : null) : <span>{label}</span>}
      {!loading && !iconOnly && iconRight && (
        <span className={styles.icon} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={cls}
        href={href}
        style={mergedStyle}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cls}
      style={mergedStyle}
      aria-busy={loading || undefined}
      {...buttonRest}
      disabled={buttonRest.disabled || loading}
    >
      {content}
    </button>
  );
}
