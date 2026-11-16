import { notFound } from "next/navigation";
import { Breadcrumbs, PageTitle, Prose } from "@/components";
import { NewerOlderNav, type NavTarget } from "@/components/NewerOlderNav";
import { CopyLinkButton } from "@/components/newsletter/CopyLinkButton";
import { SubscribeForm } from "@/components/newsletter/SubscribeForm";
import { isDevOnlyAvailable } from "@/lib/dev-only";
import { buildMetadata } from "@/lib/metadata";
import {
  formatIssueDate,
  getAllIssues,
  getIssueContent,
  getNewsletterConfig,
  issueLabel,
  type IssuePreview,
} from "@/lib/newsletter";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllIssues().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const issue = getAllIssues().find((i) => i.slug === slug);
  if (!issue) return {};

  return buildMetadata({
    title: issue.title,
    description: issue.summary,
    path: `/newsletter/${slug}`,
    noindex: true,
  });
}

function toNav(issue?: IssuePreview): NavTarget | null {
  return issue ? { title: issue.title, href: `/newsletter/${issue.slug}` } : null;
}

export default async function IssuePage({ params }: { params: Params }) {
  // Not launched yet: reachable on this machine only, like the other dev-only pages.
  if (!isDevOnlyAvailable) notFound();

  const { slug } = await params;
  const issues = getAllIssues();
  const index = issues.findIndex((i) => i.slug === slug);
  const content = index >= 0 ? await getIssueContent(slug) : null;
  if (!content) notFound();

  const issue = issues[index];
  const config = getNewsletterConfig();

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="w-full">
        <Breadcrumbs
          crumbs={[
            { label: config.name, href: "/newsletter" },
            { label: issue.title, href: `/newsletter/${slug}` },
          ]}
        />
        <PageTitle className="mt-3">{issue.title}</PageTitle>
        {issue.summary && <p className="mt-1 text-prose text-gray-600">{issue.summary}</p>}
        <div className="mt-4 flex items-center justify-between gap-4 border-y border-gray-300 py-3">
          <div className="min-w-0">
            <p className="font-sans text-sm font-bold text-gray-800">{config.author}</p>
            <p className="font-sans text-xs text-gray-400">
              {formatIssueDate(issue.date)} · {issueLabel(issue.number)} · {issue.readingTime} min read
            </p>
          </div>
          <CopyLinkButton />
        </div>
      </div>

      <div className="w-full">
        <Prose>{content}</Prose>
      </div>

      <section className="flex w-full flex-col items-center gap-3 rounded-lg border border-gray-200 bg-brand-50 px-5 py-6 text-center">
        <p className="text-prose text-ink text-balance">
          Subscribe to get the next issue of {config.name} by email.
        </p>
        <SubscribeForm source={slug} className="max-w-md" />
      </section>

      <NewerOlderNav newer={toNav(issues[index - 1])} older={toNav(issues[index + 1])} />
    </div>
  );
}
