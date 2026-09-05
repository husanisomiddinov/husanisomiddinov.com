import { remove } from "unist-util-remove";
import type { Node } from "unist";
import type { Root, Element } from "hast";

function isFootnotesHeading(node: Node): boolean {
  if (node.type !== "element" || (node as Element).tagName !== "h2") {
    return false;
  }
  const text = (node as Element).children
    .map((child) => ("value" in child ? child.value : ""))
    .join("")
    .trim();
  return text === "Footnotes";
}

/**
 * Removes the literal "## Footnotes" heading some book/writing MDX files use
 * to separate footnote content, operating on the HAST tree rather than a
 * regex over compiled JSX source (the old repo's approach, which broke
 * whenever next-mdx-remote's compiler output shape changed).
 */
export function rehypeStripFootnotesHeading() {
  return (tree: Root) => {
    remove(tree, isFootnotesHeading);
  };
}
