import { ElementType, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import styles from "./Footer.module.css";

export type FooterProps = {
  /** Tag to render. Defaults to "footer". */
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

/** Page footer: a responsive row of `<FooterColumn>`s (1 column on mobile, side by side from `md` up). */
export function Footer({ as: Tag = "footer", children, className, ...rest }: PropsWithChildren<FooterProps>) {
  return (
    <Tag className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.columns}>{children}</div>
    </Tag>
  );
}

export type FooterColumnProps = {
  title?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function FooterColumn({ title, children, className, ...rest }: PropsWithChildren<FooterColumnProps>) {
  return (
    <div className={[styles.column, className].filter(Boolean).join(" ")} {...rest}>
      {title ? <p className={styles.columnTitle}>{title}</p> : null}
      <div className={styles.columnBody}>{children}</div>
    </div>
  );
}
