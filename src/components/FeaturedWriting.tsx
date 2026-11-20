import { MoreLink } from "@/components/MoreLink";
import { EssayRow } from "@/components/EssayRow";
import type { WritingPreview } from "@/lib/posts";

export function FeaturedWriting({
  posts,
  total,
}: {
  posts: WritingPreview[];
  /** Size of the full list, shown in the link to it. */
  total: number;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-gray-300 pt-4">
      <ul className="flex w-full flex-col [&>li:first-child]:border-t-0">
        {posts.map((post) => (
          <EssayRow key={post.slug} post={post} />
        ))}
      </ul>
      <MoreLink href="/writing" className="mt-5">
        All {total} posts
      </MoreLink>
    </section>
  );
}
