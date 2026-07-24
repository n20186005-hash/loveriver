# Cloudflare Pages 上線設定

本專案是純靜態 Astro 網站，不需要 Pages Functions、資料庫、登入或預訂後端。

## Pages 建置

- Production branch：`main`
- Build command：`pnpm build`
- Build output directory：`dist`
- Node.js：22.12 以上
- Package manager：pnpm 10

也可在已登入 Wrangler 的環境執行：

```bash
pnpm deploy
```

## 網域

1. 將 `loveriver.org` 加入 Pages 專案的 Custom domains。
2. 將 `www` 轉到根網域時，使用 Cloudflare Bulk Redirect：
   - Source URL：`www.loveriver.org`
   - Target URL：`https://loveriver.org`
   - Status：`301`
   - 開啟 Preserve query string、Subpath matching 與 Preserve path suffix。
3. 為 `www` 建立已代理的 DNS 記錄。

Cloudflare Pages 的 `_redirects` 不支援網域層級比對，因此專案內不放無效的 `www` 轉址規則。設定方式參考：
https://developers.cloudflare.com/pages/how-to/www-redirect/

## Cloudflare Web Analytics

建議在 Pages 專案的 Metrics 頁面直接啟用 Web Analytics；Cloudflare 會在下一次部署自動注入，不需設定環境變數：
https://developers.cloudflare.com/web-analytics/get-started/

## SEO 上線檢查

1. 確認 `https://loveriver.org/` 為唯一正式網域。
2. 將 `https://loveriver.org/sitemap-index.xml` 提交至 Google Search Console。
3. 驗證 `robots.txt`、canonical、Open Graph 圖片與結構化資料。
4. 啟用 HTTPS 後再檢查 `www`、`*.pages.dev` 與根網域是否產生重複內容。
5. 遊船、活動與交通資料依頁面核實週期更新。
