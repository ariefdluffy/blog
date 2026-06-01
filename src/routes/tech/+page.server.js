import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Parse articles from /tech/articles/+page.md
 * Structure: # Title (first article), ## Date / # Title (subsequent)
 */
function parseArticles(content) {
	content = content.replace(/\r\n/g, '\n');

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

		// Find date (## Artikel Teknologi - DD Month YYYY)
		const dateMatch = section.match(/##\s+Artikel Teknologi\s*-\s*(.+?)(?:\n|$)/);

		// Find first non-heading paragraph as description
		const afterTitle = section.substring(section.indexOf(titleMatch[0]) + titleMatch[0].length);
		const parts = afterTitle.split(/\n\n+/);
		let description = '';
		for (const part of parts) {
			const trimmed = part.trim();
			// Skip headings, bold markers, lists, tables
			if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('**') && !trimmed.startsWith('- ') && !trimmed.startsWith('|')) {
				description = trimmed.replace(/\*\*/g, '').replace(/\n/g, ' ').trim().substring(0, 180);
				if (description.length >= 180) description += '...';
				break;
			}
		}

		articles.push({
			title: titleMatch[1].trim(),
			date: dateMatch ? dateMatch[1].trim() : null,
			description,
			link: '/tech/articles'
		});
	}

	return articles.slice(0, 5);
}

/**
 * Parse news from /tech/news/+page.md
 * Structure: ### Title, **Source:** x | **Date:** x, desc, [Read more](url)
 */
function parseNews(content) {
	content = content.replace(/\r\n/g, '\n');

	// Remove frontmatter
	const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	if (!fmMatch) return [];
	const body = fmMatch[1];

	const items = [];
	const regex = /###\s+(.+?)\n/g;
	let match;

	while ((match = regex.exec(body)) !== null) {
		const title = match[1].trim();
		const startIndex = match.index;
		const chunk = body.substring(startIndex);

		// Extract source
		const sourceMatch = chunk.match(/\*\*Source:\*\*\s+(.+?)\s+\|/);
		const source = sourceMatch ? sourceMatch[1].trim() : null;

		// Extract date
		const dateMatch = chunk.match(/\*\*Date:\*\*\s+(.+?)(?:\n|$)/);
		const date = dateMatch ? dateMatch[1].trim() : null;

		// Extract link
		const linkMatch = chunk.match(/\[Read more\]\((.+?)\)/);
		const link = linkMatch ? linkMatch[1] : null;

		// Extract description (between date line and link)
		const descMatch = chunk.match(/\*\*Date:\*\*\s+.+?\n\n([\s\S]*?)(?=\[Read more\]|\n---|\n###|\n## |$)/);
		let description = descMatch
			? descMatch[1].replace(/\[Read more\]\(.+?\)/, '').replace(/\n/g, ' ').trim()
			: '';
		if (description.length > 200) description = description.substring(0, 200) + '...';

		items.push({ title, source, date, link, description });
	}

	return items.slice(0, 5);
}

export function load() {
	try {
		const base = process.cwd();
		const articlesPath = join(base, 'src/routes/tech/articles/+page.md');
		const newsPath = join(base, 'src/routes/tech/news/+page.md');

		const articlesContent = readFileSync(articlesPath, 'utf-8');
		const newsContent = readFileSync(newsPath, 'utf-8');

		return {
			articles: parseArticles(articlesContent),
			news: parseNews(newsContent)
		};
	} catch (err) {
		console.error('Error loading tech page data:', err);
		return { articles: [], news: [] };
	}
}
