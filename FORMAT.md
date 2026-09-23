# Content and format guide

This project treats Markdown files as a small, readable content database. Templates define presentation; page definitions connect templates to content regions.

## Add a page

Create a file under `content/pages/`, for example `journal.md`. Add YAML frontmatter with `slug`, bilingual `title` and `description`, a `template`, `order`, `visible`, and a `regions` map. The key in `regions` must match a `<!-- region:name -->` placeholder in the selected template.

```markdown
---
slug: journal
title:
  zh: 文章
  en: Journal
description:
  zh: 內容更新
  en: Content updates
template: default
order: 6
visible: true
regions:
  main: journal-intro
---

Optional page-specific notes.
```

## Add a content block

Create matching files at `content/sections/zh/journal-intro.md` and `content/sections/en/journal-intro.md`. Use standard Markdown. HTML is also allowed when a component needs a controlled class, such as the feature and work card examples.

## Add a template

Add an HTML file under `templates/`. Keep all templates presentation-only and mark replaceable regions with the exact pair below:

```html
<!-- region:main -->
<!-- endregion -->
```

The builder replaces the full pair with rendered Markdown. Available tokens include `{{site_name}}`, `{{page_title}}`, `{{page_description}}`, `{{lang}}`, `{{canonical}}`, `{{nav}}`, `{{lang_url}}`, `{{lang_label}}`, `{{year}}`, and `{{region:name}}`.

## Build and deploy

Run `pip install -r scripts/requirements.txt`, then `python scripts/build.py --clean --output dist`. The output contains `dist/zh/`, `dist/en/`, `dist/pages.json`, copied assets, and a root redirect. Cloudflare Pages can use `dist` as the output directory. The included GitHub Actions workflow validates the same build on every push.
