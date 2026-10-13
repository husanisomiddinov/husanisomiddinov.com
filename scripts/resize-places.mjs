// Downscale place photos in public/images/places to a web-friendly size.
//
// The place card shows one photo in a ~220px square, so a 640px long edge stays
// crisp even on retina while keeping files small. Photos straight from a phone are
// 2-10x that, which is the whole reason the globe's cards felt slow to load.
//
// Idempotent: images already within the target are left untouched, so re-running
// after dropping in new photos only touches the new, oversized ones.
//
// Requires ImageMagick (`magick`, or legacy `identify`/`convert`).
// On macOS: `brew install imagemagick`.
//
//   yarn resize-places

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "public", "images", "places");
const MAX_EDGE = 640;
const QUALITY = 85;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Modern ImageMagick exposes one `magick` binary with subcommands; the legacy
// build ships `identify` and `convert` separately. Pick whichever is installed.
function detectTools() {
  try {
    execFileSync("magick", ["-version"], { stdio: "ignore" });
    return { identify: ["magick", "identify"], convert: ["magick"] };
  } catch {
    // fall through to the legacy binaries
  }
  try {
    execFileSync("identify", ["-version"], { stdio: "ignore" });
    return { identify: ["identify"], convert: ["convert"] };
  } catch {
    return null;
  }
}

function run([bin, ...prefix], args) {
  return execFileSync(bin, [...prefix, ...args], { encoding: "utf8" });
}

function dimensions(tools, file) {
  const [w, h] = run(tools.identify, ["-format", "%w %h", file]).trim().split(/\s+/).map(Number);
  return { w, h };
}

const tools = detectTools();
if (!tools) {
  console.error("ImageMagick not found. Install it (macOS: brew install imagemagick) and retry.");
  process.exit(1);
}
if (!fs.existsSync(DIR)) {
  console.error(`No places image directory at ${DIR}`);
  process.exit(1);
}

const files = fs
  .readdirSync(DIR)
  .filter((name) => EXTENSIONS.has(path.extname(name).toLowerCase()))
  .sort();

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;
let resized = 0;
let skipped = 0;

for (const name of files) {
  const file = path.join(DIR, name);
  const { w, h } = dimensions(tools, file);
  const before = fs.statSync(file).size;

  if (Math.max(w, h) <= MAX_EDGE) {
    skipped++;
    console.log(`skip   ${name}  (${w}x${h}, ${kb(before)})`);
    continue;
  }

  run(tools.convert, [
    file,
    "-resize", `${MAX_EDGE}x${MAX_EDGE}>`,
    "-strip",
    "-interlace", "Plane",
    "-quality", String(QUALITY),
    file,
  ]);

  const { w: nw, h: nh } = dimensions(tools, file);
  resized++;
  console.log(`resize ${name}  ${w}x${h} -> ${nw}x${nh}  ${kb(before)} -> ${kb(fs.statSync(file).size)}`);
}

console.log(`\nDone. ${resized} resized, ${skipped} already small.`);
