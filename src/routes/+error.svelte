<script lang="ts">
  import { page } from '$app/state';
  const status = $derived(page.status);
  const isNotFound = $derived(status === 404);
</script>
<svelte:head><title>{isNotFound ? '404 | Sagar Panda' : 'Error | Sagar Panda'}</title><meta name="robots" content="noindex"/></svelte:head>
<main id="main-content" class="shell page-shell"><section class="section"><div class="command">$ cat /etc/404</div><h1>{isNotFound ? '404' : 'Something went wrong'}</h1><p class="section-lead">{isNotFound ? 'The requested resource does not exist.' : 'The page could not be loaded. Please try again or return to the homepage.'}</p><a class="text-link" href="/">cd ~</a></section></main>
