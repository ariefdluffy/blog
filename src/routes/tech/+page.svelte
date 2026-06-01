<script>
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowRight, Newspaper, BookOpen, Calendar, ExternalLink } from 'lucide-svelte';

  let { data } = $props();

  const sourceColors = {
    techcrunch:          { bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400' },
    arstechnica:         { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    'the-decoder':       { bg: 'bg-orange-500/10',  text: 'text-orange-600 dark:text-orange-400' },
    technologyreview:    { bg: 'bg-rose-500/10',    text: 'text-rose-600 dark:text-rose-400' },
    huggingface:         { bg: 'bg-yellow-500/10',  text: 'text-yellow-600 dark:text-yellow-400' },
    'huggingface.co':    { bg: 'bg-yellow-500/10',  text: 'text-yellow-600 dark:text-yellow-400' },
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
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  }
</script>

<SEO title="Teknologi & AI" description="Berita AI terkini dari sumber terpercaya dan artikel teknologi mendalam. Konten di-update otomatis setiap hari." />

<!-- Hero -->
<section class="mb-10">
  <div class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="text-lg">⚡</span>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight">Teknologi & AI</h1>
        <p class="text-xs text-text-muted dark:text-dark-text-muted">Berita & Artikel</p>
      </div>
    </div>
    <p class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl">
      Berita AI terkini dari sumber terpercaya dan artikel teknologi mendalam. Konten di-update otomatis setiap hari.
    </p>
  </div>
</section>

<!-- Content Grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

  <!-- ARTICLES -->
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="flex items-center gap-2 text-sm font-bold text-primary">
        <BookOpen size={16} />
        Artikel Terbaru
      </h2>
      <a href="/tech/articles" class="text-xs text-primary hover:underline flex items-center gap-1">
        Lihat semua <ArrowRight size={12} />
      </a>
    </div>

    <div class="space-y-3">
      {#if data.articles.length > 0}
        {#each data.articles as article, i}
          <a href={article.link}
             class="group block rounded-lg border border-border dark:border-dark-border hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden">
            <!-- colored top bar -->
            <div class="h-0.5 bg-primary/40 group-hover:bg-primary transition-colors"></div>
            <div class="p-4">
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div class="min-w-0 flex-1">
                  <h3 class="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                    {article.title}
                  </h3>
                  {#if article.date}
                    <div class="flex items-center gap-1.5 text-xs text-text-muted dark:text-dark-text-muted mb-2">
                      <Calendar size={11} />
                      <span>{article.date}</span>
                    </div>
                  {/if}
                  {#if article.description}
                    <p class="text-xs text-text-muted dark:text-dark-text-muted line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  {/if}
                </div>
              </div>
            </div>
          </a>
        {/each}
      {:else}
        <div class="text-center py-10 text-sm text-text-muted dark:text-dark-text-muted italic">
          Belum ada artikel
        </div>
      {/if}
    </div>
  </section>

  <!-- NEWS -->
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="flex items-center gap-2 text-sm font-bold text-accent">
        <Newspaper size={16} />
        Berita Terbaru
      </h2>
      <a href="/tech/news" class="text-xs text-primary hover:underline flex items-center gap-1">
        Lihat semua <ArrowRight size={12} />
      </a>
    </div>

    <div class="space-y-3">
      {#if data.news.length > 0}
        {#each data.news as item}
          <a href={item.link || '#'}
             class="group block rounded-lg border border-border dark:border-dark-border hover:border-accent/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden"
             target="_blank" rel="noopener noreferrer">
            <!-- colored top bar -->
            <div class="h-0.5 bg-accent/40 group-hover:bg-accent transition-colors"></div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <h3 class="text-sm font-semibold group-hover:text-accent transition-colors line-clamp-2 flex-1">
                  {item.title}
                </h3>
                {#if item.source}
                  <span class="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full {getSourceColor(item.source).bg} {getSourceColor(item.source).text}">
                    {item.source}
                  </span>
                {/if}
              </div>
              {#if item.date}
                <div class="flex items-center gap-1.5 text-xs text-text-muted dark:text-dark-text-muted mb-1.5">
                  <Calendar size={11} />
                  <span>{formatDate(item.date)}</span>
                </div>
              {/if}
              {#if item.description}
                <p class="text-xs text-text-muted dark:text-dark-text-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              {/if}
              {#if item.link}
                <div class="flex items-center gap-1 text-[10px] text-text-muted dark:text-dark-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={10} />
                  Buka sumber
                </div>
              {/if}
            </div>
          </a>
        {/each}
      {:else}
        <div class="text-center py-10 text-sm text-text-muted dark:text-dark-text-muted italic">
          Belum ada berita
        </div>
      {/if}
    </div>
  </section>

</div>

<!-- Footer Info -->
<section class="mt-12 pt-6 border-t border-border dark:border-dark-border">
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="text-xs text-text-muted dark:text-dark-text-muted space-y-1">
      <p>
        <span class="font-medium text-text dark:text-dark-text">Sumber:</span>
        TechCrunch, Ars Technica, The Decoder, VentureBeat, MIT Technology Review
      </p>
      <p>
        <span class="font-medium text-text dark:text-dark-text">Update:</span>
        Setiap hari pukul 08:00 WIB
      </p>
    </div>
    <div class="flex gap-3">
      <a href="/tech/articles" class="text-xs px-3 py-1.5 rounded border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5">
        <BookOpen size={12} />
        Semua Artikel
      </a>
      <a href="/tech/news" class="text-xs px-3 py-1.5 rounded border border-border dark:border-dark-border hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5">
        <Newspaper size={12} />
        Semua Berita
      </a>
    </div>
  </div>
</section>
