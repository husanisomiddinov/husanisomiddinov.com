import path from "path";
import fs from "fs";
import sizeOf from "image-size";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BackLink, PageTitle, Prose } from "@/components";
import {
  getAllWritingMetadata,
  getAllWritingSlugs,
  getWritingBySlug,
  type WritingPreview,
} from "@/lib/posts";
import { buildMetadata } from "@/lib/metadata";

interface CoverDimensions {
  width: number;
  height: number;
}

interface NavLink {
  title: string;
  slug: string;
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
  const toNav = (p?: WritingPreview): NavLink | null =>
    p ? { title: p.title, slug: p.slug } : null;
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

  return buildMetadata({
    title: `${post.title} | Husan Isomiddinov`,
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

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="w-full">
        <BackLink href="/writing">← Essays</BackLink>
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

      {(newer || older) && (
        <div className="w-full pt-2">
          <hr className="mb-4 border-gray-300" />
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              {newer && (
                <Link
                  href={`/writing/${newer.slug}`}
                  className="-mx-3 block rounded-lg px-3 py-2 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
                >
                  <p className="font-sans text-sm text-gray-500">Newer</p>
                  <p className="line-clamp-2 font-sans text-sm font-bold text-gray-800">
                    {newer.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="min-w-0 flex-1 text-right">
              {older && (
                <Link
                  href={`/writing/${older.slug}`}
                  className="-mx-3 block rounded-lg px-3 py-2 transition-colors duration-300 ease-out hover:bg-gray-800/[0.04] hover:no-underline"
                >
                  <p className="font-sans text-sm text-gray-500">Older</p>
                  <p className="line-clamp-2 font-sans text-sm font-bold text-gray-800">
                    {older.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
