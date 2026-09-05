interface NumberedListProps {
  items: string[];
}

/**
 * Renders a vertical list of strings prefixed with a zero-padded index,
 * separated by dividers. Shared by the Facts and Heuristics pages.
 */
export function NumberedList({ items }: NumberedListProps) {
  const pad = Math.max(2, String(items.length).length);

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {items.map((item, i) => (
        <div key={`${i}-${item}`} className="w-full">
          <div className="flex w-full items-start gap-3">
            <span className="min-w-[30px] font-sans text-base font-medium text-brand-500">
              {String(i + 1).padStart(pad, "0")}
            </span>
            <span className="text-base leading-[1.6] text-gray-600">{item}</span>
          </div>
          {i < items.length - 1 && (
            <hr className="mt-4 w-full border-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}
