import Image from "next/image";
import { Button } from "./Button";

interface CtaSectionProps {
  title?: string;
  text: string;
  href: string;
  buttonLabel: string;
  /** Optional illustration shown on the right. */
  image?: string;
  className?: string;
}

/** Heading, short text and a green button, with an optional image on the right. */
export function CtaSection({
  title,
  text,
  href,
  buttonLabel,
  image,
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
      {image && (
        <Image
          src={image}
          alt=""
          width={500}
          height={500}
          sizes="(max-width: 640px) 112px, 144px"
          className="h-auto w-28 shrink-0 sm:w-36"
        />
      )}
    </section>
  );
}
