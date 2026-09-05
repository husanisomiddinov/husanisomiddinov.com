import { NumberedList } from "@/components";
import { getFacts } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Facts | Husan Isomiddinov",
  description: "A running list of facts I find worth remembering.",
  path: "/facts",
});

export default function FactsPage() {
  return <NumberedList items={getFacts()} />;
}
