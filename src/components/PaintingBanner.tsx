import type { ProjectPainting } from "@/types";
import Image from "next/image";

interface PaintingBannerProps {
  painting: ProjectPainting;
  priority?: boolean;
}

export function PaintingBanner({
  painting,
  priority = true,
}: PaintingBannerProps) {
  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden rounded-xl leading-none"
        style={{
          boxShadow:
            "0 1px 2px rgba(55, 53, 47, 0.06), 0 6px 20px rgba(55, 53, 47, 0.06)",
        }}
      >
        <Image
          src={painting.src}
          alt={painting.credit}
          width={painting.width}
          height={painting.height}
          sizes="(min-width: 30rem) 30rem, 100vw"
          style={{ width: "100%", height: "auto", display: "block" }}
          priority={priority}
        />
      </div>
      <p className="mt-3 text-center font-sans text-xs leading-[1.6] text-gray-500">
        {painting.credit}
      </p>
    </div>
  );
}
