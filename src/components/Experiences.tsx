import Image from "next/image";
import type { Experience } from "@/types";
import { ArrowUpRightIcon } from "@/components/icons";

function ExperienceRow({ experience }: { experience: Experience }) {
  const { name, role, date, description, logo, url } = experience;

  return (
    <div className="group relative -mx-4 flex items-start gap-5 rounded-lg px-4 py-4 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04]">
      <div className="relative h-7 w-28 shrink-0 self-start">
        <Image
          src={logo}
          alt={`${name} logo`}
          fill
          sizes="112px"
          loading="eager"
          className="object-contain object-left opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <div className="flex w-full items-baseline justify-between gap-3">
          <p className="font-sans text-base font-bold text-gray-800">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 no-underline after:absolute after:inset-0 after:content-['']"
              >
                {role}
              </a>
            ) : (
              role
            )}
          </p>
          {url && (
            <span className="shrink-0 -translate-x-1 text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowUpRightIcon />
            </span>
          )}
        </div>
        <p className="font-sans text-sm text-gray-500">
          {name} · {date}
        </p>
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
    <div className="mt-6 flex w-full flex-col items-stretch gap-1">
      {experiences.map((experience) => (
        <ExperienceRow key={experience.slug} experience={experience} />
      ))}
    </div>
  );
}
