<script lang="ts">
  import type { ProjectCardItem } from '$lib/content';
  let { project }: { project: ProjectCardItem } = $props();
  const d = $derived(project.data);
  const status = $derived(String(d.status || 'project'));
  // wip / in progress / in_progress / in-progress / ongoing get the amber dot
  const isWip = $derived(/^(wip|in[\s_-]?progress|ongoing)$/i.test(status.trim()));
</script>
<article class="terminal-card project-card">
  <div class="card-top"><span class="status-dot" class:wip={isWip}></span><span>{status.replaceAll('_', ' ')}</span><span class="mono">{String(d.date || '')}</span></div>
  <h3>{String(d.title ?? project.slug)}</h3>
  <p>{String(d.summary ?? d.description ?? '')}</p>
  <div class="tags">{#each (d.tags ?? []).slice(0, 6) as tag, i}<span class="tech-chip">{String(tag)}</span>{/each}</div>
  <div class="card-links"><a href={project.route}>view project →</a>{#if d.link}<a href={String(d.link)} target="_blank" rel="noopener noreferrer">GitHub ↗</a>{/if}</div>
</article>