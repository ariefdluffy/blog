import { getNewsPaginated } from '$lib/server/news.js';

export function load({ url }) {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = 10;
  const result = getNewsPaginated(page, pageSize);

  return {
    news: result.items,
    pagination: {
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
      pageSize: result.pageSize
    }
  };
}
