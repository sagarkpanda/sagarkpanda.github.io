<script lang="ts">
  import { onMount } from 'svelte';
  type Heading = { id: string; text: string; level: number };
  let { headings }: { headings: Heading[] } = $props();
  let open = $state(false);
  let activeIndex = $state(-1);
  let activeText = $state('table of contents');
  let root = $state<HTMLElement | undefined>();
  onMount(() => {
    if (!headings.length) return;
    const update = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('.article-body h2, .article-body h3'));
      if (!elements.length) return;
      let currentIndex = 0;
      for (let i = 0; i < elements.length; i++) { if (elements[i].getBoundingClientRect().top <= 130) currentIndex = i; else break; }
      activeIndex = currentIndex;
      activeText = elements[currentIndex]?.textContent?.trim() || headings[currentIndex]?.text || 'table of contents';
    };
    let ticking = false;
    const scroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); };
    const outside = (event: MouseEvent) => { if (root && event.target instanceof Node && !root.contains(event.target)) open = false; };
    update(); window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', update); document.addEventListener('mousedown', outside);
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', update); document.removeEventListener('mousedown', outside); };
  });
  function goToHeading(event: MouseEvent, heading: Heading, index: number) {
    event.preventDefault();
    const element = document.getElementById(heading.id);
    if (!element) return;
    open = false; activeIndex = index; activeText = element.textContent?.trim() || heading.text;
    const top = element.getBoundingClientRect().top + window.scrollY - 105;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    window.history.replaceState(null, '', `#${element.id}`);
  }
</script>
{#if headings.length}<section bind:this={root} class:toc-open={open} class="toc"><button type="button" class="toc-toggle" aria-expanded={open} onclick={() => open = !open}><span class="toc-toggle-left"><span class="toc-terminal" aria-hidden="true">$</span><span class="toc-current-heading">{activeText}</span></span><span class="toc-arrow" aria-hidden="true">{open ? '▲' : '▼'}</span></button>{#if open}<nav class="toc-nav" aria-label="Table of contents"><div class="toc-list">{#each headings as heading, index}<a href={'#' + heading.id} class:toc-sub={heading.level === 3} class:toc-active={activeIndex === index} onclick={(event) => goToHeading(event, heading, index)}><span class="toc-active-marker" aria-hidden="true">{activeIndex === index ? '>' : ''}</span><span>{heading.text}</span></a>{/each}</div></nav>{/if}</section>{/if}