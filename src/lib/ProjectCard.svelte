<script lang="ts">
  import type { ProjectCardItem } from '$lib/content';
  let { project }: { project: ProjectCardItem } = $props();
  const d = $derived(project.data);
</script>
<article class="terminal-card project-card">
  <div class="card-top"><span class="status-dot"></span><span>{String(d.status || 'project').replaceAll('_', ' ')}</span><span class="mono">{String(d.date || '')}</span></div>
  <h3>{String(d.title ?? project.slug)}</h3>
  <p>{String(d.summary ?? d.description ?? '')}</p>
  <div class="tags">{#each (d.tags ?? []).slice(0, 6) as tag, i}<span class="tech-chip" key={`${String(tag)}-${i}`}>{String(tag)}</span>{/each}</div>
  <div class="card-links"><a href={project.route}>view project →</a>{#if d.link}<a href={String(d.link)} target="_blank" rel="noopener noreferrer">GitHub ↗</a>{/if}</div>
</article>