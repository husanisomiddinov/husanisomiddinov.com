import { notFound } from "next/navigation";
import { PageTitle } from "@/components";
import { IssueRow } from "@/components/newsletter/IssueRow";
import { SubscribeForm } from "@/components/newsletter/SubscribeForm";
import { isDevOnlyAvailable } from "@/lib/dev-only";
import { buildMetadata } from "@/lib/metadata";
import { getAllIssues, getNewsletterConfig } from "@/lib/newsletter";

const FEED_PATH = "/newsletter/feed.xml";

export function generateMetadata() {
  const { name, description } = getNewsletterConfig();
  const base = buildMetadata({ title: name, description, path: "/newsletter", noindex: true });
  return {
    ...base,
    alternates: { ...base.alternates, types: { "application/rss+xml": FEED_PATH } },
  };
}

export default function NewsletterPage() {
  // Not launched yet: reachable on this machine only, like the other dev-only pages.
  if (!isDevOnlyAvailable) notFound();

  const config = getNewsletterConfig();
  const issues = getAllIssues();

  return (
    <div className="flex w-full flex-col items-stretch">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pt-6 pb-10 text-center">
        <div>
          <PageTitle>{config.name}</PageTitle>
          <p className="mt-2 text-prose text-gray-600 text-balance">{config.description}</p>
        </div>
        <SubscribeForm source="newsletter" />
      </div>

      <div className="border-t border-gray-300">
        {issues.length === 0 && <p className="py-5 text-prose text-gray-500">No issues yet.</p>}
        {issues.map((issue, i) => (
          <div key={issue.slug}>
            <IssueRow issue={issue} featured={i === 0} />
            <hr className="border-gray-300" />
          </div>
        ))}
      </div>

      <a
        href={FEED_PATH}
        className="mt-4 self-start font-sans text-sm text-gray-500 no-underline transition-colors duration-200 hover:text-brand-500"
      >
        RSS feed
      </a>
    </div>
  );
}
