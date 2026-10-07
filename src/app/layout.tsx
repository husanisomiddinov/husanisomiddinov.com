import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist_Mono } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { defaultMetadata } from "@/config/seo";
import { siteUrl } from "@/config/site";
import { DesktopNav } from "@/components/DesktopNav";
import { MobileNav } from "@/components/MobileNav";
import { JsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PostHogAnalytics } from "@/components/PostHogAnalytics";
import "./globals.css";

const geistMono = Geist_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistMono.variable}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=2" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://app.posthog.com" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <link rel="dns-prefetch" href="https://images-na.ssl-images-amazon.com" />
        <GoogleAnalytics />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                url: siteUrl,
                name: "Husan Isomiddinov",
                inLanguage: "en",
              },
              {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                name: "Husan Isomiddinov",
                url: siteUrl,
                sameAs: [
                  "https://x.com/HusanIsamiddin",
                  "https://hida115.substack.com/",
                ],
              },
            ],
          }}
        />
        <div
          className="relative mx-auto w-full max-w-content px-4 pt-4 pb-8 mt-12 lg:mt-20 lg:px-0 lg:pt-6 md:pb-40"
        >
          <DesktopNav />
          <div className="relative w-full">
            <MobileNav />
            {children}
          </div>
        </div>
        <Suspense fallback={null}>
          <PostHogAnalytics />
        </Suspense>
        <VercelAnalytics />
      </body>
    </html>
  );
}
