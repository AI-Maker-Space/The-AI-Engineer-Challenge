"use client";

import {
  COACH_CHARACTERS,
  type CoachCharacterId,
  getCharacterById,
} from "@/lib/characters";

interface CharacterSelectProps {
  value: CoachCharacterId;
  onChange: (value: CoachCharacterId) => void;
  disabled?: boolean;
}

export function CharacterSelect({
  value,
  onChange,
  disabled = false,
}: CharacterSelectProps) {
  const selected = getCharacterById(value);

  return (
    <div className="border-t border-border/60 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted">Coach character</span>
        <span className="text-xs text-muted">{selected.description}</span>
      </div>
      <div
        role="radiogroup"
        aria-label="Coach character"
        className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {COACH_CHARACTERS.map((character) => {
          const isActive = value === character.id;

          return (
            <button
              key={character.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(character.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-center transition-colors ${
                isActive
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-background text-muted hover:border-accent/40 hover:bg-surface-elevated hover:text-foreground"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span className="text-base" aria-hidden="true">
                {character.icon}
              </span>
              <span className="text-[11px] font-medium leading-tight sm:text-xs">
                {character.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
