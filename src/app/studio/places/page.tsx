import { PageTitle, BackLink } from "@/components";
import { VisitGlobeLoader } from "@/components/globe/VisitGlobeLoader";
import { getPlaces } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Places",
  description: "A globe of everywhere I've been. One dot per place, bigger the more I return.",
  path: "/studio/places",
});

export default function PlacesPage() {
  const places = getPlaces();

  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <div>
        <BackLink href="/studio">← idk</BackLink>
        <PageTitle className="mt-3">Places</PageTitle>
        <p className="mt-1 text-base text-gray-600">Everywhere I&apos;ve been, one dot per place.</p>
      </div>
      <VisitGlobeLoader places={places} />
    </div>
  );
}
