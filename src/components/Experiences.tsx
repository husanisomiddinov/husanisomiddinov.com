import Image from "next/image";
import type { Experience } from "@/types";

function ExperienceRow({
  experience,
  isFirst,
  isLast,
}: {
  experience: Experience;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { name, role, date, description, logo, logoColor, logoScale, url } =
    experience;
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
          className="relative z-10 mt-1.5 h-[11px] w-[11px] rounded-full border-2 border-gray-400 bg-[var(--color-page-bg)] transition-colors duration-300 ease-out group-hover:border-gray-600"
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
            className="w-fit font-sans text-sm text-gray-500 underline decoration-gray-400 underline-offset-2 transition-colors duration-300 ease-out hover:text-brand-500 hover:decoration-brand-500 after:absolute after:inset-0 after:content-['']"
          >
            {name}
          </a>
        ) : (
          <p className="font-sans text-sm text-gray-500">{name}</p>
        )}
        <p className="text-base leading-[1.6] text-gray-600 opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100">
          {description}
        </p>
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
