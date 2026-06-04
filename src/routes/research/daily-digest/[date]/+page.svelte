<script>
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import { Calendar, ArrowLeft, FileQuestion } from 'lucide-svelte';

  let date = $derived($page.params.date);
</script>

<SEO title="Digest Tidak Tersedia" description={`Research digest untuk ${date} belum tersedia`} />

<div class="flex flex-col items-center text-center py-16">
  <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
    <FileQuestion size={32} class="text-red-500" />
  </div>
  <h1 class="text-4xl font-black text-text dark:text-white mb-2">Digest Belum Tersedia</h1>
  <p class="text-sm text-text-muted dark:text-dark-text-muted mb-2">
    Research digest untuk tanggal <strong class="text-text dark:text-dark-text">{date}</strong> belum tersedia.
  </p>
  <p class="text-xs text-text-muted dark:text-dark-text-muted mb-8 max-w-md">
    Digest di-generate otomatis setiap hari pukul 08:00 WIB. Mungkin tanggal ini belum tiba atau belum sempat diproses.
  </p>
  <a href="/research"
    class="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-border dark:border-dark-border hover:border-primary hover:text-primary transition-colors">
    <ArrowLeft size={14} />
    Kembali ke Research
  </a>
</div>
