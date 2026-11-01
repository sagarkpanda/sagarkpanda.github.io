import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

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
    prerender: { handleMissingId: 'warn' }
  }
};

export default config;
