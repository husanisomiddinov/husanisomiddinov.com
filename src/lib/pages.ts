import { getMdxContent } from "./mdx";
import type { PageMetadata } from "@/types/content";

const getPageContent = (slug: string) =>
  getMdxContent<PageMetadata>(["pages", `${slug}.mdx`]);

export const getHomePage = () => getPageContent("home");
export const getAboutPage = () => getPageContent("about");
