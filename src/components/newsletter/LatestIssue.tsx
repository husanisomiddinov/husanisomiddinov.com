import Link from "next/link";
import { Button } from "@/components/Button";
import { formatIssueDate, issueLabel, type IssuePreview } from "@/lib/newsletter";

/** The newest issue as a raised card: title, meta, summary and a linked list of its sections. */
export function LatestIssue({ issue }: { issue: IssuePreview }) {
  const href = `/newsletter/${issue.slug}`;

  return (
    <article className="flex flex-col items-start gap-4 rounded-lg border border-gray-200 bg-brand-50 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading tracking-heading text-xl font-bold text-gray-800">
          <Link href={href} className="transition-colors duration-200 hover:text-brand-500 hover:no-underline">
            {issue.title}
          </Link>
        </h3>
        <p className="font-sans text-sm text-gray-500">
          {issueLabel(issue.number)} · {formatIssueDate(issue.date)} · {issue.readingTime} min read
        </p>
      </div>

      {issue.summary && <p className="text-prose text-ink">{issue.summary}</p>}

      {issue.sections.length > 0 && (
        <div className="w-full border-t border-gray-300 pt-4">
          <p className="mb-2 font-sans text-sm font-semibold text-gray-500">In this issue</p>
          <ol className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {issue.sections.map((section, i) => (
              <li key={section.id}>
                <Link
                  href={`${href}#${section.id}`}
                  className="group flex items-baseline gap-3 py-1 hover:no-underline"
                >
                  <span className="font-sans text-sm font-medium text-brand-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-prose-sm text-gray-700 transition-colors duration-200 group-hover:text-brand-500">
                    {section.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      <Button href={href} variant="secondary" size="sm">
        Read the issue &rarr;
      </Button>
    </article>
  );
}
