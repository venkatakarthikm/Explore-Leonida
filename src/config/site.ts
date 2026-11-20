export const SITE = {
  name: process.env.SITE_NAME || 'Explore Leonida',
  url: (process.env.SITE_URL || 'https://exploreleonida.pages.dev').replace(/\/$/, ''),
  gaId: process.env.GA_ID || '',
  tagline: 'The unofficial Grand Theft Auto VI guide',
  description:
    'Unofficial, fact-checked GTA 6 guide: PS5 cheat codes with verification status, review scores with sources, Metacritic 99 roundup, comparisons, buy and preload guides.',
  social: { x: 'https://x.com/', youtube: 'https://youtube.com/', reddit: 'https://reddit.com/r/GTA6' },
  lastDataUpdate: '2026-11-19',
};
