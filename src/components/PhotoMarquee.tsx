import { memo } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "../../content/data/personal/bio-timeline";

function Strip({ photos, copy }: { photos: GalleryPhoto[]; copy?: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className={`flex shrink-0 gap-3 pr-3 ${copy ? "photo-marquee-copy" : ""}`}
    >
      {photos.map((photo) => (
        <li key={photo.src} className="h-60 shrink-0">
          <Image
            src={photo.src}
            alt={copy ? "" : photo.alt}
            width={photo.width}
            height={photo.height}
            // Files are already webp at twice the shown size, so they skip the image optimizer
            // (no first-hit encoding delay) and load early at low priority, so nothing pops in as the strip moves.
            unoptimized
            loading="eager"
            fetchPriority="low"
            decoding="async"
            className="h-full w-auto rounded-lg border border-gray-200"
          />
        </li>
      ))}
    </ul>
  );
}

const PHOTO_HEIGHT = 240; // h-60
const GAP = 12; // gap-3
const COLUMN_WIDTH = 660; // max-w-content
/** Lets two photos that miss the column by a few pixels still count as fitting. */
const FIT_SLACK = 60;

function naturalWidth(photos: GalleryPhoto[]) {
  const widths = photos.reduce(
    (sum, p) => sum + (p.width / p.height) * PHOTO_HEIGHT,
    0,
  );
  return widths + GAP * (photos.length - 1);
}

/** A still row for a few photos. They share one height, which shrinks a little if the row is wider than its container. */
function StaticRow({
  photos,
  className,
}: {
  photos: GalleryPhoto[];
  className?: string;
}) {
  return (
    <ul
      className={`flex gap-3 ${className ?? ""}`}
      style={{ maxWidth: naturalWidth(photos) }}
    >
      {photos.map((photo) => (
        <li
          key={photo.src}
          className="min-w-0"
          style={{ flex: `${photo.width / photo.height} 1 0` }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            unoptimized
            loading="eager"
            fetchPriority="low"
            decoding="async"
            className="h-auto w-full rounded-lg border border-gray-200"
          />
        </li>
      ))}
    </ul>
  );
}

/** A looping strip of photos at one shared height, so none is cropped or shrunk. With reduced motion it becomes a plain scrollable strip. */
export const PhotoMarquee = memo(function PhotoMarquee({
  photos,
  className,
}: {
  photos: GalleryPhoto[];
  className?: string;
}) {
  // Few photos fit in the column, so there is nothing to loop through.
  if (naturalWidth(photos) <= COLUMN_WIDTH + FIT_SLACK) {
    return <StaticRow photos={photos} className={className} />;
  }

  return (
    <div className={`photo-marquee overflow-hidden ${className ?? ""}`}>
      <div className="photo-marquee-track flex w-max">
        <Strip photos={photos} />
        <Strip photos={photos} copy />
      </div>
    </div>
  );
});
