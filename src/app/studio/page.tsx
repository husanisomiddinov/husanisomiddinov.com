import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { PageTitle } from "@/components";
import { getStudioLinks } from "@/lib/data";
import type { StudioLink } from "@/types";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Studio | Husan Isomiddinov",
  description: "A workshop of collections I keep, people I read, and places I love.",
  path: "/studio",
});

function isExternal(url: string): boolean {
  return !url.startsWith("/");
}

function StudioRow({ item, isLast }: { item: StudioLink; isLast: boolean }) {
  const external = isExternal(item.url);
  const linkProps = external
    ? { href: item.url, target: "_blank", rel: "noopener noreferrer" }
    : { href: item.url };

  return (
    <div>
      <Link
        {...linkProps}
        className="group relative -mx-4 flex items-center justify-between gap-4 rounded-lg px-4 py-4 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
      >
        <div className="min-w-0">
          <p className="font-sans text-base font-bold text-gray-800 after:absolute after:inset-0 after:content-['']">
            {item.name}
          </p>
          {item.description && (
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          )}
        </div>
        <div className="shrink-0 -translate-x-1 text-gray-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          {external ? <ArrowUpRightIcon /> : <ArrowRightIcon />}
        </div>
      </Link>
      {!isLast && <hr className="border-gray-300" />}
    </div>
  );
}

export default function StudioPage() {
  const links = getStudioLinks();

  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <div>
        <PageTitle>Studio</PageTitle>
        <p className="mt-1 text-base text-gray-600">A workshop side of things.</p>
      </div>
      <div className="flex flex-col">
        {links.map((item, i) => (
          <StudioRow key={item.url} item={item} isLast={i === links.length - 1} />
        ))}
      </div>
    </div>
  );
}
