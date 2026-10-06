"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { ReadingShelfBook } from "@/types";
import type { ShelfScene } from "./bookshelf/createShelfScene";
import styles from "./bookshelf/Bookshelf.module.css";
import { BookStatus } from "@/components/BookStatus";

interface BookshelfProps {
  books: ReadingShelfBook[];
  currentSlug?: string;
}

export function Bookshelf({ books, currentSlug }: BookshelfProps) {
  return (
    <Shelf
      key={currentSlug ?? "library"}
      books={books}
      currentSlug={currentSlug}
    />
  );
}

const arrowClass =
  "grid size-7 shrink-0 cursor-pointer place-items-center rounded-md border border-gray-300 text-gray-500 transition-colors duration-200 hover:border-brand-500 hover:text-brand-500 disabled:cursor-default disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500";

function Shelf({ books, currentSlug }: BookshelfProps) {
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      books.findIndex((book) => book.slug === `/reading/${currentSlug}`),
    ),
  );
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<ShelfScene | null>(null);
  const selection = useRef(selected);
  const select = useCallback(
    (index: number) => {
      setSelected(Math.max(0, Math.min(books.length - 1, index)));
    },
    [books.length],
  );

  const open = useCallback(
    (index: number) => {
      const target = books[index]?.slug;
      if (target && target !== `/reading/${currentSlug}`) router.push(target);
    },
    [books, currentSlug, router],
  );

  useEffect(() => {
    selection.current = selected;
    scene.current?.select(selected);
  }, [selected]);

  useEffect(() => {
    const element = host.current;
    if (!element || books.length === 0) return;
    let disposed = false;
    const unavailable = (error: unknown) => {
      if (disposed) return;
      console.error("Bookshelf: 3D rendering unavailable", error);
      setStatus("unavailable");
    };
    // Only the renderer is lazy-loaded. The book controls are server-rendered.
    import("./bookshelf/createShelfScene")
      .then(({ createShelfScene }) => {
        if (disposed) return;
        scene.current = createShelfScene(
          element,
          books,
          selection.current,
          select,
          open,
          unavailable,
        );
        setStatus("ready");
      })
      .catch(unavailable);
    return () => {
      disposed = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, [books, select, open]);

  const book = books[selected];
  const progress = books.length > 1 ? (selected / (books.length - 1)) * 100 : 0;
  if (!book)
    return (
      <section className={styles.empty}>
        <h2>The shelf is waiting.</h2>
        <p>Books will appear here as the collection grows.</p>
      </section>
    );

  return (
    <section className={styles.shelf} aria-label="Interactive bookshelf">
      <div className={styles.stage}>
        <div ref={host} className={styles.canvas} aria-hidden="true" />
        {status !== "ready" && (
          <div className={styles.fallback}>
            <Image
              src={book.coverImage}
              alt=""
              width={144}
              height={216}
              loading="eager"
            />
            <span role="status">
              {status === "loading"
                ? "Preparing the shelf…"
                : "Cover view · 3D is unavailable on this device"}
            </span>
          </div>
        )}
      </div>
      <div className="my-1 flex items-center gap-3">
        <button
          type="button"
          className={arrowClass}
          aria-label="Previous book"
          disabled={selected === 0}
          onClick={() => select(selected - 1)}
        >
          <ChevronLeftIcon className="size-3.5" />
        </button>
        <input
          className={styles.range}
          style={{ "--progress": `${progress}%` } as CSSProperties}
          type="range"
          min={0}
          max={books.length - 1}
          value={selected}
          aria-label="Browse bookshelf"
          aria-valuetext={`${book.title} by ${book.author}`}
          onChange={(event) => select(Number(event.target.value))}
        />
        <button
          type="button"
          className={arrowClass}
          aria-label="Next book"
          disabled={selected === books.length - 1}
          onClick={() => select(selected + 1)}
        >
          <ChevronRightIcon className="size-3.5" />
        </button>
      </div>
      <div
        className="flex flex-col items-start gap-2 border-t border-gray-300 pt-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 className="text-base leading-snug font-bold text-balance text-gray-800">
          {book.title}
        </h2>
        <p className="font-sans text-base text-gray-500">{book.author}</p>
        <BookStatus book={book} />
      </div>
    </section>
  );
}
