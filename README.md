# Explore Leonida - Setup, Analytics & Launch Guide

## 1. Install & run locally
```bash
cd gta6-hub
npm install
npm run dev                 # http://localhost:5173
npm run build               # prebuild generates sitemaps, runs typecheck, then builds to dist/
npm run preview             # serve the production build
```
Verify: `dist/` contains sitemap.xml, sitemap-pages.xml, llms.txt, llms-full.txt, robots.txt.

## 2. Environment Variables (.env)
Pure environment variables (whitelisted in `vite.config.ts` via `define`):
- `SITE_URL` - Full production site URL (defaults to `https://exploreleonida.pages.dev`).
- `SITE_NAME` - Site brand name (e.g. `Explore Leonida`).
- `GA_ID` - Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`).

## 3. Deploy (Cloudflare Pages - free)
1. Push this folder to a GitHub repository.
2. Cloudflare Dashboard -> Workers & Pages -> Create -> Pages -> connect repo.
3. Build command: `npm run build`, output dir: `dist`.
4. Set environment variables `SITE_URL` (`https://exploreleonida.pages.dev`), `SITE_NAME`, and `GA_ID`.
5. HTTPS is automated.

## 4. Google Analytics 4 & Consent Mode
1. analytics.google.com -> Admin -> Create account ("Explore Leonida") -> Property.
2. Data stream -> Web -> copy Measurement ID `G-XXXXXXXXXX`.
3. Put it in `.env` as `GA_ID` and in host environment variables.
4. GA4 is configured with Google Consent Mode v2 (default: denied). `gtag.js` loads only after the visitor accepts cookie consent.
5. Built-in events: `page_view`, `search`, `cheat_copy`, `cheat_filter`, `review_outbound`, `buy_click`, `faq_open`.

## 5. Google Search Console & Bing Webmaster Tools
1. search.google.com/search-console -> Add property -> HTML tag verification or URL prefix:
   `<meta name="google-site-verification" content="4CzNBpwPSGD0nwfTUSD5zyA4hYjTHedhaMwUZiSv__4" />`
2. Sitemaps -> submit `https://exploreleonida.pages.dev/sitemap.xml`.
3. URL Inspection -> inspect `/`, `/cheats/ps5`, `/weapons`, `/characters`, `/map` -> Request indexing.
4. bing.com/webmasters -> Import from GSC -> submit sitemap.

## 6. Content Workflow & Verification
- Every cheat remains `unverified` until entered and verified on a console with recorded proof.
- Review scores are sourced from each outlet's own page.
- Update `lastDataUpdate` in `src/config/site.ts` to refresh sitemaps on build.
