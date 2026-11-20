/**
 * Generates sitemap.xml and sub-sitemaps
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from './env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public');
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['/', '2026-11-20', '1.0', 'daily'],
  ['/cheats/ps5', '2026-11-20', '1.0', 'daily'],
  ['/map', '2026-11-20', '0.9', 'weekly'],
  ['/weapons', '2026-11-20', '0.9', 'weekly'],
  ['/characters', '2026-11-20', '0.9', 'weekly'],
  ['/reviews', '2026-11-20', '0.9', 'daily'],
  ['/compare', '2026-11-20', '0.8', 'weekly'],
  ['/buy', '2026-11-20', '0.8', 'weekly'],
  ['/preload', '2026-11-20', '0.8', 'weekly'],
  ['/faq', '2026-11-20', '0.8', 'weekly'],
  ['/guides', '2026-11-20', '0.6', 'weekly'],
  ['/site-index', '2026-11-20', '0.5', 'weekly'],
  ['/about', '2026-11-20', '0.4', 'monthly'],
  ['/disclaimer', '2026-11-20', '0.4', 'monthly'],
  ['/terms', '2026-11-20', '0.4', 'monthly'],
  ['/privacy', '2026-11-20', '0.4', 'monthly'],
  ['/contact', '2026-11-20', '0.4', 'monthly'],
];

const base = SITE_URL.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const url = (loc, lastmod, priority, changefreq) =>
  `  <url><loc>${base}${loc}</loc><lastmod>${lastmod || today}</lastmod>${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}${priority ? `<priority>${priority}</priority>` : ''}</url>`;

const wrap = (body) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(resolve(OUT, 'sitemap-pages.xml'), wrap(PAGES.map(([p, lm, pr, cf]) => url(p, lm, pr, cf)).join('\n')));

writeFileSync(
  resolve(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `  <sitemap><loc>${base}/sitemap-pages.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
  `</sitemapindex>\n`
);

console.log('[generate-sitemap] wrote sitemap-pages.xml, sitemap.xml');
