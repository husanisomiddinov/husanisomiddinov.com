import Image from "next/image";

export interface MarqueePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const HEIGHT = 240;

/** A looping strip of photos at one shared height, so none is cropped or shrunk. Pauses on hover and focus. With reduced motion it becomes a plain scrollable strip. */
export function PhotoMarquee({ photos, className }: { photos: MarqueePhoto[]; className?: string }) {
  return (
    <div className={`photo-marquee group overflow-hidden ${className ?? ""}`}>
      <div className="photo-marquee-track flex w-max">
        {[false, true].map((duplicate) => (
          <ul
            key={String(duplicate)}
            aria-hidden={duplicate || undefined}
            className={`flex shrink-0 gap-3 pr-3 ${duplicate ? "photo-marquee-copy" : ""}`}
          >
            {photos.map((photo) => (
              <li key={photo.src} className="shrink-0" style={{ height: HEIGHT }}>
                <Image
                  src={photo.src}
                  alt={duplicate ? "" : photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={`${Math.round((HEIGHT * photo.width) / photo.height)}px`}
                  className="h-full w-auto rounded-lg border border-gray-200"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
