/**
 * CSS 自定义属性名压缩
 * 将 dist/ 目录中所有 CSS/HTML 文件的长变量名替换为短名，减少字节体积
 *
 * 用法: node scripts/minify-css-vars.mjs [--dry] [--dir <目录>]
 *   --dry    仅打印映射表，不修改文件
 *   --dir    指定目标目录（默认 dist/）
 *
 * 映射策略：按变量名字母序 → --a, --b, ..., --z, --A, ..., --Z, --az, ...
 *
 * @author 邱泉智 QIU Quanzhi (旅禾Ryoine)
 * @since 3.2.0
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';

const VERSION = '3.2.0';

// ── 解析 CLI ──
function parseArgs(argv) {
  const args = { dry: false, dir: resolve(process.cwd(), 'dist') };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--dry') { args.dry = true; continue; }
    if (argv[i] === '--dir' && argv[i + 1]) { args.dir = resolve(process.cwd(), argv[++i]); continue; }
  }
  return args;
}

const { dry, dir } = parseArgs(process.argv);

// ── 收集目标文件 ──
function collectFiles(root) {
  const result = [];
  try {
    const entries = readdirSync(root, { recursive: true, withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      const ext = extname(e.name);
      if (ext !== '.css' && ext !== '.html') continue;
      // 跳过预压缩文件
      if (extname(e.name.replace(/\.(br|gz)$/, '')) !== ext) continue;
      if (e.name.endsWith('.br') || e.name.endsWith('.gz')) continue;
      result.push(join(e.parentPath, e.name));
    }
  } catch { /* 目录不存在则跳过 */ }
  return result;
}

// ── 从文件中提取所有 CSS 变量名 ──
function collectVarNames(files) {
  const names = new Set();
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    for (const m of content.matchAll(/--[\w-]+/g)) {
      names.add(m[0]);
    }
  }
  // 按长度降序 → 字母序，确保长名先替换避免部分匹配
  return [...names].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

// ── 生成短名映射表 ──
// 单字符: a-z (26) → A-Z (26) → 双字符覆盖余量
function buildMapping(names) {
  const buildChars = () => {
    const lower = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    const upper = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    return [...lower, ...upper];
  };

  const chars = buildChars();
  const mapping = Object.create(null);
  let remain = names.length;
  let pass = 0;
  let base = '';

  while (remain > 0) {
    for (let i = 0; i < chars.length && remain > 0; i++) {
      const short = `--${base}${chars[i]}`;
      // 防止短名与现有变量冲突
      if (!names.includes(short) && !Object.values(mapping).includes(short)) {
        const idx = names.length - remain;
        mapping[names[idx]] = short;
        remain--;
      }
    }
    // 下一个 pass：增加前缀（--az → --ba, --bb, ...）
    if (remain > 0) {
      pass++;
      base = chars[pass - 1];
    }
  }

  return mapping;
}

// ── 应用映射到文件 ──
function applyMapping(files, mapping) {
  const pairs = Object.entries(mapping);
  let totalReplacements = 0;

  for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    let changed = false;

    for (const [oldName, newName] of pairs) {
      if (!content.includes(oldName)) continue;
      const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      const before = content.length;
      content = content.replace(regex, newName);
      if (content.length !== before) changed = true;
    }

    if (changed) {
      totalReplacements++;
      if (!dry) writeFileSync(file, content, 'utf-8');
    }
  }

  return totalReplacements;
}

// ── 主流程 ──
const files = collectFiles(dir);

if (files.length === 0) {
  console.error(`错误：${dir} 目录下未找到 CSS/HTML 文件`);
  process.exit(1);
}

const varNames = collectVarNames(files);

// 已压缩检测：若最长变量名 ≤ 4 字符，说明已是短名，跳过
const maxLen = Math.max(...varNames.map(n => n.length));
if (maxLen <= 4) {
  console.log('✓ CSS 变量名已为短名，跳过压缩');
  process.exit(0);
}

const mapping = buildMapping(varNames);
const modified = applyMapping(files, mapping);

// 统计实际节省
let totalSaved = 0;
for (const [old, short] of Object.entries(mapping)) {
  const perUse = old.length - short.length;
  // 遍历所有文件统计每个变量实际出现次数
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const count = (content.match(new RegExp(short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    totalSaved += perUse * count;
  }
}

console.log([
  `✓ CSS 变量名压缩完成`,
  `  文件数: ${files.length}`,
  `  变量数: ${varNames.length}`,
  `  映射例: ${Object.entries(mapping).slice(0, 3).map(([o, n]) => `${o}→${n}`).join(', ')} ...`,
  `  修改文件: ${modified}`,
  `  预估节省: ${totalSaved} B (${(totalSaved / 1024).toFixed(1)} KB)`,
  dry ? '  (仅预览，未写入)' : '',
].join('\n'));
