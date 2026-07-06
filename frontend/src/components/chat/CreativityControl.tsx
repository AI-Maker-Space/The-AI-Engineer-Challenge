"use client";

import { getCreativityLabel } from "@/lib/creativity";

interface CreativityControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CreativityControl({
  value,
  onChange,
  disabled = false,
}: CreativityControlProps) {
  const label = getCreativityLabel(value);

  return (
    <div className="border-t border-border/60 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="creativity-slider"
          className="shrink-0 text-xs font-medium text-muted"
        >
          Response style
        </label>
        <span
          className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
          aria-live="polite"
        >
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-xs text-muted" aria-hidden="true">
          Focused
        </span>
        <input
          id="creativity-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={label}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
        />
        <span className="text-xs text-muted" aria-hidden="true">
          Creative
        </span>
      </div>
      <p className="mt-1.5 text-center text-[11px] text-muted">
        Adjust how varied and exploratory the coach&apos;s replies feel
      </p>
    </div>
  );
}
