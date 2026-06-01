import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Buat slug yang aman dari sebuah judul.
 */
export function slugify(input) {
	if (!input) return '';
	return String(input)
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, ' ')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
		.substring(0, 80);
}

/**
 * Parse seluruh berita dari /tech/news/+page.md.
 * Return: array { title, slug, source, sourceUrl, date, description }
 */
export function parseAllNews(content) {
	content = String(content).replace(/\r\n/g, '\n');

	// Buang frontmatter
	const fmMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	const body = fmMatch ? fmMatch[1] : content;

	const items = [];
	const usedSlugs = new Set();

	// Tangkap setiap heading H3 sebagai awal item berita
	const regex = /^###\s+(.+)$/gm;
	const matches = [];
	let m;
	while ((m = regex.exec(body)) !== null) {
		matches.push({ title: m[1].trim(), index: m.index, length: m[0].length });
	}

	for (let i = 0; i < matches.length; i++) {
		const start = matches[i].index + matches[i].length;
		const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
		const chunk = body.substring(start, end);
		const title = matches[i].title;

		const sourceMatch = chunk.match(/\*\*Source:\*\*\s+(.+?)\s+\|/);
		const source = sourceMatch ? sourceMatch[1].trim() : null;

		const dateMatch = chunk.match(/\*\*Date:\*\*\s+(.+?)(?:\n|$)/);
		const date = dateMatch ? dateMatch[1].trim() : null;

		const linkMatch = chunk.match(/\[Read more\]\((.+?)\)/);
		const sourceUrl = linkMatch ? linkMatch[1].trim() : null;

		// Deskripsi = teks antara baris Date dan link Read more
		const descMatch = chunk.match(
			/\*\*Date:\*\*\s+.+?\n\n([\s\S]*?)(?=\[Read more\]|\n---|\n###|\n## |$)/
		);
		let description = descMatch
			? descMatch[1].replace(/\[Read more\]\(.+?\)/g, '').replace(/\s+/g, ' ').trim()
			: '';

		// Buat slug unik
		let slug = slugify(title);
		if (!slug) slug = `berita-${i + 1}`;
		let unique = slug;
		let n = 2;
		while (usedSlugs.has(unique)) {
			unique = `${slug}-${n++}`;
		}
		usedSlugs.add(unique);

		items.push({ title, slug: unique, source, sourceUrl, date, description });
	}

	return items;
}

/**
 * Baca file +page.md sumber berita.
 */
export function readNewsFile() {
	const base = process.cwd();
	const newsPath = join(base, 'src/routes/tech/news/+page.md');
	return readFileSync(newsPath, 'utf-8');
}

/**
 * Ambil semua berita dengan deskripsi yang sudah dipotong (untuk listing).
 */
export function getNewsList(limit = null) {
	try {
		const content = readNewsFile();
		const all = parseAllNews(content).map((it) => ({
			...it,
			description:
				it.description && it.description.length > 200
					? it.description.substring(0, 200) + '...'
					: it.description
		}));
		return limit ? all.slice(0, limit) : all;
	} catch (err) {
		console.error('Error reading news:', err);
		return [];
	}
}

/**
 * Ambil satu berita berdasarkan slug.
 */
export function getNewsBySlug(slug) {
	try {
		const content = readNewsFile();
		const all = parseAllNews(content);
		return all.find((it) => it.slug === slug) || null;
	} catch (err) {
		console.error('Error reading news:', err);
		return null;
	}
}
