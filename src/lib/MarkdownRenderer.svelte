<script lang="ts">
  import { onMount } from 'svelte';
  import hljs from 'highlight.js/lib/common';
  import 'highlight.js/styles/github-dark.css';
  let { html }: { html: string } = $props();
  let root = $state<HTMLDivElement | undefined>();
  let lightbox = $state('');
  let lightboxAlt = $state('');
  onMount(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const enhance = async () => {
      if (!root) return;
      const { default: mermaid } = await import('mermaid');
      if (cancelled || !root) return;
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default' });
      for (const block of Array.from(root.querySelectorAll('pre code'))) {
        if (block.classList.contains('language-mermaid')) {
          const pre = block.parentElement;
          if (!pre) continue;
          const container = document.createElement('div');
          container.className = 'mermaid-wrap';
          const diagram = document.createElement('div');
          diagram.className = 'mermaid'; diagram.textContent = block.textContent ?? '';
          container.appendChild(diagram); pre.replaceWith(container);
          continue;
        }
        try { hljs.highlightElement(block as HTMLElement); } catch { /* Keep code readable if highlighting fails. */ }
        const pre = block.parentElement;
        if (!pre || pre.parentElement?.classList.contains('code-details')) continue;
        const code = block.textContent ?? '';
        const lines = code.replace(/\n$/, '').split('\n').length;
        const language = Array.from(block.classList).find((name) => name.startsWith('language-'))?.replace('language-', '') ?? 'code';
        const wrapper = document.createElement('div'); wrapper.className = 'code-details';
        const summary = document.createElement('div'); summary.className = 'code-summary';
        const left = document.createElement('div'); left.className = 'code-summary-left';
        const languageLabel = document.createElement('span'); languageLabel.className = 'code-language'; languageLabel.textContent = language;
        const lineCount = document.createElement('span'); lineCount.className = 'code-line-count'; lineCount.textContent = `${lines} lines`;
        left.append(languageLabel, lineCount); summary.appendChild(left);
        if (lines > 3) {
          wrapper.classList.add('code-collapsed');
          const expand = document.createElement('button'); expand.type = 'button'; expand.className = 'code-expand-button'; expand.setAttribute('aria-label', 'Expand code'); expand.setAttribute('aria-expanded', 'false');
          const icon = document.createElement('span'); icon.textContent = '▼'; expand.appendChild(icon);
          const toggle = () => { const expanded = wrapper.classList.toggle('code-expanded'); wrapper.classList.toggle('code-collapsed', !expanded); expand.setAttribute('aria-expanded', String(expanded)); expand.setAttribute('aria-label', expanded ? 'Collapse code' : 'Expand code'); icon.textContent = expanded ? '▲' : '▼'; };
          expand.addEventListener('click', toggle); cleanups.push(() => expand.removeEventListener('click', toggle)); summary.appendChild(expand);
        }
        const codeContent = document.createElement('div'); codeContent.className = 'code-content';
        const parent = pre.parentElement;
        if (!parent) continue;
        parent.insertBefore(wrapper, pre); wrapper.append(summary, codeContent); codeContent.appendChild(pre); pre.classList.add('code-block');
        if (!pre.querySelector('.code-copy')) {
          const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'code-copy'; copy.textContent = 'copy'; copy.setAttribute('aria-label', 'Copy code');
          const copyHandler = async () => { try { await navigator.clipboard.writeText(code.replace(/\n$/, '')); copy.textContent = 'copied'; } catch { copy.textContent = 'copy failed'; } window.setTimeout(() => { if (copy.isConnected) copy.textContent = 'copy'; }, 1200); };
          copy.addEventListener('click', copyHandler); cleanups.push(() => copy.removeEventListener('click', copyHandler)); pre.appendChild(copy);
        }
      }
      const diagrams = Array.from(root.querySelectorAll('.mermaid'));
      if (diagrams.length) { try { await mermaid.run({ nodes: diagrams as HTMLElement[] }); } catch (error) { console.error('Mermaid render failed', error); } }
      for (const image of Array.from(root.querySelectorAll('img'))) {
        if (image.parentElement?.classList.contains('article-lightbox-trigger')) continue;
        const button = document.createElement('button'); button.type = 'button'; button.className = 'article-lightbox-trigger'; button.setAttribute('aria-label', `Open image: ${(image as HTMLImageElement).alt || 'image'}`);
        const parent = image.parentElement;
        if (!parent) continue;
        parent.insertBefore(button, image); button.appendChild(image);
        const click = () => { lightbox = (image as HTMLImageElement).src; lightboxAlt = (image as HTMLImageElement).alt; };
        button.addEventListener('click', click); cleanups.push(() => button.removeEventListener('click', click));
      }
    };
    void enhance();
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') lightbox = ''; };
    window.addEventListener('keydown', keydown);
    return () => { cancelled = true; window.removeEventListener('keydown', keydown); cleanups.forEach((cleanup) => cleanup()); };
  });
  function closeLightbox(event?: MouseEvent) { if (event && event.target !== event.currentTarget) return; lightbox = ''; }
</script>
<div bind:this={root} class="markdown-content">{@html html}</div>
{#if lightbox}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="image-lightbox" role="dialog" aria-modal="true" tabindex="-1" aria-label={lightboxAlt || 'Image preview'} onclick={closeLightbox}>
    <button type="button" class="image-lightbox-close" aria-label="Close image" onclick={(event) => { event.stopPropagation(); lightbox = ''; }}>×</button>
    <div class="image-lightbox-content"><img src={lightbox} alt={lightboxAlt} decoding="async"/></div>
  </div>
{/if}