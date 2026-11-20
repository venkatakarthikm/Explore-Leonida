const rawUrl = (process.env.SITE_URL || 'https://exploreleonida.pages.dev').replace(/\/$/, '');
const siteUrl = rawUrl.replace('explore-leonida.pages.dev', 'exploreleonida.pages.dev');
const rawName = process.env.SITE_NAME || 'Explore Leonida';
const siteName = rawName.toLowerCase() === 'explore leonida' ? 'Explore Leonida' : rawName;

export const SITE = {
  name: siteName,
  url: siteUrl,
  gaId: process.env.GA_ID || '',
  tagline: 'The unofficial Grand Theft Auto VI guide',
  description:
    'Unofficial, fact-checked GTA 6 guide: PS5 cheat codes with verification status, review scores with sources, Metacritic 99 roundup, comparisons, buy and preload guides.',
  social: { x: 'https://x.com/', youtube: 'https://youtube.com/', reddit: 'https://reddit.com/r/GTA6' },
  lastDataUpdate: '2026-11-19',
};
