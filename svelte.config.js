import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Hash every plain inline <script> in src/app.html (the theme-toggle snippet) so the CSP
// allows it. Computed at build time, so editing that script never needs a manual hash update.
const appHtml = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8');
const inlineScriptHashes = [...appHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  (m) => `sha256-${createHash('sha256').update(m[1]).digest('base64')}`
);

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'out',
      assets: 'out',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: { base: '' },
    prerender: { handleMissingId: 'warn' },
    // GitHub Pages cannot send response headers, so SvelteKit writes this policy into a
    // <meta http-equiv="content-security-policy"> tag on every prerendered page. It also
    // hashes the inline scripts it generates itself. (frame-ancestors is header-only.)
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': ['self', 'https://data.sagarpanda.com', ...inlineScriptHashes],
        'style-src': ['self', 'unsafe-inline'],
        // Posts hotlink images from miro.medium.com and i.ibb.co, so allow any HTTPS image.
        'img-src': ['self', 'data:', 'https:'],
        'font-src': ['self', 'data:'],
        'connect-src': ['self', 'https://data.sagarpanda.com'],
        'manifest-src': ['self'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['self'],
        'upgrade-insecure-requests': true
      }
    }
  }
};

export default config;
