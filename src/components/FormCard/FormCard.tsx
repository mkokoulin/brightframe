import React from "react";
import styles from "./FormCard.module.css";

export type FormCardProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function FormCard({ children, className, ...rest }: FormCardProps) {
  const cls = [styles.card, className].filter(Boolean).join(" ");
  return (
    <section className={cls} {...rest}>
      {children}
    </section>
  );
}
