"use client";

import { AnchorHTMLAttributes, ElementType, HTMLAttributes, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export type NavbarProps = {
  /** Tag to render. Defaults to "header". */
  as?: ElementType;
  /** Logo/brand slot, rendered first. */
  brand?: ReactNode;
  /** Right-aligned slot for controls — theme toggle, language select, `<Burger>` for mobile, ... */
  actions?: ReactNode;
  /** Scroll offset (px) past which the bar compacts its padding and gains a shadow. Defaults to 8. */
  scrollThreshold?: number;
} & HTMLAttributes<HTMLElement>;

/** A page header bar: brand slot, a row of `<NavbarItem>`s, and a right-aligned actions slot. */
export function Navbar({
  as: Tag = "header",
  brand,
  actions,
  children,
  className,
  scrollThreshold = 8,
  ...rest
}: PropsWithChildren<NavbarProps>) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > scrollThreshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold]);

  return (
    <Tag
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-scrolled={scrolled || undefined}
      {...rest}
    >
      {brand ? <div className={styles.brand}>{brand}</div> : null}
      {children ? <nav className={styles.nav}>{children}</nav> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </Tag>
  );
}

export type NavbarItemProps = {
  /** Tag to render. Defaults to "a". */
  as?: ElementType;
  icon?: ReactNode;
  /** Highlights the item as the current page/section. */
  active?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function NavbarItem({ as: Tag = "a", icon, active = false, className, children, ...rest }: NavbarItemProps) {
  return (
    <Tag
      className={[styles.item, active ? styles.itemActive : "", className].filter(Boolean).join(" ")}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </Tag>
  );
}
