import Link from "next/link";
import { formatIssueDate, issueLabel, type IssuePreview } from "@/lib/newsletter";

interface IssueRowProps {
  issue: IssuePreview;
  /** The newest issue leads the page with a larger serif title. */
  featured?: boolean;
}

/** One issue in the list: title, summary, then a small meta line. */
export function IssueRow({ issue, featured }: IssueRowProps) {
  return (
    <Link href={`/newsletter/${issue.slug}`} className="group flex flex-col gap-1.5 py-5 hover:no-underline">
      <p
        className={`text-gray-800 transition-colors duration-200 group-hover:text-brand-500 ${
          featured
            ? "font-heading tracking-heading text-2xl leading-snug font-bold"
            : "font-sans text-lg leading-snug font-bold"
        }`}
      >
        {issue.title}
      </p>
      {issue.summary && (
        <p className={`text-gray-600 ${featured ? "text-prose" : "line-clamp-2 text-prose-sm"}`}>{issue.summary}</p>
      )}
      <p className="font-sans text-xs text-gray-400">
        {formatIssueDate(issue.date, "short")} · {issueLabel(issue.number)} · {issue.readingTime} min read
      </p>
    </Link>
  );
}
