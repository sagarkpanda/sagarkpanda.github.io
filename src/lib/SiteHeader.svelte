<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { Sun, Moon } from 'lucide-svelte';
  import TechIcon from '$lib/TechIcon.svelte';
  import SearchButton from '$lib/SearchButton.svelte';
  import { site } from '$lib/site';
  let { dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void } = $props();
  let open = $state(false);
  let active = $state('');
  const links = [
    { desktop: 'Home', mobile: 'cd /', href: '/' },
    { desktop: 'About', mobile: 'cd /about', href: '/about/' },
    { desktop: 'Projects', mobile: 'cd /projects', href: '/#projects' },
    { desktop: 'Experience', mobile: 'cd /experience', href: '/#experience' },
    { desktop: 'Contact', mobile: 'cd /contact', href: '/contact/' },
    { desktop: 'Blogs', mobile: 'cd /blogs', href: '/blogs/' }
  ];
  function updateActive() {
    const hash = window.location.hash.slice(1);
    if (hash) active = hash;
    else if (window.location.pathname.startsWith('/blogs')) active = 'blogs';
    else if (window.location.pathname.startsWith('/about')) active = 'about';
    else if (window.location.pathname.startsWith('/contact')) active = 'contact';
    else active = '';
  }
  let sectionObserver: IntersectionObserver | undefined;
  afterNavigate(() => {
    updateActive();
    sectionObserver?.disconnect();
    sectionObserver = undefined;
    if (window.location.pathname === '/' && 'IntersectionObserver' in window) {
      const sections = ['about', 'projects', 'experience', 'contact'].map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
      sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) active = visible.target.id;
      }, { rootMargin: '-18% 0px -62% 0px', threshold: [0.1, 0.25, 0.5] });
      sections.forEach((section) => sectionObserver?.observe(section));
    }
  });
  onMount(() => {
    const shortcut = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); window.dispatchEvent(new CustomEvent('open-site-search')); } };
    window.addEventListener('hashchange', updateActive);
    window.addEventListener('keydown', shortcut);
    return () => { window.removeEventListener('hashchange', updateActive); window.removeEventListener('keydown', shortcut); sectionObserver?.disconnect(); };
  });
</script>
<header class="site-header">
  <div class="shell nav">
    <a href="/" class="brand" onclick={() => open = false}><span class="prompt">sagar@cloud</span><span class="brand-path">:~$</span></a>
    <nav class:open class="mobile-nav" aria-label="Main navigation">
      {#each links as link}
        <a href={link.href} class:nav-active={active === (link.desktop === 'Blogs' ? 'blogs' : link.desktop.toLowerCase())} onclick={() => { open = false; if (link.href.startsWith('/#')) active = link.href.slice(2); }}>
          <span class="nav-label-desktop">{link.desktop}</span><span class="nav-label-mobile">{link.mobile}</span>
        </a>
      {/each}
    </nav>
    <div class="nav-actions">
      <SearchButton />
      <a href={site.social[0][1]} target="_blank" rel="noopener noreferrer" class="github-link" aria-label="GitHub" title="GitHub"><TechIcon name="GitHub" size={17}/></a>
      <button type="button" class="icon-button" aria-label="Toggle theme" onclick={onToggleTheme}>{#if dark}<Sun size={16}/>{:else}<Moon size={16}/>{/if}</button>
      <button type="button" class:is-open={open} class="menu-toggle" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onclick={() => open = !open}><span aria-hidden="true"><i></i><i></i><i></i></span></button>
    </div>
  </div>
</header>
