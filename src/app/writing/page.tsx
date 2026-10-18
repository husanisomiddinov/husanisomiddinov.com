import { EssayRow } from "@/components/EssayRow";
import { getAllWritingMetadata, type WritingPreview } from "@/lib/posts";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Writing",
  description: "Essays and notes by Husan Isomiddinov.",
  path: "/writing",
});

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
