"use client";

import React from "react";
import styles from "./Table.module.css";

export type TableFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function TableFooter({ children, className }: TableFooterProps) {
  return <tfoot className={[styles.tfoot, className].filter(Boolean).join(" ")}>{children}</tfoot>;
}
