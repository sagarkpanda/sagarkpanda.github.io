<script lang="ts">
  let { data }: { data: Record<string, unknown> } = $props();
  let json = $derived(JSON.stringify(data).replace(/</g, "\\u003c"));
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
