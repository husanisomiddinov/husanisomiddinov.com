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

/** A looping strip of photos at one shared height, so none is cropped or shrunk. With reduced motion it becomes a plain scrollable strip. */
export const PhotoMarquee = memo(function PhotoMarquee({ photos, className }: { photos: GalleryPhoto[]; className?: string }) {
  return (
    <div className={`photo-marquee overflow-hidden ${className ?? ""}`}>
      <div className="photo-marquee-track flex w-max">
        <Strip photos={photos} />
        <Strip photos={photos} copy />
      </div>
    </div>
  );
});
