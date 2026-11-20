import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (mode === 'production') {
    if (!env.SITE_URL || env.SITE_URL.includes('YOURDOMAIN') || env.SITE_URL.includes('localhost')) {
      throw new Error('Production build failed: SITE_URL is missing or contains YOURDOMAIN/localhost.');
    }
  }

  const rawSiteUrl = (env.SITE_URL || 'https://exploreleonida.pages.dev').replace(/\/$/, '');
  const siteUrl = rawSiteUrl.replace('explore-leonida.pages.dev', 'exploreleonida.pages.dev');
  const rawSiteName = env.SITE_NAME || 'Explore Leonida';
  const siteName = rawSiteName.toLowerCase() === 'explore leonida' ? 'Explore Leonida' : rawSiteName;
  const gaId = env.GA_ID || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.SITE_URL': JSON.stringify(siteUrl),
      'process.env.SITE_NAME': JSON.stringify(siteName),
      'process.env.GA_ID': JSON.stringify(gaId),
    },
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      includedRoutes() {
        return [
          '/',
          '/cheats/ps5',
          '/reviews',
          '/compare',
          '/buy',
          '/preload',
          '/characters',
          '/weapons',
          '/map',
          '/guides',
          '/faq',
          '/site-index',
          '/about',
          '/disclaimer',
          '/terms',
          '/privacy',
          '/contact',
          '/404',
        ];
      },
    },
    build: {
      target: 'es2018',
      chunkSizeWarningLimit: 900,
      sourcemap: false,
    },
  };
});
