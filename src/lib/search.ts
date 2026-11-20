import { PAGES } from '../data/pages';
import { CHEATS } from '../data/cheats';
import { FAQS } from '../data/faq';
import { REVIEWS, METACRITIC } from '../data/reviews';
import { WEAPONS_DATABASE } from '../data/weapons';
import { MAP_LANDMARKS } from '../data/mapData';

export interface SearchItem { group: string; title: string; sub: string; path: string; }

export function buildIndex(): SearchItem[] {
  const items: SearchItem[] = PAGES.map((p) => ({ group: 'Pages', title: p.title, sub: p.desc, path: p.path }));
  CHEATS.forEach((c) =>
    items.push({ group: 'Cheats', title: c.name, sub: `${c.effect} - status: ${c.status}`, path: '/cheats/ps5' })
  );
  WEAPONS_DATABASE.forEach((w) =>
    items.push({ group: 'Weapons', title: w.name, sub: `${w.type} • ${w.status} (${w.realLife ? 'Real Life: ' + w.realLife : w.manufacturer || ''})`, path: '/weapons' })
  );
  MAP_LANDMARKS.forEach((l) =>
    items.push({ group: 'Map', title: l.name, sub: `${l.locality} • ${l.regionName} (${l.category})`, path: '/map' })
  );
  FAQS.forEach((f) => items.push({ group: 'FAQ', title: f.q, sub: f.a.slice(0, 90) + '…', path: '/faq' }));
  REVIEWS.forEach((r) =>
    items.push({ group: 'Reviews', title: `${r.outlet}: ${r.score}`, sub: `GTA 6 review score, Metacritic ${METACRITIC.score}`, path: '/reviews' })
  );
  return items;
}
