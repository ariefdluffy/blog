import { readFileSync } from "fs";
import { join } from "path";

function parseKnowledgeBase(content) {
  content = content.replace(/\r\n/g, "\n");

  // Remove frontmatter
  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  if (!fmMatch) return [];
  const body = fmMatch[1];

  const categories = [];

  // Split on ### headings
  const sections = body.split(/\n(?=###\s)/);
  for (const section of sections) {
    const headingMatch = section.match(/^###\s+\[(.+?)\]\((.+?)\)/);
    if (!headingMatch) continue;

    const title = headingMatch[1].trim();
    const path = headingMatch[2].trim();

    // Description: first non-empty line after heading
    const afterHeading = section.substring(headingMatch[0].length).trim();
    const firstLine =
      afterHeading
        .split(/\n/)
        .find((l) => l.trim() && !l.startsWith("---") && !l.startsWith(">")) ||
      "";
    const description = firstLine.trim().substring(0, 200);

    categories.push({ title, path, description });
  }

  // Fallback: simple list items - [Title](/path)
  if (categories.length === 0) {
    const itemRegex = /-\s+\[(.+?)\]\((.+?)\)/g;
    let match;
    while ((match = itemRegex.exec(body)) !== null) {
      categories.push({
        title: match[1].trim(),
        path: match[2].trim(),
        description: "",
      });
    }
  }

  return categories;
}

export function load() {
  try {
    const base = process.cwd();
    const mdPath = join(base, "src/routes/knowledge-base/+page.md.bak");
    const content = readFileSync(mdPath, "utf-8");
    const all = parseKnowledgeBase(content);
    return {
      categories: all.slice(0, 5),
      totalCount: all.length,
    };
  } catch (err) {
    console.error("Error loading knowledge-base data:", err);
    return { categories: [], totalCount: 0 };
  }
}
