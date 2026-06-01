<script>
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-svelte';

  let { data } = $props();

  const monthIcons = {
    'Januari': '❄️', 'Februari': '🌸', 'Maret': '🌱', 'April': '🌿',
    'Mei': '🌺', 'Juni': '☀️', 'Juli': '🌻', 'Agustus': '🌾',
    'September': '🍂', 'Oktober': '🍁', 'November': '🌧️', 'Desember': '🎄',
  };

  function getMonthIcon(monthName) {
    const parts = monthName.split(' ');
    return monthIcons[parts[0]] || '📅';
  }
</script>

<SEO title="Jurnal Harian" description="Catatan harian seputar aktivitas, pembelajaran, dan temuan" />

<!-- Hero -->
<section class="mb-10">
  <div class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="text-lg">📔</span>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight">Jurnal Harian</h1>
        <p class="text-xs text-text-muted dark:text-dark-text-muted">Catatan & Aktivitas</p>
      </div>
    </div>
    <p class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl">
      Catatan harian seputar aktivitas, pembelajaran, dan temuan. Topik: teknologi, AI, DevOps, dan pembelajaran.
    </p>
    {#if data.months.length > 0}
      <div class="flex gap-2 mt-4 flex-wrap">
        {#each data.months as m}
          <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {getMonthIcon(m.month)} {m.month} ({m.count})
          </span>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Latest Entries -->
<section class="mb-10">
  <div class="flex items-center justify-between mb-4">
    <h2 class="flex items-center gap-2 text-sm font-bold text-primary">
      <Clock size={16} />
      Entri Terbaru
    </h2>
  </div>

  <div class="space-y-3">
    {#if data.entries.length > 0}
      {#each data.entries as entry}
        <div class="group rounded-lg border border-border dark:border-dark-border border-l-2 border-l-primary hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden">
          <div class="p-4">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                <Calendar size={16} class="text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium text-primary">{entry.date}</span>
                </div>
                {#if entry.title}
                  <h3 class="text-sm font-semibold text-text dark:text-white group-hover:text-primary transition-colors mb-1.5 line-clamp-2">
                    {entry.title}
                  </h3>
                {/if}
                {#if entry.description}
                  <p class="text-xs text-text-muted dark:text-dark-text-muted line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="text-center py-10 text-sm text-text-muted dark:text-dark-text-muted italic">
        Belum ada jurnal
      </div>
    {/if}
  </div>
</section>

<!-- Month Archives -->
{#if data.months.length > 0}
  <section class="mb-10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="flex items-center gap-2 text-sm font-bold text-accent">
        <BookOpen size={16} />
        Arsip Bulanan
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {#each data.months as m}
        <div class="rounded-lg border border-border dark:border-dark-border border-l-2 border-l-accent p-4 hover:border-accent/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">{getMonthIcon(m.month)}</span>
            <h3 class="text-sm font-bold text-accent">{m.month}</h3>
            <span class="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium ml-auto">
              {m.count} entri
            </span>
          </div>
          <ul class="space-y-1">
            {#each m.entries.slice(0, 3) as e}
              <li class="text-xs text-text-muted dark:text-dark-text-muted line-clamp-1">
                • {e.date}{e.title ? ` — ${e.title}` : ''}
              </li>
            {/each}
            {#if m.entries.length > 3}
              <li class="text-xs text-primary font-medium">+ {m.entries.length - 3} lagi...</li>
            {/if}
          </ul>
        </div>
      {/each}
    </div>
  </section>
{/if}

<!-- Footer -->
<section class="mt-8 pt-6 border-t border-border dark:border-dark-border text-center">
  <p class="text-xs text-text-muted dark:text-dark-text-muted italic">
    Terakhir diperbarui: 01 Mei 2026 · Semua catatan dalam Bahasa Indonesia
  </p>
</section>
