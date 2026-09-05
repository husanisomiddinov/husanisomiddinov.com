"use client";

import React from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import {
  BOOK_HEIGHT_PX,
  BOOKSHELF_VIEWPORT_MIN_HEIGHT_PX,
  BOOKSHELF_VIEWPORT_PADDING_PX,
} from "@/config/bookshelfLayout";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { ReadingShelfBook } from "@/types";

interface BookshelfProps {
  books: ReadingShelfBook[];
  /**
   * The slug of the book currently open, if any (passed down from the page
   * instead of read from the router — the App Router equivalent of the old
   * `router.query.slug` read).
   */
  currentSlug?: string;
}

function useElementDimensions(ref: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = React.useState<{
    contentBox: { width: number; height: number };
  } | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ contentBox: { width, height } });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return dimensions;
}

export function Bookshelf({ books, currentSlug }: BookshelfProps) {
  const router = useRouter();
  const [bookIndex, setBookIndex] = React.useState(-1);
  const [scroll, setScroll] = React.useState(0);

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const viewportDimensions = useElementDimensions(viewportRef);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [booksInViewport, setBooksInViewport] = React.useState(0);
  const scrollFrameRef = React.useRef<number | null>(null);

  // Unique per-instance id so the SVG paper filter never collides when
  // multiple bookshelves render on the same page.
  const filterId = `paper-${React.useId().replace(/:/g, "")}`;

  const width = 41.5;

  const spineWidth = `${width}px`;
  const coverWidth = `${width * 4}px`;
  const bookWidth = `${width * 5}px`;
  const bookHeight = `${BOOK_HEIGHT_PX}px`;

  const maxScroll = React.useMemo(() => {
    return (
      (width + 12) * (books.length - booksInViewport) +
      (bookIndex > -1 ? width * 4 : 0) +
      5
    );
  }, [bookIndex, books.length, booksInViewport]);

  const boundedRelativeScroll = React.useCallback(
    (incrementX: number) => {
      setScroll((_scroll) =>
        Math.max(0, Math.min(maxScroll, _scroll + incrementX))
      );
    },
    [maxScroll]
  );

  const startScrolling = (direction: number) => {
    setIsScrolling(true);
    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
    }
    // ~4.5px/frame keeps the previous 3px-per-24ms velocity at 60fps while
    // letting the browser throttle on background tabs / low-power devices.
    const step = () => {
      setScroll((_scroll) =>
        Math.max(0, Math.min(maxScroll, _scroll + direction * 4.5))
      );
      scrollFrameRef.current = requestAnimationFrame(step);
    };
    scrollFrameRef.current = requestAnimationFrame(step);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (currentSlug && bookIndex === -1) {
      const normalizedSlug = currentSlug.toLowerCase();
      const idx = books.findIndex((b) =>
        b.slug.toLowerCase().endsWith(`/${normalizedSlug}`)
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronizing open book with the current route prop, not derived render state.
      setBookIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-check on mount/prop change, not on bookIndex.
  }, [books, currentSlug]);

  React.useEffect(() => {
    if (viewportDimensions) {
      const numberOfBooks = viewportDimensions.contentBox.width / (width + 11);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronizing viewport capacity with a ResizeObserver measurement, an external system.
      setBooksInViewport(numberOfBooks);
    }
  }, [viewportDimensions]);

  return (
    <div
      className="relative pointer-events-none"
      style={{
        marginBottom: `-${BOOKSHELF_VIEWPORT_PADDING_PX}px`,
        minHeight: `${BOOKSHELF_VIEWPORT_MIN_HEIGHT_PX}px`,
      }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="8"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="white"
              surfaceScale="1"
              result="diffLight"
            >
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      <div className="relative">
        <div
          className="absolute top-0 left-[-28px] md:left-[-36px] pointer-events-auto"
          style={{ height: bookHeight, display: scroll > 0 ? "block" : "none" }}
        >
          <button
            type="button"
            aria-label="Scroll books left"
            className="flex h-full w-[28px] cursor-pointer items-center justify-center rounded-md max-md:rounded-r-none text-gray-600 hover:bg-brand-500 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            onClick={() => boundedRelativeScroll(-(width + 12) * 3)}
            onMouseEnter={() => startScrolling(-1)}
            onMouseLeave={stopScrolling}
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <div
          ref={viewportRef}
          className="flex items-start gap-1 overflow-x-hidden cursor-grab pointer-events-auto"
          style={{ height: bookHeight }}
        >
          {books.map((book, index) => (
            <button
              key={book.slug}
              type="button"
              className="bookshelf-book"
              aria-label={
                index === bookIndex ? `Close ${book.title}` : `Open ${book.title}`
              }
              aria-expanded={index === bookIndex}
              onClick={() => {
                if (index === bookIndex) {
                  setBookIndex(-1);
                  router.push(`/reading`);
                } else {
                  setBookIndex(index);
                  router.push(book.slug);
                }
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                flexShrink: 0,
                transform: `translateX(-${scroll}px)`,
                width: bookIndex === index ? bookWidth : spineWidth,
                perspective: "1000px",
                WebkitPerspective: "1000px",
                gap: 0,
                transition: isScrolling ? `transform 180ms linear` : `all 620ms ease`,
              }}
            >
              <div
                className="flex shrink-0 items-start justify-center"
                style={{
                  width: spineWidth,
                  height: bookHeight,
                  transformOrigin: "right",
                  backgroundColor: book.spineColor,
                  color: book.textColor,
                  transform: `rotateY(${bookIndex === index ? "-60deg" : "0deg"})`,
                  transition: "all 500ms ease",
                  filter: "brightness(0.8) contrast(2)",
                  transformStyle: "preserve-3d",
                }}
              >
                <span
                  style={{
                    pointerEvents: "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    height: bookHeight,
                    width: spineWidth,
                    opacity: 0.4,
                    filter: `url(#${filterId})`,
                  }}
                />
                <h2
                  className="mt-[12px] select-none overflow-hidden text-xs font-sans font-medium text-ellipsis whitespace-nowrap"
                  style={{
                    writingMode: "vertical-rl",
                    maxHeight: `${BOOK_HEIGHT_PX - 24}px`,
                  }}
                >
                  {book.title}
                </h2>
              </div>
              <div
                className="relative shrink-0 overflow-visible"
                style={{
                  width: coverWidth,
                  height: bookHeight,
                  backgroundColor: book.spineColor,
                  transformOrigin: "left",
                  transform: `rotateY(${bookIndex === index ? "30deg" : "88.8deg"})`,
                  transition: "all 500ms ease",
                  filter: "brightness(0.8) contrast(2)",
                  transformStyle: "preserve-3d",
                }}
              >
                <span
                  style={{
                    pointerEvents: "none",
                    position: "fixed",
                    top: 0,
                    right: 0,
                    zIndex: 50,
                    height: bookHeight,
                    width: coverWidth,
                    opacity: 0.4,
                    filter: `url(#${filterId})`,
                  }}
                />
                <span
                  style={{
                    pointerEvents: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    height: bookHeight,
                    width: coverWidth,
                    background: `linear-gradient(to right, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.5) 3px, rgba(255, 255, 255, 0.25) 4px, rgba(255, 255, 255, 0.25) 6px, transparent 7px, transparent 9px, rgba(255, 255, 255, 0.25) 9px, transparent 12px)`,
                  }}
                />
                <NextImage
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 166px, 166px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center center",
                    transition: "all 500ms ease",
                  }}
                />
              </div>
            </button>
          ))}
        </div>
        <div
          className="absolute top-0 right-[-28px] md:right-[-36px] pl-[10px] pointer-events-auto"
          style={{
            height: bookHeight,
            display: scroll < maxScroll ? "block" : "none",
          }}
        >
          <button
            type="button"
            aria-label="Scroll books right"
            className="flex h-full w-[28px] cursor-pointer items-center justify-center rounded-md max-md:rounded-l-none text-gray-600 hover:bg-brand-500 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            onClick={() => boundedRelativeScroll((width + 12) * 3)}
            onMouseEnter={() => startScrolling(1)}
            onMouseLeave={stopScrolling}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
