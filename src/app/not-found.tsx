import Link from "next/link";
import { notFoundLinks } from "@/config/nav";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "404 | Husan Isomiddinov",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="font-sans text-base font-bold text-gray-800">
        404. Page not found
      </p>
      <p className="text-base leading-[1.6] text-gray-600">
        This page doesn&apos;t exist or has been moved. Here&apos;s where you can go:
      </p>
      <nav aria-label="Site links" className="flex flex-col items-start gap-2">
        {notFoundLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-sans text-base text-gray-500 no-underline transition-colors duration-200 hover:text-brand-500"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
