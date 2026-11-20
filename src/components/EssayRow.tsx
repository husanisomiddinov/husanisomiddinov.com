import Link from "next/link";
import type { WritingPreview } from "@/lib/posts";

function formatShortDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** One post in a list: just the title and the date, like an index in a notebook. */
export function EssayRow({ post }: { post: WritingPreview }) {
  return (
    <li>
      <Link
        href={`/writing/${post.slug}`}
        className="group flex items-baseline justify-between gap-4 py-1.5 no-underline"
      >
        <span className="text-prose text-ink transition-colors duration-200 group-hover:text-brand-500">
          {post.title}
        </span>
        <span className="shrink-0 font-sans text-sm whitespace-nowrap text-gray-400 tabular-nums">
          {formatShortDate(post.date)}
        </span>
      </Link>
    </li>
  );
}
