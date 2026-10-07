import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

interface ScrollRail {
  /** Attach to the outer container wrapping every item's rail segment. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Attach to each item's root element via `ref={registerItem(index)}`. */
  registerItem: (index: number) => (el: HTMLElement | null) => void;
  /** Index of the item currently crossing the center of the viewport. */
  activeIndex: number;
  /** 0-100, how far scrolled through the container (viewport-center-relative). */
  fillPercent: number;
  reducedMotion: boolean;
}

/**
 * Drives a scroll-synced rail: a fill line whose height tracks scroll
 * progress, and an "active" item index that updates as each item
 * crosses the center of the viewport. Both are measured against the
 * same reference point (viewport center) so they stay visually in sync.
 */
export function useScrollRail(itemCount: number): ScrollRail {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fillPercent, setFillPercent] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemRefs.current.indexOf(
            entry.target as HTMLElement,
          );
          if (index !== -1) setActiveIndex(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [itemCount]);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      const progress = (viewportCenter - rect.top) / rect.height;
      setFillPercent(Math.min(1, Math.max(0, progress)) * 100);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const registerItem = (index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  };

  return {
    containerRef,
    registerItem,
    activeIndex,
    fillPercent,
    reducedMotion,
  };
}
