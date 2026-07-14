# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Full production build (see pipeline below)
pnpm preview      # Preview the production build locally
```

- `pnpm` is the package manager (not npm or yarn).
- The `build` script runs 5 steps sequentially:
  1. `vue-tsc` — type-check the entire project (build fails on type errors)
  2. `node scripts/update-timestamps.mjs` — update JSON-LD `dateModified` and sitemap `<lastmod>` to current date
  3. `vite build` — bundle for production
  4. `node scripts/generate-error-pages.mjs` — generate static error pages into `dist/`
  5. `node scripts/generate-compressed.mjs` — generate `.br` and `.gz` pre-compressed copies of all files in `dist/`
- TypeScript is configured in strict mode with `noUnusedLocals` and `noUnusedParameters`.

## Scripts

All build-time scripts live in `scripts/`. They are plain Node.js ESM (`.mjs` / `.js`).

| Script | Purpose | When it runs |
|---|---|---|
| `update-timestamps.mjs` | Replaces `dateModified` in JSON-LD (all HTML entry points) and `<lastmod>` in `public/sitemap.xml` | Before `vite build` |
| `generate-error-pages.mjs` | Generates 16 static error HTML pages into `dist/` (400/401/403/404/405/408/410/413/414/429/431/500/502/503/504 + `error.html` fallback) | After `vite build` |
| `generate-compressed.mjs` | Generates `.br` (Brotli) and `.gz` (gzip) pre-compressed copies for Nginx `gzip_static on; brotli_static on;` | After error pages |
| `convert-to-avif.js` | Ad-hoc utility for converting images to AVIF format | Manually |

### `update-timestamps.mjs`

```
node scripts/update-timestamps.mjs [--date YYYY-MM-DD]
```

- Without `--date`: uses the current date (UTC+8). JSON-LD timestamps use hour-level precision (`T14:00:00+08:00`) to avoid unnecessary source diffs from per-build second-level variation.
- With `--date`: JSON-LD uses `T00:00:00+08:00` for the given date.
- Sitemap `<lastmod>` always uses `YYYY-MM-DD` format.

### `generate-error-pages.mjs`

```
node scripts/generate-error-pages.mjs --domain example.com --name "Site Name" --email admin@example.com --author "Author Name" --out dist/
```

All 5 arguments are required (short forms: `-d`, `-n`, `-e`, `-a`, `-o`). The HTML templates are embedded in the script. Output files have `<meta name="robots" content="noindex">`.

### `generate-compressed.mjs`

No arguments. Reads `dist/`, writes `.br` and `.gz` alongside every existing file. Skips already-compressed files.

## Architecture

This is a **personal homepage** (www.qqzhi.cc) — a single-page profile site with glassmorphism design and three locales (zh-CN, zh-HK, en).

### Multi-page build, single Vue app

Vite is configured with **four Rollup entry points**: `index.html`, `zh-cn.html`, `zh-hk.html`, `en.html`. Each HTML file is a nearly identical static shell (with locale-specific `<meta>` tags, Open Graph, Twitter cards, and JSON-LD structured data), but **all four point to the same `/src/main.ts`** Vue app. There is no Vue Router — the Vue app auto-detects the language from the URL path on mount and switches the vue-i18n locale accordingly. The canonical URL and `<link rel="alternate">` tags are hardcoded per HTML file.

Vite build uses `base: './'` (relative paths) and `target: 'esnext'` (no transpilation), with `modulePreload` polyfill disabled.

Nginx serves the clean URL paths (`/zh-cn`, `/zh-hk`, `/en`) — the sitemap uses clean URLs accordingly.

### i18n without a router

- `src/i18n.ts` creates a `vue-i18n` instance. Language detection at init time: URL path → `localStorage.getItem('lang')` → `navigator.language`. Falls back to `en` for non-Chinese languages. `zh-tw` and `zh-mo` are mapped to `zh-hk`.
- Only the detected locale is loaded at init time. The other two locales are **lazy-prefetched** after mount (via `requestIdleCallback` / `setTimeout` fallback in `prefetchOtherLocales()`), so language switching is instant once prefetched.
- `App.vue`'s `changeLang()` method calls `loadLocale()` if needed, switches locale, updates `localStorage`, sets `<html lang>`, `<title>`, and calls `history.replaceState` to update the URL — but does **not** reload the page or navigate.
- Locale files (`src/languages/locales/*.ts`) contain both UI strings and content (name, tags, slogan, work descriptions, footer links). There is no separation between "UI strings" and "content" — all translatable text lives in these locale objects.
- `zh-CN` has `pinyin: ''` (intentionally empty); `zh-HK` and `en` have `pinyin: 'Qiu Quanzhi'`.

### Component tree

```
main.ts
└── App.vue (all page sections inline: #home, #info, #work, #show, #log, footer)
    ├── cardInfo.vue (sidebar card: location, time, birthday, GPG fingerprint)
    └── show.vue (lazy-loaded "Works Exhibition" section)
        ├── show/bilibili.vue (iframe embed: Bilibili player)
        ├── show/blog.vue (iframe embed: home.qqzhi.cc)
        └── show/netease.vue (iframe embed: NetEase Music outchain player)
```

- `App.vue` is a large single-file component containing all page sections — there is no page-level component decomposition.
- The `show.vue` section is lazy-rendered via a `v-if="activated"` gate in `App.vue`. The `activated` ref (defined in `App.vue`) is set to `true` when the user scrolls past or clicks the activation button.
- `show/bilibili.vue` reads `aid`/`bvid`/`cid` props and constructs a `player.bilibili.com` iframe URL.
- `cardInfo.vue` and `show/bilibili.vue` use `defineProps<T>()` (generic syntax, not the runtime argument).
- `data-nosnippet` attribute is used on sections that should not be indexed as snippets by Google: the language switcher, `cardInfo.vue` sidebar card, work, show, log, and footer sections.

### Data flow

- **Static personal data** (`src/data.ts`): exports `info`, `time`, `workLinkData`, `logEntries`, `footerLinkData`, and `showTabs` (plus the `LogEntry` type). `info` contains name, email, birthday, location, GPG fingerprint, timezone, social media links, and contact info. `time` is computed once at import time using the configured timezone.
- **Dynamic content**: The Bilibili video list is fetched at runtime from `/assets/data/bilibili-videos.json` (a small JSON file in `public/assets/data/`). Each entry has `bvid` and `title`.
- **Clipboard**: Social media icons in the header call `copyInfo()` which copies the contact detail to clipboard, then opens the link. Footer contact links call `copyContact()` which copies from `info.contact`.
- **Sitemap** (`public/sitemap.xml`): lists all 5 indexable URLs (4 locale URLs with full `xhtml:link` hreflang annotations + `/works/HistoryMap/`). `<lastmod>` is updated at build time by `update-timestamps.mjs`.
- **robots.txt** (`public/robots.txt`): allows all crawling except `/assets/qrcodes/`, points to the sitemap.

### Styling

- **Glassmorphism**: translucent backgrounds (`rgba(..., 0.8)`), `backdrop-filter: blur(20px) saturate(180%)`.
- **CSS custom properties** in `src/style.scss` `:root`:
  - Active theme variables: `--theme-color`, `--theme-color-active`, `--highlight-color`
  - Active `--w-alpha-*` (white translucent): `80`, `90`
  - Active `--b-alpha-*` (black translucent): `5`, `10`, `20`, `30`, `40`, `60`, `70`, `80`, `90`
  - Active foreground/background: `--txt-b`, `--bg-w-pure`, `--filter-glass-1`
  - Only two `-fixed` variants are active: `--w-alpha-90-fixed` and `--b-alpha-30-fixed` (they retain their value in dark mode). Many other `-fixed` variants exist as commented-out placeholders.
  - Many alpha levels are commented out — only the values actually needed by the design are active.
- **Dark mode**: `@media (prefers-color-scheme: dark)` overrides the palette:
  - `--b-alpha-*` variables are redefined to use `rgba(255, 255, 255, ...)` — inverting the light/dark semantics
  - `--w-alpha-*` are redefined to use `rgba(0, 0, 0, ...)`
  - `--bg-w-pure` becomes `black`, `--txt-b` becomes `white`
  - `.bg` gets `filter: brightness(.51)` (compounds with the default `brightness(0.8)`)
  - `.card` gets `opacity: 0.5`
  - `.media-box` and `.selection` get `filter: brightness(2)`
- Scoped styles use `<style scoped>` in Vue SFCs; the main layout and shared utility classes (`.flex-row`, `.card`, `.scroll-down`, `.blanked`, `.loaded`, `.bg`) remain in `style.scss`.
- SCSS nesting is used (e.g., `.card { &.mini { ... } }`) — requires the `sass` dependency.

### Deploy (自建 Nginx)

项目部署在自建服务器上，使用 Nginx 托管静态文件。
- 构建产物 `dist/` 部署到 Nginx 静态文件目录。
- 错误页由 `scripts/generate-error-pages.mjs` 生成（HTML 模板内置于脚本中），必选参数 `--domain` `--name` `--email` `--author` `--out`，输出 16 个静态 HTML 到指定目录。Nginx 通过 `error_page` 直接映射。
- Nginx 需开启 `gzip_static on;` 和 `brotli_static on;` 以使用预压缩文件。

### Path aliases

| Alias | Path | vite.config.ts | tsconfig.json |
|---|---|---|---|
| `@` | `src/` | ✓ | ✓ (`@/*` → `./src/*`) |
| `components` | `src/components/` | ✓ | ✗ (not configured) |

The `components` alias is only configured in Vite. TypeScript resolves `components/...` imports without error because the project uses relative imports for components (`./show/...` or `@/components/...`).
