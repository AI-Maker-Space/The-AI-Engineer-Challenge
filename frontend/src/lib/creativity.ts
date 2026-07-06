/** Stored slider value (0 = focused, 100 = creative). */
export type CreativityLevel = number;

export const CREATIVITY_STORAGE_KEY = "mindful-coach-creativity";

/** Default slider position — balanced responses. */
export const DEFAULT_CREATIVITY = 50;

/** Human-readable label for the current slider position. */
export function getCreativityLabel(level: CreativityLevel): string {
  if (level < 25) return "Focused";
  if (level < 50) return "Grounded";
  if (level < 75) return "Balanced";
  if (level < 90) return "Expressive";
  return "Creative";
}

export function readStoredCreativity(): CreativityLevel {
  if (typeof window === "undefined") {
    return DEFAULT_CREATIVITY;
  }

  const stored = localStorage.getItem(CREATIVITY_STORAGE_KEY);
  if (stored === null) {
    return DEFAULT_CREATIVITY;
  }

  const parsed = Number(stored);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : DEFAULT_CREATIVITY;
}
