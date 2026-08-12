import { HTMLAttributes, ReactNode } from "react";
import styles from "./Eyebrow.module.css";

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function Eyebrow({ children, className, ...rest }: EyebrowProps) {
  const cls = [styles.eyebrow, className].filter(Boolean).join(" ");
  return (
    <p className={cls} {...rest}>
      {children}
    </p>
  );
}
