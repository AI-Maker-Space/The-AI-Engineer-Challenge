/**
 * Turns API `weather_date` strings (often ISO datetime or free text) into a date-only label.
 */
export function formatWeatherDateOnly(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const fromParse = Date.parse(trimmed);
  if (!Number.isNaN(fromParse)) {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(fromParse));
  }

  const datePart = trimmed.split(/[T\s]/)[0] ?? trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const t = Date.parse(datePart);
    if (!Number.isNaN(t)) {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(t));
    }
  }

  return datePart;
}
