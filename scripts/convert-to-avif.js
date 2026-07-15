/**
 * 将 public/ 目录下的 webp/png 图片转换为 AVIF 格式。
 * 仅当 AVIF 体积小于原图时保留 AVIF 副本。
 * 原始文件始终保留。
 *
 * 用法: node scripts/convert-to-avif.js
 */

import { readdir, stat, unlink } from 'node:fs/promises';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// 尝试的质量级别（从高到低）。首个体积小于原图的即采纳。
const QUALITY_LEVELS = [45, 35, 25];
const EFFORT = 9; // 0-9，值越大压缩率越高但速度越慢

const kept = [];   // { file, avif, origKB, avifKB, pct }
const skipped = []; // { file, origKB, reason }
const errors = [];  // { file, error }

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function tryConvert(filePath, ext, avifPath, origSize, quality) {
  await sharp(filePath)
    .avif({ quality, effort: EFFORT })
    .toFile(avifPath);
  const avifInfo = await stat(avifPath);
  return avifInfo.size;
}

async function convert(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) return;

  const avifPath = filePath.replace(ext, '.avif');
  const relPath = filePath.replace(PUBLIC_DIR, 'public');
  const avifRel = avifPath.replace(PUBLIC_DIR, 'public');

  try {
    const origInfo = await stat(filePath);
    const origKB = origInfo.size / 1024;

    // 尝试不同质量级别，直到找到体积小于原图的
    let bestSize = Infinity;
    let bestQuality = null;

    for (const q of QUALITY_LEVELS) {
      const size = await tryConvert(filePath, ext, avifPath, origInfo.size, q);
      if (size < origInfo.size) {
        bestSize = size;
        bestQuality = q;
        break; // Found a winner
      }
      // 当前质量级别体积更大 —— 下一轮迭代会覆盖此文件
    }

    if (bestQuality !== null) {
      const avifKB = bestSize / 1024;
      const pct = ((1 - avifKB / origKB) * 100).toFixed(1);
      console.log(`  ✓ ${relPath}  (${origKB.toFixed(1)}KB → ${avifKB.toFixed(1)}KB, -${pct}%, q=${bestQuality})`);
      kept.push({ file: relPath, avif: avifRel, origKB, avifKB, pct: parseFloat(pct) });
    } else {
      // 所有质量级别均大于原图 —— 删除最后生成的 AVIF
      try { await unlink(avifPath); } catch {}
      const reason = `最小 AVIF 仍大于原图（${origKB.toFixed(1)}KB）`;
      console.log(`  ✗ ${relPath}  已跳过：${reason}`);
      skipped.push({ file: relPath, origKB, reason });
    }
  } catch (err) {
    try { await unlink(avifPath); } catch {}
    errors.push({ file: relPath, error: err.message });
    console.error(`  ⚠ ${relPath}: ${err.message}`);
  }
}

console.log('正在将 public/ 中的图片转换为 AVIF……');
console.log(`设置：effort=${EFFORT}，质量级别=[${QUALITY_LEVELS}]\n`);

for await (const file of walk(PUBLIC_DIR)) {
  await convert(file);
}

// 汇总
console.log(`\n${'='.repeat(60)}`);
console.log(`已保留： ${kept.length} 个文件（AVIF 体积小于原图）`);
console.log(`已跳过： ${skipped.length} 个文件（AVIF 无收益）`);
console.log(`错误：   ${errors.length} 个`);
console.log(`${'='.repeat(60)}`);

if (kept.length > 0) {
  const totalOrig = kept.reduce((s, k) => s + k.origKB, 0);
  const totalAvif = kept.reduce((s, k) => s + k.avifKB, 0);
  console.log(`总计节省：${totalOrig.toFixed(1)}KB → ${totalAvif.toFixed(1)}KB（-${((1 - totalAvif/totalOrig) * 100).toFixed(1)}%）`);
}

// 输出 JSON 报告供参考
const report = { kept, skipped, errors };
console.log(`\n报告：${JSON.stringify(report, null, 2)}`);
