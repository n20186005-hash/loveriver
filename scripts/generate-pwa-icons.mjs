/**
 * 由 public/icons/icon.svg 產生 PWA 所需的 PNG 圖示。
 * 執行：pnpm icons
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve("public/icons/icon.svg");
const outDir = path.resolve("public/icons");

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "maskable-192.png", size: 192 },
  { file: "maskable-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

await mkdir(outDir, { recursive: true });

for (const target of targets) {
  const output = path.join(outDir, target.file);
  await sharp(source, { density: 384 })
    .resize(target.size, target.size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`generated ${path.relative(process.cwd(), output)}`);
}
