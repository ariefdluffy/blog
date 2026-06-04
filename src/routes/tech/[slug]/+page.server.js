import { error } from "@sveltejs/kit";
import { readFileSync } from "fs";
import { join } from "path";

function getAllArticles() {
  try {
    const base = process.cwd();
    const articlesPath = join(base, "src/routes/tech/articles/+page.md");
    const content = readFileSync(articlesPath, "utf-8").replace(/\r\n/g, "\n");

    const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (!fmMatch) return [];

    const sections = fmMatch[1].split(/\n---\n/);
    const articles = [];

    for (const section of sections) {
      if (!section.trim()) continue;
      const titleMatch = section.match(/^#\s+(.+)$/m);
      if (!titleMatch) continue;

      const title = titleMatch[1].trim();
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const afterTitle = section.substring(
        section.indexOf(titleMatch[0]) + titleMatch[0].length,
      );
      const parts = afterTitle.split(/\n\n+/);
      let description = "";
      for (const part of parts) {
        const trimmed = part.trim();
        if (
          trimmed &&
          !trimmed.startsWith("#") &&
          !trimmed.startsWith("**") &&
          !trimmed.startsWith("- ") &&
          !trimmed.startsWith("|")
        ) {
          description = trimmed
            .replace(/\*\*/g, "")
            .replace(/\n/g, " ")
            .trim()
            .substring(0, 120);
          if (description.length >= 120) description += "...";
          break;
        }
      }

      articles.push({ title, slug, description });
    }

    return articles;
  } catch {
    return [];
  }
}

export function load({ params }) {
  const { slug } = params;
  const articles = getAllArticles();

  const matched = articles.find((a) => a.slug === slug);
  if (matched) {
    throw error(404, {
      message: `Halaman artikel individu belum tersedia. Baca artikel di bawah.`,
      slug,
      articles,
    });
  }

  throw error(404, {
    message: `Artikel "${slug}" tidak ditemukan.`,
    slug,
    articles,
  });
}
