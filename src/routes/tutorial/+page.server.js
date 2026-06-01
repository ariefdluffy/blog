import { readFileSync } from 'fs';
import { join } from 'path';

function parseTutorials(content) {
	content = content.replace(/\r\n/g, '\n');

	// Remove frontmatter
	const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	if (!fmMatch) return [];
	let body = fmMatch[1];

	// Strip everything after a horizontal rule that comes after the last category
	// (split on ## first, then iterate)
	const categories = [];

	// Split on ## headings (lookahead)
	const sections = body.split(/\n(?=##\s)/);
	for (const section of sections) {
		const headingMatch = section.match(/^##\s+(.+?)$/m);
		if (!headingMatch) continue;

		const category = headingMatch[1].trim();
		const sectionBody = section.substring(headingMatch[0].length);

		const tutorials = [];
		const itemRegex = /-\s+\[(.+?)\]\((.+?)\)/g;
		let itemMatch;

		while ((itemMatch = itemRegex.exec(sectionBody)) !== null) {
			const title = itemMatch[1].trim();
			const path = itemMatch[2].trim();
			const slug = path.replace('/tutorial/', '');
			tutorials.push({ title, slug, path });
		}

		if (tutorials.length > 0) {
			categories.push({ category, tutorials, count: tutorials.length });
		}
	}

	return categories;
}

export function load() {
	try {
		const base = process.cwd();
		const mdPath = join(base, 'src/routes/tutorial/+page.md.bak');
		const content = readFileSync(mdPath, 'utf-8');
		const categories = parseTutorials(content);
		return { categories };
	} catch (err) {
		console.error('Error loading tutorial data:', err);
		return { categories: [] };
	}
}
