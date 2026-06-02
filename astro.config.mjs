import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  vite: {
    plugins: [tailwindcss()],
    cacheDir: '.vite-cache',
    server: {
      fs: {
        strict: true,
        allow: [projectRoot],
      },
    },
    optimizeDeps: {
      noDiscovery: true,
    },
  },
});
