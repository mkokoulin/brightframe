import React from "react";
import styles from "./Card.module.css";

export type CardVariant = "surface" | "outlined" | "elevated";
export type CardRadius = "sm" | "md" | "lg" | "xl";

type BaseProps = {
  variant?: CardVariant;
  radius?: CardRadius;
  hover?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type DivCardProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps> & { href?: undefined };

type AnchorCardProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

export type CardProps = DivCardProps | AnchorCardProps;

export function Card({
  variant = "surface",
  radius = "md",
  hover = false,
  className,
  children,
  href,
  ...rest
}: CardProps) {
  const cls = [
    styles.card,
    styles[variant],
    styles[`r${radius}`],
    hover ? styles.hover : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href !== undefined) {
    return (
      <a className={cls} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <div className={cls} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}
