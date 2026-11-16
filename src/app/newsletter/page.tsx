import { notFound } from "next/navigation";
import { NumberedList, PageTitle } from "@/components";
import { IssueRow } from "@/components/newsletter/IssueRow";
import { LatestIssue } from "@/components/newsletter/LatestIssue";
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

const sectionHeading = "mb-4 font-heading tracking-heading text-2xl font-bold text-gray-800";

export default function NewsletterPage() {
  // Not launched yet: reachable on this machine only, like the other dev-only pages.
  if (!isDevOnlyAvailable) notFound();

  const config = getNewsletterConfig();
  const [latest, ...earlier] = getAllIssues();

  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      <div className="flex flex-col gap-5">
        <div>
          <PageTitle>{config.name}</PageTitle>
          <p className="mt-2 text-prose text-ink">{config.intro}</p>
        </div>
        <SubscribeForm source="newsletter" sendDay={config.sendDay} />
      </div>

      <section className="border-t border-gray-300 pt-6">
        <h2 className={sectionHeading}>What you get</h2>
        <NumberedList items={config.inside} />
      </section>

      <section className="border-t border-gray-300 pt-6">
        <h2 className={sectionHeading}>Latest issue</h2>
        {latest ? (
          <LatestIssue issue={latest} />
        ) : (
          <p className="text-prose text-gray-500">
            The first issue has not gone out yet. Subscribe and it will be the first thing you get.
          </p>
        )}
      </section>

      {earlier.length > 0 && (
        <section className="border-t border-gray-300 pt-6">
          <h2 className={sectionHeading}>Earlier issues</h2>
          <div className="flex flex-col">
            {earlier.map((issue, i) => (
              <div key={issue.slug}>
                <IssueRow issue={issue} />
                {i < earlier.length - 1 && <hr className="border-gray-300" />}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="font-sans text-sm text-gray-500">
        Rather read it in a feed reader? Here is the{" "}
        <a href={FEED_PATH} className="text-gray-500 underline decoration-dotted underline-offset-[3px] transition-colors duration-200 hover:text-brand-500">
          RSS feed
        </a>
        .
      </p>
    </div>
  );
}
