#!/usr/bin/env python3
"""Build the multilingual Modular Markdown Site System into standard static HTML."""
from __future__ import annotations
import argparse
import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any

import markdown
import yaml

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ["zh", "en"]


def read_frontmatter(path: Path) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}, text
    _, frontmatter, body = text.split("---", 2)
    return yaml.safe_load(frontmatter) or {}, body.strip()


def render_md(text: str) -> str:
    return markdown.markdown(text, extensions=["extra", "sane_lists", "tables"])


def load_pages() -> list[dict[str, Any]]:
    pages = []
    for path in sorted((ROOT / "content/pages").glob("*.md")):
        meta, body = read_frontmatter(path)
        if not meta:
            raise ValueError(f"Missing frontmatter in {path}")
        meta["source"] = path.name
        meta["notes"] = body
        meta["order"] = int(meta.get("order", 999))
        meta["visible"] = bool(meta.get("visible", True))
        pages.append(meta)
    return sorted(pages, key=lambda page: page["order"])


def section_html(lang: str, key: str, cache: dict[tuple[str, str], str]) -> str:
    cache_key = (lang, key)
    if cache_key in cache:
        return cache[cache_key]
    path = ROOT / "content/sections" / lang / f"{key}.md"
    if not path.exists():
        raise FileNotFoundError(f"Missing section for {lang}: {path}")
    _, body = read_frontmatter(path)
    cache[cache_key] = render_md(body)
    return cache[cache_key]


def nav_html(pages: list[dict[str, Any]], lang: str, current: str) -> str:
    links = []
    for page in pages:
        if not page.get("visible", True):
            continue
        slug = page["slug"]
        label = page["title"][lang]
        active = " aria-current=\"page\" class=\"is-active\"" if slug == current else ""
        links.append(f'<a href="/{lang}/{slug}.html"{active}>{label}</a>')
    return "".join(links)


def replace_regions(template: str, page: dict[str, Any], lang: str, cache: dict[tuple[str, str], str]) -> str:
    regions = page.get("regions", {})
    def repl(match: re.Match[str]) -> str:
        name = match.group(1)
        key = regions.get(name)
        if not key:
            return ""
        return section_html(lang, key, cache)
    pattern = re.compile(r"<!-- region:([\w-]+) -->.*?<!-- endregion -->", re.DOTALL)
    return pattern.sub(repl, template)


def build(output: Path, clean: bool) -> list[dict[str, Any]]:
    if clean and output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / "assets", output / "assets", dirs_exist_ok=True)
    pages = load_pages()
    site = json.loads((ROOT / "site.json").read_text(encoding="utf-8"))
    cache: dict[tuple[str, str], str] = {}
    manifest = []
    for lang in LANGUAGES:
        lang_dir = output / lang
        lang_dir.mkdir(exist_ok=True)
        for page in pages:
            slug = page["slug"]
            template_name = f'{page.get("template", "default")}.html'
            template_path = ROOT / "templates" / template_name
            if not template_path.exists():
                raise FileNotFoundError(f"Missing template: {template_path}")
            template = template_path.read_text(encoding="utf-8")
            body = replace_regions(template, page, lang, cache)
            other_lang = "en" if lang == "zh" else "zh"
            values = {
                "site_name": site["name"],
                "page_title": page["title"][lang],
                "page_description": page["description"][lang],
                "template": page.get("template", "default"),
                "lang": lang,
                "canonical": f'{site["baseUrl"]}/{lang}/{slug}.html',
                "lang_url": f'/{other_lang}/{slug}.html',
                "lang_label": "EN" if lang == "zh" else "中文",
                "footer_line": "內容是基礎設施。" if lang == "zh" else "Content is infrastructure.",
                "year": str(datetime.now().year),
                "page_number": str(page.get("order", "" )).zfill(2),
                "nav": nav_html(pages, lang, slug),
                "body": body,
            }
            for key, value in values.items():
                body = body.replace("{{" + key + "}}", str(value))
            # page body is inserted after region replacement, then shell tokens are filled.
            html = template
            html = replace_regions(html, page, lang, cache)
            for key, value in values.items():
                html = html.replace("{{" + key + "}}", str(value))
            (lang_dir / f"{slug}.html").write_text(html, encoding="utf-8")
            manifest.append({
                "slug": slug, "lang": lang, "title": page["title"][lang],
                "description": page["description"][lang], "template": page.get("template", "default"),
                "url": f"/{lang}/{slug}.html", "order": page.get("order", 999),
            })
    (output / "index.html").write_text("""<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/zh/"><link rel="canonical" href="/zh/index.html"><title>Modular Markdown Site System</title><a href="/zh/index.html">Open the site</a>""", encoding="utf-8")
    (output / "pages.json").write_text(json.dumps({"generatedAt": datetime.now().isoformat(), "pages": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "pages.json").write_text(json.dumps({"generatedAt": datetime.now().isoformat(), "pages": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    parser.add_argument("--clean", action="store_true")
    args = parser.parse_args()
    manifest = build(args.output, args.clean)
    print(f"Built {len(manifest)} localized pages to {args.output}")


if __name__ == "__main__":
    main()
