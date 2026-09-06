"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { ReadingShelfBook } from "@/types";
import type { ShelfScene } from "./bookshelf/createShelfScene";
import styles from "./bookshelf/Bookshelf.module.css";
import { readingStatusLabel } from "@/lib/reading-status";

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
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<ShelfScene | null>(null);
  const selection = useRef(selected);
  const select = useCallback(
    (index: number) => {
      setSelected(Math.max(0, Math.min(books.length - 1, index)));
    },
    [books.length],
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
  }, [books, select]);

  const book = books[selected];
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
      <div className={styles.transport}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Previous book"
          disabled={selected === 0}
          onClick={() => select(selected - 1)}
        >
          <ChevronLeftIcon />
        </button>
        <input
          className={styles.range}
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
          className={styles.arrow}
          aria-label="Next book"
          disabled={selected === books.length - 1}
          onClick={() => select(selected + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div className={styles.details}>
        <div aria-live="polite" aria-atomic="true">
          <p className={styles.meta}>{readingStatusLabel(book)}</p>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.author}>{book.author}</p>
        </div>
        <Link className={styles.open} href={book.slug}>
          {currentSlug && book.slug === `/reading/${currentSlug}`
            ? "Reading now"
            : "Open book"}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
