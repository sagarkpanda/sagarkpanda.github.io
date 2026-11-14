<script lang="ts">
  let { page, totalPages }: { page: number; totalPages: number } = $props();

  const firstHref = '/blogs/';
  const previousHref = $derived(page === 2 ? '/blogs/' : `/blogs/page/${page - 1}/`);
  const nextHref = $derived(`/blogs/page/${page + 1}/`);
  const lastHref = $derived(`/blogs/page/${totalPages}/`);
</script>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Blog pagination">
    {#if page > 1}<a href={firstHref}>« first</a>{:else}<span class="disabled">« first</span>{/if}
    {#if page > 1}<a href={previousHref}>← newer</a>{:else}<span class="disabled">← newer</span>{/if}
    <span>page {page} of {totalPages}</span>
    {#if page < totalPages}<a href={nextHref}>older →</a>{:else}<span class="disabled">older →</span>{/if}
    {#if page < totalPages}<a href={lastHref}>last »</a>{:else}<span class="disabled">last »</span>{/if}
  </nav>
{/if}
