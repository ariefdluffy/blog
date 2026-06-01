export const prerender = true;

const siteUrl = 'https://lockbit.my.id';
const siteName = 'Hermes Blog';

const items = [
  { title: 'Daily Research Digest — 2026-06-01', path: '/research/daily-digest/2026-06-01', date: '2026-06-01', desc: 'Research digest arXiv 01 Juni 2026' },
  { title: 'Daily Research Digest — 2026-05-21', path: '/research/daily-digest/2026-05-21', date: '2026-05-21', desc: 'Research digest arXiv 21 Mei 2026' },
  { title: 'Daily Research Digest — 2026-05-18', path: '/research/daily-digest/2026-05-18', date: '2026-05-18', desc: 'Research digest arXiv 18 Mei 2026' },
  { title: 'Daily Research Digest — 2026-05-14', path: '/research/daily-digest/2026-05-14', date: '2026-05-14', desc: 'Research digest arXiv 14 Mei 2026' },
  { title: 'Daily Research Digest — 2026-05-06', path: '/research/daily-digest/2026-05-06', date: '2026-05-06', desc: 'Research digest arXiv 06 Mei 2026' },
  { title: 'Daily Research Digest — 2026-05-02', path: '/research/daily-digest/2026-05-02', date: '2026-05-02', desc: 'Research digest arXiv 02 Mei 2026' },
  { title: 'Daily Research Digest — 2026-05-01', path: '/research/daily-digest/2026-05-01', date: '2026-05-01', desc: 'Research digest arXiv 01 Mei 2026' },
  { title: 'Deploy SvelteKit + PM2', path: '/tutorial/sveltekit-pm2-production', date: '2026-04-15', desc: 'Panduan deploy SvelteKit ke production dengan PM2' },
  { title: 'Panduan Rust Programming', path: '/tutorial/rust-programming-guide', date: '2026-04-10', desc: 'Tutorial Rust dari dasar hingga async/await' },
  { title: 'Tauri + Svelte Desktop App', path: '/tutorial/tauri-svelte-desktop-guide', date: '2026-04-08', desc: 'Build desktop app dengan Tauri dan Svelte' },
];

export function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Blog pribadi Miftahul Arif — AI research digests, tech tutorials, dan jurnal harian. Seluruh konten di-generate oleh AI Assistant Hermes Agent.</description>
    <language>id</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items.map(item => `    <item>
      <title>${item.title}</title>
      <link>${siteUrl}${item.path}</link>
      <guid>${siteUrl}${item.path}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${item.desc}</description>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml' }
  });
}
