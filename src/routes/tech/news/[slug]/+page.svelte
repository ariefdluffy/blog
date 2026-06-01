<script>
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowLeft, Calendar, ExternalLink, Newspaper } from 'lucide-svelte';

  let { data } = $props();
  const news = data.news;

  const sourceColors = {
    techcrunch:          { bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400' },
    arstechnica:         { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    'the-decoder':       { bg: 'bg-orange-500/10',  text: 'text-orange-600 dark:text-orange-400' },
    technologyreview:    { bg: 'bg-rose-500/10',    text: 'text-rose-600 dark:text-rose-400' },
    huggingface:         { bg: 'bg-yellow-500/10',  text: 'text-yellow-600 dark:text-yellow-400' },
    'huggingface.co':    { bg: 'bg-yellow-500/10',  text: 'text-yellow-600 dark:text-yellow-400' }
  };

  function getSourceColor(source) {
    if (!source) return { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400' };
    const key = source.toLowerCase().trim();
    return sourceColors[key] || { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400' };
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  const seoDescription = news.description
    ? news.description.substring(0, 160)
    : `Berita AI: ${news.title}`;
</script>

<SEO title={news.title} description={seoDescription} />

<article class="max-w-3xl mx-auto">
  <!-- Breadcrumb / back -->
  <nav class="mb-6 flex items-center gap-2 text-xs text-text-muted dark:text-dark-text-muted">
    <a href="/tech" class="hover:text-primary transition-colors">Teknologi & AI</a>
    <span>/</span>
    <a href="/tech/news" class="hover:text-primary transition-colors">Berita</a>
  </nav>

  <a
    href="/tech/news"
    class="inline-flex items-center gap-1.5 text-xs text-text-muted dark:text-dark-text-muted hover:text-primary transition-colors mb-6"
  >
    <ArrowLeft size={14} />
    Kembali ke daftar berita
  </a>

  <!-- Header -->
  <header class="mb-8">
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent">
        <Newspaper size={12} />
        Berita
      </span>
      {#if news.source}
        <span
          class="text-[10px] font-medium px-2 py-0.5 rounded-full {getSourceColor(news.source).bg} {getSourceColor(news.source).text}"
        >
          {news.source}
        </span>
      {/if}
      {#if news.date}
        <span class="inline-flex items-center gap-1 text-xs text-text-muted dark:text-dark-text-muted">
          <Calendar size={12} />
          {formatDate(news.date)}
        </span>
      {/if}
    </div>

    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
      {news.title}
    </h1>
  </header>

  <!-- Body -->
  <div class="prose prose-sm dark:prose-invert max-w-none mb-10">
    {#if news.description}
      <p class="text-base leading-relaxed text-text dark:text-dark-text">
        {news.description}
      </p>
    {:else}
      <p class="italic text-text-muted dark:text-dark-text-muted">
        Ringkasan tidak tersedia. Silakan baca selengkapnya di sumber asli.
      </p>
    {/if}
  </div>

  <!-- Source CTA -->
  {#if news.sourceUrl}
    <div
      class="rounded-lg border border-border dark:border-dark-border bg-bg-alt dark:bg-dark-bg-alt p-4 sm:p-5 mb-8"
    >
      <p class="text-xs text-text-muted dark:text-dark-text-muted mb-2">
        Konten ini adalah ringkasan otomatis. Untuk versi lengkap, kunjungi sumber asli:
      </p>
      <a
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline break-all"
      >
        <ExternalLink size={14} />
        Buka sumber asli{#if news.source}&nbsp;({news.source}){/if}
      </a>
    </div>
  {/if}

  <!-- Footer nav -->
  <div class="pt-6 border-t border-border dark:border-dark-border flex flex-wrap gap-3">
    <a
      href="/tech/news"
      class="text-xs px-3 py-1.5 rounded border border-border dark:border-dark-border hover:border-accent hover:text-accent transition-colors inline-flex items-center gap-1.5"
    >
      <Newspaper size={12} />
      Semua Berita
    </a>
    <a
      href="/tech"
      class="text-xs px-3 py-1.5 rounded border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1.5"
    >
      <ArrowLeft size={12} />
      Teknologi & AI
    </a>
  </div>
</article>
