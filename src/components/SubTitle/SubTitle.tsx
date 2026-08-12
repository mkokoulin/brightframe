import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./SubTitle.module.css";

export type SubTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function SubTitle({ children, className, ...rest }: PropsWithChildren<SubTitleProps>) {
  return (
    <h2 className={[styles.subtitle, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </h2>
  );
}
