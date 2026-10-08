/**
 * Mirrors the FastAPI `WeatherEntity` model in `api/index.py`.
 * The API returns JSON with snake_case keys.
 */
export const WEATHER_TYPES = [
  "sunny",
  "rainy",
  "cloudy",
  "snowy",
  "stormy",
  "foggy",
  "windy",
  "hazy",
  "drizzle",
  "sleet",
  "hail",
  "blizzard",
  "hot",
  "cold",
  "freezing",
  "humid",
  "dry",
  "dusty",
  "overcast",
  "tornado",
] as const;

export type WeatherType = (typeof WEATHER_TYPES)[number];

export type WeatherEntity = {
  weather_date: string;
  location: string;
  temperature: number;
  feels_like: number;
  wind_speed: number;
  weather_type: WeatherType;
  description: string;
  /** Conversational assistant reply for in-app chat */
  response: string;
};

export function isWeatherEntity(value: unknown): value is WeatherEntity {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.weather_date === "string" &&
    typeof o.location === "string" &&
    typeof o.temperature === "number" &&
    typeof o.feels_like === "number" &&
    typeof o.wind_speed === "number" &&
    typeof o.weather_type === "string" &&
    WEATHER_TYPES.includes(o.weather_type as WeatherType) &&
    typeof o.description === "string" &&
    typeof o.response === "string"
  );
}
