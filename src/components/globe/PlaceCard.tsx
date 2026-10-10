import Image from "next/image";
import type { Place } from "@/types";
import { formatVisitDate } from "./formatVisitDate";

interface PlaceCardProps {
  place: Place;
  pinned: boolean;
  onClose: () => void;
}

/** Hover/pinned popover: a polaroid of the most recent photo, then every visit, newest first. */
export function PlaceCard({ place, pinned, onClose }: PlaceCardProps) {
  const photo = place.visits.find((visit) => visit.photo);
  const count = place.visits.length;
  const dated = place.visits.filter((visit) => visit.date);

  return (
    <div className="rounded-lg border border-gray-300 bg-page-bg p-3 shadow-[0_10px_30px_-12px_rgba(35,41,19,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-sm font-bold text-gray-800">{place.name}</p>
          <p className="text-xs text-gray-500">
            {place.country} · {place.home ? "home base" : `${count} ${count === 1 ? "visit" : "visits"}`}
          </p>
        </div>
        {pinned && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-1 cursor-pointer rounded px-1.5 py-0.5 text-base leading-none text-gray-500 hover:text-brand-500"
          >
            ×
          </button>
        )}
      </div>

      <figure className="mt-3 -rotate-2 bg-white p-2.5 pb-8 shadow-[0_6px_16px_-6px_rgba(35,41,19,0.45)]">
        <div className="relative aspect-square w-full overflow-hidden bg-brand-100">
          {photo?.photo && (
            <Image
              src={photo.photo}
              alt={photo.date ? `${place.name}, ${formatVisitDate(photo.date)}` : place.name}
              fill
              sizes="220px"
              // Serve the original file: the optimizer's small, recompressed variants look soft on retina.
              unoptimized
              className="object-cover"
            />
          )}
        </div>
      </figure>

      {place.home && place.lived && (
        <p className="mt-3 text-xs font-bold text-gray-800">Lived here {place.lived}</p>
      )}

      {!place.home && dated.length > 0 && (
        <ol className={`mt-3 flex flex-col gap-2 ${pinned ? "max-h-40 overflow-y-auto pr-1" : ""}`}>
          {dated.map((visit, i) => (
            <li key={i}>
              <p className="text-xs font-bold text-gray-800">{formatVisitDate(visit.date!)}</p>
              {visit.note && <p className="text-sm leading-snug text-gray-600">{visit.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
