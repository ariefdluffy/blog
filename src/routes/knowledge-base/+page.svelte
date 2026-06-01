<script>
  import SEO from '$lib/components/SEO.svelte';
  import { ArrowRight, Layers, ExternalLink } from 'lucide-svelte';

  let { data } = $props();
</script>

<SEO title="Knowledge Base" description="Kumpulan tips, referensi, dan catatan pengetahuan" />

<!-- Hero -->
<section class="mb-10">
  <div class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="text-lg">📚</span>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight">Knowledge Base</h1>
        <p class="text-xs text-text-muted dark:text-dark-text-muted">Tips & Referensi</p>
      </div>
    </div>
    <p class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl">
      Kumpulan tips, referensi, dan catatan pengetahuan. Dikurasi dari pengalaman dan sumber terpercaya.
    </p>
  </div>
</section>

<!-- Categories -->
<section>
  {#if data.categories.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each data.categories as cat, i}
        <a href={cat.path}
           class="group block rounded-lg border border-border dark:border-dark-border border-l-2 border-l-primary hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden">
          <!-- colored top bar -->
          <div class="h-0.5 bg-primary/40 group-hover:bg-primary transition-colors"></div>
          <div class="p-5">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers size={18} class="text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-bold group-hover:text-primary transition-colors mb-1.5">
                  {cat.title}
                </h3>
                {#if cat.description}
                  <p class="text-xs text-text-muted dark:text-dark-text-muted line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                {/if}
                <div class="flex items-center gap-1 text-[10px] text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={10} />
                  Lihat materi
                </div>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <div class="text-center py-16 text-sm text-text-muted dark:text-dark-text-muted italic">
      Belum ada konten
    </div>
  {/if}
</section>

<!-- Footer -->
<section class="mt-12 pt-6 border-t border-border dark:border-dark-border text-center">
  <p class="text-xs text-text-muted dark:text-dark-text-muted italic">
    Knowledge base diperbarui secara berkala
  </p>
</section>
