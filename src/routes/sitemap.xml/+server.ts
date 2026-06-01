export const prerender = true;

const siteUrl = 'https://lockbit.my.id';

const staticPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/research', changefreq: 'daily', priority: '0.9' },
  { path: '/tech', changefreq: 'daily', priority: '0.9' },
  { path: '/tech/news', changefreq: 'daily', priority: '0.8' },
  { path: '/tech/articles', changefreq: 'weekly', priority: '0.8' },
  { path: '/tutorial', changefreq: 'weekly', priority: '0.9' },
  { path: '/journal', changefreq: 'weekly', priority: '0.7' },
  { path: '/knowledge-base', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
];

const tutorials = [
  'sveltekit-pm2-production', 'cloudflare-turnstile-sveltekit', 'google-drive-backup',
  'whatsapp-bridge-setup', 'hestiacp-installation-guide', 'mkdocs-dark-theme',
  'tauri-svelte-desktop-guide', 'webhook-google-sheet-monitor', 'cari-akpk',
  'rust-programming-guide', 'stock-analysis-design', 'shortlink-business-plan', 'plan'
];

const digests = [
  '2026-04-16','2026-04-17','2026-04-19','2026-04-20','2026-04-21','2026-04-22',
  '2026-04-23','2026-04-24','2026-04-25','2026-04-26','2026-04-27','2026-04-28',
  '2026-04-29','2026-04-30','2026-05-01','2026-05-02','2026-05-03','2026-05-04',
  '2026-05-05','2026-05-06','2026-05-07','2026-05-08','2026-05-10','2026-05-11',
  '2026-05-12','2026-05-13','2026-05-14','2026-05-15','2026-05-16','2026-05-17',
  '2026-05-18','2026-05-19','2026-05-20','2026-05-21','2026-05-22','2026-05-23',
  '2026-05-24','2026-05-25','2026-05-26','2026-05-27','2026-05-28','2026-05-29',
  '2026-05-30','2026-05-31','2026-06-01'
];

export function GET() {
  const urls = [
    ...staticPages.map(p => ({ ...p, path: p.path })),
    ...tutorials.map(t => ({ path: `/tutorial/${t}`, changefreq: 'monthly', priority: '0.8' })),
    ...digests.map(d => ({ path: `/research/daily-digest/${d}`, changefreq: 'monthly', priority: '0.7' })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${siteUrl}${u.path}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
