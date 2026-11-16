export interface PageMetadata {
  title: string;
  description?: string;
}

export interface Book {
  title: string;
  author: string;
  date?: string | null;
  rating?: number | null;
  /** Month the book was started, shown while it's still being read. */
  started?: string;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
  summaryContent?: string;
  /** Shown in the featured books section on the home page. */
  featured?: boolean;
}

export type ReadingShelfBook = Pick<
  Book,
  | "title"
  | "author"
  | "date"
  | "rating"
  | "started"
  | "coverImage"
  | "spineColor"
  | "textColor"
  | "slug"
>;

export interface Post {
  title: string;
  date: string;
  tag?: "essay" | "note";
  description?: string;
  cover?: string;
  /** Shown in the featured writing section on the home page. */
  featured?: boolean;
}

export interface Issue {
  title: string;
  /** Issue number, shown as "No. 03". */
  issue: number;
  /** ISO date the issue went out, e.g. 2026-11-15. */
  date: string;
  /** One sentence shown in the archive and the feed. */
  summary?: string;
}
