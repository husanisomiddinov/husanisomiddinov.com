"use client";

import { useEffect, useState } from "react";

export function useAnimationsEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return enabled;
}

/** Counts up on a timer; stays at 0 when animation is off. */
export function useTick(enabled: boolean, ms: number): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [enabled, ms]);
  return tick;
}

/**
 * Ref for an <animate begin="indefinite">: starts it by hand. begin="0s" counts from page load,
 * so an element mounted later would already be finished. Stable identity, so a re-render doesn't restart it.
 */
export const startMotion = (el: SVGElement | null) => (el as SVGAnimationElement | null)?.beginElement();
