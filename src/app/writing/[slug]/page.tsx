import path from "path";
import fs from "fs";
import sizeOf from "image-size";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, PageTitle, Prose } from "@/components";
import { JsonLd } from "@/components/JsonLd";
import { NewerOlderNav, type NavTarget } from "@/components/NewerOlderNav";
import {
  getAllWritingMetadata,
  getAllWritingSlugs,
  getWritingBySlug,
  type WritingPreview,
} from "@/lib/posts";
import { buildMetadata } from "@/lib/metadata";
import { siteUrl } from "@/config/site";

interface CoverDimensions {
  width: number;
  height: number;
}

function getCoverDimensions(cover: string | null | undefined): CoverDimensions | null {
  if (!cover?.startsWith("/")) return null;
  try {
    const imagePath = path.join(process.cwd(), "public", cover);
    const buffer = new Uint8Array(fs.readFileSync(imagePath));
    const dims = sizeOf(buffer);
    if (dims.width && dims.height) {
      return { width: dims.width, height: dims.height };
    }
  } catch {
    // Fall through to the `fill` + fixed-aspect-ratio rendering path.
  }
  return null;
}

function getNav(slug: string) {
  const all = getAllWritingMetadata();
  const idx = all.findIndex((p) => p.slug === slug);
  const toNav = (p?: WritingPreview): NavTarget | null =>
    p ? { title: p.title, href: `/writing/${p.slug}` } : null;
  return {
    newer: idx > 0 ? toNav(all[idx - 1]) : null,
    older: idx >= 0 && idx < all.length - 1 ? toNav(all[idx + 1]) : null,
    readingTime: idx >= 0 ? all[idx].readingTime : null,
  };
}

export function generateStaticParams() {
  return getAllWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);
  if (!post) return {};

  const preview = getAllWritingMetadata().find((p) => p.slug === slug);

  return buildMetadata({
    title: post.title,
    description: preview?.excerpt,
    path: `/writing/${slug}`,
  });
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);
  if (!post) {
    notFound();
  }

  const coverDimensions = getCoverDimensions(post.cover);
  const { newer, older, readingTime } = getNav(slug);
  const preview = getAllWritingMetadata().find((p) => p.slug === slug);
  const pageUrl = `${siteUrl}/writing/${slug}`;

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          datePublished: post.date,
          author: { "@id": `${siteUrl}/#person` },
          publisher: { "@id": `${siteUrl}/#person` },
          url: pageUrl,
          ...(preview?.excerpt && { description: preview.excerpt }),
          ...(post.cover && { image: `${siteUrl}${post.cover}` }),
        }}
      />
      <div className="w-full">
        <Breadcrumbs
          crumbs={[
            { label: "Essays", href: "/writing" },
            { label: post.title, href: `/writing/${slug}` },
          ]}
        />
        <PageTitle className="mt-3 mb-2">{post.title}</PageTitle>
        <p className="font-sans text-sm text-gray-500">
          {post.date}
          {readingTime ? ` · ${readingTime} min read` : ""}
        </p>
      </div>

      {post.cover &&
        (coverDimensions ? (
          <div className="w-full overflow-hidden rounded-[10px]">
            <Image
              src={post.cover}
              alt={post.title}
              width={coverDimensions.width}
              height={coverDimensions.height}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden rounded-[10px]"
            style={{ aspectRatio: "2 / 1" }}
          >
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        ))}

      <div className="w-full">
        <Prose>{post.content}</Prose>
      </div>

      <NewerOlderNav newer={newer} older={older} />
    </div>
  );
}
