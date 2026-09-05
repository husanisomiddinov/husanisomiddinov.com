import Link from "next/link";
import { getAllBooks } from "@/lib/books";
import { CollectionBrowser, type CollectionBook } from "@/components/CollectionBrowser";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Collection | Books | Husan Isomiddinov",
  description: "Search the full shelf, filter by status, and switch between cover and list views.",
  path: "/reading/collection",
});

export default function CollectionPage() {
  const books: CollectionBook[] = getAllBooks().map((b) => {
    const book: CollectionBook = {
      title: b.title,
      author: b.author,
      coverImage: b.coverImage,
      slug: b.slug,
    };
    if (b.date) book.date = b.date;
    if (b.rating != null) book.rating = b.rating;
    return book;
  });

  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <div>
        <Link
          href="/reading"
          className="font-sans text-sm text-gray-500 no-underline hover:text-brand-500"
        >
          ← Back to the shelf
        </Link>
        <h1 className="mt-3 text-lg leading-snug font-bold text-gray-800 md:text-xl">
          The collection
        </h1>
        <p className="mt-1 text-base text-gray-600">
          Every book on the shelf. Search the shelf, filter by status, and switch between
          cover and list views.
        </p>
      </div>

      <CollectionBrowser books={books} />
    </div>
  );
}
