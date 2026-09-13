import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    type: z.enum(["guide", "place", "route", "boat", "utility"]).default("guide"),
    keywords: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    station: z.string().optional(),
    duration: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    sourceLabel: z.string().optional(),
    sourceUrl: z.url().optional(),
    /**
     * 該景點自己在 Google Maps 上的使用者評分（非本站評分）。
     * 有填才會在頁面顯示評分卡並註明來源；沒有自填的愛河主體頁沿用全站愛河評分。
     */
    rating: z
      .object({
        value: z.number().min(0).max(5),
        reviewCount: z.number().int().nonnegative(),
        /** 受評分的主體名稱；未填時依序取 sourceLabel、頁面標題 */
        subject: z.string().optional(),
        /** Google Maps 地點連結；未填時以主體名稱產生 Google Maps 搜尋連結 */
        sourceUrl: z.url().optional(),
        /** 實際查核日期（YYYY-MM-DD）：動態資料一律要能標註查核時間 */
        verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "查核日期需為 YYYY-MM-DD"),
      })
      .optional(),
    /**
     * 頁面專屬問答。有填才會輸出「常見問題」區塊與 FAQPage 結構化資料，
     * 用來對應 Search Console 裡排名好但沒有點擊的長尾問句型查詢。
     */
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { pages };
