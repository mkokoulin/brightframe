import { HTMLAttributes } from "react";
import styles from "./DayBadge.module.css";

function formatBadge(d: Date, locale: string) {
  const weekday = d.toLocaleDateString(locale, { weekday: "short" });
  const day = d.toLocaleDateString(locale, { day: "numeric" });
  const month = d.toLocaleDateString(locale, { month: "short" }).replace(".", "").toUpperCase();
  return { weekday, day, month };
}

export type DayBadgeSize = "md" | "compact";

export type DayBadgeProps = {
  date: Date;
  /** BCP 47 locale for weekday/month formatting. Defaults to "ru-RU". */
  locale?: string;
  size?: DayBadgeSize;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

export function DayBadge({ date, locale = "ru-RU", size = "md", className, ...rest }: DayBadgeProps) {
  const { weekday, day, month } = formatBadge(date, locale);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const cls = [
    styles.badge,
    isWeekend ? styles.weekend : "",
    size === "compact" ? styles.compact : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...rest}>
      <div className={styles.inner}>
        <div className={styles.weekday}>{weekday}</div>
        <div className={styles.day}>{day}</div>
        <div className={styles.month}>{month}</div>
      </div>
    </div>
  );
}
