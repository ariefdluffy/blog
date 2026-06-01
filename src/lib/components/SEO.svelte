<script>
  import { page } from '$app/stores';

  let {
    title = 'Hermes Blog',
    description = 'Blog pribadi Miftahul Arif — AI research digests, tech tutorials, dan jurnal harian. Seluruh konten di-generate oleh AI Assistant Hermes Agent.',
    type = 'website',
    date = '',
    tags = [],
    image = ''
  } = $props();

  const siteUrl = 'https://lockbit.my.id';
  const siteName = 'Hermes Blog';
  const author = 'Miftahul Arif';

  let fullTitle = $derived(title === siteName ? siteName : `${title} — ${siteName}`);
  let currentUrl = $derived(`${siteUrl}${$page.url.pathname}`);
  let ogImage = $derived(image || `${siteUrl}/og-default.png`);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta name="author" content={author} />
  <link rel="canonical" href={currentUrl} />

  <!-- Open Graph -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content="id_ID" />
  {#if image}
    <meta property="og:image" content={image} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  <!-- Article specific -->
  {#if type === 'article' && date}
    <meta property="article:published_time" content={date} />
  {/if}
  {#if tags.length > 0}
    {#each tags as tag}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}

  <!-- JSON-LD -->
  {#if type === 'article'}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": { "@type": "Person", "name": author },
        "url": currentUrl,
        "datePublished": date,
        "publisher": { "@type": "Organization", "name": siteName }
      })}
    </script>
  {:else}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": siteUrl,
        "author": { "@type": "Person", "name": author },
        "description": description
      })}
    </script>
  {/if}
</svelte:head>
