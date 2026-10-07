"use client";

import { useEffect, useRef, useCallback } from "react";

const W = 48;
const H = 32;
const RAMP = " .,:;+*#%@";
const AR = 0.5;

function cupShade(col: number, row: number): number {
  const cx = 22;
  const x = (col - cx) * AR;

  const rimY = 10;
  const botY = 24;

  if (row >= rimY && row <= botY) {
    const t = (row - rimY) / (botY - rimY);
    const r = 6.5 - t * 2.5;
    const nx = x / r;
    if (Math.abs(nx) <= 1) {
      const cylinder = Math.sqrt(1 - nx * nx);
      const edgeY = Math.min((row - rimY + 0.5) / 1.5, (botY - row + 0.5) / 1.5, 1);
      return cylinder * edgeY;
    }
  }

  if (row === rimY - 1) {
    const r = 7;
    const nx = x / r;
    if (Math.abs(nx) <= 1) {
      return 0.4 + Math.sqrt(1 - nx * nx) * 0.2;
    }
  }

  if (row >= botY + 1 && row <= botY + 2) {
    const r = 4 - (row - botY - 1) * 1;
    const nx = x / r;
    if (Math.abs(nx) <= 1) return 0.35;
  }

  if (row >= botY + 3 && row <= botY + 4) {
    const r = 5.5;
    const nx = x / r;
    if (Math.abs(nx) <= 1) {
      const edge = 1 - Math.abs(nx);
      return Math.min(edge * 3, 1) * 0.3;
    }
  }

  const hcx = cx + 16;
  const hcy = (rimY + botY) / 2;
  const hdx = (col - hcx) * AR;
  const hdy = (row - hcy) * 0.7;
  const hr = Math.sqrt(hdx * hdx + hdy * hdy);
  const ring = Math.abs(hr - 2.2);
  if (ring < 0.8 && col > cx + 13) {
    return (0.8 - ring) / 0.8 * 0.65;
  }

  return 0;
}

export function CoffeeArt() {
  const preRef = useRef<HTMLPreElement>(null);
  const animRef = useRef<number>(0);

  const render = useCallback((frame: number) => {
    const el = preRef.current;
    if (!el) return;

    const lines: string[] = [];

    for (let y = 0; y < H; y++) {
      let line = "";
      for (let x = 0; x < W; x++) {
        const s = cupShade(x, y);

        if (s > 0.01) {
          const ci = Math.floor(s * (RAMP.length - 1));
          line += RAMP[Math.max(0, Math.min(ci, RAMP.length - 1))];
          continue;
        }

        if (y >= 1 && y < 10) {
          const cx = 22;
          const cols = [cx - 6, cx, cx + 6];
          let ch = " ";
          for (let si = 0; si < 3; si++) {
            const rise = (10 - y) / 9;
            const wave = Math.sin(frame * 0.05 + y * 0.45 + si * 2.1) * (1.5 + rise * 3);
            const dist = Math.abs(x - (cols[si] + wave));
            if (dist < 1.5) {
              const fade = (1 - rise * rise) * (1 - dist / 1.5) * 0.5;
              if (fade > 0.03) {
                const ci = Math.floor(fade * (RAMP.length - 1));
                ch = RAMP[Math.min(ci, RAMP.length - 1)];
              }
            }
          }
          line += ch;
          continue;
        }

        line += " ";
      }
      lines.push(line.trimEnd());
    }

    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    el.textContent = lines.join("\n");
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    function loop(ts: number) {
      if (ts - last > 50) {
        render(frame++);
        last = ts;
      }
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [render]);

  return (
    <pre
      ref={preRef}
      aria-hidden
      className="pointer-events-none select-none whitespace-pre font-mono text-[10px] leading-[1.2] text-gray-400 sm:text-xs"
    />
  );
}
