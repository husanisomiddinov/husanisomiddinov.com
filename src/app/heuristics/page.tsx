import { NumberedList } from "@/components";
import { getHeuristics } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Heuristics | Husan Isomiddinov",
  description: "Rules of thumb and mental models I use to make decisions.",
  path: "/heuristics",
});

export default function HeuristicsPage() {
  return <NumberedList items={getHeuristics()} />;
}
