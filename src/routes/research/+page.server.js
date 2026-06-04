import { readFileSync, readdirSync } from "fs";
import { join } from "path";

function getPaperCount(content) {
  // Try **Total Paper:** field first
  const totalMatch = content.match(/\*\*Total Paper:\*\*\s*(\d+)/);
  if (totalMatch) return parseInt(totalMatch[1], 10);

  // Fallback: count ### N. headings
  const headingMatches = content.match(/^### \d+\.\s+.+$/gm);
  return headingMatches ? headingMatches.length : 0;
}

function getMonthKey(dateStr) {
  return dateStr.substring(0, 7); // "2026-04"
}

function getMonthName(monthKey) {
  const [y, m] = monthKey.split("-");
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] || m} ${y}`;
}

export function load() {
  const base = process.cwd();
  const digestDir = join(base, "src/routes/research/daily-digest");

  const dirs = readdirSync(digestDir)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();

  const allEntries = [];
  let totalPapers = 0;
  let activeDays = 0;

  for (const date of dirs) {
    const mdPath = join(digestDir, date, "+page.md");
    let papers = 0;
    let status = "empty";

    try {
      const content = readFileSync(mdPath, "utf-8");
      papers = getPaperCount(content);
      totalPapers += papers;
      if (papers > 0) {
        status = "full";
        activeDays++;
      } else {
        status = "ok";
      }
    } catch {
      status = "ok";
    }

    const day = String(parseInt(date.substring(8), 10)).padStart(2, "0");
    allEntries.push({
      date,
      label: day,
      papers: papers > 0 ? papers : null,
      status,
    });
  }

  // Group by month
  const monthMap = {};
  for (const entry of allEntries) {
    const mk = getMonthKey(entry.date);
    if (!monthMap[mk]) monthMap[mk] = [];
    monthMap[mk].push(entry);
  }

  const months = Object.keys(monthMap)
    .sort()
    .reverse()
    .map((mk) => ({
      name: getMonthName(mk),
      key: mk,
    }));

  const totalDigests = dirs.length;

  // Latest 5 digests with content (non-empty)
  const allDigestsSorted = [...allEntries].reverse();
  const latestDigests = allDigestsSorted.slice(0, 5);

  return {
    months,
    digests: monthMap,
    totalDigests,
    totalPapers,
    activeDays,
    latestDigests,
  };
}
