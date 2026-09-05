import path from "path";
import fs from "fs";
import matter from "gray-matter";

async function books() {
  const basePath = path.join(process.cwd(), "content", "books");

  if (!fs.existsSync(basePath)) {
    throw new Error(`Books directory not found: ${basePath}`);
  }

  const bookPaths = fs.readdirSync(basePath, "utf8");
  const books = bookPaths
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const contentPath = path.join(basePath, fileName);
      const fileContents = fs.readFileSync(contentPath, "utf8");
      const { data: frontmatter, content } = matter(fileContents);

      if (!frontmatter.title) {
        throw new Error(`Missing required "title" in frontmatter: ${fileName}`);
      }

      return {
        ...frontmatter,
        slug: "/" + path.join("reading", fileName.replace(/\.mdx$/, "")),
        summaryContent: content.split(/^##\s+My Notes/m)[0].trim(),
      };
    });

  if (books.length === 0) {
    throw new Error(`No .mdx book files found in ${basePath}`);
  }

  books.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return -1;
    if (!b.date) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  fs.writeFileSync(
    path.join(basePath, "index.json"),
    JSON.stringify(books, undefined, 2)
  );

  console.log(`✅ Generated content/books/index.json (${books.length} books)`);
}

async function main() {
  await books();
}

main().catch((error) => {
  console.error(`❌ generate-content failed: ${error.message}`);
  process.exit(1);
});
