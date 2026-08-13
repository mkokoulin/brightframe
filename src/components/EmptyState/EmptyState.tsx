import { HTMLAttributes, ReactNode } from "react";
import styles from "./EmptyState.module.css";

export type EmptyStateProps = {
  /** Illustration or icon, rendered above the title. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** e.g. a `<Btn>` — rendered below the description. */
  action?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "title">;

export function EmptyState({ icon, title, description, action, className, ...rest }: EmptyStateProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      {icon ? (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
