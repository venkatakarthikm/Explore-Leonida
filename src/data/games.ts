import type { GameRow } from './types';

export const GAMES: GameRow[] = [
  { game: 'Grand Theft Auto VI', year: 2026, metacritic: 99, setting: 'Leonida / Vice City', platforms: 'PS5, Xbox Series X|S', note: 'Dual protagonists Jason & Lucia' },
  { game: 'Grand Theft Auto V', year: 2013, metacritic: 97, setting: 'Los Santos / Blaine County', platforms: 'PS3→PS5, Xbox, PC' },
  { game: 'Grand Theft Auto IV', year: 2008, metacritic: 98, setting: 'Liberty City', platforms: 'PS3, Xbox 360, PC' },
  { game: 'Grand Theft Auto: San Andreas', year: 2004, metacritic: 95, setting: 'San Andreas', platforms: 'PS2, Xbox, PC, mobile' },
  { game: 'Grand Theft Auto: Vice City', year: 2002, metacritic: 95, setting: 'Vice City', platforms: 'PS2, Xbox, PC, mobile' },
  { game: 'Grand Theft Auto III', year: 2001, metacritic: 97, setting: 'Liberty City', platforms: 'PS2, Xbox, PC, mobile' },
  { game: 'Red Dead Redemption 2', year: 2018, metacritic: 97, setting: 'American West, 1899', platforms: 'PS4, Xbox One, PC', note: 'Rockstar, same studio' },
  { game: 'Cyberpunk 2077', year: 2020, metacritic: 86, setting: 'Night City', platforms: 'PS4/5, Xbox, PC', note: 'Open-world comparison' },
];

export const STORES = [
  { name: 'PlayStation Store (PS5)', url: 'https://www.playstation.com/games/grand-theft-auto-vi/', price: '$79.99 (US, Standard)', note: 'Digital pre-order included 1-month GTA+ per US listing' },
  { name: 'Xbox Store (Series X|S)', url: 'https://www.xbox.com/games/grand-theft-auto-vi', price: '$79.99+ (US, Standard)', note: 'Ultimate Edition $99.99+' },
  { name: 'Rockstar Store', url: 'https://store.rockstargames.com/game/buy-gta-vi', price: '$79.99 (US)', note: 'Ultimate upgrade available' },
];
