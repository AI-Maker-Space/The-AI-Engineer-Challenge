/** Supported coach persona identifiers — must match the backend. */
export type CoachCharacterId =
  | "professional"
  | "warm_friend"
  | "mindful_guide"
  | "motivational_coach";

export interface CoachCharacter {
  id: CoachCharacterId;
  label: string;
  description: string;
  icon: string;
}

export const COACH_CHARACTERS: CoachCharacter[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Clear and structured",
    icon: "💼",
  },
  {
    id: "warm_friend",
    label: "Warm friend",
    description: "Empathetic and validating",
    icon: "🤗",
  },
  {
    id: "mindful_guide",
    label: "Mindful guide",
    description: "Calm and reflective",
    icon: "🧘",
  },
  {
    id: "motivational_coach",
    label: "Motivational coach",
    description: "Encouraging and action-oriented",
    icon: "⚡",
  },
];

export const CHARACTER_STORAGE_KEY = "mindful-coach-character";

export const DEFAULT_CHARACTER: CoachCharacterId = "mindful_guide";

const VALID_IDS = new Set<string>(COACH_CHARACTERS.map((c) => c.id));

export function isCoachCharacterId(value: string): value is CoachCharacterId {
  return VALID_IDS.has(value);
}

export function readStoredCharacter(): CoachCharacterId {
  if (typeof window === "undefined") {
    return DEFAULT_CHARACTER;
  }

  const stored = localStorage.getItem(CHARACTER_STORAGE_KEY);
  if (stored && isCoachCharacterId(stored)) {
    return stored;
  }

  return DEFAULT_CHARACTER;
}

export function getCharacterById(id: CoachCharacterId): CoachCharacter {
  const character = COACH_CHARACTERS.find((c) => c.id === id);
  if (!character) {
    throw new Error(`Unknown character: ${id}`);
  }
  return character;
}
