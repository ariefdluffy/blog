import { readFileSync, readdirSync } from "fs";
import { join } from "path";

function getLatestDigests(limit = 4) {
  try {
    const base = process.cwd();
    const digestDir = join(base, "src/routes/research/daily-digest");

    const dirs = readdirSync(digestDir)
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse()
      .slice(0, limit);

    return dirs.map((date) => {
      const mdPath = join(digestDir, date, "+page.md");
      let count = 0;
      try {
        const content = readFileSync(mdPath, "utf-8");
        // Try **Total Paper:** field first
        const totalMatch = content.match(/\*\*Total Paper:\*\*\s*(\d+)/);
        if (totalMatch) {
          count = parseInt(totalMatch[1], 10);
        } else {
          // Fallback: count ### N. headings
          const paperMatches = content.match(/^### \d+\.\s+.+$/gm);
          count = paperMatches ? paperMatches.length : 0;
        }
      } catch {}

      const [y, m, d] = date.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      const monthIndex = parseInt(m, 10) - 1;
      const label = `${parseInt(d, 10)} ${months[monthIndex] || m} ${y}`;

      return { date, label, count };
    });
  } catch {
    return [];
  }
}

function getLatestTutorials() {
  try {
    const base = process.cwd();
    const mdPath = join(base, "src/routes/tutorial/+page.md.bak");
    const content = readFileSync(mdPath, "utf-8").replace(/\r\n/g, "\n");

    const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (!fmMatch) return [];

    const tutorials = [];
    const itemRegex = /-\s+\[(.+?)\]\((.+?)\)/g;
    let match;
    while ((match = itemRegex.exec(fmMatch[1])) !== null) {
      const title = match[1].trim();
      const path = match[2].trim();
      const slug = path.replace("/tutorial/", "");
      tutorials.push({ slug, label: title, path });
    }

    return tutorials.slice(0, 5);
  } catch {
    return [];
  }
}

function getStats() {
  const base = process.cwd();

  // Count research digests
  const digestDir = join(base, "src/routes/research/daily-digest");
  let digestCount = 0;
  try {
    const dirs = readdirSync(digestDir).filter((d) =>
      /^\d{4}-\d{2}-\d{2}$/.test(d),
    );
    digestCount = dirs.length;
  } catch {}

  // Count tech articles
  let articleCount = 0;
  try {
    const articlesContent = readFileSync(
      join(base, "src/routes/tech/articles/+page.md"),
      "utf-8",
    );
    const titles = articlesContent.match(/^#\s+(.+)$/gm);
    articleCount = titles ? titles.length : 0;
  } catch {}

  // Count tutorials
  let tutorialCount = 0;
  try {
    const mdPath = join(base, "src/routes/tutorial/+page.md.bak");
    const content = readFileSync(mdPath, "utf-8");
    const itemRegex = /-\s+\[(.+?)\]\((.+?)\)/g;
    while (itemRegex.exec(content) !== null) tutorialCount++;
  } catch {}

  return [
    {
      label: "Research Digests",
      value: digestCount + "+",
      icon: "FlaskConical",
    },
    {
      label: "Artikel Teknologi",
      value: String(articleCount),
      icon: "FileText",
    },
    { label: "Tutorials", value: String(tutorialCount), icon: "BookOpen" },
  ];
}

export function load() {
  const latestDigests = getLatestDigests(4);
  const latestTutorials = getLatestTutorials();
  const stats = getStats();

  return { latestDigests, latestTutorials, stats };
}
