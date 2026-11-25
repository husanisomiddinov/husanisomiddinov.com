import NextImage from "next/image";

/**
 * A book cover drawn as a closed paperback: the cover image with three page
 * edges peeking out along the right (6px) and bottom (3px), like a book seen
 * slightly from the side. `className` sets the width; the cover keeps a 2:3
 * ratio inside it.
 */
export function BookCover({
  src,
  alt,
  sizes,
  eager = false,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 pr-1.5 pb-[3px] ${className}`}>
      {/* Page edges, deepest first so each one sits under the next. The
          deepest casts a soft ink shadow down and to the right, like the
          book resting on the page. */}
      <span
        aria-hidden="true"
        className="absolute top-[3px] right-0 bottom-0 left-1.5 rounded-sm border border-gray-300 bg-brand-50 shadow-[3px_5px_10px_-2px_rgb(42_41_37/0.22)]"
      />
      <span
        aria-hidden="true"
        className="absolute top-[2px] right-0.5 bottom-[1px] left-1 rounded-sm border border-gray-300 bg-brand-50"
      />
      <span
        aria-hidden="true"
        className="absolute top-[1px] right-1 bottom-[2px] left-0.5 rounded-sm border border-gray-300 bg-brand-50"
      />
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-gray-200">
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          priority={priority}
          style={{ objectFit: "cover" }}
          quality={85}
        />
      </div>
    </div>
  );
}
