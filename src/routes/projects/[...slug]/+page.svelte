<script lang="ts">
  import type { PageData } from './$types';
  import MarkdownRenderer from '$lib/MarkdownRenderer.svelte';

  let { data }: { data: PageData } = $props();

  const aliases: Record<string, string> = {
    'new relic': 'New Relic',
    opentelemetry: 'OpenTelemetry',
    kubernetes: 'Kubernetes',
    'github actions': 'GitHub Actions',
    'gitlab ci/cd': 'GitLab CI/CD',
    trivy: 'Trivy',
    falco: 'Falco',
    sonarqube: 'SonarQube',
    terraform: 'Terraform',
    ansible: 'Ansible',
    nginx: 'NGINX'
  };
  const normalizeTag = (tag: string) => aliases[tag.toLowerCase()] ?? tag;

  const project = $derived(data.project);
  const title = $derived(String(project.data.title ?? project.slug));
  const summary = $derived(String(project.data.summary ?? ''));
  const description = $derived(String(project.data.description ?? project.data.summary ?? ''));
  const status = $derived(String(project.data.status ?? ''));
  const link = $derived(project.data.link ? String(project.data.link) : '');
  const date = $derived.by(() => {
    const value = project.data.date as unknown;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return value ? String(value) : '';
  });
  const tags = $derived(((project.data.tags as unknown[] | undefined) ?? []).map((tag) => normalizeTag(String(tag))));
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="canonical" href={'https://sagarpanda.com' + project.route} />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="https://sagarpanda.com/images/og-image.png" />
  <meta name="description" content={description} />
</svelte:head>

<main id="main-content" class="shell">
  <article>
    <header class="article-header">
      <div class="eyebrow">~/projects/{project.slug}</div>

      <h1>{title}</h1>

      {#if summary}<p>{summary}</p>{/if}

      <div class="article-meta">
        {date} · {status}
        {#if link}
          · <a href={link} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        {/if}
      </div>

      {#if tags.length}
        <div class="tags project-tags">
          {#each tags as tag (tag)}
            <span class="tech-chip">{tag}</span>
          {/each}
        </div>
      {/if}
    </header>

    <div class="article-body">
      {#key project.slug}
        <MarkdownRenderer html={project.html} />
      {/key}
    </div>
  </article>
</main>
