import { Button } from "@/components/Button";
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
      <Button href="/writing" className="mt-4">
        All writing &rarr;
      </Button>
    </section>
  );
}
