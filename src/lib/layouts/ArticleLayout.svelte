<script>
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';

  let { title = '', description = '', date = '', tags = [], children } = $props();

  let articleEl = $state(null);
  let readTime = $state(0);

  $effect(() => {
    if (articleEl) {
      const text = articleEl.textContent || '';
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      readTime = Math.max(1, Math.ceil(words / 200));
    }
  });

  let crumbs = $derived(() => {
    const parts = $page.url.pathname.split('/').filter(Boolean);
    const result = [{ label: 'Home', href: '/' }];
    let path = '';
    for (const part of parts) {
      path += '/' + part;
      result.push({ label: part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), href: path });
    }
    return result;
  });
</script>

<SEO {title} {description} type="article" {date} {tags} />

<article bind:this={articleEl} class="prose dark:prose-invert max-w-none">
  <!-- Breadcrumbs -->
  <nav class="mb-6 text-xs text-text-muted dark:text-dark-text-muted flex items-center gap-1 flex-wrap">
    {#each crumbs() as crumb, i}
      {#if i > 0}<span class="opacity-40">/</span>{/if}
      {#if i === crumbs().length - 1}
        <span class="text-text dark:text-dark-text">{crumb.label}</span>
      {:else}
        <a href={crumb.href} class="hover:text-primary transition-colors">{crumb.label}</a>
      {/if}
    {/each}
  </nav>

  {#if title}
    <h1>{title}</h1>
  {/if}

  {#if date || tags.length > 0 || readTime > 0}
    <div class="flex flex-wrap items-center gap-3 text-xs text-text-muted dark:text-dark-text-muted mb-8 not-prose">
      {#if date}
        <time datetime={date}>{date}</time>
      {/if}
      {#if readTime > 0}
        <span>{readTime} min baca</span>
      {/if}
      {#each tags as tag}
        <span class="px-2 py-0.5 rounded bg-bg-alt dark:bg-dark-bg-alt">{tag}</span>
      {/each}
    </div>
  {/if}

  {#if description}
    <p class="text-text-muted dark:text-dark-text-muted text-sm leading-relaxed mb-8 not-prose">{description}</p>
  {/if}

  {@render children()}
</article>
