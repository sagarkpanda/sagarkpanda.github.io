<script lang="ts">
  import Section from '$lib/Section.svelte';
  import { site } from '$lib/site';
  let { headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' } = $props();
  const linkedin = site.social.find(([name]) => name === 'LinkedIn')?.[1];
</script>
<Section command="ping sagar --interactive" title="Get In Touch" id="contact" {headingLevel}>
  <div class="contact-card">
    <p>My inbox is always open. Whether it is an infrastructure question, collaboration, or just a technical discussion, send me a note or connect with me on LinkedIn.</p>
    <div class="hero-actions contact-actions">
      <a class="button primary" href={'mailto:' + site.email}>$ email</a>
      {#if linkedin}<a class="button primary" href={linkedin} target="_blank" rel="noopener noreferrer">$ linkedin</a>{/if}
    </div>
  </div>
</Section>
