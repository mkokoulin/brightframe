"use client";

import React, { useState } from "react";
import styles from "./Avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarProps = {
  src?: string;
  alt?: string;
  /** Used to derive initials when `src` is absent or fails to load. */
  name?: string;
  size?: AvatarSize;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children">;

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ src, alt, name, size = "md", className, ...rest }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;
  const initials = getInitials(name);

  return (
    <span
      className={[styles.avatar, styles[size], className].filter(Boolean).join(" ")}
      role={showImage ? undefined : "img"}
      aria-label={showImage ? undefined : (alt ?? name ?? "Avatar")}
      {...rest}
    >
      {showImage ? (
        <img className={styles.img} src={src} alt={alt ?? name ?? ""} onError={() => setErrored(true)} />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={styles.fallbackIcon}>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
