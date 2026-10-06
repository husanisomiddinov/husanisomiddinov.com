"use client";

import Image from "next/image";
import { useScrollRail } from "@/lib/useScrollRail";
import type { Experience, ExperienceImage } from "@/types";

/** Rail column width in px — keep in sync with the grid-cols value below. */
const RAIL_WIDTH = 12;

function ExperienceRow({
  experience,
  isFirst,
  isLast,
  active,
  registerRef,
}: {
  experience: Experience;
  isFirst: boolean;
  isLast: boolean;
  active: boolean;
  registerRef: (el: HTMLElement | null) => void;
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
    <div
      ref={registerRef}
      className={`group relative -mx-4 grid gap-x-4 rounded-lg px-4 py-5 transition-colors duration-300 ease-out hover:bg-gray-800/[0.03] ${active ? "bg-gray-800/[0.03]" : ""}`}
      style={{ gridTemplateColumns: `${RAIL_WIDTH}px 36px 1fr` }}
    >
      <div className="relative flex justify-center">
        <span
          aria-hidden
          className={`absolute left-1/2 w-px -translate-x-1/2 bg-gray-300 ${isFirst ? "top-1/2" : "top-0"} ${isLast ? "bottom-1/2" : "bottom-0"}`}
        />
        <span
          aria-hidden
          className={`relative z-10 mt-1.5 h-[9px] w-[9px] rounded-[2px] border transition-colors duration-500 ease-out group-hover:border-brand-600 group-hover:bg-brand-500 ${
            active
              ? "border-brand-600 bg-brand-500"
              : "border-gray-400 bg-[var(--color-page-bg)]"
          }`}
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
              className={`object-contain opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-0 ${active ? "opacity-0" : ""}`}
            />
            <Image
              src={logoColor}
              alt=""
              aria-hidden
              fill
              sizes="36px"
              loading="eager"
              style={logoStyle}
              className={`object-contain opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 ${active ? "opacity-100" : ""}`}
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
        <p
          className={`text-[0.9375rem] leading-[1.6] text-gray-600 opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100 ${active ? "opacity-100" : ""}`}
        >
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

  // With just one or two side photos, every photo (including the
  // side ones) can render at its own true aspect ratio: solve for the
  // column-width split where the main photo and the stacked side
  // column land at the same total height, so nothing is cropped and
  // the block still reads as one clean aligned rectangle.
  if (side.length <= 2) {
    // The gap-1 (4px) seams between stacked side photos are fixed
    // pixel amounts while the columns are percentage-based, so the
    // solve is only exact at one reference width — use the page's
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

  // With three or more side photos, stacking them all in one
  // exact-fit column (above) squeezes each one down to a sliver to
  // match the main photo's height. Past two, switch to a proper
  // 2-column square thumbnail grid instead — a light, expected crop
  // for small previews, in exchange for each one actually being
  // legible. The main photo still keeps its full aspect ratio.
  const mainWidthPct = 56;
  const sideWidthPct = 100 - mainWidthPct;

  return (
    <div className="mt-2 flex w-full items-start gap-1">
      <div
        style={{ width: `${mainWidthPct}%` }}
        className="shrink-0 overflow-hidden rounded-lg border border-gray-200"
      >
        <Image
          src={main.src}
          alt={alt}
          width={main.width}
          height={main.height}
          quality={95}
          sizes="(max-width: 640px) 56vw, 370px"
          className="h-auto w-full"
        />
      </div>
      <div
        style={{ width: `${sideWidthPct}%` }}
        className="grid shrink-0 grid-cols-2 gap-1"
      >
        {side.map((img) => (
          <div
            key={img.src}
            className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
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
  const { containerRef, registerItem, activeIndex, fillPercent, reducedMotion } =
    useScrollRail(experiences.length);

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative mt-6 flex w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 w-px bg-brand-500"
        style={{
          left: RAIL_WIDTH / 2,
          height: `${fillPercent}%`,
          transition: reducedMotion ? "none" : "height 150ms linear",
        }}
      />
      {experiences.map((experience, index) => (
        <ExperienceRow
          key={experience.slug}
          experience={experience}
          isFirst={index === 0}
          isLast={index === experiences.length - 1}
          active={index === activeIndex}
          registerRef={registerItem(index)}
        />
      ))}
    </div>
  );
}
