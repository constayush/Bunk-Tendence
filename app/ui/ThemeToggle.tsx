"use client";

import { Sun, Moon } from "@phosphor-icons/react";
import type { Theme } from "./theme";

export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="ghost-btn flex h-8 w-8 items-center justify-center rounded-lg"
    >
      {isDark ? <Sun size={16} weight="fill" /> : <Moon size={16} weight="fill" />}
    </button>
  );
}
