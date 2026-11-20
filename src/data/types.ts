export type CheatStatus = 'official' | 'tested' | 'community-reported' | 'unverified' | 'tbc';

export interface Cheat {
  id: string;
  name: string;
  effect: string;
  category: 'combat' | 'vehicles';
  sequence: string[] | null;
  unlock: string;
  status: CheatStatus;
  source: string;
  lastVerified?: string;
  updatedAt: string;
}

export interface Review {
  outlet: string;
  score: string;
  normalized: number;
  url?: string;
  verified: boolean;
  publishedAt: string;
}

export interface Faq { q: string; a: string; group: string; }

export interface GameRow {
  game: string; year: number | 'TBC'; metacritic: number | 'TBC';
  setting: string; platforms: string; note?: string;
}
