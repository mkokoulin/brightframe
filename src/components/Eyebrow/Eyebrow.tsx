import { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Eyebrow.module.css";

export type EyebrowProps = {
  children: ReactNode;
  /** Tag to render. Defaults to "p". */
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

export function Eyebrow({ children, className, as: Tag = "p", ...rest }: EyebrowProps) {
  const cls = [styles.eyebrow, className].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
