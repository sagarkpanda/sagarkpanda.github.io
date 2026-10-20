<script lang="ts">
  import { onMount } from 'svelte';
  import PostCard from '$lib/PostCard.svelte';
  type SearchItem = { title: string; description?: string; content?: string; tags?: string[]; categories?: string[]; route: string; kind?: string; date?: string };
  let query = $state('');
  let items = $state<SearchItem[]>([]);
  let loaded = $state(false);
  onMount(async () => {
    query = new URLSearchParams(window.location.search).get('q') ?? '';
    try { const response = await fetch('/search-index.json'); items = response.ok ? await response.json() as SearchItem[] : []; } catch { items = []; }
    loaded = true;
  });
  const results = $derived(items.filter((item) => (item.kind ?? 'Blog') === 'Blog').filter((item) => [item.title, item.description ?? '', (item.content ?? '').replace(/<[^>]*>/g, ' '), ...(item.tags ?? []), ...(item.categories ?? [])].join(' ').toLowerCase().includes(query.trim().toLowerCase())).slice(0, 100));
</script>
<svelte:head><title>Search | Sagar Panda</title><link rel="canonical" href="https://sagarpanda.com/search/"/><meta name="robots" content="noindex,follow"/></svelte:head>
<main id="main-content" class="shell page-shell"><section class="section"><div class="command">$ grep -R</div><h1>Search</h1><label for="search">Search posts</label><input id="search" bind:value={query} placeholder="Kubernetes, Terraform, GitHub Actions..." class="search-input"/><p class="post-date">{loaded ? results.length : 'Loading'} results</p><div class="post-list">{#each results as item}<article class="post-row"><div class="post-date">{item.date ?? ''}</div><div><a class="post-title" href={item.route}>{item.title}</a><p>{item.description ?? ''}</p><div class="post-tags">{#each (item.tags ?? []).slice(0,4) as tag}<span>#{tag}</span>{/each}</div></div></article>{/each}</div></section></main>
