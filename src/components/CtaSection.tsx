import Link from "next/link";

interface CtaSectionProps {
  title: string;
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
      <div className="flex flex-col items-start gap-3">
        <h2 className="font-heading tracking-heading text-2xl font-bold text-gray-800">
          {title}
        </h2>
        <p className="max-w-sm text-prose text-gray-600">{text}</p>
        <Link
          href={href}
          className="mt-1 rounded-lg bg-brand-500 px-5 py-2.5 font-sans text-sm font-bold text-brand-50 no-underline transition-colors hover:bg-brand-600"
        >
          {buttonLabel}
        </Link>
      </div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="w-28 shrink-0 sm:w-36" />
      )}
    </section>
  );
}
