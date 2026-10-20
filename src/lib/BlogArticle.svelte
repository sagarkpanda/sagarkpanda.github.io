<script lang="ts">
  import type { ContentItem } from '$lib/content';
  import { displayDate } from '$lib/format';
  import { normalizeTaxonomySlug } from '$lib/taxonomy';
  import TableOfContents from '$lib/TableOfContents.svelte';
  import SeriesNavigation from '$lib/SeriesNavigation.svelte';
  import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';
  type SeriesGroup = { name: string; currentIndex: number; articles: { title: string; route: string; order: number }[] };
  type PostMeta = Pick<ContentItem, 'slug' | 'route' | 'data'>;
  let { post, allPosts, related }: { post: ContentItem; allPosts: PostMeta[]; related: PostMeta[] } = $props();
  const rawSeries = (value: unknown): string[] => typeof value === 'string' ? [value] : Array.isArray(value) ? value.map(String) : [];

  const seriesGroups: SeriesGroup[] = $derived(
    rawSeries(post.data.series).map((seriesName) => {
      const articles = allPosts.filter((item) => rawSeries(item.data.series).some((name) => name.toLowerCase() === seriesName.toLowerCase())).sort((a,b) => (typeof a.data.series_order === 'number' ? a.data.series_order : Number.MAX_SAFE_INTEGER) - (typeof b.data.series_order === 'number' ? b.data.series_order : Number.MAX_SAFE_INTEGER));
      return { name: seriesName, currentIndex: articles.findIndex((item) => item.route === post.route) + 1, articles: articles.map((item) => ({ title: String(item.data.title ?? item.slug), route: item.route, order: typeof item.data.series_order === 'number' ? item.data.series_order : 0 })) };
    }).filter((series) => series.articles.length > 0 && series.currentIndex > 0)
  );

  const index = $derived(allPosts.findIndex((item) => item.route === post.route));
  const previous = $derived(index >= 0 ? allPosts[index + 1] : undefined);
  const next = $derived(index > 0 ? allPosts[index - 1] : undefined);
  const headings = $derived(post.headings.filter((heading) => heading.level === 2 || heading.level === 3));
</script>
<article>
  <header class="article-header">
    <div class="eyebrow">~/blogs/{post.slug}</div>
    <h1>{post.data.title ?? post.slug}</h1>
    {#if post.data.summary}<p>{post.data.summary}</p>{/if}
    <div class="article-author">By <strong>Sagar Panda</strong></div>
    <div class="article-meta-panel" class:no-series={seriesGroups.length === 0}>
      <div class="article-meta-details">
        <div class="article-meta-top"><span>{displayDate(post.data.date)}</span><span>·</span><span>{post.readingTime} min read</span></div>
        <div class="article-meta-divider"></div>
        <div class="article-meta-row"><span class="article-meta-label">Author:</span><strong>Sagar Panda</strong></div>
        {#if (post.data.tags ?? []).length > 0}<div class="article-meta-row"><span class="article-meta-label">Tags:</span><div class="article-meta-values">{#each [...new Set(post.data.tags ?? [])] as tag}<a href={'/tags/' + normalizeTaxonomySlug(String(tag)) + '/'} class="metadata-tag">{tag}</a>{/each}</div></div>{/if}
      </div>
      {#if seriesGroups.length > 0}<SeriesNavigation series={seriesGroups}/>{/if}
    </div>
  </header>
  {#if post.data.cover}<div class="article-cover"><img src={String(post.data.cover)} alt={String(post.data.title ?? '')} loading="eager" fetchpriority="high"/></div>{/if}
  <div class="article-content"><TableOfContents {headings}/><div class="article-body">{#key post.slug}<MarkdownRenderer html={post.html}/>{/key}</div></div>
  <div class="article-nav">
    {#if previous}<a href={previous.route} class="article-nav-card"><span>← previous</span><strong>{previous.data.title ?? previous.slug}</strong></a>{:else}<span></span>{/if}
    {#if next}<a href={next.route} class="article-nav-card article-nav-next"><span>next →</span><strong>{next.data.title ?? next.slug}</strong></a>{:else}<span></span>{/if}
  </div>
  {#if related.length}<section class="related-section"><div class="command">$ grep -r "related" ~/blogs</div><h2>Related</h2><div class="related-grid">{#each related as item}<a href={item.route} class="related-card"><span>{displayDate(item.data.date)}</span><strong>{item.data.title ?? item.slug}</strong><small>{item.data.summary ?? item.data.description ?? ''}</small></a>{/each}</div></section>{/if}
  <footer class="article-footer"><a href="/blogs/">← all posts</a></footer>
</article>