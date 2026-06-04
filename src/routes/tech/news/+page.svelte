<script>
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowLeft, Newspaper, Calendar, ArrowRight } from 'lucide-svelte';

  let { data } = $props();
  const { news, pagination } = data;

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

<SEO title="Semua Berita AI" description="Daftar semua berita AI terkini" />

<!-- Header -->
<div class="mb-8">
  <a href="/tech"
    class="inline-flex items-center gap-1.5 text-xs text-text-muted dark:text-dark-text-muted hover:text-primary transition-colors mb-4">
    <ArrowLeft size={14} />
    Kembali ke Teknologi & AI
  </a>

  <div class="flex items-center gap-3 mb-3">
    <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
      <Newspaper size={20} class="text-accent" />
    </div>
    <div>
      <h1 class="text-2xl font-extrabold tracking-tight">Semua Berita</h1>
      <p class="text-xs text-text-muted dark:text-dark-text-muted">{pagination.total} berita</p>
    </div>
  </div>
</div>

<!-- News List -->
<div class="space-y-3 mb-8">
  {#if news.length > 0}
    {#each news as item}
      <a href={item.link || '#'}
        class="group block rounded-lg border border-border dark:border-dark-border hover:border-accent/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden">
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
        </div>
      </a>
    {/each}
  {:else}
    <div class="text-center py-16 text-sm text-text-muted dark:text-dark-text-muted italic">
      Belum ada berita
    </div>
  {/if}
</div>

<!-- Pagination -->
{#if pagination.totalPages > 1}
  <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
    {#if pagination.page > 1}
      <a href="?page={pagination.page - 1}"
        class="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors">
        <ArrowLeft size={12} />
        Sebelumnya
      </a>
    {/if}

    {#each Array(pagination.totalPages) as _, i}
      {@const p = i + 1}
      {#if p === pagination.page || p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1}
        <a href="?page={p}"
          class="text-xs px-3 py-1.5 rounded-lg border transition-colors {p === pagination.page ? 'bg-primary text-white border-primary' : 'border-border dark:border-dark-border hover:border-primary hover:text-primary'}">
          {p}
        </a>
      {:else if p === pagination.page - 2 || p === pagination.page + 2}
        <span class="text-xs text-text-muted">...</span>
      {/if}
    {/each}

    {#if pagination.page < pagination.totalPages}
      <a href="?page={pagination.page + 1}"
        class="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors">
        Selanjutnya
        <ArrowRight size={12} />
      </a>
    {/if}
  </nav>
{/if}

<!-- Back link -->
<div class="text-center mt-8">
  <a href="/tech"
    class="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors">
    <ArrowLeft size={14} />
    Kembali ke Teknologi & AI
  </a>
</div>
