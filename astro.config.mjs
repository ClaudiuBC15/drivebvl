import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [react()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 3001,
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
      include: [
        'react',
        'react-dom',
        '@radix-ui/react-avatar',
      ]
    }
  },
});
