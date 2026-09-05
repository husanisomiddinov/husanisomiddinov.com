import type { ProjectPainting } from "@/types";
import Image from "next/image";

/** Small list-preview file in `public/paintings/thumbs/` (same basename as full painting, `.jpg`). */
function listThumbnailSrc(fullSrc: string): string {
  const file = fullSrc.split("/").pop() ?? "";
  const base = file.replace(/\.[^.]+$/, "");
  return `/paintings/thumbs/${base}.jpg`;
}

interface PaintingThumbProps {
  painting: ProjectPainting;
  width?: number;
  /**
   * Optional aspect ratio (width / height) used to crop the painting via
   * object-fit cover. When omitted, the painting renders at its natural
   * aspect ratio.
   */
  aspectRatio?: number;
}

export function PaintingThumb({
  painting,
  width = 104,
  aspectRatio,
}: PaintingThumbProps) {
  const cropped = typeof aspectRatio === "number";
  const thumbSrc = listThumbnailSrc(painting.src);
  const sizes = `${Math.max(120, width * 2)}px`;
  const sharedImageProps = { src: thumbSrc, sizes, unoptimized: true };

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-md bg-gray-100 leading-none after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:shadow-[inset_0_0_0_1px_rgba(55,53,47,0.08)]"
      style={{
        width: `${width}px`,
        boxShadow:
          "0 1px 2px rgba(55, 53, 47, 0.06), 0 4px 12px rgba(55, 53, 47, 0.05)",
        aspectRatio: cropped ? `${aspectRatio}` : undefined,
      }}
    >
      {cropped ? (
        <Image
          {...sharedImageProps}
          alt=""
          fill
          style={{ objectFit: "cover", display: "block" }}
        />
      ) : (
        <Image
          {...sharedImageProps}
          alt=""
          width={painting.width}
          height={painting.height}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      )}
    </div>
  );
}
