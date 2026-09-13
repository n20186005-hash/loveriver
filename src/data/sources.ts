/**
 * 資料來源清單（E-E-A-T）。
 * 用於頁面底部的 SourcesSection 與側邊欄來源標註。
 */

export interface SourceItem {
  label: string;
  href: string;
  note?: string;
}

export const sources: SourceItem[] = [
  {
    label: "高雄旅遊網－愛河",
    href: "https://khh.travel/zh-tw/attractions/detail/232",
    note: "高雄市政府官方旅遊資訊，景點定位與開放說明。",
  },
  {
    label: "高雄旅遊網－愛河之心",
    href: "https://khh.travel/zh-tw/attractions/detail/19",
    note: "愛河之心（雙湖生態水岸）官方介紹。",
  },
  {
    label: "高雄市輪船股份有限公司",
    href: "https://kcs.kcg.gov.tw/",
    note: "愛之船航班、票價與停航公告。",
  },
  {
    label: "高雄捷運公司",
    href: "https://www.krtc.com.tw/",
    note: "捷運與輕軌路線、車站與轉乘資訊。",
  },
  {
    label: "高雄流行音樂中心",
    href: "https://kpmc.com.tw/",
    note: "愛河灣場館節目與開放時間。",
  },
  {
    label: "駁二藝術特區",
    href: "https://pier2.org/",
    note: "倉庫群展覽與戶外藝術開放資訊。",
  },
  {
    label: "台灣交通部觀光署",
    href: "https://www.taiwan.net.tw/",
    note: "國家級旅遊資訊與交通指引。",
  },
  {
    label: "Google Maps－Love River 愛河",
    href: "https://maps.app.goo.gl/SwMZaznF1f4iXwAz9",
    note: "地點位置、營業狀態與使用者評分（本站評分來源）。",
  },
];

/** 動態資訊（船班、活動、交通）應顯示的最後查核日期。 */
export const lastVerifiedAt = "2026-09-13";
export const lastVerifiedLabel = "2026 年 9 月 13 日";
