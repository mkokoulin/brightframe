import { ElementType, HTMLAttributes } from "react";
import styles from "./SectionHeading.module.css";

export type SectionHeadingAlign = "left" | "center" | "right";

export type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: SectionHeadingAlign;
  /** Heading tag to render — override for correct document outline. Defaults to "h2". */
  as?: ElementType;
  className?: string;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "title">;

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
  className,
  ...rest
}: SectionHeadingProps) {
  const alignCls = align !== "left" ? styles[align] : "";
  return (
    <>
      <Tag className={[styles.title, alignCls, className].filter(Boolean).join(" ")} {...rest}>
        {title}
      </Tag>
      {subtitle && <p className={[styles.subtitle, alignCls].filter(Boolean).join(" ")}>{subtitle}</p>}
    </>
  );
}
