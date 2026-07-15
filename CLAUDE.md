# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 命令

```bash
pnpm dev          # 启动 Vite 开发服务器
pnpm build        # 完整生产构建（流程见下文）
pnpm preview      # 本地预览生产构建
```

- 包管理器为 `pnpm`（非 npm 或 yarn）。
- `build` 命令按顺序执行 5 个步骤：
  1. `vue-tsc` — 对整个项目进行类型检查（类型错误会导致构建失败）
  2. `node scripts/update-timestamps.mjs` — 将 JSON-LD `dateModified` 和 sitemap `<lastmod>` 更新为当前日期
  3. `vite build` — 打包为生产产物
  4. `node scripts/generate-error-pages.mjs` — 生成静态错误页到 `dist/` 目录
  5. `node scripts/generate-compressed.mjs` — 为 `dist/` 中所有文件生成 `.br` 和 `.gz` 预压缩副本
- TypeScript 配置为严格模式，启用了 `noUnusedLocals` 和 `noUnusedParameters`。

## 构建脚本

所有构建脚本位于 `scripts/` 目录下，均为纯 Node.js ESM（`.mjs` / `.js`）。

| 脚本 | 用途 | 执行时机 |
|---|---|---|
| `update-timestamps.mjs` | 替换 JSON-LD 中的 `dateModified`（所有 HTML 入口）和 `public/sitemap.xml` 中的 `<lastmod>` | `vite build` 之前 |
| `generate-error-pages.mjs` | 生成 16 个静态错误 HTML 页面到 `dist/`（400/401/403/404/405/408/410/413/414/429/431/500/502/503/504 + `error.html` 兜底页） | `vite build` 之后 |
| `generate-compressed.mjs` | 生成 `.br`（Brotli）和 `.gz`（gzip）预压缩副本，供 Nginx `gzip_static on; brotli_static on;` 使用 | 错误页生成之后 |
| `convert-to-avif.js` | 临时工具，用于将图片转换为 AVIF 格式 | 手动执行 |

### `update-timestamps.mjs`

```
node scripts/update-timestamps.mjs [--date YYYY-MM-DD]
```

- 不传 `--date`：使用当前日期（UTC+8）。JSON-LD 时间戳采用小时级精度（`T14:00:00+08:00`），避免每次构建因秒级差异导致源码无意义变更。
- 传入 `--date`：JSON-LD 使用给定日期的 `T00:00:00+08:00`。
- Sitemap `<lastmod>` 始终使用 `YYYY-MM-DD` 格式。

### `generate-error-pages.mjs`

```
node scripts/generate-error-pages.mjs --domain example.com --name "站点名称" --email admin@example.com --author "作者名" --out dist/
```

5 个参数均为必填（短参数：`-d`、`-n`、`-e`、`-a`、`-o`）。HTML 模板内置于脚本中。输出文件包含 `<meta name="robots" content="noindex">`。

### `generate-compressed.mjs`

无参数。读取 `dist/` 目录，为每个已有文件在同级目录生成 `.br` 和 `.gz` 副本。跳过已被压缩的文件。

## 项目架构

这是一个**个人主页**（www.qqzhi.cc）—— 采用玻璃拟态设计的单页个人介绍站点，支持三语言（zh-CN、zh-HK、en）。

### 多页面构建，单一 Vue 应用

Vite 配置了**四个 Rollup 入口点**：`index.html`、`zh-cn.html`、`zh-hk.html`、`en.html`。每个 HTML 文件结构几乎相同，仅语言特定的 `<meta>` 标签、Open Graph、Twitter 卡片和 JSON-LD 结构化数据有所差异，但**四个入口均指向同一个 `/src/main.ts`** Vue 应用。项目中未使用 Vue Router —— Vue 应用在挂载时从 URL 路径自动检测语言，并据此切换 vue-i18n 的语言环境。各 HTML 文件中硬编码了规范 URL 和 `<link rel="alternate">` 标签。

Vite 构建使用 `base: './'`（相对路径）和 `target: 'esnext'`（不做语法降级），并禁用了 `modulePreload` polyfill。

Nginx 提供简洁路径（`/zh-cn`、`/zh-hk`、`/en`）—— sitemap 也相应使用简洁 URL。

### 无路由的国际化方案

- `src/i18n.ts` 创建 `vue-i18n` 实例。初始化时的语言检测逻辑：URL 路径 → `localStorage.getItem('lang')` → `navigator.language`。非中文语言回退到 `en`。`zh-tw` 和 `zh-mo` 映射为 `zh-hk`。
- 初始化时仅加载检测到的语言包。其余两个语言包在挂载后**延迟预加载**（通过 `requestIdleCallback` / `setTimeout` 降级方案在 `prefetchOtherLocales()` 中实现），预加载完成后语言切换即时响应。
- `App.vue` 的 `changeLang()` 方法：先按需调用 `loadLocale()`，再切换语言环境，更新 `localStorage`，设置 `<html lang>`、`<title>`，并通过 `history.replaceState` 更新 URL —— 但**不会**刷新页面或导航。
- 语言文件（`src/languages/locales/*.ts`）同时包含 UI 字符串和内容（姓名、标签、口号、作品描述、页脚链接）。不存在"UI 字符串"和"内容"的分离 —— 所有可翻译文本均存放在这些语言对象中。
- `zh-CN` 的 `pinyin: ''`（有意留空）；`zh-HK` 和 `en` 的 `pinyin: 'Qiu Quanzhi'`。

### 组件树

```
main.ts
└── App.vue（所有页面区域均内联于此：#home、#info、#work、#show、#log、footer）
    ├── cardInfo.vue（侧边栏卡片：地点、时间、生日、GPG 指纹）
    └── show.vue（懒加载的"作品展示"区域）
        ├── show/bilibili.vue（iframe 嵌入：Bilibili 播放器）
        ├── show/blog.vue（iframe 嵌入：home.qqzhi.cc）
        └── show/netease.vue（iframe 嵌入：网易云音乐外链播放器）
```

- `App.vue` 是一个包含所有页面区域的大型单文件组件 —— 未做页面级组件拆分。
- `show.vue` 区域通过 `App.vue` 中的 `v-if="activated"` 门控实现懒渲染。`activated` ref（定义在 `App.vue` 中）在用户滚动经过或点击激活按钮时置为 `true`。
- `show/bilibili.vue` 读取 `aid`/`bvid`/`cid` props，构造 `player.bilibili.com` 的 iframe URL。
- `cardInfo.vue` 和 `show/bilibili.vue` 使用 `defineProps<T>()` （泛型语法，非运行时参数）。
- 不希望被 Google 作为摘要索引的区域使用 `data-nosnippet` 属性标记：语言切换器、`cardInfo.vue` 侧边栏卡片、作品、展示、日志和页脚区域。

### 数据流

- **静态个人数据**（`src/data.ts`）：导出 `info`、`time`、`workLinkData`、`logEntries`、`footerLinkData` 和 `showTabs`（以及 `LogEntry` 类型）。`info` 包含姓名、邮箱、生日、地点、GPG 指纹、时区、社交媒体链接和联系方式。`time` 在 import 时使用配置的时区计算一次。
- **动态内容**：Bilibili 视频列表在运行时从 `/assets/data/bilibili-videos.json`（`public/assets/data/` 下的一个小 JSON 文件）获取。每条记录包含 `bvid` 和 `title`。
- **剪贴板**：头部社交媒体图标调用 `copyInfo()`，将联系方式复制到剪贴板后打开链接。页脚联系方式调用 `copyContact()`，从 `info.contact` 复制。
- **Sitemap**（`public/sitemap.xml`）：列出所有 5 个可索引 URL（4 个语言 URL，带有完整的 `xhtml:link` hreflang 标注 + `/works/HistoryMap/`）。`<lastmod>` 由 `update-timestamps.mjs` 在构建时更新。
- **robots.txt**（`public/robots.txt`）：允许所有爬虫，排除 `/assets/qrcodes/`，指向 sitemap。

### 样式

- **玻璃拟态**：半透明背景（`rgba(..., 0.8)`），`backdrop-filter: blur(20px) saturate(180%)`。
- **CSS 自定义属性**，定义于 `src/style.scss` 的 `:root` 中：
  - 激活的主题变量：`--theme-color`、`--theme-color-active`、`--highlight-color`
  - 激活的 `--w-alpha-*`（白色半透明）：`80`、`90`
  - 激活的 `--b-alpha-*`（黑色半透明）：`5`、`10`、`20`、`30`、`40`、`60`、`70`、`80`、`90`
  - 激活的前景/背景：`--txt-b`、`--bg-w-pure`、`--filter-glass-1`
  - 仅两个 `-fixed` 变体处于激活状态：`--w-alpha-90-fixed` 和 `--b-alpha-30-fixed`（在暗色模式下保持原值）。其余 `-fixed` 变体以注释形式预留。
  - 许多透明度级别被注释掉 —— 仅设计中实际需要的值处于激活状态。
- **暗色模式**：`@media (prefers-color-scheme: dark)` 覆盖调色板：
  - `--b-alpha-*` 变量重定义为使用 `rgba(255, 255, 255, ...)` —— 反转了亮/暗语义
  - `--w-alpha-*` 重定义为使用 `rgba(0, 0, 0, ...)`
  - `--bg-w-pure` 变为 `black`，`--txt-b` 变为 `white`
  - `.bg` 获得 `filter: brightness(.51)`（叠加默认的 `brightness(0.8)`）
  - `.card` 获得 `opacity: 0.5`
  - `.media-box` 和 `.selection` 获得 `filter: brightness(2)`
- 组件样式使用 Vue SFC 的 `<style scoped>`；主要布局和共享工具类（`.flex-row`、`.card`、`.scroll-down`、`.blanked`、`.loaded`、`.bg`）保留在 `style.scss` 中。
- 使用 SCSS 嵌套（如 `.card { &.mini { ... } }`）—— 需要 `sass` 依赖。

### 部署（自建 Nginx）

项目部署在自建服务器上，使用 Nginx 托管静态文件。
- 构建产物 `dist/` 部署到 Nginx 静态文件目录。
- 错误页由 `scripts/generate-error-pages.mjs` 生成（HTML 模板内置于脚本中），必选参数 `--domain` `--name` `--email` `--author` `--out`，输出 16 个静态 HTML 到指定目录。Nginx 通过 `error_page` 直接映射。
- Nginx 需开启 `gzip_static on;` 和 `brotli_static on;` 以使用预压缩文件。

### 路径别名

| 别名 | 路径 | vite.config.ts | tsconfig.json |
|---|---|---|---|
| `@` | `src/` | ✓ | ✓（`@/*` → `./src/*`） |
| `components` | `src/components/` | ✓ | ✗（未配置） |

`components` 别名仅在 Vite 中配置。TypeScript 可正常解析 `components/...` 导入，因为项目内部使用相对路径导入组件（`./show/...` 或 `@/components/...`）。
