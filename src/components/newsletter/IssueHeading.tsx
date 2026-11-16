import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { sectionId } from "@/lib/newsletter";

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

/** An issue's section heading, with an anchor id the archive links to. The scroll margin clears the fixed nav. */
export function IssueHeading({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 id={sectionId(textOf(children))} className="scroll-mt-16 lg:scroll-mt-28" {...rest}>
      {children}
    </h2>
  );
}
