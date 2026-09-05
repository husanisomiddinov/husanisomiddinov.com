import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="hover:no-underline">
      <span className="font-sans text-xl font-semibold text-brand-500">
        Husan
      </span>
    </Link>
  );
}
