import React from "react";
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
  className,
  children,
  href,
  ...rest
}: BtnProps) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    pill ? styles.pill : "",
    fullWidth ? styles.fullWidth : "",
    className,
  ].filter(Boolean).join(" ");

  const content = (
    <>
      {iconLeft && <span className={styles.icon} aria-hidden="true">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className={styles.icon} aria-hidden="true">{iconRight}</span>}
    </>
  );

  if (href !== undefined) {
    return (
      <a className={cls} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
