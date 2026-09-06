"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  ArrowRightIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "@/components/icons";
import type { ReadingShelfBook } from "@/types";
import { isBookRead as isRead } from "@/lib/reading-status";

export type CollectionBook = Pick<
  ReadingShelfBook,
  "title" | "author" | "date" | "rating" | "coverImage" | "slug"
>;

type StatusFilter = "all" | "read" | "reading";
type ViewMode = "grid" | "list";

function FilterTab({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`border-b pb-1 font-sans text-sm font-medium transition-colors duration-200 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 ${
        isActive
          ? "border-brand-500 text-brand-500"
          : "border-transparent text-gray-500"
      }`}
    >
      {label}
      <span className="ml-1.5 font-normal text-gray-400">{count}</span>
    </button>
  );
}

function ViewToggleButton({
  label,
  isActive,
  onClick,
  children,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 ${
        isActive
          ? "bg-brand-500 text-brand-50"
          : "text-gray-600 hover:text-brand-500"
      }`}
    >
      {children}
    </button>
  );
}

function GridCard({ book, eager }: { book: CollectionBook; eager: boolean }) {
  return (
    <Link
      href={book.slug}
      className="group -m-2 block rounded-lg p-2 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
    >
      <div className="flex flex-col items-start gap-2">
        <div
          className="relative w-full overflow-hidden rounded-lg border border-gray-200"
          style={{ aspectRatio: "2 / 3" }}
        >
          <NextImage
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 160px"
            loading={eager ? "eager" : "lazy"}
            style={{ objectFit: "cover" }}
            quality={85}
          />
        </div>
        <div className="w-full">
          <p className="line-clamp-2 font-sans text-sm leading-snug font-bold text-gray-800">
            {book.title}
          </p>
          <p className="truncate font-sans text-xs text-gray-500">
            {book.author}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ListRow({ book }: { book: CollectionBook }) {
  return (
    <Link
      href={book.slug}
      className="group -mx-4 block w-full rounded-lg px-4 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-2.5">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="truncate font-sans text-base font-bold text-gray-800">
            {book.title}
          </p>
          <p className="shrink-0 truncate font-sans text-sm text-gray-500">
            {book.author}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-sans text-xs whitespace-nowrap text-gray-400">
            {isRead(book)
              ? book.rating == null
                ? "Read"
                : `${book.rating}/10`
              : "Reading"}
          </span>
          <span className="-translate-x-1 text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CollectionBrowser({ books }: { books: CollectionBook[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const counts = useMemo(() => {
    const read = books.filter(isRead).length;
    return { all: books.length, read, reading: books.length - read };
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      if (status === "read" && !isRead(book)) return false;
      if (status === "reading" && isRead(book)) return false;
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      );
    });
  }, [books, query, status]);

  return (
    <div className="flex flex-col items-stretch gap-6">
      <div className="flex items-center gap-2 border-b border-gray-300 pb-2">
        <SearchIcon className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or author"
          aria-label="Search the collection"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent font-sans text-base text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <FilterTab
            label="All"
            count={counts.all}
            isActive={status === "all"}
            onClick={() => setStatus("all")}
          />
          <FilterTab
            label="Read"
            count={counts.read}
            isActive={status === "read"}
            onClick={() => setStatus("read")}
          />
          <FilterTab
            label="Reading"
            count={counts.reading}
            isActive={status === "reading"}
            onClick={() => setStatus("reading")}
          />
        </div>
        <div className="flex items-center gap-1">
          <ViewToggleButton
            label="Grid view"
            isActive={view === "grid"}
            onClick={() => setView("grid")}
          >
            <GridIcon />
          </ViewToggleButton>
          <ViewToggleButton
            label="List view"
            isActive={view === "list"}
            onClick={() => setView("list")}
          >
            <ListIcon />
          </ViewToggleButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-base text-gray-500">
          No books match your search.
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((book, index) => (
            <GridCard key={book.slug} book={book} eager={index < 8} />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((book) => (
            <ListRow key={book.slug} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
