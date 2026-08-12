import { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Container.module.css";

export type ContainerProps = {
  /** Tag to render (e.g. "main", "section", "article"). Defaults to "div". */
  as?: ElementType;
} & HTMLAttributes<HTMLDivElement>;

export function Container({ children, className, as: Tag = "div", ...rest }: PropsWithChildren<ContainerProps>) {
  return (
    <Tag className={[styles.container, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
