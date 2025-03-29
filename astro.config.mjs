import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import icon from 'astro-icon';

import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  integrations: [tailwind(), react(), icon()],
  adapter: netlify({
    edgeMiddleware: true
  })
});