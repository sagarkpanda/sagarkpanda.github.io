<script lang="ts">
  type Article = { title: string; route: string; order: number };
  type Group = { name: string; currentIndex: number; articles: Article[] };
  let { series }: { series: Group[] } = $props();
  let activeSeries = $state(0);
  const active = $derived(series[activeSeries]);
  const currentArticle = $derived(active?.articles[active.currentIndex - 1]);
</script>
{#if series.length && active}<div class="series-panel">{#if series.length > 1}<div class="series-tabs" role="tablist">{#each series as item, index}<button type="button" role="tab" aria-selected={activeSeries === index} class:active={activeSeries === index} class="series-tab" onclick={() => activeSeries = index}><span>{item.name}</span><span>{item.currentIndex}/{item.articles.length}</span></button>{/each}</div>{/if}<div class="series-panel-header"><div class="series-name" title={active.name}>{active.name}</div><div class="series-count">{active.currentIndex}/{active.articles.length}</div></div><nav class="series-list" aria-label={`${active.name} series`}>{#each active.articles as article}<a href={article.route} class:current={article.route === currentArticle?.route} class="series-item" aria-current={article.route === currentArticle?.route ? 'page' : undefined}><span class="series-order">{article.order}</span><span class="series-title" title={article.title}>{article.title}</span></a>{/each}</nav></div>{/if}
