# 圖片目錄

把圖片**上傳到這個資料夾**，網站就會在下次部署時自動更新。

## 個人照片

1. 在 GitHub 網頁上按 `Add file` → `Upload files`，把照片拖進 `content/images/`。
   建議尺寸：**800 × 1000 px**（直式），檔名取為 `portrait.jpg`（JPG／PNG／WebP 皆可）。
2. 打開 `content/site/zh/hero.md`（中文）與 `content/site/en/hero.md`（英文），
   把 frontmatter 裡的 `portrait: ""` 改成 `portrait: "portrait.jpg"`。
   「我的故事」頁用的是 `content/site/{zh,en}/biography.md` 裡的 `portrait`，同樣改法。
3. Commit → Cloudflare 會自動重新 build 並部署，照片即上線。
   `portrait` 留空時，網站會繼續顯示原本的佔位圖，不會破圖。

## 其他圖片

任何放在這裡的圖片都會被同步到網站的 `/images/` 路徑下。
例如上傳 `lab.jpg`，就可以在 Markdown 內文裡用 `![說明](/images/lab.jpg)` 引用。
檔名請用英文、數字、連字號，避免中文與空白。
