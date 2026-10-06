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
}
