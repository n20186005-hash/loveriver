/**
 * 常見問題（FAQ）。
 * 同一份資料同時用於：
 *  1. 頁面上的 FAQ 區塊（FaqSection.astro，首頁）
 *  2. FAQPage 結構化資料（/faq/ 頁與首頁）
 * 問答文字與 /faq/ 頁面內容保持一致，避免結構化資料與可見內容不符。
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "愛河要門票嗎？",
    answer: "河岸步道本身不需要門票，可以自由散步。遊船、展館、特展與部分活動則各自售票。",
  },
  {
    question: "愛河哪一站下車？",
    answer:
      "去愛之船國賓站周邊，選捷運 O4 前金站或 O2 鹽埕埔站；去愛河灣，選輕軌 C10 光榮碼頭、C11 真愛碼頭或 C12 駁二大義；去愛河之心則是 C24。",
  },
  {
    question: "愛河、愛河灣、愛河之心一樣嗎？",
    answer:
      "不一樣。愛河市區段是經典遊船區；愛河灣是接近出海口的港灣景觀；愛河之心位於北邊中上游，是雙湖生態水岸。",
  },
  {
    question: "白天還是晚上比較好？",
    answer:
      "第一次來建議日落前抵達，一次看白天、夕陽和夜景。只想散步與拍燈光，晚間即可；想認路或帶小孩，保留一些天亮時間更輕鬆。",
  },
  {
    question: "愛之船與貢多拉怎麼選？",
    answer:
      "想聽導覽、辨認沿岸地標，選愛之船；想要小船、划行與歌唱氣氛，選貢多拉。兩者常見航程約 25 分鐘，但售票與營運仍以當日公告為準。",
  },
  {
    question: "下雨會開船嗎？",
    answer:
      "不一定。天候、水位、風勢與水域活動都可能影響營運。不要只看一般營業時間，出發當天仍要查看營運單位公告。",
  },
  {
    question: "愛河晚上安全嗎？",
    answer:
      "主要景觀段晚間通常有人潮與照明，但仍屬開放水岸。請走主要步道、照顧隨行孩童、不要跨越護欄，偏僻或照明不足處不單獨久留。",
  },
  {
    question: "建議停留多久？",
    answer:
      "只走市區段約 1.5 至 2 小時；加上遊船與愛河灣，安排半天較舒服；若再接駁二與大港橋，可排一整天。",
  },
];

/** 產生 FAQPage 結構化資料。 */
export function buildFaqSchema(items: FaqItem[] = faqItems): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
