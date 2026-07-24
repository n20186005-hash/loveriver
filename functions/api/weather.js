const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const weatherDescriptions = {
  0: ["晴朗", "☀️"],
  1: ["大致晴朗", "🌤️"],
  2: ["局部多雲", "⛅"],
  3: ["陰天", "☁️"],
  45: ["有霧", "🌫️"],
  48: ["霧淞", "🌫️"],
  51: ["毛毛雨", "🌦️"],
  53: ["毛毛雨", "🌦️"],
  55: ["較強毛毛雨", "🌧️"],
  56: ["凍毛毛雨", "🌧️"],
  57: ["凍毛毛雨", "🌧️"],
  61: ["小雨", "🌦️"],
  63: ["中雨", "🌧️"],
  65: ["大雨", "🌧️"],
  66: ["凍雨", "🌧️"],
  67: ["凍雨", "🌧️"],
  71: ["小雪", "🌨️"],
  73: ["降雪", "🌨️"],
  75: ["大雪", "❄️"],
  77: ["霰", "🌨️"],
  80: ["短暫陣雨", "🌦️"],
  81: ["陣雨", "🌧️"],
  82: ["強陣雨", "⛈️"],
  85: ["陣雪", "🌨️"],
  86: ["強陣雪", "🌨️"],
  95: ["雷雨", "⛈️"],
  96: ["雷雨伴隨冰雹", "⛈️"],
  99: ["強雷雨伴隨冰雹", "⛈️"],
};

function describeWeather(code, isDay = true) {
  const [condition, icon] = weatherDescriptions[code] ?? ["天氣變化", "🌤️"];
  if (!isDay && code <= 1) return [condition, "🌙"];
  return [condition, icon];
}

function requiredNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid weather field: ${field}`);
  }
  return value;
}

function dayLabel(date, index) {
  if (index === 0) return "今天";
  if (index === 1) return "明天";
  return new Intl.DateTimeFormat("zh-TW", {
    weekday: "short",
    timeZone: "Asia/Taipei",
  }).format(new Date(`${date}T00:00:00+08:00`));
}

function weatherAdvice(currentCode, today) {
  const severeWeather = [currentCode, today.weatherCode].some((code) =>
    [82, 95, 96, 99].includes(code),
  );

  if (severeWeather || today.precipitationProbability >= 70 || today.maxWindGust >= 60) {
    return {
      level: "avoid",
      title: "先改安排室內行程",
      text: "可能有雷雨、強降雨或強陣風。請遠離水岸邊緣，遊船是否開航以營運單位現場公告為準。",
    };
  }

  if (
    today.precipitationProbability >= 45 ||
    today.maxWindGust >= 40 ||
    today.maxTemperature >= 34
  ) {
    return {
      level: "watch",
      title: "散步行程需要保留彈性",
      text: "留意短時降雨、強風或高溫，準備雨具、飲水與防曬，並在搭船前再次確認航班。",
    };
  }

  return {
    level: "good",
    title: "適合安排河岸散步",
    text: "天氣條件相對穩定，仍請留意午後陣雨與現場風勢；靠近水岸時請注意腳步與安全。",
  };
}

function normalizeWeather(raw) {
  if (!raw?.current || !raw?.daily || !Array.isArray(raw.daily.time)) {
    throw new Error("Incomplete weather response");
  }

  const currentCode = requiredNumber(raw.current.weather_code, "current.weather_code");
  const [currentCondition, currentIcon] = describeWeather(
    currentCode,
    raw.current.is_day === 1,
  );

  const daily = raw.daily.time.slice(0, 3).map((date, index) => {
    const code = requiredNumber(raw.daily.weather_code?.[index], `daily.weather_code.${index}`);
    const [condition, icon] = describeWeather(code);

    return {
      label: dayLabel(date, index),
      weatherCode: code,
      condition,
      icon,
      maxTemperature: requiredNumber(
        raw.daily.temperature_2m_max?.[index],
        `daily.temperature_2m_max.${index}`,
      ),
      minTemperature: requiredNumber(
        raw.daily.temperature_2m_min?.[index],
        `daily.temperature_2m_min.${index}`,
      ),
      precipitationProbability: requiredNumber(
        raw.daily.precipitation_probability_max?.[index],
        `daily.precipitation_probability_max.${index}`,
      ),
      maxWindGust: requiredNumber(
        raw.daily.wind_gusts_10m_max?.[index],
        `daily.wind_gusts_10m_max.${index}`,
      ),
    };
  });

  if (daily.length < 3) throw new Error("Three-day forecast unavailable");

  return {
    location: "高雄愛河市區段",
    source: {
      name: "Open-Meteo",
      url: "https://open-meteo.com/",
    },
    current: {
      weatherCode: currentCode,
      isDay: raw.current.is_day === 1,
      condition: currentCondition,
      icon: currentIcon,
      temperature: requiredNumber(raw.current.temperature_2m, "current.temperature_2m"),
      apparentTemperature: requiredNumber(
        raw.current.apparent_temperature,
        "current.apparent_temperature",
      ),
      windSpeed: requiredNumber(raw.current.wind_speed_10m, "current.wind_speed_10m"),
    },
    today: daily[0],
    daily,
    advice: weatherAdvice(currentCode, daily[0]),
  };
}

function upstreamUrl() {
  const url = new URL(WEATHER_API);
  url.searchParams.set("latitude", "22.6252");
  url.searchParams.set("longitude", "120.2894");
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max",
  );
  url.searchParams.set("timezone", "Asia/Taipei");
  url.searchParams.set("forecast_days", "3");
  return url;
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const cacheUrl = new URL(context.request.url);
  cacheUrl.search = "";
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const upstream = await fetch(upstreamUrl(), {
      headers: { Accept: "application/json" },
    });
    if (!upstream.ok) throw new Error(`Weather API returned ${upstream.status}`);

    const response = Response.json(normalizeWeather(await upstream.json()), {
      headers: {
        "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
      },
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "weather request failed",
        error: error instanceof Error ? error.message : String(error),
        path: new URL(context.request.url).pathname,
      }),
    );

    return Response.json(
      { error: "weather_unavailable" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

export { normalizeWeather, upstreamUrl };
