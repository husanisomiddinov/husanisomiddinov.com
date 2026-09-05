const FALLBACK_SITE_URL = "https://husanisomiddinov.com";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  FALLBACK_SITE_URL;

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");
