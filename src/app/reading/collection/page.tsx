import { getAllBooks } from "@/lib/books";
import { CollectionBrowser, type CollectionBook } from "@/components/CollectionBrowser";
import { Breadcrumbs, PageTitle } from "@/components";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Collection - Husan Isomiddinov",
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
        <Breadcrumbs
          crumbs={[
            { label: "Books", href: "/reading" },
            { label: "Collection", href: "/reading/collection" },
          ]}
        />
        <PageTitle className="mt-3">The collection</PageTitle>
        <p className="mt-1 text-base text-gray-600">
          Every book on the shelf. Search the shelf, filter by status, and switch between
          cover and list views.
        </p>
      </div>

      <CollectionBrowser books={books} />
    </div>
  );
}
