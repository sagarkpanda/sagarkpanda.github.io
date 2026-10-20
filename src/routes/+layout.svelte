<script lang="ts">
  import '../app.css';
  import SiteHeader from '$lib/SiteHeader.svelte';
  import ScrollToTop from '$lib/ScrollToTop.svelte';
  import { onMount, type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
  let dark = $state(false);

  onMount(() => {
    try {
      const saved = localStorage.getItem('theme');

      dark =
        saved === 'dark' ||
        (!saved &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      document.documentElement.classList.toggle('dark', dark);
    } catch {}
  });

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);

    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  }
</script>

<svelte:head>
  <title>Sagar Panda | DevOps &amp; Cloud Engineer</title>
  <link rel="icon" href="/images/favicon.svg" />
  <meta
    property="og:site_name"
    content="Sagar Panda | DevOps &amp; Cloud Engineer"
  />
</svelte:head>

<a href="#main-content" class="skip-link">Skip to main content</a>

<SiteHeader {dark} onToggleTheme={toggleTheme} />

<div id="main-content">
  {@render children()}
</div>

<ScrollToTop />