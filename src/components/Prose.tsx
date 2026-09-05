import type { PropsWithChildren } from "react";

/** Applies the site's typography styles (see `.prose` in globals.css) to MDX content. */
export function Prose({ children }: PropsWithChildren) {
  return <article className="prose">{children}</article>;
}
