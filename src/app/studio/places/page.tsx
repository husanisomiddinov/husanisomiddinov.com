import { VisitGlobeLoader } from "@/components/globe/VisitGlobeLoader";
import { getPlaces } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Places",
  description: "A globe of everywhere I've been. One dot per place, bigger the more I return.",
  path: "/studio/places",
});

export default function PlacesPage() {
  return <VisitGlobeLoader places={getPlaces()} />;
}
