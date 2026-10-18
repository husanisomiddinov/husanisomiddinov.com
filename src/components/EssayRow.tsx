import Link from "next/link";
import NextImage from "next/image";
import type { WritingPreview } from "@/lib/posts";

function formatShortDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Thumb({ post }: { post: WritingPreview }) {
  if (post.cover) {
    return (
      <div className="relative size-[52px] shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:size-[60px]">
        <NextImage src={post.cover} alt="" fill sizes="60px" style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 sm:size-[60px]">
      <span className="font-sans text-xl font-medium text-brand-500">
        {post.title.charAt(0)}
      </span>
    </div>
  );
}

export function EssayRow({ post }: { post: WritingPreview }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex items-start gap-4 py-3 hover:no-underline"
    >
      <Thumb post={post} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="line-clamp-2 font-sans text-base leading-snug font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-500">
            {post.title}
          </p>
          <span className="shrink-0 font-sans text-xs whitespace-nowrap text-gray-400">
            {formatShortDate(post.date)}
          </span>
        </div>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-prose-sm text-gray-600">{post.excerpt}</p>
        )}
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p className="font-sans text-xs text-gray-400">{post.readingTime} min read</p>
        </div>
      </div>
    </Link>
  );
}
