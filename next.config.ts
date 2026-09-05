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
    return [{ source: "/:path*", headers: securityHeaders }];
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
