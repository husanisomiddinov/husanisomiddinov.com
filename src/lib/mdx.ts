import path from "path";
import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import { rehypeStripFootnotesHeading } from "@/lib/remark/rehype-strip-footnotes-heading";

export interface MdxContent<TMetadata> {
  metadata: TMetadata;
  content: React.ReactElement;
}

/** Reads and compiles an MDX file from `content/`, returning the rendered element and its parsed frontmatter. */
export async function getMdxContent<TMetadata>(
  paths: string[],
  components?: MDXComponents
): Promise<MdxContent<TMetadata> | undefined> {
  const contentPath = path.join(process.cwd(), "content", ...paths);
  if (!fs.existsSync(contentPath)) {
    return undefined;
  }

  const source = fs.readFileSync(contentPath, "utf8");
  const { content, frontmatter } = await compileMDX<TMetadata>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeStripFootnotesHeading],
      },
    },
  });

  return { metadata: frontmatter, content };
}
