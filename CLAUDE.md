# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check with vue-tsc, then build for production
pnpm preview      # Preview the production build locally
```

- `pnpm` is the package manager (not npm or yarn).
- `vue-tsc` runs before `vite build` to type-check the entire project. Build will fail on type errors.
- TypeScript is configured in strict mode with `noUnusedLocals` and `noUnusedParameters`.

## Architecture

This is a **personal homepage** (www.qqzhi.cc) — a single-page profile site with glassmorphism design and three locales (zh-CN, zh-HK, en).

### Multi-page build, single Vue app

Vite is configured with **four Rollup entry points**: `index.html`, `zh-cn.html`, `zh-hk.html`, `en.html`. Each HTML file is a nearly identical static shell (with locale-specific `<meta>` tags, Open Graph, Twitter cards, and JSON-LD structured data), but **all four point to the same `/src/main.ts`** Vue app. There is no Vue Router — the Vue app auto-detects the language from the URL path on mount and switches the vue-i18n locale accordingly. The canonical URL and `<link rel="alternate">` tags are hardcoded per HTML file.

Vite build uses `base: './'` (relative paths) and `target: 'esnext'` (no transpilation), with `modulePreload` polyfill disabled.

### i18n without a router

- `src/i18n.ts` creates a `vue-i18n` instance. Language detection at init time: URL path → `localStorage.getItem('lang')` → `navigator.language`. Falls back to `en` for non-Chinese languages. `zh-tw` and `zh-mo` are mapped to `zh-hk`.
- `App.vue`'s `changeLang()` method switches locale, updates `localStorage`, sets `<html lang>`, `<title>`, and calls `history.replaceState` to update the URL — but does **not** reload the page or navigate. All three locales are always loaded (see `src/languages/index.ts`).
- Locale files (`src/languages/locales/*.ts`) contain both UI strings and content (name, tags, slogan, work descriptions, footer links). There is no separation between "UI strings" and "content" — all translatable text lives in these locale objects.
- `zh-CN` has `pinyin: ''` (intentionally empty); `zh-HK` and `en` have `pinyin: 'Qiu Quanzhi'`.

### Component tree

```
main.ts
└── App.vue (all page sections inline: #home, #info, #work, #show, #log, footer)
    ├── cardInfo.vue (sidebar card: location, time, birthday, GPG fingerprint)
    └── show.vue (lazy-loaded "Works Exhibition" section)
        ├── bilibili.vue (iframe embed: Bilibili player)
        ├── blog.vue (iframe embed: home.qqzhi.cc)
        └── netease.vue (iframe embed: NetEase Music outchain player)
```

- `App.vue` is a large single-file component containing all page sections — there is no page-level component decomposition.
- The `show.vue` section lazy-renders only after the user scrolls past or clicks to activate (`activated` ref).
- `bilibili.vue` reads `aid`/`bvid`/`cid` props and constructs a `player.bilibili.com` iframe URL.
- `cardInfo.vue` and `bilibili.vue` use `defineProps<T>()` (generic syntax, not the runtime argument).
- `data-nosnippet` attribute is used on sections that should not be indexed as snippets by Google (the language switcher, work, show, log, and footer sections).

### Data flow

- **Static personal data** (`src/data.ts`): name, email, birthday, location, GPG fingerprint, timezone, social media links, and contact info. Exports `info` and `time` (computed once at import time using the configured timezone). These are imported directly by `App.vue` and `cardInfo.vue` — not provided/injected.
- **Dynamic content**: The Bilibili video list is fetched at runtime from `/assets/data/works.json` (a small JSON file in `public/`). Each entry has `bvid` and `title`.
- **Clipboard**: Social media icons in the header call `copyInfo()` which copies the contact detail to clipboard, then opens the link. Footer contact links call `copyContact()` which copies from `info.contact`.

### Styling

- **Glassmorphism**: translucent backgrounds (`rgba(..., 0.8)`), backdrop-filter blur + saturate.
- **CSS custom properties** in `src/style.scss` `:root` — a full set of `--w-alpha-*` (white translucent), `--b-alpha-*` (black translucent), `--txt-*`, `--bg-*`, `--theme-color*` variables. Every variable has a corresponding `-fixed` variant (e.g., `--w-alpha-90-fixed`) that retains its value regardless of color scheme — used in places where dark mode should not affect the appearance.
- **Dark mode**: `@media (prefers-color-scheme: dark)` swaps the color palette — inverts `--w-alpha-*` ↔ `--b-alpha-*` semantics so white-on-dark becomes dark-on-light. Also applies `filter: brightness(0.51)` to the background image and `filter: brightness(2)` to icons.
- Scoped styles use `<style scoped>` in Vue SFCs; the main layout and shared utility classes (`.flex-row`, `.card`, `.scroll-down`, etc.) remain in `style.scss`.
- SCSS nesting is used (e.g., `.card { &.mini { ... } }`) — requires the `sass` dependency.
- Path aliases configured in both `vite.config.ts` and `tsconfig.json`: `@` → `src/`, `components` → `src/components/`.

### Deploy (Vercel)

`vercel.json` sets `"cleanUrls": true` and adds `Access-Control-Allow-Origin: *` on all routes. The site is served as a static build. A `public/404.html` exists for custom 404 handling.

### Path aliases

- `@` → `src/`
- `components` → `src/components/`

Both are configured in `vite.config.ts` (resolve.alias) and `tsconfig.json` (paths).
