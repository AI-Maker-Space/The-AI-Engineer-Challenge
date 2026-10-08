import React from "react";
import { useTheme } from "../contexts/ThemeContext";

// Toggle switch for switching between light and dark mode with "Mode" label.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Mode
      </span>
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-slate-600"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {isDark ? "Dark" : "Light"}
      </span>
    </div>
  );
}

