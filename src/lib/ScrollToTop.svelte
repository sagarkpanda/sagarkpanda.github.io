<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowUp } from 'lucide-svelte';
  let visible = $state(false);
  let idle = $state(false);
  onMount(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const show = window.scrollY > 500;
      visible = show;
      idle = false;
      if (timer) clearTimeout(timer);
      if (show) timer = setTimeout(() => idle = true, 2200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (timer) clearTimeout(timer); };
  });
</script>
{#if visible}<button class="scroll-top" class:scroll-top-idle={idle} onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"><ArrowUp size={17}/></button>{/if}
