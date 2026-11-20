import Link from "next/link";
import type { WritingPreview } from "@/lib/posts";

function formatLongDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** One post in a list: the title in the heading serif as a link, the full date under it, a hairline above. */
export function EssayRow({ post }: { post: WritingPreview }) {
  return (
    <li className="border-t border-gray-300">
      <Link
        href={`/writing/${post.slug}`}
        className="group flex flex-col gap-1 py-4 no-underline"
      >
        <span className="font-heading tracking-heading text-xl leading-snug text-brand-500 transition-colors duration-200 group-hover:text-brand-600">
          {post.title}
        </span>
        <span className="font-heading text-base text-gray-500">{formatLongDate(post.date)}</span>
      </Link>
    </li>
  );
}
