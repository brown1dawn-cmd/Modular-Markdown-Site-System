# Modular Markdown Site System

一個雙語（中文／英文）個人網站框架：**內容只寫 Markdown，網站自動長出來。**

使用者（例如教授）在 GitHub 網頁上編輯 `content/site/` 裡的 Markdown 檔、把照片上傳到 `content/images/`，按下 Commit，Cloudflare 就會自動重新 build 並部署——全程不需要碰程式碼。

展示站：https://modular-markdown-site-system.brown1dawn.workers.dev/（虛構歷史學者「王曉民」示範內容）

## 運作原理

```
content/site/{zh,en}/*.md   ← 唯一內容來源（Markdown＋YAML frontmatter）
content/images/*             ← 上傳的圖片
site.json                    ← 網站名稱、導覽列、聯絡資訊
        │  pnpm run build 前自動執行
        ▼
scripts/build-content.mjs    ← 編譯器：MD → client/src/content.generated.ts
        │                      圖片同步到 client/public/images/
        ▼
Vite + React                 ← 讀取編譯產物，輸出靜態站
        ▼
Cloudflare Workers           ← 純靜態資源託管（SPA fallback）
```

**單一管線**：只有 `pnpm run build` 一條路徑，沒有第二套 renderer 會漂移。

## 使用者工作流（給教授／客戶看的版本）

1. **改文字**：在 GitHub 上打開 `content/site/zh/`（中文）或 `content/site/en/`（英文），點檔案、按鉛筆圖示編輯、Commit。內文用 Markdown（段落、**粗體**、*斜體*、[連結](url)、- 清單）；標題、時間軸、著作等結構化資料寫在檔案上方的 frontmatter（YAML），欄位說明見 `FORMAT.md`。
2. **換照片**：把照片拖進 `content/images/`（建議 800×1000 px，取名 `portrait.jpg`），再到 `hero.md`／`biography.md` 把 `portrait: ""` 改成 `portrait: "portrait.jpg"`。詳細步驟見 `content/images/README.md`。
3. **等部署**：Cloudflare Workers Builds 偵測到 push 會自動 `pnpm run build`＋部署，約一分鐘後上線。

> 編譯器會做基本檢查：缺檔案、缺 frontmatter 欄位、`portrait` 指向不存在的圖片，build 會直接報錯，不會讓破圖上線。

## 本地開發

```bash
pnpm install
pnpm run dev        # 先編譯內容，再起 Vite dev server（http://localhost:3000）
pnpm run build      # 內容編譯＋正式建置 → dist/public
pnpm run check      # TypeScript 型別檢查
pnpm run deploy     # 建置＋部署到 Cloudflare Workers
```

## 聯絡我

「聯絡我」頁沒有表單，只有一顆「寫信給我」按鈕（`mailto:`，點了會開啟訪客的郵件軟體）＋直接顯示的信箱地址。信箱地址在 `site.json` 的 `contact.email`，換人使用時改那裡即可。

## Cloudflare Workers Builds 設定

沿用原本的兩段式設定即可：

| Setting | Value |
| --- | --- |
| Build command | `pnpm run build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Preview command | `pnpm exec wrangler preview` |
| Root directory | repository root（空白） |

`prebuild` 會在 `pnpm run build` 之前自動把 Markdown 編譯好，不需要額外步驟。

## 專案結構

```
content/site/{zh,en}/   8 個內容區塊的 Markdown（hero、home、biography、expertise、
                        publications、teaching、talks、connect）
content/images/         上傳的圖片（同步到網站 /images/）
site.json               網站名稱、雙語導覽列、聯絡資訊
scripts/build-content.mjs  內容編譯器（prebuild 自動執行）
client/src/
  pages/Home.tsx        唯一頁面：7 個路由的版面（設計層，只讀內容，不寫文案）
  content.ts            內容模型的 TypeScript 型別
  content.generated.ts  編譯器產物（git 不追蹤，每次 build 重新產生）
wrangler.jsonc          Worker 名稱、靜態資源目錄、SPA fallback
```

## 注意事項

- `content.generated.ts` 是編譯產物，不要手動改，改了下次 build 會被覆蓋。
- 換一間客戶使用時，改 `site.json`（網站名、導覽列、信箱）＋重寫 `content/site/` 的 16 個 Markdown 檔即可，設計層完全不用動。
- 中文標題的行高有特別處理（`html:lang(zh)` 覆寫），改字級時注意 CJK 需要比拉丁字母寬鬆的行高。
