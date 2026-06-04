import { readFileSync } from "fs";
import { join } from "path";
import { getNewsList } from "$lib/server/news.js";

/**
 * Parse articles from /tech/articles/+page.md
 * Supports multiple date formats:
 * - "## Artikel Teknologi - DD Month YYYY"
 * - "*Tanggal: DD Month YYYY*"
 * - "DD Month YYYY" in the first paragraph
 */
function parseArticles(content) {
  content = content.replace(/\r\n/g, "\n");

  // Remove frontmatter
  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  if (!fmMatch) return [];
  const body = fmMatch[1];

  // Split by --- at top level
  const sections = body.split(/\n---\n/);
  const articles = [];

  for (const section of sections) {
    if (!section.trim()) continue;

    // Find title (# heading)
    const titleMatch = section.match(/^#\s+(.+)$/m);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();

    const afterTitle = section.substring(
      section.indexOf(titleMatch[0]) + titleMatch[0].length,
    );

    // --- DATE EXTRACTION ---
    let date = null;

    // Strategy 1: ## Artikel Teknologi - DD Month YYYY
    const dateMatch1 = section.match(
      /##\s+Artikel Teknologi\s*-\s*(.+?)(?:\n|$)/,
    );
    if (dateMatch1) {
      date = dateMatch1[1].trim();
    }

    // Strategy 2: *Tanggal: DD Month YYYY* or **Tanggal:**
    if (!date) {
      const dateMatch2 = afterTitle.match(
        /[\*_]*Tanggal[\*_]*\s*:\s*(.+?)(?:\n|$)/i,
      );
      if (dateMatch2) {
        date = dateMatch2[1].trim().replace(/^[\*_\s]+|[\*_\s]+$/g, "");
      }
    }

    // Strategy 3: Look for date pattern in first 500 chars
    if (!date) {
      const intro = afterTitle.replace(/\n/g, " ").substring(0, 500);
      const monthNames =
        "(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)";
      const datePattern = new RegExp(`(\\d{1,2})\\s+${monthNames}\\s+(\\d{4})`);
      const match = intro.match(datePattern);
      if (match) {
        const day = match[1].padStart(2, "0");
        const monthMap = {
          Januari: "01",
          Februari: "02",
          Maret: "03",
          April: "04",
          Mei: "05",
          Juni: "06",
          Juli: "07",
          Agustus: "08",
          September: "09",
          Oktober: "10",
          November: "11",
          Desember: "12",
        };
        const month = monthMap[match[2]] || "00";
        date = `${match[3]}-${month}-${day}`;
      }
    }

    // Strategy 4: Find ISO date YYYY-MM-DD in first 500 chars
    if (!date) {
      const isoMatch = afterTitle
        .replace(/\n/g, " ")
        .substring(0, 500)
        .match(/\b(\d{4}-\d{2}-\d{2})\b/);
      if (isoMatch) date = isoMatch[1];
    }

    // Find first non-heading paragraph as description
    const parts = afterTitle.split(/\n\n+/);
    let description = "";
    for (const part of parts) {
      const trimmed = part.trim();
      // Skip headings, bold markers, lists, tables
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
          .substring(0, 180);
        if (description.length >= 180) description += "...";
        break;
      }
    }

    // Create anchor slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    articles.push({
      title,
      date,
      description,
      link: `/tech/articles#${slug}`,
      slug,
    });
  }

  // Sort by date descending (newest first)
  // Articles without dates go to the end
  return articles
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    })
    .slice(0, 5);
}

export function load() {
  try {
    const base = process.cwd();
    const articlesPath = join(base, "src/routes/tech/articles/+page.md");
    const articlesContent = readFileSync(articlesPath, "utf-8");

    const totalArticles = (articlesContent.match(/^#\s+(.+)$/gm) || []).length;

    const news = getNewsList(5).map((it) => ({
      title: it.title,
      source: it.source,
      date: it.date,
      link: `/tech/news/${it.slug}`,
      sourceUrl: it.sourceUrl,
      description: it.description,
    }));

    const totalNewsCount = getNewsList().length;

    return {
      articles: parseArticles(articlesContent),
      totalArticles,
      news,
      totalNewsCount,
    };
  } catch (err) {
    console.error("Error loading tech page data:", err);
    return { articles: [], totalArticles: 0, news: [], totalNewsCount: 0 };
  }
}
