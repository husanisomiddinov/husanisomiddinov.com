/**
 * Pages and data marked dev-only exist only while running `yarn dev` on this machine.
 * Production builds (Vercel) 404 them, drop them from nav and the sitemap, and never read their data.
 */
export const isDevOnlyAvailable = process.env.NODE_ENV !== "production";
