import type { WeatherType } from "./types";

/**
 * Generated JPEG backgrounds under `public/weather/{type}.jpg` (one per API `weather_type`).
 * `null` uses the neutral welcome / pre-forecast image.
 */
export function weatherBackdropUrl(type: WeatherType | null): string {
  if (!type) return "/weather/default.jpg";
  return `/weather/${type}.jpg`;
}
