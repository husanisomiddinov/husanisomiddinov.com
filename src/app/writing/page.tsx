import { EssayRow } from "@/components/EssayRow";
import { getAllWritingMetadata } from "@/lib/posts";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Writing",
  description: "Essays and notes by Husan Isomiddinov.",
  path: "/writing",
});

export default function WritingPage() {
  return (
    <ul className="-mt-4 flex w-full flex-col [&>li:first-child]:border-t-0">
      {getAllWritingMetadata().map((post) => (
        <EssayRow key={post.slug} post={post} />
      ))}
    </ul>
  );
}
