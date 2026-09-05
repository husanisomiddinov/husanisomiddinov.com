import Link from "next/link";
import NextImage from "next/image";
import { getAllWritingMetadata, type WritingPreview } from "@/lib/posts";
import { buildMetadata } from "@/lib/metadata";
import { ArrowRightIcon } from "@/components/icons";

export const metadata = buildMetadata({
  title: "Writing | Husan Isomiddinov",
  description: "Essays and notes by Husan Isomiddinov.",
  path: "/writing",
});

function formatShortDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getYear(date: string): string {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "" : String(d.getFullYear());
}

function groupByYear(posts: WritingPreview[]) {
  const groups: { year: string; posts: WritingPreview[] }[] = [];
  for (const post of posts) {
    const year = getYear(post.date);
    let group = groups.find((g) => g.year === year);
    if (!group) {
      group = { year, posts: [] };
      groups.push(group);
    }
    group.posts.push(post);
  }
  return groups;
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

function EssayRow({ post }: { post: WritingPreview }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group -mx-4 flex w-full items-start gap-4 rounded-lg px-4 py-3 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
    >
      <Thumb post={post} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="line-clamp-2 font-sans text-base leading-snug font-bold text-gray-800">
            {post.title}
          </p>
          <span className="shrink-0 font-sans text-xs whitespace-nowrap text-gray-400">
            {formatShortDate(post.date)}
          </span>
        </div>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
        )}
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p className="font-sans text-xs text-gray-400">{post.readingTime} min read</p>
          <span className="shrink-0 -translate-x-1 text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function WritingPage() {
  const groups = groupByYear(getAllWritingMetadata());

  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      {groups.map((group) => (
        <div key={group.year}>
          <p className="mb-4 font-sans text-sm font-semibold text-gray-500">{group.year}</p>
          <div className="flex w-full flex-col items-stretch gap-5">
            {group.posts.map((post) => (
              <EssayRow key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
