"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const get = () =>
    typeof window !== "undefined" && typeof window.matchMedia !== "undefined"
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;

    const mql = window.matchMedia(query);

    const handler = () => setMatches(mql.matches);

    // sync immediately
    handler();

    // modern browsers
    if (mql.addEventListener) mql.addEventListener("change", handler);
    // legacy Safari
    else mql.addListener(handler);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [query]);

  return matches;
}
