import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../src/content/pages/", import.meta.url).pathname;
function walk(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? walk(path) : /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}
const paths = walk(root).map((file) => relative(root, file));
const english = paths.filter((path) => path.startsWith("en/"));
const chinese = paths.filter((path) => !path.startsWith("en/"));
const normalized = (path) => path.replace(/\/index\.(md|mdx)$/, ".$1").replace(/\.mdx$/, ".md");
const englishIds = new Set(english.map((path) => normalized(path.slice(3))));
const untranslated = chinese.filter((path) => !englishIds.has(normalized(path)));
const mixedEnglish = english.filter((path) => /[\u3400-\u9fff]/u.test(readFileSync(join(root, path), "utf8")));

console.log(`Chinese pages: ${chinese.length}`);
console.log(`English pages: ${english.length}`);
console.log(`English pages containing CJK: ${mixedEnglish.length}`);
if (mixedEnglish.length) console.log(`Mixed English pages:\n${mixedEnglish.map((p) => `  ${p}`).join("\n")}`);
console.log(`Chinese pages without an English counterpart: ${untranslated.length}`);
if (untranslated.length) console.log(`Missing translations:\n${untranslated.map((p) => `  ${p}`).join("\n")}`);
if (mixedEnglish.length || untranslated.length) process.exitCode = 1;
