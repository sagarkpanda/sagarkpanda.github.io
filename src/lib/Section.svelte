<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  let { command, title, id, headingLevel = 'h2', children }: {
    command: string; title: string; id?: string; headingLevel?: 'h1' | 'h2'; children: Snippet;
  } = $props();
  let section: HTMLElement | undefined;
  onMount(() => {
    if (!section) return;
    if (!('IntersectionObserver' in window)) {
      section.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('is-visible');
        observer.unobserve(section);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  });
</script>
<section bind:this={section} {id} class="section section-reveal">
  <div class="command">$ {command}</div>
  {#if headingLevel === 'h1'}<h1>{title}</h1>{:else}<h2>{title}</h2>{/if}
  {@render children()}
</section>
