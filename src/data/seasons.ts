/**
 * 季度遊覽策略：氣象、水位與生態的常年綜合分析。
 *
 * 月均溫、雨量型態與舒適度屬長期常態特徵（依中央氣象署高雄測站長期統計之約略值），
 * 水域與生態欄位為一般季節性觀察，非單一測站即時數值。
 * 實際天候與水況請以出發當日公告為準。
 */

export interface SeasonStrategy {
  id: "spring" | "summer" | "autumn" | "winter";
  name: string;
  months: string;
  headline: string;
  temperature: string;
  rainfall: string;
  comfort: string;
  water: string;
  ecology: string;
  best: string;
  caution: string;
  accent: string;
}

export const seasonSourceNote =
  "氣象欄位為高雄地區長期常態特徵（約略值）；水位、濁度與生態為一般季節性觀察，實際情況依當日公告與現場為準。";

export const seasons: SeasonStrategy[] = [
  {
    id: "spring",
    name: "春季",
    months: "3 月至 5 月",
    headline: "白天最適合長距離步行，5 月起留意午後對流雨",
    temperature: "月均溫約 21–27°C，由暖轉熱",
    rainfall: "3–4 月相對偏少，5 月進入梅雨前緣、降雨頻率上升",
    comfort: "溫暖舒適，濕度逐步升高，日夜溫差仍明顯",
    water: "水量中等；春雨後短時間濁度略升，水位大致平穩",
    ecology: "留鳥活躍，過境鳥類於春季遷移期出現頻率較高",
    best: "白天步行、單車與攝影；適合把市區段與愛河灣排成同一條路線",
    caution: "5 月午後雷陣雨來得快，折疊傘與室內備案建議先準備",
    accent: "river",
  },
  {
    id: "summer",
    name: "夏季",
    months: "6 月至 8 月",
    headline: "避開正午，以清晨與日落後為主；颱風豪雨是最主要變數",
    temperature: "月均溫約 28–30°C，為全年高溫期",
    rainfall: "梅雨尾聲與颱風季重疊，午後對流雨頻繁且雨勢集中",
    comfort: "悶熱，體感常高於實際氣溫，紫外線指數容易達到過量級",
    water: "大雨後水位上升、漂流物增加，短時間內水色偏濁",
    ecology: "生物活動集中於清晨與黃昏，正午前後河岸較為安靜",
    best: "清晨或日落後出發；把室內場館安排在正午時段",
    caution: "颱風、豪雨與雷擊；水域活動與遊船可能臨時停航",
    accent: "gold",
  },
  {
    id: "autumn",
    name: "秋季",
    months: "9 月至 11 月",
    headline: "全年最穩定的戶外季節，適合長時間拍攝與散步",
    temperature: "月均溫約 27°C 降至 23°C，逐步轉涼",
    rainfall: "9 月仍為颱風季尾聲，10 月起轉為相對乾爽",
    comfort: "濕度與氣溫同步下降，體感舒適度全年最佳",
    water: "水位回穩、濁度降低，河面反射條件較好",
    ecology: "候鳥南遷期間，水岸與河口一帶的鳥況較為豐富",
    best: "全時段戶外活動、藍調時刻攝影與較長距離的步行路線",
    caution: "秋颱路徑變化大；入秋後日夜溫差增加",
    accent: "coral",
  },
  {
    id: "winter",
    name: "冬季",
    months: "12 月至 2 月",
    headline: "降雨少、能見度佳，但東北季風讓體感偏涼",
    temperature: "月均溫約 19–20°C，為全年低溫期",
    rainfall: "相對乾季，降雨日數與雨量明顯偏少",
    comfort: "涼爽乾燥；風勢較強時體感溫度下降明顯",
    water: "水量偏低、流速較緩，水況相對穩定",
    ecology: "冬候鳥停留期，水岸觀察與生態紀錄的好時機",
    best: "白天散步與生態觀察；晚間以燈光倒影與夜景為主",
    caution: "開闊河段與橋面風勢明顯，記得加件防風外套",
    accent: "navy",
  },
];
