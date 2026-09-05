import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

const SITE_TITLE = "Husan Isomiddinov";
const SITE_DESCRIPTION =
  "Personal website of Husan Isomiddinov featuring books, essays, projects, and studio.";

export const defaultOpenGraphImages = [
  {
    url: `${siteUrl}/ascii-art.png`,
    alt: "Husan Isomiddinov — site preview",
  },
];

/** Root-layout metadata — the equivalent of the old `<DefaultSeo>` config. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_TITLE,
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: defaultOpenGraphImages.map((image) => image.url),
  },
};
