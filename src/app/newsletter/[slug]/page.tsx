import { notFound } from "next/navigation";
import { Breadcrumbs, PageTitle, Prose } from "@/components";
import { NewerOlderNav, type NavTarget } from "@/components/NewerOlderNav";
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
        <PageTitle className="mt-3 mb-2">{issue.title}</PageTitle>
        <p className="font-sans text-sm text-gray-500">
          {issueLabel(issue.number)} · {formatIssueDate(issue.date)} · {issue.readingTime} min read
        </p>
      </div>

      <div className="w-full">
        <Prose>{content}</Prose>
      </div>

      <section className="flex w-full flex-col gap-3 border-t border-gray-300 pt-8">
        <h2 className="font-heading tracking-heading text-2xl font-bold text-gray-800">Get the next one</h2>
        <p className="text-prose text-ink">
          This goes out every {config.sendDay}. Leave your email and the next issue comes to you.
        </p>
        <SubscribeForm source={slug} sendDay={config.sendDay} />
      </section>

      <NewerOlderNav newer={toNav(issues[index - 1])} older={toNav(issues[index + 1])} />
    </div>
  );
}
