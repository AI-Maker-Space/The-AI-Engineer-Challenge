// Minimal className merge helper used by shadcn-style components.
// Accepts strings or conditional values and flattens them into one class string.
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}


