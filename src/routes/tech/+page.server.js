import { readFileSync } from 'fs';
import { join } from 'path';
import { getNewsList } from '$lib/server/news.js';

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

export function load() {
	try {
		const base = process.cwd();
		const articlesPath = join(base, 'src/routes/tech/articles/+page.md');
		const articlesContent = readFileSync(articlesPath, 'utf-8');

		const news = getNewsList(5).map((it) => ({
			title: it.title,
			source: it.source,
			date: it.date,
			link: `/tech/news/${it.slug}`,
			sourceUrl: it.sourceUrl,
			description: it.description
		}));

		return {
			articles: parseArticles(articlesContent),
			news
		};
	} catch (err) {
		console.error('Error loading tech page data:', err);
		return { articles: [], news: [] };
	}
}
