import { siteUrl } from "@/config/site";
import { isDevOnlyAvailable } from "@/lib/dev-only";
import { getAllIssues, getNewsletterConfig } from "@/lib/newsletter";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS feed of the digest issues, newest first. */
export function GET() {
  if (!isDevOnlyAvailable) return new Response("Not found", { status: 404 });

  const { name, description } = getNewsletterConfig();
  const items = getAllIssues()
    .map((issue) => {
      const url = `${siteUrl}/newsletter/${issue.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(issue.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid>${url}</guid>`,
        `      <pubDate>${new Date(`${issue.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(issue.summary)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(name)}</title>
    <link>${siteUrl}/newsletter</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
