import { getQuotes } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Quotes | Husan Isomiddinov",
  description: "A collection of quotes I keep coming back to.",
  path: "/quotes",
});

export default function QuotesPage() {
  const quotes = getQuotes();

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {quotes.map((item, i) => (
        <div key={`${item.author}-${i}`} className="w-full">
          <div className="flex w-full flex-col items-start gap-2">
            <p className="text-base leading-[1.6] text-gray-600">
              &ldquo;{item.quote}&rdquo;
            </p>
            <p className="font-sans text-base font-medium text-brand-500">
              — {item.author}
            </p>
          </div>
          {i < quotes.length - 1 && <hr className="mt-4 w-full border-gray-300" />}
        </div>
      ))}
    </div>
  );
}
