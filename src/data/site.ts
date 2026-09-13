/**
 * 單景點 SEO 實體綁定配置（Single attraction entity binding）
 * ---------------------------------------------------------------
 * 這裡是本網站唯一的地理實體資料來源。
 * 只要更新這個檔案，JSON-LD、TDK/OG、地圖、評分與來源標註都會同步。
 *
 * 更新 Google 評分／評論數時，請同步修改 `attraction.rating` 底下的
 * value / reviewCount / verifiedAt 三個欄位，即可完成「最新評分同步」。
 *
 * 各景點頁自己的 Google 評分寫在該頁 frontmatter 的 `rating` 欄位
 * （結構見 content.config.ts）。沒有自填評分的愛河主體頁才沿用這裡的預設值，
 * 避免把愛河的分數顯示在其他景點頁上。
 */

/**
 * 評分資料形狀：全站愛河預設值與各景點頁自填的評分共用同一套顯示邏輯。
 * subject 決定來源標註要寫哪個景點，sourceUrl 讓每個分數都能連回原始頁面。
 */
export interface RatingInfo {
  /** 受評分的主體名稱，會顯示在來源標註中，避免分數掛錯景點 */
  subject: string;
  value: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
  source: string;
  sourceUrl: string;
  verifiedAt: string;
  verifiedLabel: string;
}

/** 把查核日期（YYYY-MM-DD）轉成頁面顯示用的日期文字。 */
export function formatVerifiedLabel(verifiedAt: string): string {
  const [year, month, day] = verifiedAt.split("-");
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export const site = {
  domain: "loveriver.org",
  url: "https://loveriver.org/",
  name: "高雄愛河旅遊指南",
  nameEn: "Love River Kaohsiung Guide",
  locale: "zh-Hant-TW",
  ogLocale: "zh_TW",
  tagline: "從愛河之心到愛河灣，一次看懂高雄最美水岸。",
} as const;

/** 景點官方全稱、俗稱與地理歸屬（對應 {{ATTRACTION_FULL_NAME}} 等佔位符）。 */
export const attraction = {
  /** 官方全稱：與 Google Maps 實體名稱一致 */
  fullName: "Love River",
  /** 當地語言名稱 */
  localizedName: "愛河",
  /** 域名對應的常用俗稱 */
  shortName: "Love River",
  /** Google 地點類別 */
  category: "Tourist attraction",

  cityName: "Kaohsiung",
  cityNameZh: "高雄市",
  districtName: "Qianjin District",
  stateProvince: "Kaohsiung City",
  countryName: "Taiwan",
  countryCode: "TW",
  postalCode: "801",
  streetAddress: "No. 188-1, Hedong Rd, Guangming Village, Qianjin District",
  addressZh: "台灣高雄市前金區光明里河東路 188-1 號",
  plusCode: "J7FQ+WM Guangming Village, Yancheng District, Kaohsiung City, Taiwan",

  latitude: 22.6248606,
  longitude: 120.2891291,

  /** Google Maps 分享短連結（{{MAPS_SHARE_URL}}） */
  mapsShareUrl: "https://maps.app.goo.gl/SwMZaznF1f4iXwAz9",
  /** Google Maps 嵌入代碼中的 src 連結（{{MAPS_EMBED_SRC}}） */
  mapsEmbedSrc:
    "https://www.google.com/maps?q=Love%20River%2C%20Kaohsiung&hl=zh-TW&z=15&output=embed",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Love+River+Kaohsiung",

  /** 周邊核心地標（{{NEARBY_LANDMARK_1}} / {{NEARBY_LANDMARK_2}} ...） */
  nearbyLandmarks: [
    "高雄流行音樂中心",
    "真愛碼頭",
    "大港橋",
    "愛河之心",
    "駁二藝術特區",
  ],

  /** 當地政府／官方旅遊局連結（{{GOVT_TOURISM_URL}}） */
  govtTourismUrl: "https://khh.travel/zh-tw/attractions/detail/232",
  govtTourismLabel: "高雄旅遊網－愛河",
  nationalTourismUrl: "https://www.taiwan.net.tw/",
  nationalTourismLabel: "台灣交通部觀光署",

  /** Google Maps 使用者評分（頁面顯示用，非本站自行評分） */
  rating: {
    /** 來源標註會顯示的名稱，避免與其他景點的評分混淆 */
    subject: "Love River 愛河",
    value: 4.3,
    reviewCount: 11660,
    bestRating: 5,
    worstRating: 1,
    source: "Google Maps",
    sourceUrl: "https://maps.app.goo.gl/SwMZaznF1f4iXwAz9",
    /** 實際查核日期（同步更新時請一併修改） */
    verifiedAt: "2026-09-13",
    verifiedLabel: "2026 年 9 月 13 日",
  },
} as const;

export const attractionImage = `https://${site.domain}/images/hero-1280.webp`;
export const attractionEntityId = `https://${site.domain}/#attraction`;

/** 首段等位聲明（模板 4.1）：把域名含義與官方全稱在語意上等同。 */
export const entityIntro =
  "歡迎來到 Love River（愛河），一般也直接稱作 Love River 愛河。它位於台灣高雄市前金區，是旅客進入這座城市水岸的第一站。";

/** 周邊語意集群描述（模板 4.3）。 */
export const entityNearby =
  "造訪 Love River 愛河時，可以輕鬆串連周邊的歷史地標與景點，包括高雄流行音樂中心、真愛碼頭與大港橋。";

/** 地理麵包屑與歸屬層級（模板 4.2）。 */
export const entityHierarchy = [
  attraction.fullName,
  attraction.cityNameZh,
  "Kaohsiung City",
  attraction.countryName,
] as const;

/** 產生 Google 地圖搜尋連結，供各頁面重複使用。 */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * 產生 TouristAttraction 結構化資料（模板 1，含 @id 與 image 補全）。
 * 使用 @id 讓搜尋引擎在知識圖譜中精確錨定同一個實體。
 */
export function buildAttractionSchema(extra?: Record<string, unknown>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": attractionEntityId,
    name: attraction.fullName,
    alternateName: [attraction.localizedName, `${attraction.cityName} ${attraction.fullName}`],
    description: `Comprehensive visitor guide to ${attraction.fullName} in ${attraction.cityName}, ${attraction.stateProvince}, ${attraction.countryName}.`,
    url: site.url,
    image: [attractionImage],
    isAccessibleForFree: true,
    publicAccess: true,
    touristType: ["自由行旅客", "親子旅客", "攝影旅客", "情侶"],
    address: {
      "@type": "PostalAddress",
      streetAddress: attraction.streetAddress,
      addressLocality: attraction.cityName,
      addressRegion: attraction.stateProvince,
      postalCode: attraction.postalCode,
      addressCountry: attraction.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: attraction.latitude,
      longitude: attraction.longitude,
    },
    hasMap: attraction.mapsShareUrl,
    /**
     * 評分來源為 Google Maps 使用者資料，與頁面顯示的數字一致。
     * 更新時請同步調整 attraction.rating，避免結構化資料與可見內容不符。
     */
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: attraction.rating.value,
      reviewCount: attraction.rating.reviewCount,
      bestRating: attraction.rating.bestRating,
      worstRating: attraction.rating.worstRating,
    },
    sameAs: [attraction.mapsShareUrl, attraction.govtTourismUrl],
    containedInPlace: {
      "@type": "City",
      name: attraction.cityNameZh,
    },
    ...extra,
  };
}
