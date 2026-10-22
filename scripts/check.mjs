#!/usr/bin/env node
/**
 * 仓库自检。只读，不改任何文件。
 *
 *   node scripts/check.mjs
 *
 * 检查项：
 *   1. 三份 SKILL.md：首字节不是 BOM、frontmatter 可解析、name 与目录名一致、引号配平
 *   2. 所有 references/*.md 指针都存在
 *   3. 每份 reference 至少被一份 SKILL.md 引用（防孤儿）
 *   4. 行尾统一为 LF（混用 CRLF/LF 会让多行替换静默失败）
 *   5. 体检表声明条数与实际行数一致
 *
 * 退出码：0 全过；1 有问题。
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKILLS = ["requirement-framing", "solution-design", "incremental-delivery"];

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

function read(p) {
  return fs.readFileSync(p, "utf8").replace(/^\uFEFF/, "");
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const skillDirs = SKILLS.map((s) => ({ name: s, dir: path.join(ROOT, "skills", s) }));

// ---- 1. frontmatter / BOM / name / 引号 / 行尾 ----
for (const { name, dir } of skillDirs) {
  const p = path.join(dir, "SKILL.md");
  if (!fs.existsSync(p)) {
    fail(`缺文件: skills/${name}/SKILL.md`);
    continue;
  }
  const raw = fs.readFileSync(p);
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) fail(`${name}/SKILL.md 首字节是 BOM`);

  const text = raw.toString("utf8");
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) {
    fail(`${name}/SKILL.md frontmatter 解析失败`);
    continue;
  }
  const lines = fm[1].split("\n");
  const nm = (lines.find((l) => l.startsWith("name:")) || "").replace("name:", "").trim();
  if (nm !== name) fail(`${name}/SKILL.md 的 name="${nm}" 与目录名不一致`);

  const desc = lines.find((l) => l.startsWith("description:")) || "";
  const quotes = (desc.match(/"/g) || []).length;
  if (quotes % 2 !== 0) fail(`${name}/SKILL.md description 引号不配平（${quotes} 个）`);

  if (/\r\n/.test(text)) fail(`${name}/SKILL.md 行尾混用了 CRLF`);
}

// ---- 全仓行尾检查 ----
for (const p of walk(ROOT)) {
  if (p.includes(`${path.sep}.git${path.sep}`)) continue;
  if (/\r\n/.test(read(p))) fail(`行尾含 CRLF: ${path.relative(ROOT, p)}`);
  if (fs.readFileSync(p)[0] === 0xef) fail(`首字节含 BOM: ${path.relative(ROOT, p)}`);
}

// ---- 2 & 3. reference 指针存在 + 无孤儿 ----
const referenced = new Set();
for (const { name, dir } of skillDirs) {
  const p = path.join(dir, "SKILL.md");
  if (!fs.existsSync(p)) continue;
  const text = read(p);
  for (const m of text.matchAll(/`?references\/([\w.-]+\.md)`?/g)) {
    referenced.add(`${name}/${m[1]}`);
    if (!fs.existsSync(path.join(dir, "references", m[1]))) {
      fail(`${name}/SKILL.md 指向不存在的 references/${m[1]}`);
    }
  }
}

for (const { name, dir } of skillDirs) {
  const refDir = path.join(dir, "references");
  if (!fs.existsSync(refDir)) continue;
  for (const f of fs.readdirSync(refDir)) {
    if (!f.endsWith(".md")) continue;
    if (!referenced.has(`${name}/${f}`)) fail(`孤儿 reference（没有任何 SKILL.md 指向它）: ${name}/references/${f}`);
  }
}

// ---- 5. 体检表条数与声明一致 ----
{
  const p = path.join(ROOT, "skills/solution-design/SKILL.md");
  if (fs.existsSync(p)) {
    const text = read(p);
    const decl = text.match(/### frame 体检（([一二三四五六七八九十]+)条/);
    const start = text.indexOf('### frame 体检');
    const after = text.slice(start + 10);
    const endRel = after.search(/\n(###|\*\*)/);
    const block = [text.slice(start, endRel < 0 ? undefined : start + 10 + endRel)];
    if (decl && block) {
      const rows = (block[0].match(/^\| \d+ \|/gm) || []).length;
      const map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
      const n = map[decl[1]];
      if (n && rows !== n) fail(`体检表声明「${decl[1]}条」，实际 ${rows} 行`);
      else if (n) notes.push(`体检表 ${rows} 条，与声明一致`);
    }
  }
}

// ---- 报告 ----
if (problems.length) {
  console.error(`✗ ${problems.length} 个问题\n`);
  for (const m of problems) console.error("  - " + m);
  process.exit(1);
}
console.log(`✓ 全部通过（${skillDirs.length} 个 skill）`);
for (const n of notes) console.log("  · " + n);
