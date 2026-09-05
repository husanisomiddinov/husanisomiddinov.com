import NextImage from "next/image";
import type { ImgHTMLAttributes } from "react";

export function MDXImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, width, height, loading = "lazy", className, ...rest } = props;

  if (!src) {
    return null;
  }

  const isRelative = typeof src === "string" && src.startsWith("/");

  // For external images, use a plain img tag.
  if (!isRelative) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, not local to /public.
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`my-4 max-w-full h-auto ${className ?? ""}`}
        {...rest}
      />
    );
  }

  // For relative images, use Next.js Image with optimization.
  const widthNum = typeof width === "string" ? parseInt(width, 10) : width || 800;
  const heightNum = typeof height === "string" ? parseInt(height, 10) : height || 600;

  return (
    <div className="relative my-4 w-full max-w-full">
      <NextImage
        src={src}
        alt={alt || ""}
        width={widthNum}
        height={heightNum}
        loading={loading as "lazy" | "eager"}
        quality={85}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
