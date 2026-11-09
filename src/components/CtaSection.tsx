import type { ReactNode } from "react";
import Image from "next/image";
import { Button } from "./Button";

interface CtaSectionProps {
  title?: string;
  text: string;
  href: string;
  buttonLabel: string;
  /** Optional still illustration shown on the right, from a path under /public. */
  image?: string;
  /** Optional custom illustration on the right (for example an animated one). Wins over `image`. */
  illustration?: ReactNode;
  className?: string;
}

const illustrationSize = "w-28 shrink-0 sm:w-36";

/** Heading, short text and a green button, with an optional illustration on the right. */
export function CtaSection({
  title,
  text,
  href,
  buttonLabel,
  image,
  illustration,
  className,
}: CtaSectionProps) {
  return (
    <section
      className={`flex items-center justify-between gap-6 ${className ?? ""}`}
    >
      <div className="flex min-w-0 flex-col items-start gap-3">
        {title && (
          <h2 className="font-heading tracking-heading text-2xl font-bold text-gray-800">
            {title}
          </h2>
        )}
        <p className="text-prose text-ink">{text}</p>
        <Button href={href} className="mt-1">
          {buttonLabel}
        </Button>
      </div>
      {illustration ??
        (image && (
          <Image
            src={image}
            alt=""
            width={500}
            height={500}
            sizes="(max-width: 640px) 112px, 144px"
            className={`h-auto ${illustrationSize}`}
          />
        ))}
    </section>
  );
}
