import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Container.module.css";

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ children, className, ...rest }: PropsWithChildren<ContainerProps>) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
