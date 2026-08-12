import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Title.module.css";

export type TitleProps = HTMLAttributes<HTMLHeadingElement>;

export function Title({ children, className, ...rest }: PropsWithChildren<TitleProps>) {
  return (
    <h1 className={[styles.title, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </h1>
  );
}
