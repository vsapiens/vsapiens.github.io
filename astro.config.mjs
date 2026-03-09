import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://vsapiens.github.io',
  integrations: [tailwind()],
});
