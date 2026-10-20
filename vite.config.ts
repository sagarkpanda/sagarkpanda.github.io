// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    chunkSizeWarningLimit: 2000, // Raises the warning threshold to 2MB since Markdown/Mermaid engines are heavy
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('highlight.js') ||
              id.includes('mermaid') ||
              id.includes('marked') ||
              id.includes('gray-matter')
            ) {
              return 'vendor-markdown';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});