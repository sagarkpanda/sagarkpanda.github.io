<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { Search, X } from 'lucide-svelte';

  type SearchItem = {
    title: string;
    description?: string;
    content?: string;
    tags?: string[];
    categories?: string[];
    route: string;
    kind?: string;
  };

  const sections = [
    ['About', '/#about'],
    ['Projects', '/#projects'],
    ['Experience', '/#experience'],
    ['Education', '/#education'],
    ['Latest Writing', '/#blog'],
    ['Contact', '/#contact'],
    ['All Blog Posts', '/blogs/']
  ] as const;

  let open = $state(false);
  let query = $state('');
  let index = $state<SearchItem[]>([]);
  let loaded = $state(false);
  let inputEl = $state<HTMLInputElement | undefined>();

  const normalized = $derived(query.trim().toLowerCase());
  const filteredSections = $derived(
    sections.filter(([name]) => !normalized || name.toLowerCase().includes(normalized))
  );

  // Clean each post's content once per index load, not on every keystroke.
  const cleanedIndex = $derived(
    index
      .filter((item) => (item.kind ?? 'Blog') === 'Blog')
      .map((item) => ({ item, clean: cleanSearchContent(item.content ?? '') }))
  );

  const results = $derived(
    normalized
      ? cleanedIndex
          .filter(({ item, clean }) =>
            [item.title, item.description ?? '', clean, ...(item.tags ?? []), ...(item.categories ?? [])]
              .join(' ')
              .toLowerCase()
              .includes(normalized)
          )
          .slice(0, 8)
          .map(({ item, clean }) => ({
            item,
            preview: findContentMatch(clean, normalized) || item.description || ''
          }))
      : []
  );

  async function loadIndex() {
    if (loaded) return;
    try {
      const response = await fetch('/search-index.json');
      index = response.ok ? ((await response.json()) as SearchItem[]) : [];
    } catch {
      index = [];
    }
    loaded = true;
  }

  async function openSearch() {
    open = true;
    void loadIndex();
    await tick();
    inputEl?.focus();
  }

  function close() {
    open = false;
  }

  function submit(event?: Event) {
    event?.preventDefault();
    const q = query.trim();
    if (!q) return;
    close();
    void goto(`/search/?q=${encodeURIComponent(q)}`);
  }

  onMount(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        void openSearch();
      }
      if (event.key === 'Escape') close();
    };
    window.addEventListener('open-site-search', openSearch);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('open-site-search', openSearch);
      window.removeEventListener('keydown', handleKey);
    };
  });

  function cleanSearchContent(content: string) {
    return content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\{\{<\s*figure[\s\S]*?>\}\}/gi, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/!\[[^\]]*\]\s*\[[^\]]*\]/g, ' ')
      .replace(/<img\b[^>]*>/gi, ' ')
      .replace(/<\/?figure\b[^>]*>/gi, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[#>*_`~]/g, ' ')
      .replace(/\]\s*\(/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findContentMatch(content: string, q: string) {
    if (!content || !q) return '';
    const matchIndex = content.toLowerCase().indexOf(q);
    if (matchIndex === -1) return '';

    const sentences = content.split(/(?<=[.!?])\s+/);
    let position = 0;

    for (const sentence of sentences) {
      const sentenceStart = position;
      const sentenceEnd = position + sentence.length;

      if (matchIndex >= sentenceStart && matchIndex <= sentenceEnd) {
        const maxLength = 180;
        if (sentence.length <= maxLength) return sentence.trim();

        const localMatch = matchIndex - sentenceStart;
        const start = Math.max(0, localMatch - 70);
        const end = Math.min(sentence.length, start + maxLength);
        let preview = sentence.slice(start, end).trim();
        if (start > 0) preview = `…${preview}`;
        if (end < sentence.length) preview = `${preview}…`;
        return preview;
      }
      position = sentenceEnd + 1;
    }

    return content.slice(Math.max(0, matchIndex - 70), matchIndex + 110);
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Text is escaped before the <mark> tags are added, so {@html} is safe here.
  function highlightMatch(text: string, q: string) {
    if (!q) return escapeHtml(text);
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text
      .split(new RegExp(`(${escaped})`, 'gi'))
      .map((part) =>
        part.toLowerCase() === q.toLowerCase()
          ? `<mark>${escapeHtml(part)}</mark>`
          : `<span>${escapeHtml(part)}</span>`
      )
      .join('');
  }
</script>

<button
  class="icon-button search-button"
  type="button"
  onclick={openSearch}
  aria-label="Search"
  title="Search (Ctrl+K)"
>
  <Search size={16} />
</button>

{#if open}
  <div class="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
    <button class="search-backdrop" aria-label="Close search" onclick={close} type="button"></button>

    <div class="search-dialog">
      <div class="search-dialog-head">
        <span><Search size={16} /> search</span>
        <button class="icon-button" onclick={close} aria-label="Close search" type="button">
          <X size={16} />
        </button>
      </div>

      <form onsubmit={submit}>
        <div class="search-input-wrap">
          <input
            bind:this={inputEl}
            bind:value={query}
            placeholder="Search blog posts..."
            aria-label="Search blog posts"
          />
          {#if query}
            <button
              type="button"
              class="search-clear"
              onclick={() => {
                query = '';
                inputEl?.focus();
              }}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={17} />
            </button>
          {/if}
        </div>
      </form>

      {#if !normalized}
        <div class="search-suggestions">
          <div class="search-suggestions-title">jump to section</div>
          {#each sections as [name, href]}
            <a {href} onclick={close}>{name}<span>↗</span></a>
          {/each}
        </div>
      {:else}
        <div class="search-suggestions">
          <div class="search-suggestions-title">
            {results.length ? 'matching blog posts' : 'no matching blog posts'}
          </div>

          <div class="search-results-scroll">
            {#each results as { item, preview } (item.route)}
              <a href={item.route} onclick={close}>
                <span class="search-popup-result">
                  <strong>{item.title}</strong>
                  {#if preview}
                    <small>{@html highlightMatch(preview, normalized)}</small>
                  {/if}
                </span>
                <span>↗</span>
              </a>
            {/each}

            {#if !results.length && filteredSections.length > 0}
              <div class="search-suggestions-title">matching sections</div>
              {#each filteredSections as [name, href]}
                <a {href} onclick={close}>{name}<span>↗</span></a>
              {/each}
            {/if}
          </div>
        </div>

        <button type="button" class="search-all-button" onclick={submit}>
          Search all blog posts →
        </button>
      {/if}

      <div class="search-hint"><span>Enter</span> search <span>Esc</span> close</div>
    </div>
  </div>
{/if}
