import styles from "./SectionHeading.module.css";

export type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <>
      <h2 className={[styles.title, className].filter(Boolean).join(" ")}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </>
  );
}
