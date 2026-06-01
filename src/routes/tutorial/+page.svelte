<script>
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowRight, BookOpen, Layers, FileText } from 'lucide-svelte';

  let { data } = $props();

  // Icons per category (simple map)
  const categoryIcons = {
    'DevOps & Server': '🖥️',
    'Web & Desktop': '🌐',
    'Automation': '⚙️',
    'Programming': '💻',
    'AI & ML': '🤖',
    'Database': '🗄️',
  };

  const categoryColors = [
    'border-l-primary',
    'border-l-accent',
    'border-l-emerald-500',
    'border-l-orange-500',
    'border-l-rose-500',
    'border-l-yellow-500',
  ];

  function getColor(i) {
    return categoryColors[i % categoryColors.length];
  }
</script>

<SEO title="Tutorial" description="Kumpulan tutorial teknis step-by-step berdasarkan pengalaman nyata" />

<!-- Hero -->
<section class="mb-10">
  <div class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="text-lg">📘</span>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight">Tutorial</h1>
        <p class="text-xs text-text-muted dark:text-dark-text-muted">Panduan Teknis</p>
      </div>
    </div>
    <p class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl">
      Panduan teknis step-by-step berdasarkan pengalaman nyata setup dan maintenance server.
    </p>
    {#if data.categories.length > 0}
      <div class="flex gap-2 mt-4 flex-wrap">
        {#each data.categories as cat}
          <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {cat.category} ({cat.count})
          </span>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Categories -->
<div class="space-y-8">
  {#if data.categories.length > 0}
    {#each data.categories as cat, ci}
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="flex items-center gap-2 text-sm font-bold text-primary">
            <span>{categoryIcons[cat.category] || '📄'}</span>
            {cat.category}
          </h2>
          <span class="text-xs text-text-muted dark:text-dark-text-muted">{cat.count} tutorial</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each cat.tutorials as t, i}
            <a href={t.path}
               class="group block rounded-lg border border-border dark:border-dark-border border-l-2 {getColor(ci)} hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden">
              <div class="p-4">
                <div class="flex items-start gap-3">
                  <span class="flex-shrink-0 w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {t.title}
                    </h3>
                    <p class="text-[11px] text-text-muted dark:text-dark-text-muted mt-1.5 font-mono truncate">
                      {t.path}
                    </p>
                  </div>
                  <ArrowRight size={14} class="flex-shrink-0 text-text-muted dark:text-dark-text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                </div>
              </div>
            </a>
          {/each}
        </div>
      </section>
    {/each}
  {:else}
    <div class="text-center py-16 text-sm text-text-muted dark:text-dark-text-muted italic">
      Belum ada tutorial
    </div>
  {/if}
</div>

<!-- Footer -->
<section class="mt-12 pt-6 border-t border-border dark:border-dark-border text-center">
  <p class="text-xs text-text-muted dark:text-dark-text-muted italic">
    Semua tutorial ditulis berdasarkan pengalaman nyata. Langsung bisa dipraktekkan.
  </p>
</section>
