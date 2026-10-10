const FORMATS = {
  4: { year: "numeric" },
  7: { year: "numeric", month: "short" },
  10: { year: "numeric", month: "short", day: "numeric" },
} as const satisfies Record<number, Intl.DateTimeFormatOptions>;

/** "2024" / "2024-06" / "2024-06-12" -> "2024" / "Jun 2024" / "Jun 12, 2024". */
export function formatVisitDate(date: string): string {
  const options = FORMATS[date.length as keyof typeof FORMATS];
  if (!options) return date;
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(
    new Date(date.length === 4 ? `${date}-01-01` : date.length === 7 ? `${date}-01` : date),
  );
}
