import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Link.module.css";

export type LinkVariant = "default" | "muted" | "brand";

export type LinkProps = {
  href?: string;
  alt?: string;
  className?: string;
  target?: string;
  variant?: LinkVariant;
  /** Set to false for an underline-on-hover-only link. Defaults to true. */
  underline?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "target" | "title">;

export function Link({
  children,
  href = "#",
  alt,
  className,
  target,
  variant = "default",
  underline = true,
  ...rest
}: PropsWithChildren<LinkProps>) {
  return (
    <a
      className={[styles.link, styles[variant], !underline ? styles.noUnderline : "", className]
        .filter(Boolean)
        .join(" ")}
      href={href}
      title={alt}
      target={target}
      rel="noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}
