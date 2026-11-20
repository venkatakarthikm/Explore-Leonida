export interface PageMeta {
  path: string;
  title: string;
  desc: string;
  updated: string;
  group: string;
}

export const PAGES: PageMeta[] = [
  { path: '/', title: 'Home', desc: 'GTA 6 guide: cheats, reviews, Metacritic 99, guides', updated: '2026-11-19', group: 'Main' },
  { path: '/cheats/ps5', title: 'GTA 6 Cheats PS5', desc: 'Every reported PS5 cheat code with verification status', updated: '2026-11-19', group: 'Core' },
  { path: '/reviews', title: 'GTA 6 Review Scores', desc: 'Metacritic 99 + IGN, GameSpot, Eurogamer and 17 outlet roundup', updated: '2026-11-19', group: 'Core' },
  { path: '/compare', title: 'Compare GTA Games', desc: 'GTA 6 vs GTA 5, RDR2, Cyberpunk: Metacritic and features', updated: '2026-11-20', group: 'Core' },
  { path: '/buy', title: 'Where to Buy GTA 6', desc: 'PlayStation Store, Xbox Store and Rockstar Store links', updated: '2026-11-20', group: 'Core' },
  { path: '/preload', title: 'Preload & Install', desc: 'Pre-download dates, unlock times, storage TBC tracker', updated: '2026-11-20', group: 'Core' },
  { path: '/characters', title: 'Characters (Jason & Lucia)', desc: 'Jason Duval, Lucia Caminos and 50+ confirmed Leonida cast', updated: '2026-11-20', group: 'Core' },
  { path: '/weapons', title: 'Weapons & Arsenal', desc: 'Over 40 confirmed firearms, melee weapons, real-life counterparts, and vehicle trunk armory', updated: '2026-11-20', group: 'Core' },
  { path: '/map', title: 'Interactive Map & Atlas', desc: 'Interactive atlas of Leonida: safehouses, gun stores, mod shops, and 70+ landmarks across 5 counties', updated: '2026-11-20', group: 'Core' },
  { path: '/guides', title: 'Guides (Coming Soon)', desc: 'Map, characters, trophies, walkthrough: in progress', updated: '2026-11-20', group: 'Core' },
  { path: '/faq', title: 'FAQ', desc: '40+ answers on release, cheats, reviews, price, tech', updated: '2026-11-19', group: 'Help' },
  { path: '/site-index', title: 'Site Index', desc: 'Every page on Explore Leonida', updated: '2026-11-19', group: 'Help' },
  { path: '/about', title: 'About & Editorial Policy', desc: 'Who we are and how we verify cheats and scores', updated: '2026-11-19', group: 'Legal' },
  { path: '/disclaimer', title: 'Disclaimer', desc: 'Unofficial fan site notice and trademarks', updated: '2026-11-19', group: 'Legal' },
  { path: '/terms', title: 'Terms of Use', desc: 'Terms governing use of Explore Leonida', updated: '2026-11-19', group: 'Legal' },
  { path: '/privacy', title: 'Privacy Policy', desc: 'Analytics, cookies, GDPR & India DPDP basics', updated: '2026-11-19', group: 'Legal' },
  { path: '/contact', title: 'Contact', desc: 'Reach the Explore Leonida team', updated: '2026-11-19', group: 'Legal' },
];
