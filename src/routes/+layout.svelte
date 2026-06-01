<script>
  import '../app.css';
  import { Sun, Moon, Menu, X, ChevronRight, ChevronDown, Home, BookOpen } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { onNavigate } from '$app/navigation';
  import SEO from '$lib/components/SEO.svelte';

  let { children } = $props();
  let darkMode = $state(true);
  let mobileMenuOpen = $state(false);
  let tutorialOpen = $state(false);

  function toggleTheme() {
    darkMode = !darkMode;
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }

  const nav = [
    { label: 'Riset', href: '/research' },
    { label: 'Teknologi & AI', href: '/tech' },
    { label: 'Tutorial', href: '/tutorial' },
    { label: 'Jurnal', href: '/journal' },
    { label: 'Knowledge Base', href: '/knowledge-base' },
    { label: 'Tentang', href: '/about' },
  ];

  const tutorials = [
    { label: 'SvelteKit + PM2', href: '/tutorial/sveltekit-pm2-production' },
    { label: 'Google Drive Backup', href: '/tutorial/google-drive-backup' },
    { label: 'WhatsApp Bridge', href: '/tutorial/whatsapp-bridge-setup' },
    { label: 'HestiaCP Install', href: '/tutorial/hestiacp-installation-guide' },
    { label: 'Cloudflare Turnstile', href: '/tutorial/cloudflare-turnstile-sveltekit' },
    { label: 'MkDocs Dark Theme', href: '/tutorial/mkdocs-dark-theme' },
    { label: 'Tauri + Svelte', href: '/tutorial/tauri-svelte-desktop-guide' },
    { label: 'Webhook Monitor', href: '/tutorial/webhook-google-sheet-monitor' },
    { label: 'Cari AKPK', href: '/tutorial/cari-akpk' },
    { label: 'Rust Programming', href: '/tutorial/rust-programming-guide' },
    { label: 'Stock Analysis', href: '/tutorial/stock-analysis-design' },
    { label: 'Bisnis Shortlink', href: '/tutorial/shortlink-business-plan' },
  ];

  function isActive(href) {
    if (href === '/') return $page.url.pathname === '/';
    return $page.url.pathname.startsWith(href);
  }

  onNavigate(() => { mobileMenuOpen = false; });
</script>

<div class="flex min-h-screen flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50 border-b border-border dark:border-dark-border bg-bg/80 dark:bg-dark-bg/80 backdrop-blur-md">
    <div class="mx-auto max-w-3xl flex items-center justify-between px-5 py-3">
      <a href="/" class="text-base font-bold tracking-tight text-primary">Hermes Blog</a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        {#each nav as item}
          <a href={item.href} class="px-2.5 py-1.5 rounded text-sm transition-colors {isActive(item.href) ? 'text-primary font-medium' : 'text-text-muted dark:text-dark-text-muted hover:text-text dark:hover:text-dark-text'}">
            {item.label}
          </a>
        {/each}
        <button onclick={toggleTheme} class="ml-2 p-1.5 rounded hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-colors" aria-label="Toggle theme">
          {#if darkMode}<Sun size={16} />{:else}<Moon size={16} />{/if}
        </button>
      </nav>

      <!-- Mobile menu button -->
      <div class="flex items-center gap-2 md:hidden">
        <button onclick={toggleTheme} class="p-1.5 rounded hover:bg-bg-alt dark:hover:bg-dark-bg-alt" aria-label="Toggle theme">
          {#if darkMode}<Sun size={16} />{:else}<Moon size={16} />{/if}
        </button>
        <button onclick={() => mobileMenuOpen = !mobileMenuOpen} class="p-1.5 rounded hover:bg-bg-alt dark:hover:bg-dark-bg-alt" aria-label="Menu">
          {#if mobileMenuOpen}<X size={18} />{:else}<Menu size={18} />{/if}
        </button>
      </div>
    </div>

    <!-- Mobile dropdown -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-border dark:border-dark-border bg-bg dark:bg-dark-bg">
        <nav class="px-5 py-3 space-y-0.5">
          {#each nav as item}
            {#if item.href === '/tutorial'}
              <button
                class="flex items-center justify-between w-full py-2 text-sm {isActive(item.href) ? 'text-primary font-medium' : 'text-text-muted dark:text-dark-text-muted'}"
                onclick={() => tutorialOpen = !tutorialOpen}
              >
                <span>{item.label}</span>
                <ChevronDown size={14} class="transition-transform {tutorialOpen ? 'rotate-180' : ''}" />
              </button>
              {#if tutorialOpen}
                <div class="pl-4 space-y-1 pb-2">
                  {#each tutorials as t}
                    <a href={t.href} class="block py-1.5 text-xs {isActive(t.href) ? 'text-primary' : 'text-text-muted dark:text-dark-text-muted'}">{t.label}</a>
                  {/each}
                </div>
              {/if}
            {:else}
              <a href={item.href} class="block py-2 text-sm {isActive(item.href) ? 'text-primary font-medium' : 'text-text-muted dark:text-dark-text-muted'}">{item.label}</a>
            {/if}
          {/each}
        </nav>
      </div>
    {/if}
  </header>

  <main class="flex-1">
    <div class="mx-auto max-w-3xl px-5 py-8">
      {@render children()}
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-border dark:border-dark-border py-5 mt-auto">
    <div class="mx-auto max-w-3xl px-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted dark:text-dark-text-muted">
      <p>&copy; 2026 Miftahul Arif</p>
      <div class="flex gap-4">
        <a href="https://github.com/ariefdluffy" class="hover:text-text dark:hover:text-dark-text transition-colors">GitHub</a>
        <a href="/about" class="hover:text-text dark:hover:text-dark-text transition-colors">Tentang & Kontak</a>
      </div>
    </div>
  </footer>
</div>
