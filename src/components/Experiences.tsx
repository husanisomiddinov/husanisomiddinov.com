import Image from "next/image";
import type { Experience, ExperienceImage } from "@/types";

function ExperienceRow({ experience }: { experience: Experience }) {
  const {
    name,
    role,
    date,
    description,
    logo,
    logoColor,
    logoScale,
    url,
    images,
  } = experience;
  const logoStyle = logoScale
    ? { transform: `scale(${logoScale})`, transformOrigin: "center" }
    : undefined;

  return (
    <div
      className="relative grid gap-x-4 py-5"
      style={{ gridTemplateColumns: "36px 1fr" }}
    >
      <div className="relative h-9 w-9">
        <Image
          src={logoColor ?? logo}
          alt={`${name} logo`}
          fill
          sizes="36px"
          loading="eager"
          style={logoStyle}
          className="object-contain"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex w-full flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h3 className="font-sans text-lg font-bold text-gray-800">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 no-underline transition-colors duration-200 ease-out hover:text-brand-500 after:absolute after:inset-0 after:content-['']"
              >
                {name}
              </a>
            ) : (
              name
            )}
          </h3>
          <span className="shrink-0 font-sans text-sm text-gray-500">
            {date}
          </span>
        </div>
        <p className="font-sans text-sm text-gray-500">{role}</p>
        <p className="text-prose text-ink">{description}</p>
        {images && images.length > 0 && (
          <ExperienceGallery images={images} alt={`${name} photos`} />
        )}
      </div>
    </div>
  );
}

function ExperienceGallery({
  images,
  alt,
}: {
  images: ExperienceImage[];
  alt: string;
}) {
  const [main, ...side] = images;

  if (side.length === 0) {
    return (
      <div className="mt-2 w-full overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={main.src}
          alt={alt}
          width={main.width}
          height={main.height}
          quality={95}
          sizes="(max-width: 640px) 100vw, 660px"
          className="h-auto w-full"
        />
      </div>
    );
  }

  // With just one or two side photos, every photo (including the
  // side ones) can render at its own true aspect ratio: solve for the
  // column-width split where the main photo and the stacked side
  // column land at the same total height, so nothing is cropped and
  // the block still reads as one clean aligned rectangle.
  if (side.length <= 2) {
    // The gap-1 (4px) seams between stacked side photos are fixed
    // pixel amounts while the columns are percentage-based, so the
    // solve is only exact at one reference width - use the page's
    // content width (--max-width-content, 660px), since that's what
    // this row renders at on any viewport wide enough to show the
    // full-size gallery.
    const GAP_PX = 4;
    const REFERENCE_WIDTH_PX = 660;
    const mainInverseRatio = main.height / main.width;
    const sideInverseRatioSum = side.reduce(
      (sum, img) => sum + img.height / img.width,
      0,
    );
    const sideGapTotal = GAP_PX * (side.length - 1);
    const sideFraction =
      (mainInverseRatio - sideGapTotal / REFERENCE_WIDTH_PX) /
      (sideInverseRatioSum + mainInverseRatio);
    const mainFraction = 1 - sideFraction;

    return (
      <div className="mt-2 flex w-full gap-1 overflow-hidden rounded-lg border border-gray-200">
        <div style={{ width: `${mainFraction * 100}%` }} className="shrink-0">
          <Image
            src={main.src}
            alt={alt}
            width={main.width}
            height={main.height}
            quality={95}
            sizes="(max-width: 640px) 60vw, 400px"
            className="h-auto w-full"
          />
        </div>
        <div
          style={{ width: `${sideFraction * 100}%` }}
          className="flex shrink-0 flex-col gap-1 overflow-hidden"
        >
          {side.map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              aria-hidden
              width={img.width}
              height={img.height}
              quality={95}
              sizes="(max-width: 640px) 40vw, 260px"
              className="h-auto w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  // With three or more side photos, lay them out as a 2-column grid inside
  // the same framed block as the main photo. The main keeps its natural
  // aspect ratio and sets the block height; the grid stretches to match it,
  // so both columns live under one border and align exactly. Thumbnails are
  // cropped to fill (object-cover); an odd final photo spans both columns so
  // there's no empty cell.
  const mainWidthPct = 56;
  const sideWidthPct = 100 - mainWidthPct;
  const sideRows = Math.ceil(side.length / 2);
  const oddLast = side.length % 2 === 1;

  return (
    <div className="mt-2 flex w-full items-stretch gap-1 overflow-hidden rounded-lg border border-gray-200">
      <div style={{ width: `${mainWidthPct}%` }} className="shrink-0">
        <Image
          src={main.src}
          alt={alt}
          width={main.width}
          height={main.height}
          quality={95}
          sizes="(max-width: 640px) 56vw, 370px"
          className="block h-auto w-full"
        />
      </div>
      <div
        style={{
          width: `${sideWidthPct}%`,
          gridTemplateRows: `repeat(${sideRows}, 1fr)`,
        }}
        className="grid shrink-0 grid-cols-2 gap-1"
      >
        {side.map((img, i) => (
          <div
            key={img.src}
            className={`relative overflow-hidden ${
              oddLast && i === side.length - 1 ? "col-span-2" : ""
            }`}
          >
            <Image
              src={img.src}
              alt=""
              aria-hidden
              fill
              quality={95}
              sizes="(max-width: 640px) 22vw, 145px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Experiences({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-6 flex w-full flex-col">
      {experiences.map((experience) => (
        <ExperienceRow key={experience.slug} experience={experience} />
      ))}
    </div>
  );
}
