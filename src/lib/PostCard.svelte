<script lang="ts">
  import type { PostCardItem } from '$lib/content';
  import { normalizeTaxonomySlug } from '$lib/taxonomy';
  import { displayDate } from '$lib/format';
  let { post }: { post: PostCardItem } = $props();
</script>
<article class="post-row">
  <div class="post-date">{displayDate(post.data.date)}</div>
  <div>
    <a class="post-title" href={post.route}>{post.data.title ?? post.slug}</a>
    <p>{post.data.summary ?? post.data.description ?? ''}</p>
    <div class="post-meta"><span>{post.readingTime} min read</span>
      <div class="post-tags">{#each (post.data.tags ?? []).slice(0,4) as tag}<a href={'/tags/' + normalizeTaxonomySlug(String(tag)) + '/'}>{tag}</a>{/each}</div>
    </div>
  </div>
</article>
