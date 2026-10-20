import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Baseline hardening headers applied to every route. A strict
    // Content-Security-Policy is intentionally omitted for now: the site loads
    // inline gtag/GA, PostHog, and Vercel Analytics, which would need nonces to
    // work under CSP — that's a separate, carefully-tested change.
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    // Files in public/ keep their names when edited in place, so avoid
    // `immutable`: cache for a day and revalidate in the background.
    const staticCache = [
      { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: staticCache },
      { source: "/data/:path*", headers: staticCache },
    ];
  },

  async redirects() {
    return [
      {
        source: "/books/:slug*",
        destination: "/reading/:slug*",
        permanent: true,
      },
      {
        source: "/ai-projects",
        destination: "/projects#ai-projects",
        permanent: true,
      },
      {
        source: "/ai-projects/1",
        destination: "/projects/sentiment-analysis",
        permanent: true,
      },
      {
        source: "/ai-projects/:id",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/deep-dives",
        destination: "/",
        permanent: true,
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Content column is under 700px, so skip the 1920/2048/3840 srcset entries.
    deviceSizes: [640, 750, 828, 1080, 1200],
    qualities: [75, 85, 95],
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ecx.images-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "media.oceanofpdf.com" },
      { protocol: "https", hostname: "cdn1.bookmanager.com" },
      { protocol: "https", hostname: "www.sundialpress.co" },
      { protocol: "https", hostname: "images.penguinrandomhouse.com" },
      { protocol: "https", hostname: "i.etsystatic.com" },
      { protocol: "https", hostname: "literariness.org" },
      { protocol: "https", hostname: "exclusivebooks.co.za" },
      { protocol: "https", hostname: "books.max-nova.com" },
      { protocol: "https", hostname: "i.gr-assets.com" },
      { protocol: "https", hostname: "images.collections.yale.edu" },
      { protocol: "https", hostname: "substackcdn.com" },
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  poweredByHeader: false,
};

export default nextConfig;
