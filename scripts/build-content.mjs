#!/usr/bin/env node
/**
 * build-content.mjs — 內容編譯器（Content Compiler）
 *
 * 單一真相來源：`content/site/{zh,en}/*.md` + 根目錄 `site.json`。
 * 這個腳本在 `pnpm run build` / `pnpm run dev` 之前自動執行（prebuild），
 * 把 Markdown（含 YAML frontmatter）編譯成 React 直接 import 的
 * `client/src/content.generated.ts`，並把 `content/images/` 同步到
 * `client/public/images/`。
 *
 * 使用者工作流：
 *   1. 在 GitHub 網頁上編輯 content/site/zh/*.md（或 en）→ Commit
 *   2. 上傳圖片到 content/images/（例如 portrait.jpg）
 *   3. Cloudflare Workers Builds 自動重新 build + 部署，網站即更新
 *
 * 支援的 Markdown 語法（內文）：段落、**粗體**、*斜體*、[連結](url)、- 清單。
 * 結構化資料（時間軸、著作、卡片等）寫在 frontmatter，用 YAML 列表。
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_JSON = path.join(ROOT, "site.json");
const CONTENT_DIR = path.join(ROOT, "content", "site");
const IMAGES_SRC = path.join(ROOT, "content", "images");
const IMAGES_DEST = path.join(ROOT, "client", "public", "images");
const OUT_TS = path.join(ROOT, "client", "src", "content.generated.ts");
const INDEX_HTML = path.join(ROOT, "client", "index.html");

const SECTIONS = ["hero", "home", "biography", "expertise", "publications", "teaching", "talks", "connect"];

/** 每個 section 必備的 frontmatter 欄位（少了就直接報錯，避免上線才發現） */
const REQUIRED = {
  hero: ["eyebrow", "title", "titleEm", "exploreLabel", "explorePath", "meetLabel", "meetPath", "photoLabel", "photoNote"],
  home: ["tag", "title", "links"],
  biography: ["tag", "title", "quote", "quoteBy", "timelineTitle", "timelineNote", "timeline", "photoLabel", "photoNote"],
  expertise: ["tag", "title", "capabilities"],
  publications: ["tag", "title", "publications", "achievementTitle", "achievements"],
  teaching: ["tag", "title", "cards"],
  talks: ["tag", "title", "talks"],
  connect: ["tag", "title", "buttonLabel", "formTitle", "formName", "formEmail", "formMessage", "formSubmit", "formSending", "formSuccess", "formFallback", "formError"],
};

function fail(msg) {
  console.error(`\x1b[31m[content]\x1b[0m ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`\x1b[32m[content]\x1b[0m ${msg}`);
}

function parseMd(filePath) {
  const text = readFileSync(filePath, "utf8");
  if (!text.startsWith("---")) fail(`缺少 frontmatter：${path.relative(ROOT, filePath)}`);
  const end = text.indexOf("---", 3);
  if (end === -1) fail(`frontmatter 未閉合：${path.relative(ROOT, filePath)}`);
  let data;
  try {
    data = YAML.parse(text.slice(3, end)) || {};
  } catch (e) {
    fail(`YAML 解析失敗 ${path.relative(ROOT, filePath)}：${e.message}`);
  }
  return { data, body: text.slice(end + 3).trim() };
}

/* ---------- 極簡 Markdown → HTML（段落 / 粗體 / 斜體 / 連結 / 清單） ---------- */
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function inline(s) {
  let h = esc(s);
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  return h;
}
function mdToHtml(body) {
  if (!body) return "";
  const blocks = [];
  let para = [];
  let list = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push(`<p>${para.map(inline).join("<br>")}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`);
      list = [];
    }
  };
  for (const line of body.split("\n")) {
    if (/^\s*$/.test(line)) {
      flushPara();
      flushList();
      continue;
    }
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) {
      flushPara();
      list.push(m[1]);
      continue;
    }
    if (list.length) flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks.join("\n");
}

/* ---------- 主流程 ---------- */
const site = JSON.parse(readFileSync(SITE_JSON, "utf8"));
const languages = site.languages || ["zh", "en"];
if (!site.chrome || !site.contact) fail("site.json 缺少 chrome 或 contact 區段");

const content = {};
for (const lang of languages) {
  const langDir = path.join(CONTENT_DIR, lang);
  if (!existsSync(langDir)) fail(`缺少語言目錄：content/site/${lang}/`);
  const sections = {};
  for (const name of SECTIONS) {
    const filePath = path.join(langDir, `${name}.md`);
    if (!existsSync(filePath)) fail(`缺少內容檔：content/site/${lang}/${name}.md`);
    const { data, body } = parseMd(filePath);
    for (const key of REQUIRED[name] || []) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        fail(`content/site/${lang}/${name}.md 缺少 frontmatter 欄位：${key}`);
      }
    }
    // 圖片路徑檢查：portrait 若有填，檔案必須真的存在，否則上線會破圖
    for (const imgKey of ["portrait"]) {
      const rel = data[imgKey];
      if (rel) {
        const disk = path.join(IMAGES_SRC, path.basename(rel));
        if (!existsSync(disk)) {
          fail(`content/site/${lang}/${name}.md 的 ${imgKey} 指向 ${rel}，但 content/images/${path.basename(rel)} 不存在`);
        }
        data[imgKey] = `/images/${path.basename(rel)}`;
      }
    }
    sections[name] = { ...data, bodyHtml: mdToHtml(body) };
  }
  content[lang] = {
    chrome: site.chrome[lang] || fail(`site.json 缺少 chrome.${lang}`),
    contact: {
      email: site.contact.email,
      officeHours: site.contact.officeHours?.[lang] || "",
      affiliation: site.contact.affiliation?.[lang] || "",
    },
    ...sections,
  };
}

/* ---------- 圖片同步：content/images → client/public/images ---------- */
if (existsSync(IMAGES_SRC)) {
  rmSync(IMAGES_DEST, { recursive: true, force: true });
  mkdirSync(IMAGES_DEST, { recursive: true });
  for (const f of readdirSync(IMAGES_SRC)) {
    if (f.endsWith(".md") || f.startsWith(".")) continue;
    cpSync(path.join(IMAGES_SRC, f), path.join(IMAGES_DEST, f));
  }
  ok(`圖片已同步：content/images/ → client/public/images/`);
} else {
  mkdirSync(IMAGES_SRC, { recursive: true });
}

/* ---------- index.html：標題 / 描述跟著 site.json 走 ---------- */
if (existsSync(INDEX_HTML)) {
  let html = readFileSync(INDEX_HTML, "utf8");
  const next = html
    .replace(/<title>.*?<\/title>/, `<title>${esc(site.name)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(site.description)}" />`);
  const withDesc = next.includes('name="description"')
    ? next
    : next.replace("</head>", `  <meta name="description" content="${esc(site.description)}" />\n</head>`);
  if (withDesc !== html) {
    writeFileSync(INDEX_HTML, withDesc);
    ok("index.html 標題 / 描述已同步 site.json");
  }
}

/* ---------- 輸出 TypeScript 模組 ---------- */
const ts = `/**
 * 由 scripts/build-content.mjs 自動產生，請勿手動編輯。
 * 內容來源：content/site/{zh,en}/*.md ＋ site.json
 * 重新產生：pnpm run content
 */
import type { SiteContent, SiteMeta } from "./content";

export const siteMeta: SiteMeta = ${JSON.stringify(
  {
    name: site.name,
    shortName: site.shortName,
    description: site.description,
    defaultLanguage: site.defaultLanguage,
    languages,
    author: site.author,
    baseUrl: site.baseUrl,
    theme: site.theme,
    routes: site.routes,
  },
  null,
  2,
)};

export const content: Record<string, SiteContent> = ${JSON.stringify(content, null, 2)};
`;
mkdirSync(path.dirname(OUT_TS), { recursive: true });
writeFileSync(OUT_TS, ts);
ok(`內容編譯完成：${SECTIONS.length} 個區塊 × ${languages.length} 語言 → client/src/content.generated.ts`);
