import { notFound } from "next/navigation";
import { VisitGlobeLoader } from "@/components/globe/VisitGlobeLoader";
import { getPlaces } from "@/lib/data";
import { isDevOnlyAvailable } from "@/lib/dev-only";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Places",
  description: "A globe of everywhere I've been.",
  path: "/studio/places",
});

export default function PlacesPage() {
  // Local-only: 404 on any deployed build, before the (untracked) places data is read.
  if (!isDevOnlyAvailable) notFound();
  return <VisitGlobeLoader places={getPlaces()} />;
}
