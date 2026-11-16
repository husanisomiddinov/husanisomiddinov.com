import Link from "next/link";
import { formatIssueDate, issueLabel, type IssuePreview } from "@/lib/newsletter";

/** One past issue in the archive: its number, title, date, summary and reading time. */
export function IssueRow({ issue }: { issue: IssuePreview }) {
  return (
    <Link href={`/newsletter/${issue.slug}`} className="group flex items-start gap-4 py-4 hover:no-underline">
      <span className="w-14 shrink-0 font-sans text-base font-medium text-brand-500">
        {issueLabel(issue.number)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="line-clamp-2 font-sans text-base leading-snug font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-500">
            {issue.title}
          </p>
          <span className="shrink-0 font-sans text-xs whitespace-nowrap text-gray-400">
            {formatIssueDate(issue.date, "short")}
          </span>
        </div>
        {issue.summary && <p className="mt-1 line-clamp-2 text-prose-sm text-gray-600">{issue.summary}</p>}
        <p className="mt-1.5 font-sans text-xs text-gray-400">{issue.readingTime} min read</p>
      </div>
    </Link>
  );
}
