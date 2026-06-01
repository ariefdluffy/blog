import { error } from '@sveltejs/kit';
import { getNewsBySlug } from '$lib/server/news.js';

export function load({ params }) {
	const item = getNewsBySlug(params.slug);
	if (!item) {
		throw error(404, 'Berita tidak ditemukan');
	}
	return { news: item };
}
