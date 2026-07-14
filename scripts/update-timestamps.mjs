/**
 * 构建时更新时间戳脚本
 * 在构建前更新所有 HTML 文件中的 JSON-LD dateModified 和 sitemap.xml 的 lastmod。
 *
 * 用法: node scripts/update-timestamps.mjs [--date YYYY-MM-DD]
 *       不传 --date 则使用当前日期 (UTC+8)
 *
 * @author 邱泉智 QIU Quanzhi (旅禾Ryoine)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── 解析参数 ──
function parseArgs(argv) {
  let date = null;
  for (let i = 2; i < argv.length; i++) {
    if ((argv[i] === '--date' || argv[i] === '-d') && argv[i + 1]) {
      date = argv[++i];
    }
  }
  return date || null;
}

const dateArg = parseArgs(process.argv);

function buildDate(offsetHours = 8) {
  if (dateArg) return dateArg;
  const d = new Date();
  // 使用 UTC 偏移模拟指定时区
  const local = new Date(d.getTime() + offsetHours * 3600 * 1000);
  return local.toISOString().split('T')[0]; // YYYY-MM-DD
}

const dateStr = buildDate();
// 完整的 ISO 时间戳用于 JSON-LD（精度到小时，避免分钟/秒导致源码频繁变更）
const isoStr = (() => {
  if (dateArg) return `${dateArg}T00:00:00+08:00`;
  const d = new Date(new Date().getTime() + 8 * 3600 * 1000);
  const datePart = d.toISOString().split('T')[0];
  const hour = String(d.getUTCHours()).padStart(2, '0');
  return `${datePart}T${hour}:00:00+08:00`;
})();

// ── 需要处理的文件 ──
const htmlFiles = [
  'index.html',
  'zh-cn.html',
  'zh-hk.html',
  'en.html',
].map(f => resolve(root, f));

const sitemapFile = resolve(root, 'public', 'sitemap.xml');

// ── 更新 JSON-LD dateModified ──
const jsonLdPattern = /"dateModified":\s*"[^"]*"/;
let htmlUpdated = 0;
for (const file of htmlFiles) {
  let content = readFileSync(file, 'utf-8');
  const replacement = `"dateModified": "${isoStr}"`;
  if (jsonLdPattern.test(content)) {
    content = content.replace(jsonLdPattern, replacement);
    writeFileSync(file, content);
    htmlUpdated++;
  }
}

// ── 更新 sitemap.xml ──
let sitemapUpdated = 0;
try {
  let content = readFileSync(sitemapFile, 'utf-8');
  const lastmodPattern = /<lastmod>[^<]*<\/lastmod>/g;
  const matchCount = (content.match(lastmodPattern) || []).length;
  content = content.replace(lastmodPattern, `<lastmod>${dateStr}</lastmod>`);
  writeFileSync(sitemapFile, content);
  sitemapUpdated = matchCount;
} catch { /* 文件不存在则跳过 */ }

// ── 输出 ──
console.log(`✓ Timestamps updated to ${dateStr} (ISO: ${isoStr})`);
console.log(`  HTML (JSON-LD): ${htmlUpdated} files`);
console.log(`  Sitemap:        ${sitemapUpdated} entries`);
