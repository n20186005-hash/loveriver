/**
 * 氣象資料 → 旅客可直接執行的建議。
 *
 * 愛河的環境條件是「都市河岸 ＋ 感潮河口（下游銜接愛河灣與高雄港）」，因此只輸出
 * 與這個環境相關的三種資料視角：
 *   1. 都市河岸：體感溫度、紫外線、空氣品質 → 防暑、防曬、空氣品質
 *   2. 感潮河段：潮位與流向 → 岸邊階梯濕滑、護欄外側安全
 *   3. 港灣水域：風力、浪高、水溫 → 遊船與港邊活動條件
 * 山區、森林、溶洞、沙漠等本地不具備的地形，對應的建議模組不予輸出。
 *
 * 產品原則：
 *   - 只給動作，不要求旅客自行解讀數值
 *   - 不滿足條件的條目直接不輸出，避免堆疊無用訊息
 *   - 颱風、豪雨等官方警報以中央氣象署公告為準，這裡只做行前風險提示
 */
import type { CurrentWeather, RawAir, RawMarine, WeatherDay } from "./weather";

export type AdviceLevel = "good" | "watch" | "caution";
export type DayRisk = "none" | "watch" | "danger";

export interface RiskNotice {
  level: "warn" | "danger";
  title: string;
  detail: string;
}

export interface AdviceGroup {
  /** 出行穿搭 */
  dressing: string[];
  /** 遊玩安排 */
  activity: string[];
  /** 隨身物品 */
  items: string[];
}

export interface AirOutlook {
  aqi: number;
  pm25: number | null;
  label: string;
  tone: "good" | "fair" | "poor";
}

export interface MarineOutlook {
  waveHeight: number | null;
  wavePeriod: number | null;
  seaTemperature: number | null;
  seaLevelHeight: number | null;
  tideDirection: "rising" | "falling" | "steady" | null;
  note: string;
}

export interface WeatherAdvice {
  level: AdviceLevel;
  headline: string;
  summary: string;
  risks: RiskNotice[];
  groups: AdviceGroup;
  air: AirOutlook | null;
  marine: MarineOutlook | null;
}

type WeatherKind =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "light-rain"
  | "rain"
  | "heavy-rain"
  | "thunder";

const SEVERITY: Record<WeatherKind, number> = {
  clear: 0,
  partly: 0,
  cloudy: 0,
  fog: 0,
  drizzle: 1,
  "light-rain": 2,
  rain: 3,
  "heavy-rain": 4,
  thunder: 5,
};

const BEAUFORT_THRESHOLDS = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];

const classify = (code: number): WeatherKind => {
  if (code >= 95) return "thunder";
  if (code === 65 || code === 67 || code === 82) return "heavy-rain";
  if (code === 63 || code === 66 || code === 81) return "rain";
  if (code === 61 || code === 80 || (code >= 71 && code <= 77) || code === 85 || code === 86) {
    return "light-rain";
  }
  if (code >= 51 && code <= 57) return "drizzle";
  if (code === 45 || code === 48) return "fog";
  if (code === 3) return "cloudy";
  if (code === 2) return "partly";
  return "clear";
};

/** 風速（km/h）換算蒲福風級，讓「風力幾級」這種共同語言可以直接給旅客。 */
export const beaufort = (kilometersPerHour: number): number =>
  BEAUFORT_THRESHOLDS.reduce((level, threshold) => (kilometersPerHour >= threshold ? level + 1 : level), 0);

export const uvLabel = (uv: number): string => {
  if (uv >= 11) return "極強";
  if (uv >= 8) return "很強";
  if (uv >= 6) return "強";
  if (uv >= 3) return "中等";
  return "弱";
};

const isRainy = (kind: WeatherKind): boolean => kind !== "fog" && SEVERITY[kind] >= 1;

const wetRoad = (kind: WeatherKind): boolean => isRainy(kind);

const heavier = (a: WeatherKind, b: WeatherKind): WeatherKind => (SEVERITY[a] >= SEVERITY[b] ? a : b);

const cap = (values: string[], max: number): string[] => [...new Set(values)].slice(0, max);

/** 單日風險評級，用於 7 日預報的清單標記。 */
export function rateDay(day: WeatherDay): { risk: DayRisk; riskLabel: string | null } {
  const kind = classify(day.weatherCode);
  if (kind === "thunder") return { risk: "danger", riskLabel: "雷雨" };
  if (day.maxWindGust >= 90) return { risk: "danger", riskLabel: "強風" };
  if (day.precipitationSum >= 100) return { risk: "danger", riskLabel: "強降雨" };
  if (day.maxTemperature >= 37) return { risk: "danger", riskLabel: "高溫" };

  if (kind === "heavy-rain") return { risk: "watch", riskLabel: "大雨" };
  if (day.precipitationProbability >= 60) return { risk: "watch", riskLabel: "降雨" };
  if (day.maxWindGust >= 63) return { risk: "watch", riskLabel: "風大" };
  if (day.maxTemperature >= 35) return { risk: "watch", riskLabel: "高溫" };
  if (day.uvIndexMax >= 11) return { risk: "watch", riskLabel: "紫外線" };
  return { risk: "none", riskLabel: null };
}

function interpretAir(air: RawAir | null): AirOutlook | null {
  if (!air || air.aqi === null) return null;
  const aqi = Math.round(air.aqi);
  const label =
    aqi <= 50
      ? "良好"
      : aqi <= 100
        ? "普通"
        : aqi <= 150
          ? "對敏感族群不健康"
          : aqi <= 200
            ? "對所有族群不健康"
            : "非常不健康";
  const tone = aqi <= 50 ? "good" : aqi <= 100 ? "fair" : "poor";
  return { aqi, pm25: air.pm25, label, tone };
}

function interpretMarine(marine: RawMarine | null): MarineOutlook | null {
  if (!marine) return null;
  const { waveHeight, wavePeriod, seaTemperature, seaLevelHeight, tideDelta } = marine;
  if (waveHeight === null && seaTemperature === null && seaLevelHeight === null) return null;

  const tideDirection: MarineOutlook["tideDirection"] =
    tideDelta === null ? null : tideDelta > 0.06 ? "rising" : tideDelta < -0.06 ? "falling" : "steady";

  const note =
    tideDirection === "rising"
      ? "感潮河段接近漲潮，海水向上游推進，岸邊階梯與親水階面較容易濕滑。"
      : tideDirection === "falling"
        ? "感潮河段接近退潮，護欄外側泥灘露出時特別濕滑，請留在步道範圍內。"
        : "感潮河段水位變化平緩，水岸步道大致正常。";

  return { waveHeight, wavePeriod, seaTemperature, seaLevelHeight, tideDirection, note };
}

export interface BuildAdviceInput {
  current: CurrentWeather;
  today: WeatherDay;
  air: RawAir | null;
  marine: RawMarine | null;
  /** 1–12，用於季節性的蚊蟲與親水提示。 */
  month: number;
}

export function buildAdvice(input: BuildAdviceInput): WeatherAdvice {
  const { current, today, air, marine, month } = input;

  const kind = heavier(classify(today.weatherCode), classify(current.weatherCode));
  const probability = today.precipitationProbability;
  const rainSum = today.precipitationSum;
  const maxTemp = today.maxTemperature;
  const minTemp = today.minTemperature;
  const swing = maxTemp - minTemp;
  const uv = today.uvIndexMax;
  const gust = today.maxWindGust;
  const windLevel = beaufort(gust);
  const feels = current.apparentTemperature;

  const risks: RiskNotice[] = [];
  const dressing: string[] = [];
  const activity: string[] = [];
  const items: string[] = [];

  /* ── 風險提醒：優先於一般建議 ───────────────────────────── */
  if (kind === "thunder") {
    risks.push({
      level: "danger",
      title: "雷雨",
      detail: "附近有雷雨，請離開水邊與空曠河岸，不要在大樹下或孤立涼亭停留；水上活動請立即上岸。",
    });
  }
  if (rainSum >= 100) {
    risks.push({
      level: "danger",
      title: "致災性降雨",
      detail: "累積雨量偏高，河岸低窪處與自行車道可能積水或暫時封閉，避開護欄外側與排水口附近。",
    });
  } else if (rainSum >= 50 || (kind === "heavy-rain" && probability >= 70)) {
    risks.push({
      level: "warn",
      title: "明顯降雨",
      detail: "雨勢集中時河岸容易積水與濕滑，靠近水邊請放慢腳步，遊船可能臨時停航。",
    });
  }
  if (gust >= 90) {
    risks.push({
      level: "danger",
      title: "強風",
      detail: "風勢強勁，請遠離廣告招牌、臨時棚架與岸邊礁石；遊船與水上活動多半暫停。",
    });
  } else if (gust >= 63) {
    risks.push({
      level: "warn",
      title: "風勢強勁",
      detail: "開闊河段與橋面風力明顯，騎單車與撐傘都要放慢，臨時設施可能暫停營運。",
    });
  }
  if (maxTemp >= 37) {
    risks.push({
      level: "danger",
      title: "高溫",
      detail: "正午前後避免長時間曝曬，出現頭暈、心悸等徵兆請立刻到陰影處休息並補水。",
    });
  } else if (maxTemp >= 35) {
    risks.push({
      level: "warn",
      title: "高溫",
      detail: "日照強烈，戶外活動建議安排在上午十點前或日落之後。",
    });
  }
  if (maxTemp <= 10) {
    risks.push({
      level: "warn",
      title: "低溫",
      detail: "天氣寒冷，清晨與夜間的空曠河段體感更低，請做好保暖。",
    });
  }
  if (kind === "fog" && (current.visibility === null || current.visibility < 2000)) {
    risks.push({
      level: "warn",
      title: "濃霧",
      detail: "能見度不佳，渡輪與航班可能延誤，也不適合高處觀景與看海。",
    });
  }
  if (uv >= 11) {
    risks.push({
      level: "warn",
      title: "紫外線過量",
      detail: "正午前後短時間就可能曬傷，請縮短戶外停留並加強遮蔽。",
    });
  }
  const airOutlook = interpretAir(air);
  if (airOutlook && airOutlook.aqi >= 151) {
    risks.push({
      level: "warn",
      title: "空氣品質不佳",
      detail: "建議減少戶外劇烈運動，敏感族群外出請戴口罩。",
    });
  }
  const marineOutlook = interpretMarine(marine);

  /* ── 出行穿搭 ─────────────────────────────────────────── */
  if (maxTemp >= 33) {
    dressing.push("氣溫偏高，以輕薄透氣的短袖、短褲為主，材質選排汗快乾。");
  } else if (maxTemp >= 30) {
    dressing.push("天氣悶熱，建議輕薄透氣衣物，避免深色與厚重材質。");
  } else if (maxTemp <= 12) {
    dressing.push("天氣偏冷，建議厚外套搭配長褲，脖子與手部也要顧到。");
  } else if (maxTemp <= 19) {
    dressing.push("早晚偏涼，長袖加一件薄外套就足夠。");
  } else {
    dressing.push("氣溫舒適，短袖搭配一件薄外套，進出室內外都好調整。");
  }
  if (swing >= 8) {
    dressing.push(`日夜溫差約 ${Math.round(swing)}°C，採洋蔥式穿法，帶一件可隨時增減的外套。`);
  }
  if (windLevel >= 5) {
    dressing.push("風勢偏大，建議防風外套，避免寬鬆長裙與容易被吹落的帽子。");
  }
  if (wetRoad(kind)) {
    dressing.push(
      kind === "drizzle" || kind === "light-rain"
        ? "路面濕滑，鞋底選防滑或防潑水款式，走河岸石階時放慢腳步。"
        : "風雨明顯，防水外套比撐傘更實用。",
    );
  }
  if (uv >= 5 && maxTemp < 33) {
    dressing.push("紫外線偏強，長袖薄外套或遮蔽式配件可以少曬很多。");
  }
  if (current.humidity >= 80 && maxTemp >= 28) {
    dressing.push("濕度偏高，體感會比數字更悶，衣物選快乾材質並多補充水分。");
  }

  /* ── 遊玩安排 ─────────────────────────────────────────── */
  if (kind === "thunder") {
    activity.push("水上與遊船行程建議改期，改走室內展館等有遮蔽的行程。");
  } else if (kind === "heavy-rain" || kind === "rain") {
    activity.push("不建議安排戶外行程，優先選室內景點，露天座位與河岸散步建議順延。");
  } else if (probability >= 60) {
    activity.push("戶外行程請保留彈性，優先安排室內場館，露天活動建議往後順延。");
  } else if (kind === "drizzle") {
    activity.push("細雨下露天體驗較差，可先走騎樓與室內展館，等雨停再回到河岸。");
  }

  if (maxTemp >= 32) {
    activity.push("縮短正午前後的戶外停留，把河岸散步與拍照移到日落前後。");
  } else if (uv >= 8) {
    activity.push("正午紫外線很強，盡量待在陰影或有遮蔽的位置。");
  }

  if (windLevel >= 6) {
    activity.push("遊船與露天設施可能停航停運，出發前先確認當日營運公告。");
  } else if (windLevel >= 5) {
    activity.push("河岸與橋面風勢明顯，騎單車請放慢速度並留意側風。");
  }

  if (kind === "fog") {
    activity.push("能見度不佳，不適合高處觀景與看海，行程以市區室內景點為主。");
  } else if (kind === "clear") {
    activity.push("天氣晴朗，適合安排戶外遊覽，以及日出與日落時段的河面拍照。");
  } else if (kind === "cloudy") {
    activity.push("光線柔和均勻，拍照不容易過曝，適合長時間在河岸走動。");
  } else if (kind === "partly") {
    activity.push("雲量與陽光交替，適合散步與河面攝影，仍要留意短暫陣雨。");
  }

  if (marineOutlook) {
    if (marineOutlook.waveHeight !== null && marineOutlook.waveHeight >= 1.5) {
      activity.push(
        `港灣浪高約 ${marineOutlook.waveHeight.toFixed(1)} 公尺，搭船與港邊觀浪請保持安全距離。`,
      );
    }
    if (marineOutlook.seaTemperature !== null && marineOutlook.seaTemperature <= 24) {
      activity.push(
        `港灣水溫約 ${Math.round(marineOutlook.seaTemperature)}°C，海上風加上低水溫，乘船時體感會比市區更涼。`,
      );
    }
    activity.push(marineOutlook.note);
  }

  if (airOutlook) {
    if (airOutlook.aqi >= 151) {
      activity.push("空氣品質偏差，建議減少單車、慢跑等戶外劇烈運動。");
    } else if (airOutlook.aqi <= 50) {
      activity.push("空氣品質良好，適合安排較長時間的戶外活動。");
    }
  }

  /* ── 隨身物品 ─────────────────────────────────────────── */
  if (kind === "heavy-rain" || kind === "rain") {
    items.push("雨衣（風大時不要用長柄傘）");
  } else if (probability >= 60) {
    items.push("折疊傘或輕便雨衣");
  } else if (probability >= 30 || kind === "drizzle" || kind === "light-rain") {
    items.push("折疊傘");
  }

  if (uv >= 5) {
    items.push("防曬乳、太陽眼鏡、遮陽帽");
  } else if (uv >= 3 || (kind === "clear" && current.isDay)) {
    items.push("防曬乳");
  }

  if (maxTemp >= 30) {
    items.push("充足的飲用水");
  }

  if (maxTemp <= 12) {
    items.push("保暖外套、圍巾");
  } else if (windLevel >= 5) {
    items.push("防風外套");
  } else if (swing >= 8 || maxTemp <= 19) {
    items.push("薄外套");
  }

  if (month >= 5 && month <= 9 && maxTemp >= 28) {
    items.push("防蚊液");
  }

  if (kind === "fog" || (airOutlook?.aqi ?? 0) >= 101) {
    items.push("口罩");
  }

  /* ── 整體評級與一句話結論 ─────────────────────────────── */
  const hasDanger = risks.some((risk) => risk.level === "danger");
  const level: AdviceLevel = hasDanger
    ? "caution"
    : risks.length > 0 || probability >= 30 || maxTemp >= 33 || uv >= 8
      ? "watch"
      : "good";

  const headline = hasDanger
    ? "今天建議調整行程，以室內與短程為主"
    : kind === "thunder" || kind === "heavy-rain" || kind === "rain"
      ? "今天有雨，行程請保留室內備案"
      : probability >= 60
        ? "今天降雨機率高，帶傘再出門"
        : maxTemp >= 33 || uv >= 8
          ? "天氣偏熱，建議清晨或日落後出發"
          : kind === "cloudy"
            ? "今天光線柔和，適合散步與拍照"
            : kind === "clear"
              ? "今天天氣晴朗，適合走河岸"
              : "今天整體適合戶外活動";

  const summary = `${today.condition}・${Math.round(minTemp)}–${Math.round(maxTemp)}°C・體感 ${Math.round(
    feels,
  )}°C・降雨機率 ${probability}%・風力 ${windLevel} 級・紫外線${uvLabel(uv)}`;

  return {
    level,
    headline,
    summary,
    risks,
    groups: {
      dressing: cap(dressing, 4),
      activity: cap(activity, 5),
      items: cap(items, 5),
    },
    air: airOutlook,
    marine: marineOutlook,
  };
}
