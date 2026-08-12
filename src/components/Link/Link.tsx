import { PropsWithChildren } from "react";
import styles from "./Link.module.css";

export type LinkProps = {
  href?: string;
  alt?: string;
  className?: string;
  target?: string;
};

export function Link({ children, href = "#", alt, className, target }: PropsWithChildren<LinkProps>) {
  return (
    <a
      className={[styles.link, className].filter(Boolean).join(" ")}
      href={href}
      title={alt}
      target={target}
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
