# 內容撰寫指南（給網站擁有者）

網站上的**每一個字**都來自 `content/site/` 裡的 Markdown 檔。設計（版面、顏色、字體）完全不用動，改這裡就好。

## 檔案一覽

| 檔案 | 對應頁面 |
| --- | --- |
| `hero.md` | 首頁頂部大標＋個人照片 |
| `home.md` | 首頁中段引言＋三個連結 |
| `biography.md` | 我的故事（引言、名言、學術時間軸） |
| `expertise.md` | 研究專長（能力清單） |
| `publications.md` | 論文成就（著作卡片＋榮譽列表） |
| `teaching.md` | 教學指導（三張卡片） |
| `talks.md` | 演講交流（演講列表） |
| `connect.md` | 聯絡我（引言＋表單文案） |

每個檔案都有 `zh`（中文）和 `en`（英文）兩個版本，放在 `content/site/zh/` 和 `content/site/en/`。

## 寫作格式

每個檔案分成兩部分：

```markdown
---
title: "我研究那些\n容易被忽略的痕跡。"   # ← frontmatter：標題、標籤、列表等結構化資料
tag: 首頁 / WANG XIAOMIN
links:
  - label: 我的故事
    path: /biography
---

這裡是內文，用 Markdown 寫。          # ← body：段落文字，支援 **粗體**、*斜體*、
                                       #    [連結文字](https://...)、- 清單
```

- `---` 上下包住的是 **frontmatter**（YAML）：標題、按鈕文字、時間軸、著作列表都寫在這裡。**每個檔案必填的欄位如果缺了，build 會直接報錯告訴你是缺哪個**，不會默默上線壞掉的網站。
- `---` 下面的是**內文**：一般段落。空一行分段；同一段內換行會轉成 `<br>`。
- 標題裡的 `\n` 表示手動換行（設計上大標題會斷成兩行）。

## 常用欄位速查

- `portrait: "portrait.jpg"` — 個人照片檔名（檔案要先上傳到 `content/images/`）。留空 `""` 顯示佔位圖。
- `timeline:` — 學術時間軸，每筆 `year`／`title`／`detail`。
- `publications:` — 著作，每筆 `type`（如「專書 · 2023」）／`title`／`detail`。
- `capabilities:`／`talks:`／`cards:` — 標題＋說明的列表，每筆 `title`／`detail`（teaching 的卡片多一個 `kicker` 小標）。
- `achievements:` — 純文字列表，一行一條。
- `connect.md` 的 `form*` 欄位是表單的標籤文字（姓名、送出、成功訊息等）。

## 全站設定（site.json）

網站名稱、瀏覽器分頁標題、導覽列 7 個按鈕的中英文、頁尾、聯絡信箱、辦公時間、所屬單位，都在根目錄的 `site.json`：

- `name` — 網站名稱（同時是瀏覽器分頁標題）
- `chrome.zh.nav`／`chrome.en.nav` — 導覽列按鈕文字（順序對應 `routes`）
- `contact.email`、`contact.officeHours`、`contact.affiliation` — 聯絡資訊（中英分開）

## 圖片

見 `content/images/README.md`：上傳圖片到 `content/images/`，在 Markdown 裡用檔名引用，build 會自動同步到網站的 `/images/` 路徑。

## 檢查清單（交給客戶前）

- [ ] 16 個 Markdown 檔的中英文都填完（不要留「銀河大學」這種示範文字）
- [ ] `portrait` 已上傳真實照片
- [ ] `site.json` 的信箱、單位、網站名稱已換成客戶的
- [ ] 聯絡表單的 Resend 環境變數已設定（見 README）
- [ ] 用手機＋電腦各看一次，確認中文標題沒有重疊、文字沒有被背景蓋掉
