import Link from "next/link";

export interface NavTarget {
  title: string;
  href: string;
}

function Target({ label, target }: { label: string; target: NavTarget }) {
  return (
    <Link href={target.href} className="group block py-2 hover:no-underline">
      <p className="font-sans text-sm text-gray-500">{label}</p>
      <p className="line-clamp-2 font-sans text-sm font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-500">
        {target.title}
      </p>
    </Link>
  );
}

/** The newer / older pair under an article, split left and right below a hairline. */
export function NewerOlderNav({ newer, older }: { newer: NavTarget | null; older: NavTarget | null }) {
  if (!newer && !older) return null;

  return (
    <div className="w-full pt-2">
      <hr className="mb-4 border-gray-300" />
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">{newer && <Target label="Newer" target={newer} />}</div>
        <div className="min-w-0 flex-1 text-right">{older && <Target label="Older" target={older} />}</div>
      </div>
    </div>
  );
}
