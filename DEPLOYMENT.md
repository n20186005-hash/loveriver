# Cloudflare Workers 上線設定

本站部署在 Cloudflare Workers。內容頁在建置時預先產生為靜態資源，只有需要即時資料的模組（即時氣象與 7 日預報）在請求時於 Workers 上算繪，並寫入邊緣快取。沒有資料庫、會員、環境變數或任何金鑰需求。

## 環境需求

- Node.js：22.12 以上
- pnpm：10
- wrangler：4（已列為開發相依，透過 `pnpm exec wrangler` 執行）

## 建置與部署

```bash
pnpm install
pnpm build            # astro check && astro build
pnpm exec wrangler deploy
```

或直接：

```bash
pnpm deploy           # 等同 pnpm build && wrangler deploy
```

首次部署前需先登入：`pnpm exec wrangler login`。

建置產物結構：

| 路徑 | 內容 |
| --- | --- |
| `dist/client` | 預先產生的靜態頁面與資源（138 個檔案），以 `env.ASSETS` 提供 |
| `dist/server` | Workers 進入點 `entry.mjs` 與算繪用 chunks |
| `dist/server/wrangler.json` | 由建置流程產生的實際部署設定 |
| `.wrangler/deploy/config.json` | 讓根目錄的 `wrangler deploy` 指向上面那份設定 |

`wrangler.jsonc` 的 `assets.directory` 寫 `./dist` 是給建置流程用的來源設定，實際部署時會被改寫為指向 `dist/client`，不需手動調整。

## wrangler.jsonc 關鍵欄位

| 欄位 | 說明 |
| --- | --- |
| `main` | `@astrojs/cloudflare/entrypoints/server`，由適配器提供 |
| `assets.directory` | 靜態資源來源，建置時改寫為 `dist/client` |
| `assets.binding` | `ASSETS`，供伺服器端讀取靜態資源 |
| `compatibility_flags` | `nodejs_compat`，Astro 執行期需要 |
| `observability` | 開啟 Workers Logs，便於追蹤伺服器端錯誤 |

`astro.config.mjs` 設定了 `session: false`：本站沒有工作階段需求，因此不需要建立 KV 命名空間，也不需要任何額外綁定。部署時唯一的綁定是 `env.ASSETS`。

## 本機開發與預覽

```bash
pnpm dev        # astro dev，於本機模擬 Workers 執行環境
pnpm preview    # wrangler dev，以實際 Workers 執行期啟動
```

即時氣象模組在 `astro dev` 下會直接向外部取得資料；在 Workers 執行環境中則優先使用邊緣快取。

## 快取與標頭

- `public/_headers`：全站安全標頭與快取策略；建置時適配器會再注入 `/_astro/*` 的不可變快取。
- 氣象模組回應：`max-age=300, s-maxage=900, stale-while-revalidate=1800`，並另外寫入 15 分鐘的邊緣快取，避免每個訪客都觸發外部請求。
- 上游取數逾時或失敗時，會退回最近一次成功的快取結果；完全取不到資料時只顯示替代訊息，不影響其他區塊。

## 網域與 www 整併

正式網域只有一個：`https://loveriver.org/`。`www` 與根網域若同時可存取，會產生重複內容與權重分散（Search Console 的「網頁」報表會同時出現 `loveriver.org/...` 與 `www.loveriver.org/...`）。因此採三層防線：

1. **DNS 與 Custom Domain**：在 Workers 專案的 Settings → Domains & Routes 加入 `loveriver.org` 作為 Custom Domain，並為 `www` 建立已代理（proxied）的 DNS 記錄。
2. **301 轉址（主要修正）**：將 `www` 永久轉到根網域。二選一：
   - **Redirect Rule（建議，單次跳轉）**：Rules → Redirect Rules，條件 `Hostname equals www.loveriver.org`，動作 `Static` 導向 `https://loveriver.org`，勾選 Preserve query string，狀態碼 `301`。
   - **Bulk Redirect**：Source URL `www.loveriver.org`、Target URL `https://loveriver.org`、Status `301`，開啟 Preserve query string、Subpath matching 與 Preserve path suffix。
   - 兩者都會保留路徑與查詢字串，`https://www.loveriver.org/transport/` 會 301 導到 `https://loveriver.org/transport/`。
3. **Canonical 保底**：`BaseLayout.astro` 以 `Astro.site`（`https://loveriver.org`）產生 canonical，所有頁面即使被 `www`、`*.workers.dev` 或其他網域存取，canonical 一律指向根網域，作為轉址未生效時的備援訊號。

`_redirects` 不支援網域層級（host）比對，只比對路徑，因此專案內不放無效的 `www` 轉址規則；host 層級的 301 必須在 Cloudflare 儀表板設定。設定方式參考：
https://developers.cloudflare.com/pages/how-to/www-redirect/

### Search Console 設定

1. 於 Search Console 建立 **網域資源（Domain property）**，加入 `loveriver.org`，一次涵蓋 http/https 與 www／非 www 的所有組合。
2. 既有網址前置字元資源（`https://loveriver.org/`）可保留，但以網域資源的數據為準。
3. 部署後用「網址審查」測試 `https://www.loveriver.org/transport/`，確認回傳 `301` 且最終 URL 為根網域版本。
4. 於「Sitemaps」提交 `https://loveriver.org/sitemap-index.xml`。

### 多語系與 hreflang

- 中文（`zh-Hant-TW`）與英文（`en`）對應頁面由 `[...slug].astro` 以同一份內容 ID 推導，只有存在對應譯頁時才輸出 `hreflang`，並附上 `x-default`（指向中文頁）。
- 目前英文頁為 `/en/`、`/en/transport/`、`/en/boats/cruise-comparison/`；新增英文頁時，只要放在 `src/content/pages/en/` 底下並與中文頁路徑同名，即會自動產生雙向 `hreflang`。
- `hreflang` 不會取代 canonical；`hreflang` 用於語言分眾，canonical 仍指向各語言自己的網址。
- 想要取得跨語言搜尋曝光時，兩個語言版本都必須是可直接存取的 200 頁面，不能以轉址或 JS 切換取代。

## Cloudflare Web Analytics

在 Workers 專案的 Metrics 頁面啟用 Web Analytics，Cloudflare 會在下一次部署自動注入，不需設定環境變數：
https://developers.cloudflare.com/web-analytics/get-started/

## 上線後檢查

1. 確認 `https://loveriver.org/` 為唯一正式網域。
2. 以 `curl -I https://www.loveriver.org/transport/` 確認回傳 `301` 且 `Location` 為 `https://loveriver.org/transport/`；`www` 任一子路徑都應保留原路徑。
3. 開啟首頁，確認即時氣象區塊在天氣骨架之後正常替換為實際內容。
4. 檢查 `/_server-islands/` 的回應標頭帶有預期的快取時間。
5. 將 `https://loveriver.org/sitemap-index.xml` 提交至 Google Search Console，並建立網域資源。
6. 驗證 `robots.txt`、canonical、Open Graph 圖片與結構化資料；用 Rich Results Test 確認 `TouristAttraction` 與 `FAQPage` 能被辨識（Search Console 的「搜尋外觀」需數日才會反映）。
7. 以檢視原始碼確認 `/` 與 `/en/` 互相輸出 `hreflang` 與 `x-default`，且中英文頁 canonical 各自指向自己的網址。
8. 用 PageSpeed Insights 檢查行動版；本站圖片已輸出 WebP／AVIF 並使用延遲載入，若分數偏低優先檢查第三方腳本與伺服器回應時間。
9. 遊船、活動、交通與設施資料依頁面核實週期更新。
