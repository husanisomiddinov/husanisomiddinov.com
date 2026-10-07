"use client";

import { useEffect, useRef } from "react";

const FRAMES = [
  [
    "        .  :  .        ",
    "       .   :   .       ",
    "        .  :  .        ",
    "         . : .         ",
    "    .---~~~~~~~~---.   ",
    "    |               |  ",
    "    |               |--|",
    "    |               |  |",
    "    |               |--|",
    "    |               |  ",
    "     \\             /   ",
    "      \\           /    ",
    "       \\_________/     ",
    "       /=========\\     ",
  ],
  [
    "       .   :   .       ",
    "        .  :  .        ",
    "       .   :   .       ",
    "        .  : .         ",
    "    .---~~~~~~~~---.   ",
    "    |               |  ",
    "    |               |--|",
    "    |               |  |",
    "    |               |--|",
    "    |               |  ",
    "     \\             /   ",
    "      \\           /    ",
    "       \\_________/     ",
    "       /=========\\     ",
  ],
  [
    "      .    :    .      ",
    "       .   :   .       ",
    "        .  :  .        ",
    "         . : .         ",
    "    .---~~~~~~~~---.   ",
    "    |               |  ",
    "    |               |--|",
    "    |               |  |",
    "    |               |--|",
    "    |               |  ",
    "     \\             /   ",
    "      \\           /    ",
    "       \\_________/     ",
    "       /=========\\     ",
  ],
  [
    "       .   :   .       ",
    "      .    :    .      ",
    "       .   :   .       ",
    "        .  : .         ",
    "    .---~~~~~~~~---.   ",
    "    |               |  ",
    "    |               |--|",
    "    |               |  |",
    "    |               |--|",
    "    |               |  ",
    "     \\             /   ",
    "      \\           /    ",
    "       \\_________/     ",
    "       /=========\\     ",
  ],
];

export function CoffeeArt() {
  const preRef = useRef<HTMLPreElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    el.textContent = FRAMES[0].join("\n");

    const id = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % FRAMES.length;
      el.textContent = FRAMES[frameRef.current].join("\n");
    }, 400);

    return () => clearInterval(id);
  }, []);

  return (
    <pre
      ref={preRef}
      aria-hidden
      className="pointer-events-none select-none text-[10px] leading-[1.4] text-gray-400 sm:text-xs"
    />
  );
}
