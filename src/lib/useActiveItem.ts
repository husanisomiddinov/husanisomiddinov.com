import { useEffect, useRef, useState } from "react";

interface ActiveItem {
  /** Attach to each item's root element via `ref={registerItem(index)}`. */
  registerItem: (index: number) => (el: HTMLElement | null) => void;
  /** Index of the item currently crossing the center of the viewport. */
  activeIndex: number;
}

/** Tracks which item is crossing the center of the viewport. */
export function useActiveItem(itemCount: number): ActiveItem {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const registerItem = (index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  };

  return { registerItem, activeIndex };
}
