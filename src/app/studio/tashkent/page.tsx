import { getTashkentDining } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { TashkentAccordion } from "@/components/TashkentAccordion";

export const metadata = buildMetadata({
  title: "Tashkent Dining Recommendations | Studio | Husan Isomiddinov",
  path: "/studio/tashkent",
});

export default function TashkentPage() {
  const categories = getTashkentDining();

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <p className="text-base leading-[1.6] text-gray-600">
        Home devours me. Eats me alive. I can&apos;t be productive at all when my
        bed is a glimpse away. Naturally, I go out a lot. To cafes (mostly),
        restaurants, and bakeries (sometimes). So I thought curating my
        personal list of dining recommendations in the city would be
        interesting. (The list is subjective and I probably missed some
        places.)
      </p>

      <TashkentAccordion categories={categories} />
    </div>
  );
}
