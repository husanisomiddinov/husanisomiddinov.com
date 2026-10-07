import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/config/site";

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const items = [{ label: "Home", href: "/" }, ...crumbs];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${siteUrl}${item.href}`,
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="font-sans text-sm text-gray-500">
        {items.map((item, i) => (
          <span key={item.href}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {i < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-500 no-underline hover:text-brand-500"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-400">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
