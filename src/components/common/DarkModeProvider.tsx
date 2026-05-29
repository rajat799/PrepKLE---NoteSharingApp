"use client";

import { useEffect } from "react";

/**
 * Client component that applies the saved theme preference on mount.
 * Runs only on the client — keeps the root layout as a server component.
 */
export function DarkModeProvider() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}
