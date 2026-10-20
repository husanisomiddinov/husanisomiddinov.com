// Downscale and recompress oversized images in public/ to a web-friendly size.
//
// Next's image optimizer already serves resized variants, but it reads the source
// file on every cold request and `next build`, so multi-megabyte originals make
// both slow. Each folder gets a long-edge cap sized to its largest display slot
// at 2x. Aspect ratio is preserved, so declared width/height stay valid.
//
// Idempotent: files already within the cap and under SKIP_BELOW_KB are left
// alone, and a re-encode is only kept when it is actually smaller.
//
//   yarn optimize-images

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public");
const TARGETS = [
  { dir: "images/experiences", maxEdge: 1320 },
  { dir: "images/books", maxEdge: 1000 },
  { dir: "writing", maxEdge: 1600 },
];
const QUALITY = 85;
const SKIP_BELOW_KB = 150;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".webp"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function encode(pipeline, ext) {
  return ext === ".webp"
    ? pipeline.webp({ quality: QUALITY })
    : pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
}

let savedBytes = 0;
for (const { dir, maxEdge } of TARGETS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;

  for (const file of walk(abs)) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTENSIONS.has(ext)) continue;

    const before = fs.statSync(file).size;
    const meta = await sharp(file).metadata();
    const oversized = Math.max(meta.width, meta.height) > maxEdge;
    if (!oversized && before < SKIP_BELOW_KB * 1024) continue;

    const pipeline = sharp(file).rotate();
    if (oversized) {
      pipeline.resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true });
    }
    const out = await encode(pipeline, ext).toBuffer();
    if (out.length >= before) continue;

    fs.writeFileSync(file, out);
    savedBytes += before - out.length;
    console.log(
      `${path.relative(ROOT, file)}: ${(before / 1024) | 0}KB -> ${(out.length / 1024) | 0}KB`,
    );
  }
}
console.log(`Saved ${(savedBytes / 1024 / 1024).toFixed(1)}MB`);
