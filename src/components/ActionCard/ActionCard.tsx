import React from "react";
import styles from "./ActionCard.module.css";

type BaseProps = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

type DivActionCardProps = BaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps> & { href?: undefined };

type AnchorActionCardProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

export type ActionCardProps = DivActionCardProps | AnchorActionCardProps;

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * A clickable tile: icon in the top-left corner, an always-visible arrow
 * button in the top-right corner, and a title/description below.
 */
export function ActionCard({ icon, title, description, className, href, ...rest }: ActionCardProps) {
  const cls = [styles.card, className].filter(Boolean).join(" ");

  const inner = (
    <>
      <div className={styles.top}>
        {icon ? (
          <div className={styles.icon} aria-hidden="true">
            {icon}
          </div>
        ) : (
          <span />
        )}
        <span className={styles.arrow} aria-hidden="true">
          <ArrowIcon />
        </span>
      </div>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
    </>
  );

  if (href !== undefined) {
    return (
      <a className={cls} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }

  return (
    <div className={cls} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
      {inner}
    </div>
  );
}
