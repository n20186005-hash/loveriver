import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://loveriver.org",
  trailingSlash: "always",
  compressHTML: true,
  // 內容頁全部預先產生，僅氣象等即時模組在請求時於伺服器端算繪。
  output: "static",
  integrations: [mdx(), sitemap()],
  // 靜態頁維持預先產生；需要即時資料的模組（如氣象）改為請求時在伺服器端算繪。
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "directory",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
