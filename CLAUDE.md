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

This is a **personal homepage** (www.qqzhi.cc) — a single-page profile site with glassmorphism design and three locales.

### Multi-page build, single Vue app

Vite is configured with **four Rollup entry points**: `index.html`, `zh-cn.html`, `zh-hk.html`, `en.html`. Each HTML file is a nearly identical static shell (with locale-specific `<meta>` tags and structured data), but **all four point to the same `/src/main.ts`** Vue app. There is no Vue Router — the Vue app auto-detects the language from the URL path on mount and switches the vue-i18n locale accordingly. The canonical URL and `<link rel="alternate">` tags are hardcoded per HTML file.

### i18n without a router

- `src/i18n.ts` creates a `vue-i18n` instance. Language detection at init time: URL path → `localStorage.getItem('lang')` → `navigator.language`. Falls back to `en` for non-Chinese languages.
- `App.vue`'s `changeLang()` method switches locale, updates `localStorage`, sets `<html lang>`, `<title>`, and calls `history.replaceState` to update the URL — but does **not** reload the page or navigate. All three locales are always loaded (see `src/languages/index.ts`).
- Locale files (`src/languages/locales/*.ts`) contain both UI strings and content (name, tags, slogan, work descriptions, footer links). There is no separation between "UI strings" and "content" — all translatable text lives in these locale objects.

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
- `bilibili.vue` reads `bvid`/`aid`/`cid` props and constructs a `player.bilibili.com` iframe URL.
- `cardInfo.vue` and `bilibili.vue` use `defineProps<T>()` (generic syntax, not the runtime argument).

### Data flow

- **Static personal data** (`src/data.ts`): name, email, birthday, location, GPG fingerprint, timezone, social media links, and contact info. Exports `info` and `time` (computed once at import time using the configured timezone). These are imported directly by `App.vue` and `cardInfo.vue` — not provided/injected.
- **Dynamic content**: The Bilibili video list is fetched at runtime from `/assets/data/works.json` (a small JSON file in `public/`).
- **Clipboard**: Social media icons in the header call `copyInfo()` which copies the contact detail to clipboard, then opens the link. Footer contact links call `copyContact()`.

### Styling

- **Glassmorphism**: translucent backgrounds (`rgba(..., 0.8)`), backdrop-filter blur + saturate.
- **CSS custom properties** in `src/style.scss` `:root` — a full set of `--w-alpha-*` (white), `--b-alpha-*` (black), `--txt-*`, `--bg-*` variables. There are **duplicate triple-dash variants** (e.g., `---w-alpha-10` alongside `--w-alpha-10`) that appear to be a legacy naming convention still referenced in some components.
- **Dark mode**: `@media (prefers-color-scheme: dark)` swaps the color palette — notably inverts `--w-alpha-*` ↔ `--b-alpha-*` semantics so white-on-dark becomes dark-on-light.
- Scoped styles use `<style scoped>` in Vue SFCs; the main layout remains in `style.scss`.

### Deploy (Vercel)

`vercel.json` sets `"cleanUrls": true` and adds `Access-Control-Allow-Origin: *` on all routes. The site is served as a static build.
