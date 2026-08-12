import { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./SubTitle.module.css";

export type SubTitleProps = {
  /** Tag to render — override for document outline. Defaults to "h2". */
  as?: ElementType;
} & HTMLAttributes<HTMLHeadingElement>;

export function SubTitle({ children, className, as: Tag = "h2", ...rest }: PropsWithChildren<SubTitleProps>) {
  return (
    <Tag className={[styles.subtitle, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
