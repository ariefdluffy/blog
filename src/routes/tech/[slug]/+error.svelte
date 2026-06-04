<script>
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowLeft, FileQuestion, BookOpen, ExternalLink, ArrowRight } from 'lucide-svelte';

  let err = $derived($page.error);
  let articles = $derived(err?.body?.articles || []);
  let isMatched = $derived(articles.some(a => a.slug === err?.body?.slug));
</script>

<SEO title="Artikel Tidak Ditemukan" description="Halaman artikel tidak ditemukan" />

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 min-h-[60vh] items-start">
  <!-- KIRI: 404 Message -->
  <div class="flex flex-col items-center md:items-start text-center md:text-left pt-8 md:pt-16">
    <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
      <FileQuestion size={32} class="text-red-500" />
    </div>
    <h1 class="text-6xl font-black text-text dark:text-white mb-2">404</h1>
    <p class="text-sm text-text-muted dark:text-dark-text-muted mb-4">
      {err?.body?.message || 'Halaman tidak ditemukan'}
    </p>
    {#if isMatched}
      <div class="flex flex-col items-center md:items-start gap-2 mb-6">
        <p class="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
          ✓ Artikel ini ada, tapi belum punya halaman individu
        </p>
        <p class="text-xs text-text-muted dark:text-dark-text-muted">
          Baca artikel dengan scroll ke posisinya di halaman utama.
        </p>
      </div>
    {:else}
      <p class="text-xs text-text-muted dark:text-dark-text-muted mb-6">
        Mungkin slug salah atau artikel belum dibuat.
      </p>
    {/if}

    <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <a href="/tech/articles"
        class="inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors">
        <BookOpen size={14} />
        Semua Artikel
      </a>
      <a href="/tech"
        class="inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors">
        <ArrowLeft size={14} />
        Teknologi & AI
      </a>
    </div>
  </div>

  <!-- KANAN: Available Articles -->
  <div class="border-t md:border-t-0 md:border-l border-border dark:border-dark-border pt-6 md:pt-0 md:pl-6">
    <div class="flex items-center gap-2 mb-4">
      <BookOpen size={16} class="text-primary" />
      <h2 class="text-sm font-bold text-primary">Artikel Tersedia</h2>
      <span class="text-xs text-text-muted dark:text-dark-text-muted">({articles.length})</span>
    </div>

    {#if articles.length > 0}
      <div class="space-y-3">
        {#each articles as a, i}
          <a href="/tech/articles#{a.slug}"
            class="group block rounded-lg border border-border dark:border-dark-border border-l-2 border-l-primary hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden">
            <div class="p-3">
              <div class="flex items-start gap-2">
                <span class="flex-shrink-0 w-5 h-5 rounded bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div class="min-w-0 flex-1">
                  <h3 class="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {a.title}
                  </h3>
                  {#if a.description}
                    <p class="text-[11px] text-text-muted dark:text-dark-text-muted line-clamp-1 leading-relaxed">
                      {a.description}
                    </p>
                  {/if}
                </div>
                <ArrowRight size={12} class="flex-shrink-0 text-text-muted dark:text-dark-text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all mt-1" />
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-center py-10 text-sm text-text-muted dark:text-dark-text-muted italic">
        Belum ada artikel
      </div>
    {/if}
  </div>
</div>
