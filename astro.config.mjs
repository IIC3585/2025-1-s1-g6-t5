import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [react(), svelte()],
  output: 'static',
  site: 'https://music-store.com'
});