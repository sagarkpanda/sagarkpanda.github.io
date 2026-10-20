<script lang="ts">
  import type { PageData } from './$types';
  import BlogArticle from '$lib/BlogArticle.svelte';
  import JsonLd from '$lib/JsonLd.svelte';
  let { data }: { data: PageData } = $props();
  const title = $derived(String(data.post.data.title ?? data.post.slug));
  const description = $derived(String(data.post.data.summary ?? data.post.data.description ?? ''));
  const url = $derived('https://sagarpanda.com' + data.post.route);
  const cover = $derived(data.post.data.cover ? String(data.post.data.cover) : 'https://sagarpanda.com/images/og-image.png');
</script>
<svelte:head>
  <title>{title}</title><meta name="description" content={description}/><link rel="canonical" href={url}/>
  <meta property="og:type" content="article"/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:url" content={url}/><meta property="og:image" content={cover}/>
  <meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/><meta name="twitter:image" content={cover}/>
</svelte:head>
<JsonLd data={{'@context':'https://schema.org','@graph':[{'@context':'https://schema.org','@type':'BlogPosting','@id':url+'#article','headline':title,'description':description,'url':url,'image':cover,'inLanguage':'en','author':{'@type':'Person','@id':'https://sagarpanda.com/#person','name':'Sagar Panda','url':'https://sagarpanda.com/','jobTitle':'DevOps & Cloud Engineer'},'publisher':{'@type':'Person','@id':'https://sagarpanda.com/#person','name':'Sagar Panda','url':'https://sagarpanda.com/'},...(data.post.data.date ? {datePublished:new Date(String(data.post.data.date)).toISOString()} : {}),mainEntityOfPage:{'@type':'WebPage','@id':url},...(Array.isArray(data.post.data.tags) && data.post.data.tags.length ? {keywords:data.post.data.tags.map(String)} : {})},{'@type':'BreadcrumbList','@id':url+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://sagarpanda.com/'},{'@type':'ListItem','position':2,'name':'Blogs','item':'https://sagarpanda.com/blogs/'},{'@type':'ListItem','position':3,'name':title,'item':url}]}]}}/>
<main id="main-content" class="shell article-shell"><BlogArticle post={data.post} allPosts={data.allPosts} related={data.related}/></main>