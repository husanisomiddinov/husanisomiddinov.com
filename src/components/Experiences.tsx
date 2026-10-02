import Image from "next/image";
import type { Experience, ExperienceImage } from "@/types";

function ExperienceRow({
  experience,
  isFirst,
  isLast,
}: {
  experience: Experience;
  isFirst: boolean;
  isLast: boolean;
}) {
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
    <div className="group relative -mx-4 grid grid-cols-[12px_36px_1fr] gap-x-4 rounded-lg px-4 py-5 transition-colors duration-300 ease-out hover:bg-gray-800/[0.03]">
      <div className="relative flex justify-center">
        <span
          aria-hidden
          className={`absolute left-1/2 w-px -translate-x-1/2 bg-gray-300 ${isFirst ? "top-1/2" : "top-0"} ${isLast ? "bottom-1/2" : "bottom-0"}`}
        />
        <span
          aria-hidden
          className="relative z-10 mt-1.5 h-[9px] w-[9px] rounded-[2px] border border-gray-400 bg-[var(--color-page-bg)] transition-colors duration-300 ease-out group-hover:border-gray-800"
        />
      </div>
      <div className="relative h-9 w-9">
        {logoColor ? (
          <>
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              sizes="36px"
              loading="eager"
              style={logoStyle}
              className="object-contain opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />
            <Image
              src={logoColor}
              alt=""
              aria-hidden
              fill
              sizes="36px"
              loading="eager"
              style={logoStyle}
              className="object-contain opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          </>
        ) : (
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            sizes="36px"
            loading="eager"
            style={logoStyle}
            className="object-contain opacity-70"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex w-full items-baseline justify-between gap-3">
          <h3 className="font-sans text-base font-bold text-gray-800">
            {role}
          </h3>
          <span className="shrink-0 font-sans text-sm text-gray-500">
            {date}
          </span>
        </div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit font-sans text-sm text-gray-500 underline decoration-dotted decoration-brand-300 underline-offset-4 transition-colors duration-300 ease-out hover:text-brand-500 hover:decoration-brand-500 after:absolute after:inset-0 after:content-['']"
          >
            {name}
          </a>
        ) : (
          <p className="font-sans text-sm text-gray-500">{name}</p>
        )}
        <p className="text-[0.9375rem] leading-[1.6] text-gray-600 opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100">
          {description}
        </p>
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

  // Every photo renders at its own true aspect ratio — nothing is
  // cropped. The side column stacks under its own width; the main
  // column's width is solved so both columns land at the same total
  // height, so the block still reads as one clean aligned rectangle.
  const mainInverseRatio = main.height / main.width;
  const sideInverseRatioSum = side.reduce(
    (sum, img) => sum + img.height / img.width,
    0,
  );
  const sideFraction =
    mainInverseRatio / (sideInverseRatioSum + mainInverseRatio);
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
        className="flex shrink-0 flex-col gap-1"
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

export function Experiences({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex w-full flex-col">
      {experiences.map((experience, index) => (
        <ExperienceRow
          key={experience.slug}
          experience={experience}
          isFirst={index === 0}
          isLast={index === experiences.length - 1}
        />
      ))}
    </div>
  );
}
