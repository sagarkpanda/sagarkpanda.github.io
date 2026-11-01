import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('highlight.js')) return 'vendor-highlight';
          if (/node_modules\/(unified|remark|rehype|mdast|hast|micromark|unist|vfile)/.test(id)) return 'vendor-markdown';
        }
      }
    }
  }
});
