/**
 * 愛河（高雄）即時氣象、7 日預報與環境概況。
 *
 * 在伺服器端取得數值預報資料並加以整理；上游請求結果會寫入邊緣快取與
 * 模組內記憶體，避免每個訪客都觸發一次外部請求。
 *
 * 取用的資料面向依愛河的實際環境決定（都市河岸＋感潮河口＋港灣）：
 *   - 陸域：氣溫、體感、降雨、風、紫外線、能見度
 *   - 空氣：空氣品質指標（戶外活動參考）
 *   - 水域：港灣浪高、浪週期、海水溫度，以及感潮河段的潮位變化
 * 山區、森林等地形條件不適用，故不取用對應資料。
 *
 * 僅在伺服器執行（server island / on-demand route），不會被打包進前端。
 */
import { attraction } from "../data/site";
import { buildAdvice, rateDay } from "./advice";
import type { DayRisk, WeatherAdvice } from "./advice";

export type WeatherGlyph =
  | "clear-day"
  | "clear-night"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "heavy-rain"
  | "thunder";

export interface WeatherDay {
  date: string;
  label: string;
  shortDate: string;
  weatherCode: number;
  condition: string;
  glyph: WeatherGlyph;
  maxTemperature: number;
  minTemperature: number;
  precipitationSum: number;
  precipitationProbability: number;
  maxWindSpeed: number;
  maxWindGust: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  risk: DayRisk;
  riskLabel: string | null;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windGust: number;
  visibility: number | null;
  isDay: boolean;
  weatherCode: number;
  condition: string;
  glyph: WeatherGlyph;
  observedAt: string;
}

export interface RawAir {
  aqi: number | null;
  pm25: number | null;
}

export interface RawMarine {
  waveHeight: number | null;
  wavePeriod: number | null;
  seaTemperature: number | null;
  seaLevelHeight: number | null;
  /** 與一小時前後的潮位差，用來判斷漲退潮。 */
  tideDelta: number | null;
}

export interface WeatherSnapshot {
  updatedAt: string;
  timezone: string;
  locationName: string;
  current: CurrentWeather;
  today: WeatherDay;
  days: WeatherDay[];
  blueHour: string;
  advice: WeatherAdvice;
}

const TTL_SECONDS = 900;
const STALE_SECONDS = 6 * 60 * 60;
const CACHE_KEY = "https://loveriver.org/__edge-cache/weather/v2";

/**
 * 港灣水域的取樣點：高雄港外側一帶，代表愛河灣與港區的浪況。
 * 感潮河段的水位以同一模型推估，僅作行前參考。
 */
const MARINE_PROBE = { latitude: 22.603, longitude: 120.268 };

const WMO_CODES: Record<number, { label: string; glyph: WeatherGlyph }> = {
  0: { label: "晴朗", glyph: "clear-day" },
  1: { label: "晴時多雲", glyph: "partly" },
  2: { label: "多雲", glyph: "partly" },
  3: { label: "陰天", glyph: "cloudy" },
  45: { label: "有霧", glyph: "fog" },
  48: { label: "霧淞", glyph: "fog" },
  51: { label: "弱毛毛雨", glyph: "drizzle" },
  53: { label: "毛毛雨", glyph: "drizzle" },
  55: { label: "強毛毛雨", glyph: "drizzle" },
  56: { label: "凍毛毛雨", glyph: "drizzle" },
  57: { label: "強凍毛毛雨", glyph: "drizzle" },
  61: { label: "小雨", glyph: "rain" },
  63: { label: "中雨", glyph: "rain" },
  65: { label: "大雨", glyph: "heavy-rain" },
  66: { label: "凍雨", glyph: "rain" },
  67: { label: "強凍雨", glyph: "heavy-rain" },
  71: { label: "小雪", glyph: "rain" },
  73: { label: "中雪", glyph: "rain" },
  75: { label: "大雪", glyph: "heavy-rain" },
  77: { label: "雪粒", glyph: "rain" },
  80: { label: "短暫陣雨", glyph: "rain" },
  81: { label: "陣雨", glyph: "rain" },
  82: { label: "強陣雨", glyph: "heavy-rain" },
  85: { label: "陣雪", glyph: "rain" },
  86: { label: "強陣雪", glyph: "heavy-rain" },
  95: { label: "雷陣雨", glyph: "thunder" },
  96: { label: "雷雨伴冰雹", glyph: "thunder" },
  99: { label: "強雷雨伴冰雹", glyph: "thunder" },
};

interface CacheLike {
  match(key: string): Promise<Response | undefined>;
  put(key: string, response: Response): Promise<void>;
}

/** 取用邊緣快取；不在 Workers 執行環境時回傳 null。 */
function edgeCache(): CacheLike | null {
  const scope = globalThis as unknown as { caches?: { default?: CacheLike } };
  return scope.caches?.default ?? null;
}

let memoryCache: { storedAt: number; snapshot: WeatherSnapshot } | null = null;

const round = (value: number, digits = 0): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const toOptionalNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const toMinutes = (iso: string): number => {
  const time = iso.split("T")[1] ?? "";
  const [hour, minute] = time.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
};

const toClock = (iso: string): string => {
  const time = iso.split("T")[1] ?? "";
  return time.slice(0, 5) || "—";
};

const addMinutes = (iso: string, minutes: number): string => {
  const total = (toMinutes(iso) + minutes) % (24 * 60);
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const WEEKDAYS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

const dayLabels = (dates: string[]): string[] =>
  dates.map((date, index) => {
    if (index === 0) return "今天";
    if (index === 1) return "明天";
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    return WEEKDAYS[weekday] ?? date;
  });

const describe = (code: number) =>
  WMO_CODES[code] ?? { label: "天氣多變", glyph: "cloudy" as WeatherGlyph };

/** 找出與指定時刻最接近的逐時索引，用於能見度與潮位。 */
function hourIndex(times: string[], currentTime: string): number {
  if (times.length === 0) return -1;
  const target = `${currentTime.slice(0, 13)}:00`;
  const exact = times.indexOf(target);
  if (exact >= 0) return exact;
  const wanted = toMinutes(target);
  let best = 0;
  let bestGap = Number.POSITIVE_INFINITY;
  times.forEach((time, index) => {
    const gap = Math.abs(toMinutes(time) - wanted);
    if (gap < bestGap) {
      bestGap = gap;
      best = index;
    }
  });
  return best;
}

function normalize(forecast: Record<string, any>, marine: Record<string, any> | null, air: Record<string, any> | null): WeatherSnapshot {
  const daily = forecast.daily ?? {};
  const current = forecast.current ?? {};
  const hourly = forecast.hourly ?? {};
  const dates: string[] = daily.time ?? [];
  const labels = dayLabels(dates);

  const days: WeatherDay[] = dates.map((date, index) => {
    const code = Number(daily.weather_code?.[index] ?? 0);
    const info = describe(code);
    const day: WeatherDay = {
      date,
      label: labels[index] ?? date,
      shortDate: `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`,
      weatherCode: code,
      condition: info.label,
      glyph: info.glyph,
      maxTemperature: round(daily.temperature_2m_max?.[index] ?? 0),
      minTemperature: round(daily.temperature_2m_min?.[index] ?? 0),
      precipitationSum: round(daily.precipitation_sum?.[index] ?? 0, 1),
      precipitationProbability: round(daily.precipitation_probability_max?.[index] ?? 0),
      maxWindSpeed: round(daily.wind_speed_10m_max?.[index] ?? 0),
      maxWindGust: round(daily.wind_gusts_10m_max?.[index] ?? 0),
      uvIndexMax: round(daily.uv_index_max?.[index] ?? 0, 1),
      sunrise: toClock(String(daily.sunrise?.[index] ?? "")),
      sunset: toClock(String(daily.sunset?.[index] ?? "")),
      risk: "none",
      riskLabel: null,
    };
    return { ...day, ...rateDay(day) };
  });

  const currentCode = Number(current.weather_code ?? days[0]?.weatherCode ?? 0);
  const currentInfo = describe(currentCode);
  const currentTime = String(current.time ?? "");
  const visibilityIndex = hourIndex(hourly.time ?? [], currentTime);

  const normalizedCurrent: CurrentWeather = {
    temperature: round(current.temperature_2m ?? 0, 1),
    apparentTemperature: round(current.apparent_temperature ?? current.temperature_2m ?? 0, 1),
    humidity: round(current.relative_humidity_2m ?? 0),
    precipitation: round(current.precipitation ?? 0, 1),
    windSpeed: round(current.wind_speed_10m ?? 0),
    windGust: round(current.wind_gusts_10m ?? 0),
    visibility:
      visibilityIndex >= 0
        ? toOptionalNumber(hourly.visibility?.[visibilityIndex])
        : null,
    isDay: Number(current.is_day ?? 1) === 1,
    weatherCode: currentCode,
    condition: currentInfo.label,
    glyph: currentInfo.glyph,
    observedAt: toClock(currentTime),
  };

  const today: WeatherDay = days[0] ?? {
    date: "",
    label: "今天",
    shortDate: "",
    weatherCode: 0,
    condition: "—",
    glyph: "cloudy",
    maxTemperature: 0,
    minTemperature: 0,
    precipitationSum: 0,
    precipitationProbability: 0,
    maxWindSpeed: 0,
    maxWindGust: 0,
    uvIndexMax: 0,
    sunrise: "—",
    sunset: "—",
    risk: "none",
    riskLabel: null,
  };

  return {
    updatedAt: new Date().toISOString(),
    timezone: String(forecast.timezone ?? "Asia/Taipei"),
    locationName: attraction.localizedName,
    current: normalizedCurrent,
    today,
    days: days.slice(0, 7),
    blueHour: today.sunset !== "—" ? addMinutes(`T${today.sunset}`, 25) : "—",
    advice: buildAdvice({
      current: normalizedCurrent,
      today,
      air: readAir(air),
      marine: readMarine(marine, currentTime),
      month: Number(today.date.slice(5, 7)) || new Date().getMonth() + 1,
    }),
  };
}

function readAir(payload: Record<string, any> | null): RawAir | null {
  if (!payload) return null;
  const current = payload.current ?? {};
  const aqi = toOptionalNumber(current.us_aqi);
  const pm25 = toOptionalNumber(current.pm2_5);
  if (aqi === null && pm25 === null) return null;
  return { aqi, pm25 };
}

function readMarine(payload: Record<string, any> | null, currentTime: string): RawMarine | null {
  if (!payload) return null;
  const current = payload.current ?? {};
  const hourly = payload.hourly ?? {};
  const index = hourIndex(hourly.time ?? [], currentTime);
  const levels: unknown[] = hourly.sea_level_height_msl ?? [];

  let seaLevelHeight: number | null = null;
  let tideDelta: number | null = null;
  if (index >= 0) {
    seaLevelHeight = toOptionalNumber(levels[index]);
    const next = toOptionalNumber(levels[index + 1]);
    const previous = toOptionalNumber(levels[index - 1]);
    // 正值代表水位正在上升（漲潮），負值代表退潮。
    if (seaLevelHeight !== null) {
      if (next !== null) tideDelta = round(next - seaLevelHeight, 2);
      else if (previous !== null) tideDelta = round(seaLevelHeight - previous, 2);
    }
  }

  const raw: RawMarine = {
    waveHeight: toOptionalNumber(current.wave_height),
    wavePeriod: toOptionalNumber(current.wave_period),
    seaTemperature: toOptionalNumber(current.sea_surface_temperature),
    seaLevelHeight,
    tideDelta,
  };

  if (
    raw.waveHeight === null &&
    raw.wavePeriod === null &&
    raw.seaTemperature === null &&
    raw.seaLevelHeight === null
  ) {
    return null;
  }
  return raw;
}

function buildRequestUrl(): string {
  const params = new URLSearchParams({
    latitude: String(attraction.latitude),
    longitude: String(attraction.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
    hourly: "visibility",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset",
    timezone: "Asia/Taipei",
    wind_speed_unit: "kmh",
    forecast_days: "7",
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

function buildMarineUrl(): string {
  const params = new URLSearchParams({
    latitude: String(MARINE_PROBE.latitude),
    longitude: String(MARINE_PROBE.longitude),
    current: "wave_height,wave_period,sea_surface_temperature",
    hourly: "sea_level_height_msl",
    timezone: "Asia/Taipei",
    forecast_days: "2",
  });
  return `https://marine-api.open-meteo.com/v1/marine?${params.toString()}`;
}

function buildAirUrl(): string {
  const params = new URLSearchParams({
    latitude: String(attraction.latitude),
    longitude: String(attraction.longitude),
    current: "pm2_5,us_aqi",
    timezone: "Asia/Taipei",
  });
  return `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`;
}

async function fetchJson(url: string): Promise<Record<string, any> | null> {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(6000) : undefined,
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, any>;
  } catch {
    return null;
  }
}

async function readEdgeCache(): Promise<WeatherSnapshot | null> {
  const cache = edgeCache();
  if (!cache) return null;
  try {
    const hit = await cache.match(CACHE_KEY);
    if (!hit) return null;
    return (await hit.json()) as WeatherSnapshot;
  } catch {
    return null;
  }
}

async function writeEdgeCache(snapshot: WeatherSnapshot): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  try {
    await cache.put(
      CACHE_KEY,
      new Response(JSON.stringify(snapshot), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": `public, max-age=${TTL_SECONDS}`,
        },
      }),
    );
  } catch {
    /* 快取寫入失敗不影響回應 */
  }
}

/**
 * 取得愛河即時氣象與環境概況。優先序：模組記憶體 → 邊緣快取 → 上游請求。
 * 水域與空氣品質為輔助資訊，取得失敗時僅略過該區塊，不影響主要預報。
 */
export async function getWeather(): Promise<WeatherSnapshot | null> {
  const now = Date.now();

  if (memoryCache && now - memoryCache.storedAt < TTL_SECONDS * 1000) {
    return memoryCache.snapshot;
  }

  const cached = await readEdgeCache();
  if (cached) {
    memoryCache = { storedAt: now, snapshot: cached };
    return cached;
  }

  try {
    const [forecast, marine, air] = await Promise.all([
      fetchJson(buildRequestUrl()),
      fetchJson(buildMarineUrl()),
      fetchJson(buildAirUrl()),
    ]);
    if (!forecast) throw new Error("weather upstream unavailable");

    const snapshot = normalize(forecast, marine, air);
    memoryCache = { storedAt: now, snapshot };
    await writeEdgeCache(snapshot);
    return snapshot;
  } catch {
    if (memoryCache && now - memoryCache.storedAt < STALE_SECONDS * 1000) {
      return memoryCache.snapshot;
    }
    return null;
  }
}
