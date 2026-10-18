import Link from "next/link";
import { EssayRow } from "@/components/EssayRow";
import type { WritingPreview } from "@/lib/posts";

export function FeaturedWriting({ posts }: { posts: WritingPreview[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-gray-300 pt-4">
      <div className="flex w-full flex-col items-stretch gap-5">
        {posts.map((post) => (
          <EssayRow key={post.slug} post={post} />
        ))}
      </div>
      <Link
        href="/writing"
        className="font-sans text-sm font-medium text-gray-500 no-underline transition-colors duration-200 hover:text-brand-500"
      >
        All writing
      </Link>
    </section>
  );
}
