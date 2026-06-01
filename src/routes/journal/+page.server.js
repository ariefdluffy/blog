import { readFileSync } from 'fs';
import { join } from 'path';

function parseJournal(content) {
	content = content.replace(/\r\n/g, '\n');

	// Remove frontmatter
	const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	if (!fmMatch) return [];
	const body = fmMatch[1];

	const entries = [];

	// Split on ### headings
	const sections = body.split(/\n(?=###\s)/);
	for (const section of sections) {
		const headingMatch = section.match(/^###\s+(.+?)$/m);
		if (!headingMatch) continue;

		const rawHeading = headingMatch[1].trim();
		const entryBody = section.substring(headingMatch[0].length).trim();

		// Parse heading: "DD Month YYYY — Title" or "DD Month YYYY"
		let date = rawHeading;
		let title = '';
		const dashMatch = rawHeading.match(/^(.+?)\s*[—–-]\s*(.+)$/);
		if (dashMatch) {
			date = dashMatch[1].trim();
			title = dashMatch[2].trim();
		}

		// Extract description: first meaningful line
		const lines = entryBody.split(/\n/).filter(l => l.trim() && !l.startsWith('---'));
		let description = '';
		if (lines.length > 0) {
			const firstLine = lines[0].trim().replace(/^\*\*.*?:\*\*\s*/, '');
			description = firstLine.substring(0, 200);
			if (firstLine.length > 200) description += '...';
		}

		entries.push({ date, title, description, rawHeading });
	}

	return entries.slice(0, 10);
}

function parseMonthGroups(content) {
	content = content.replace(/\r\n/g, '\n');
	const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	if (!fmMatch) return [];
	const body = fmMatch[1];

	const months = [];
	const monthRegex = /^##\s+(.+?)$/gm;
	let match;

	while ((match = monthRegex.exec(body)) !== null) {
		const monthName = match[1].trim();
		// Get entries in this month section
		const startIdx = match.index + match[0].length;
		const nextMonthIdx = body.indexOf('\n## ', startIdx);
		const monthBody = nextMonthIdx > 0 ? body.substring(startIdx, nextMonthIdx) : body.substring(startIdx);

		const entryRegex = /^###\s+(.+?)$/gm;
		let entryMatch;
		const monthEntries = [];

		while ((entryMatch = entryRegex.exec(monthBody)) !== null) {
			const rawHeading = entryMatch[1].trim();
			let date = rawHeading;
			let title = '';
			const dashMatch = rawHeading.match(/^(.+?)\s*[—–-]\s*(.+)$/);
			if (dashMatch) {
				date = dashMatch[1].trim();
				title = dashMatch[2].trim();
			}
			monthEntries.push({ date, title, rawHeading });
		}

		if (monthEntries.length > 0) {
			months.push({ month: monthName, entries: monthEntries, count: monthEntries.length });
		}
	}

	return months;
}

export function load() {
	try {
		const base = process.cwd();
		const mdPath = join(base, 'src/routes/journal/+page.md.bak');
		const content = readFileSync(mdPath, 'utf-8');

		return {
			entries: parseJournal(content),
			months: parseMonthGroups(content)
		};
	} catch (err) {
		console.error('Error loading journal data:', err);
		return { entries: [], months: [] };
	}
}
