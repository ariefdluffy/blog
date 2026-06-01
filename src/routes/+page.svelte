<script>
  import { ChevronRight, ArrowRight, Rss } from 'lucide-svelte';
  import SEO from '$lib/components/SEO.svelte';

  const latestDigests = [
    { date: '2026-06-01', label: '01 Jun 2026', count: 15 },
    { date: '2026-05-21', label: '21 Mei 2026', count: 15 },
    { date: '2026-05-18', label: '18 Mei 2026', count: 15 },
    { date: '2026-05-14', label: '14 Mei 2026', count: 15 },
  ];

  const latestTutorials = [
    { slug: 'sveltekit-pm2-production', label: 'Deploy SvelteKit + PM2' },
    { slug: 'rust-programming-guide', label: 'Panduan Rust Programming' },
    { slug: 'tauri-svelte-desktop-guide', label: 'Tauri + Svelte Desktop App' },
    { slug: 'cloudflare-turnstile-sveltekit', label: 'Cloudflare Turnstile + SvelteKit' },
    { slug: 'hestiacp-installation-guide', label: 'Install HestiaCP di VPS' },
  ];

  const sections = [
    { label: 'Research Digests', desc: 'Ringkasan paper arXiv & Semantic Scholar setiap hari', href: '/research', count: '45 digest' },
    { label: 'Teknologi & AI', desc: 'Berita AI terkini dan artikel teknologi mendalam', href: '/tech', count: '100+ artikel' },
    { label: 'Tutorial', desc: 'Panduan teknis step-by-step berdasarkan pengalaman nyata', href: '/tutorial', count: '12 tutorial' },
    { label: 'Jurnal', desc: 'Catatan harian, refleksi, dan log aktivitas', href: '/journal', count: 'Harian' },
    { label: 'Knowledge Base', desc: 'Tips, referensi, dan kumpulan pengetahuan', href: '/knowledge-base', count: '' },
  ];
</script>

<SEO title="Hermes Blog" description="Blog pribadi Miftahul Arif — AI research digests, tech tutorials, dan jurnal harian. Konten di-generate otomatis setiap hari." />

<!-- Hero -->
<section class="mb-14">
  <div class="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight mb-2">Miftahul Arif</h1>
      <p class="text-sm text-text-muted dark:text-dark-text-muted">AI Researcher &middot; Developer &middot; Writer</p>
    </div>
    <a href="/research" class="flex-shrink-0 mt-1 text-xs px-3 py-1.5 rounded-full border border-border dark:border-dark-border text-text-muted dark:text-dark-text-muted hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5">
      <Rss size={12} />
      RSS
    </a>
  </div>
  <p class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl">
    Blog pribadi berisi daily AI research digests, tech tutorials, dan jurnal harian. 
    Konten di-generate otomatis setiap hari pukul 08:00 WIB oleh Hermes Agent.
  </p>
</section>

<!-- Sections Grid -->
<section class="mb-14">
  <h2 class="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted mb-4">Navigasi</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {#each sections as s}
      <a href={s.href} class="group block rounded-lg border border-border dark:border-dark-border p-4 hover:border-primary/50 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all">
        <div class="flex items-start justify-between mb-1.5">
          <h3 class="text-sm font-bold group-hover:text-primary transition-colors">{s.label}</h3>
          {#if s.count}
            <span class="text-xs text-text-muted dark:text-dark-text-muted bg-bg-alt dark:bg-dark-bg-alt px-2 py-0.5 rounded">{s.count}</span>
          {/if}
        </div>
        <p class="text-xs text-text-muted dark:text-dark-text-muted leading-relaxed">{s.desc}</p>
      </a>
    {/each}
  </div>
</section>

<!-- Latest Research -->
<section class="mb-14">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted">Research Terbaru</h2>
    <a href="/research" class="text-xs text-primary hover:underline flex items-center gap-1">
      Lihat semua <ArrowRight size={12} />
    </a>
  </div>
  <div class="space-y-0">
    {#each latestDigests as d}
      <a href="/research/daily-digest/{d.date}" class="flex items-center justify-between py-3 border-b border-border dark:border-dark-border hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-colors -mx-2 px-2 rounded group">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full {d.count > 0 ? 'bg-green-500' : 'bg-text-muted dark:bg-dark-text-muted'} flex-shrink-0"></span>
          <span class="text-sm font-medium group-hover:text-primary transition-colors">{d.label}</span>
        </div>
        <div class="flex items-center gap-2">
          {#if d.count > 0}
            <span class="text-xs text-text-muted dark:text-dark-text-muted">{d.count} papers</span>
          {:else}
            <span class="text-xs text-text-muted dark:text-dark-text-muted italic">kosong</span>
          {/if}
          <ChevronRight size={14} class="text-text-muted dark:text-dark-text-muted group-hover:text-primary transition-colors" />
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- Latest Tutorials -->
<section class="mb-14">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted">Tutorial Populer</h2>
    <a href="/tutorial" class="text-xs text-primary hover:underline flex items-center gap-1">
      Lihat semua <ArrowRight size={12} />
    </a>
  </div>
  <div class="space-y-0">
    {#each latestTutorials as t, i}
      <a href="/tutorial/{t.slug}" class="flex items-center gap-3 py-3 border-b border-border dark:border-dark-border hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-colors -mx-2 px-2 rounded group">
        <span class="text-xs text-text-muted dark:text-dark-text-muted font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
        <span class="text-sm font-medium group-hover:text-primary transition-colors">{t.label}</span>
      </a>
    {/each}
  </div>
</section>
