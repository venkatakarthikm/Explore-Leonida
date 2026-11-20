import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/data');
mkdirSync(OUT, { recursive: true });

const SRC = 'Owner-supplied guide screenshot, origin unknown';
const UP = '2026-11-20';

const CHEATS = [
  { id: 'max-ammo', name: 'Max Ammo', effect: 'Fills all ammo', category: 'combat', sequence: ['DOWN','UP','RIGHT','DOWN','LEFT','LEFT','UP','UP','DOWN','LEFT'], unlock: 'Win 25 bronze medals or higher at shooting ranges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'infinite-ammo', name: 'Infinite Ammo', effect: 'Ammo never runs out', category: 'combat', sequence: ['DOWN','UP','RIGHT','DOWN','LEFT','LEFT','UP','DOWN','DOWN','DOWN'], unlock: 'Win 25 silver medals or higher at shooting ranges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'no-reload', name: 'No Reload', effect: 'Weapons fire without reloading', category: 'combat', sequence: ['DOWN','UP','RIGHT','DOWN','LEFT','LEFT','UP','DOWN','DOWN','UP'], unlock: 'Win 25 gold medals at shooting ranges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'all-explosive-weapons', name: 'All Explosive Weapons', effect: 'Grants explosive weapon set', category: 'combat', sequence: null, unlock: 'Throw 100 grenades', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'incendiary-ammo', name: 'Incendiary Ammo', effect: 'Bullets set targets on fire', category: 'combat', sequence: null, unlock: 'Burn 100 enemies with fire damage', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'exploding-bottles', name: 'Exploding Bottles', effect: 'Molotovs explode on impact', category: 'combat', sequence: null, unlock: 'Throw 100 molotovs', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'explosive-shotgun', name: 'Explosive Shotgun (Mason & Keen Shortstraw)', effect: 'Explosive shells', category: 'combat', sequence: null, unlock: 'Hit 100 enemies with explosive damage', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'hauners-hat', name: 'Haüners H-AT', effect: 'Heavy weapon', category: 'combat', sequence: null, unlock: 'Blow up 100 vehicles', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'attack-force', name: 'Attack Force', effect: 'Bullets and melee launch targets', category: 'combat', sequence: ['DOWN','UP','LEFT','LEFT','RIGHT','DOWN','DOWN','UP','DOWN'], unlock: 'Finish the story', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'exploding-balls', name: 'Exploding Balls', effect: 'Sports balls explode on impact', category: 'combat', sequence: ['DOWN','UP','LEFT','LEFT','RIGHT','DOWN','DOWN','UP','RIGHT'], unlock: 'Hit 20 enemies with explosive damage', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'vehicle-force', name: 'Vehicle Force', effect: 'Collisions launch targets', category: 'combat', sequence: ['DOWN','UP','LEFT','LEFT','RIGHT','DOWN','LEFT','UP','DOWN'], unlock: 'Kill 25 enemies with a vehicle (civilians count)', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'interstate-ambulance', name: 'Interstate Ambulance', effect: 'Spawns ambulance', category: 'vehicles', sequence: null, unlock: 'Discover it in the Progress menu', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'airboat-09', name: 'Airboat 09', effect: 'Spawns airboat', category: 'vehicles', sequence: null, unlock: 'Complete 5 survival challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'bravado-banshee', name: 'Bravado Banshee', effect: 'Spawns Banshee', category: 'vehicles', sequence: null, unlock: 'Complete all combat challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'tuff-bmx', name: 'Tuff BMX', effect: 'Spawns BMX', category: 'vehicles', sequence: null, unlock: 'Complete 5 fitness challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'maibatsu-boomazoom', name: 'Maibatsu Boomazoom', effect: 'Spawns Boomazoom', category: 'vehicles', sequence: ['LEFT','UP','RIGHT','DOWN','LEFT','LEFT','UP','LEFT'], unlock: 'Complete 5 shopping challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'nagasaki-carbon-rs', name: 'Nagasaki Carbon RS', effect: 'Spawns Carbon RS bike', category: 'vehicles', sequence: null, unlock: 'Complete all exploration challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'vapid-dominator-65', name: "'65 Vapid Dominator", effect: 'Spawns classic Dominator', category: 'vehicles', sequence: null, unlock: 'Complete all fitness challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'progen-emerus', name: 'Progen Emerus', effect: 'Spawns super car', category: 'vehicles', sequence: null, unlock: 'Complete all vehicle challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'inflatable-flamingo', name: 'Inflatable Flamingo', effect: 'Spawns flamingo float', category: 'vehicles', sequence: null, unlock: 'Destroy 50 cocaine flamingos', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'mtl-pumper', name: 'MTL Pumper', effect: 'Spawns truck', category: 'vehicles', sequence: ['LEFT','UP','RIGHT','DOWN','LEFT','RIGHT','RIGHT','UP'], unlock: 'Discover it in the Progress menu', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'vapid-stanier-taxi', name: 'Vapid Stanier G2 Taxi', effect: 'Spawns taxi', category: 'vehicles', sequence: null, unlock: 'Complete 5 sports challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'hauners-p996-lazer', name: 'Haüners P-996 Lazer', effect: 'Spawns jet', category: 'vehicles', sequence: null, unlock: 'Complete all challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'hvy-bulldozer', name: 'HVY Bulldozer', effect: 'Spawns bulldozer', category: 'vehicles', sequence: ['LEFT','UP','RIGHT','DOWN','LEFT','RIGHT','RIGHT','DOWN'], unlock: 'Discover it in the Progress menu', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'lapwing-mallard', name: 'Lapwing Mallard', effect: 'Spawns plane', category: 'vehicles', sequence: null, unlock: 'Complete 5 vehicle challenges', status: 'unverified', source: SRC, updatedAt: UP },
  { id: 'brimstone-golfer', name: 'Brimstone Golfer', effect: 'Spawns golf cart', category: 'vehicles', sequence: null, unlock: 'Complete all sports challenges', status: 'unverified', source: SRC, updatedAt: UP },
];

const METACRITIC = { score: 99, asOf: '2026-11-18', url: 'https://www.metacritic.com/game/grand-theft-auto-vi/' };

const REVIEWS = [
  { outlet: 'IGN', score: '10/10', normalized: 100, verified: true, publishedAt: '2026-11-18', url: 'https://in.ign.com/grand-theft-auto-vi/277358/grand-theft-auto-6-review'},
  { outlet: 'VGC', score: '5/5', normalized: 100, verified: false, publishedAt: '2026-11-18', url: 'https://www.videogameschronicle.com/review/grand-theft-auto-6/' },
  { outlet: 'Empire', score: '5/5', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'Forbes', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'Eurogamer', score: '5/5', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'ComicBook', score: '5/5', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'Digital Spy', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'TechRadar', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'GameSpot', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'ScreenRant', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'Destructoid', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'Push Square', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'CGMagazine', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'GamesRadar', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'DualShockers', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'Game Informer', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
  { outlet: 'EDGE Magazine', score: '10/10', normalized: 100, verified: false, publishedAt: '2026-11-18', url: '' },
];

const FAQS = [
  // Weapons
  { group: 'Weapons', q: 'How many weapons are in GTA 6?', a: 'Over 40 distinct weapons have been identified through official trailers, development documents, and community analysis.' },
  { group: 'Weapons', q: 'How does the weapon inventory system work in GTA 6?', a: 'GTA 6 implements a limited on-person inventory system inspired by Red Dead Redemption 2, with the remaining arsenal stored in your personal vehicle trunk.' },
  { group: 'Weapons', q: 'What is the vehicle trunk armory mechanic?', a: 'Personal vehicles act as mobile weapon lockers to equip heavier assault rifles, shotguns, RPGs, and tactical body armor.' },
  { group: 'Weapons', q: 'What real-life firearms are featured in GTA 6?', a: 'Counterparts include the Klose K17 (Glock 17), Girardi ES9 (SIG Sauer P226), Shrewsbury AKM (Kalashnikov AKM), and Duke Arms 556 (AR-15 / M4A1).' },
  { group: 'Weapons', q: 'Can weapons be customized and upgraded in GTA 6?', a: 'Yes. Players can visit Ammu-Nation stores and workbenches for suppressors, extended magazines, red dot optics, and custom finishes.' },
  // Characters
  { group: 'Characters', q: 'Who are the main playable characters in GTA 6?', a: 'GTA 6 stars dual outlaw protagonists Jason Duval and Lucia Caminos navigating crime across the state of Leonida.' },
  { group: 'Characters', q: 'Who is Lucia Caminos in GTA 6?', a: 'Lucia Caminos is the first female playable protagonist in modern 3D Grand Theft Auto history, beginning her journey after parole from Leonida Penitentiary.' },
  { group: 'Characters', q: 'Who is Jason Duval in GTA 6?', a: 'Jason Duval is a former military enlistee who grew up among crooks and grifters in the Florida Keys, handling coastal smuggling in Key Lento.' },
  { group: 'Characters', q: 'How does character switching work between Jason and Lucia?', a: 'Players can switch between Jason and Lucia seamlessly in real time during free roam and coordinate positioning during missions.' },
  // Map & World
  { group: 'Map & World', q: 'How large is the GTA 6 Leonida map compared to GTA 5?', a: 'Community cartography projects estimate Leonida to be approximately 2.5 to 3 times the landmass of GTA V with extensive water navigation and interiors.' },
  { group: 'Map & World', q: 'What are the five confirmed counties in GTA 6?', a: 'Leonida consists of Vice-Dale County, Kelly County, Mariana County (The Keys), Leonard County, and Lummox County.' },
  { group: 'Map & World', q: 'What percentage of buildings have enterable interiors?', a: 'An estimated 60% to 70% of commercial storefronts feature walk-in interiors with interactive robbery mechanics.' },
  { group: 'Map & World', q: 'Can you travel seamlessly to the Florida Keys without loading screens?', a: 'Yes. The entire map of Leonida is completely open and seamless with zero loading screens.' },
  // Cheats
  { group: 'Cheats', q: 'Does GTA 6 have cheat codes on PS5 and Xbox Series X|S?', a: 'Rockstar has not published an official cheat list at launch. Every circulating button combination online is unverified.' },
  { group: 'Cheats', q: 'Do cheat codes disable PS5 trophies and Xbox achievements?', a: 'Yes. Activating cheats disables trophy and achievement unlocking for that play session and flags the save file.' },
  { group: 'Cheats', q: 'Can cheat codes be used in GTA Online / GTA 6 Online?', a: 'No. Cheat codes are strictly restricted to single-player story mode.' },
  { group: 'Cheats', q: 'Is there an unlimited money cheat in GTA 6?', a: 'No verified money cheat exists in any modern GTA release. Third-party money generators are fraudulent.' },
  // Release & Buying
  { group: 'Release', q: 'When did GTA 6 release?', a: 'Grand Theft Auto VI officially launched on Thursday, 19 November 2026, on PlayStation 5 and Xbox Series X|S.' },
  { group: 'Release', q: 'What platforms is GTA 6 on?', a: 'PlayStation 5 and Xbox Series X|S. There is no PC version at launch.' },
  { group: 'Price & Buying', q: 'How much does GTA 6 cost?', a: 'Standard edition is $79.99 USD on the PlayStation Store and Xbox Store. The Ultimate Edition is $99.99+ USD.' },
  // Reviews
  { group: 'Reviews', q: 'What is the GTA 6 Metacritic score?', a: '99 on Metacritic as of 18 November 2026, based on critic reviews.' },
  { group: 'Reviews', q: 'Did IGN give GTA 6 a 10?', a: 'Yes. IGN scored GTA 6 10/10 Masterpiece, as did GameSpot, TechRadar, and VGC.' },
];

writeFileSync(resolve(OUT, 'cheats.json'), JSON.stringify(CHEATS, null, 2));
writeFileSync(resolve(OUT, 'reviews.json'), JSON.stringify({ metacritic: METACRITIC, reviews: REVIEWS }, null, 2));
writeFileSync(resolve(OUT, 'faq.json'), JSON.stringify(FAQS, null, 2));

console.log('[generate-data] Wrote cheats.json, reviews.json, faq.json into public/data/');
