<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, X } from 'lucide-svelte';
  type SearchItem = { title: string; description?: string; content?: string; tags?: string[]; categories?: string[]; route: string; kind?: string };
  let open = $state(false);
  let query = $state('');
  let index = $state<SearchItem[]>([]);
  let loaded = $state(false);
  const sections = [['About','/#about'],['Projects','/#projects'],['Experience','/#experience'],['Education','/#education'],['Latest Writing','/#blog'],['Contact','/#contact'],['All Blog Posts','/blogs/']] as const;
  const normalized = $derived(query.trim().toLowerCase());
  const filteredSections = $derived(sections.filter(([name]) => !normalized || name.toLowerCase().includes(normalized)));
  const results = $derived(normalized ? index.filter((item) => (item.kind ?? 'Blog') === 'Blog').filter((item) => [item.title, item.description ?? '', (item.content ?? '').replace(/<[^>]*>/g, ' '), ...(item.tags ?? []), ...(item.categories ?? [])].join(' ').toLowerCase().includes(normalized)).slice(0, 8) : []);
  async function loadIndex() {
    if (loaded) return;
    try { const response = await fetch('/search-index.json'); index = response.ok ? await response.json() as SearchItem[] : []; } catch { index = []; }
    loaded = true;
  }
  function close() { open = false; }
  function submit(event: SubmitEvent) { event.preventDefault(); const q = query.trim(); if (!q) return; close(); window.location.href = `/search/?q=${encodeURIComponent(q)}`; }
  onMount(() => {
    const handleOpen = () => { open = true; void loadIndex(); };
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('open-site-search', handleOpen);
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('open-site-search', handleOpen); window.removeEventListener('keydown', handleKey); };
  });
</script>
<button class="icon-button search-button" type="button" onclick={() => { open = true; void loadIndex(); }} aria-label="Search" title="Search (Ctrl+K)"><Search size={16}/></button>
{#if open}
  <div class="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
    <button class="search-backdrop" aria-label="Close search" onclick={close} type="button"></button>
    <div class="search-dialog">
      <div class="search-dialog-head"><span><Search size={16}/> search</span><button class="icon-button" onclick={close} aria-label="Close search" type="button"><X size={16}/></button></div>
      <form onsubmit={submit}><div class="search-input-wrap"><input use:focus bind:value={query} placeholder="Search blog posts..." aria-label="Search blog posts"/>{#if query}<button type="button" class="search-clear" onclick={() => query = ''} aria-label="Clear search"><X size={17}/></button>{/if}</div></form>
      {#if !normalized}
        <div class="search-suggestions"><div class="search-suggestions-title">jump to section</div>{#each filteredSections as [name, href]}<a href={href} onclick={close}>{name}<span>↗</span></a>{/each}</div>
      {:else}
        <div class="search-suggestions"><div class="search-suggestions-title">{results.length ? 'matching blog posts' : 'no matching blog posts'}</div><div class="search-results-scroll">{#each results as item}<a class="search-result" href={item.route} onclick={close}><strong>{item.title}</strong><span>{item.description ?? ''}</span></a>{/each}</div></div>
      {/if}
      <div class="search-dialog-foot"><span>↑↓ navigate · enter open</span><span>esc close</span></div>
    </div>
  </div>
{/if}