import type { Metadata } from "next";

interface PageMetadataInput {
  title: string;
  description?: string;
  /** Route path, e.g. "/about" — used for the canonical URL. */
  path: string;
  noindex?: boolean;
  openGraph?: Metadata["openGraph"];
}

/** Builds per-page metadata on top of the root layout's defaults (see config/seo.ts). */
export function buildMetadata({
  title,
  description,
  path,
  noindex,
  openGraph,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path === "/" ? "/" : path },
    ...(noindex && { robots: { index: false, follow: false } }),
    ...(openGraph && {
      openGraph: { title, description, ...openGraph },
    }),
  };
}
