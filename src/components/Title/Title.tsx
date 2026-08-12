import { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Title.module.css";

export type TitleProps = {
  /** Tag to render — override for document outline (e.g. "h2" if an h1 already exists). Defaults to "h1". */
  as?: ElementType;
} & HTMLAttributes<HTMLHeadingElement>;

export function Title({ children, className, as: Tag = "h1", ...rest }: PropsWithChildren<TitleProps>) {
  return (
    <Tag className={[styles.title, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
