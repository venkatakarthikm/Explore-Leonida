/**
 * GTA 6 CHEATS — merged from 3 guides published around the 18–19 Nov 2026 launch.
 * Replace src/data/cheats.ts with this file.
 *
 * DATA INTEGRITY RULES (do not break):
 *  - We have NOT tested any code on our own PS5, so nothing is 'tested' or 'official'.
 *  - 'community-reported' = the same code appears in 2+ of the 3 guides.
 *  - 'unverified'         = the code appears in only 1 guide.
 *  - 'tbc'                = the cheat exists in the in-game list, but no guide has published its code yet.
 *  - Never fill a TBC with a guess or a recycled GTA V code.
 *  - When you test a code on PS5, set `testedOn` + `status: 'tested'` and add a video URL.
 */

export type CheatStatus = 'official' | 'tested' | 'community-reported' | 'unverified' | 'tbc';
export type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type CheatCategory = 'player' | 'combat' | 'vehicles' | 'environment' | 'filters';
export type SourceId = 'future' | 'vice' | 'press';

export interface CheatSource {
  id: SourceId;
  name: string;
  published?: string;
  url?: string; // TODO: paste the real article URLs here before publishing
  note: string;
}

export interface Cheat {
  id: string;
  name: string;
  effect: string;
  category: CheatCategory;
  sequence: Dir[] | null;       // D-pad directions (same on PS5 and Xbox)
  unlock: string;               // in-game unlock requirement
  status: CheatStatus;
  source: string;               // short human-readable summary (kept for older components)
  codeSources: SourceId[];      // which guides list the CODE
  agreement: number;            // how many guides list the code (0–3)
  dispute?: string;             // where the guides disagree
  note?: string;
  testedOn?: string;            // ISO date, set when WE test it on PS5
  videoUrl?: string;
  updatedAt: string;
}

export const DATA_UPDATED = '2026-11-19';
export const TOTAL_GUIDES = 3;

export const CHEAT_SOURCES: CheatSource[] = [
  {
    id: 'future',
    name: 'Guide with a full list of unlock requirements and D-pad codes (Future plc site; page mentions "GTA 6 O\'Clock")',
    note: 'The most complete list: every cheat with its effect, unlock requirement and D-pad code or TBC. TODO: confirm outlet name and add URL.',
  },
  {
    id: 'vice',
    name: 'VICE (credits GTA Base)',
    note: 'Says it counted 61 cheats and that its writer unlocked 12 in a review playthrough. Includes the PS5 / Xbox entry steps.',
  },
  {
    id: 'press',
    name: 'Guide by Bartosz "Resurrect" Wiktor',
    published: '2026-11-18',
    note: 'Cross-checks PC Gamer, Insider Gaming, PowerPyx and Press Start, and flags where they disagree.',
  },
];

// ---------------------------------------------------------------------------
// Compact builder: sequences are written as U/D/L/R letters.
// ---------------------------------------------------------------------------
const MAP: Record<string, Dir> = { U: 'UP', D: 'DOWN', L: 'LEFT', R: 'RIGHT' };
const seq = (s?: string): Dir[] | null => (s ? s.split('').map((c) => MAP[c]) : null);
const ALL3: SourceId[] = ['future', 'vice', 'press'];

interface Raw {
  id: string; name: string; category: CheatCategory; effect: string; unlock: string;
  code?: string; codeSources?: SourceId[]; dispute?: string; note?: string;
}

const RAW: Raw[] = [
  // ============ PLAYER (10) ============
  { id: 'money-250k', name: '$250,000', category: 'player', effect: 'Instantly gives you $250,000.', unlock: 'Finish the main story', code: 'URDLULDR', codeSources: ALL3,
    note: 'Saving is disabled after any cheat, so the cash does not carry over to your save file.' },
  { id: 'drunk', name: 'Drunk', category: 'player', effect: 'Instantly makes you and your partner drunk.', unlock: 'Spend $2,500 on alcohol', code: 'ULRUULRULR', codeSources: ['future'],
    note: 'Only one guide lists this code; the other two list it as unconfirmed.' },
  { id: 'raise-heat-level', name: 'Raise Heat Level', category: 'player', effect: 'Raises your level of heat across the map.', unlock: 'Lose (escape) a 3-star Wanted Level 25 times', code: 'LDRDUDU', codeSources: ALL3 },
  { id: 'raise-wanted-level', name: 'Raise Wanted Level', category: 'player', effect: 'Raises your Wanted Level across the map.', unlock: 'Lose (escape) a 3-star Wanted Level 50 times', code: 'LDRDURU', codeSources: ['future', 'vice'] },
  { id: 'unlimited-focus', name: 'Unlimited Focus', category: 'player', effect: 'Focus never runs out.', unlock: 'Finish the main story', code: 'DUUDUDUDUR', codeSources: ALL3 },
  { id: 'no-fall-damage', name: 'No Fall Damage', category: 'player', effect: 'You are immune to fall damage.', unlock: 'Survive a freefall from 40 feet, 20 times' },
  { id: 'parachute', name: 'Parachute', category: 'player', effect: 'Adds a parachute to your loadout.', unlock: 'Complete 50 skydives or base jumps from 300 feet or higher' },
  { id: 'body-armor', name: 'Body Armor', category: 'player', effect: 'Adds body armor to your loadout.', unlock: 'Complete 100 workouts', code: 'DULUUUUUDD', codeSources: ALL3 },
  { id: 'repair-vehicle', name: 'Repair Vehicle', category: 'player', effect: 'Fully repairs your current vehicle.', unlock: 'Get 1st place in 10 races at Gellhorn Raceway, Thrillbilly Mud Club and Boone Speedway',
    dispute: 'One guide words this as "win the required races at all three circuits" without giving the number.' },
  { id: 'unlimited-nitrous', name: 'Unlimited Nitrous', category: 'player', effect: 'Nitrous and fuel never run out on vehicles.', unlock: 'Complete 50 stunt jumps' },

  // ============ COMBAT (11) ============
  { id: 'max-ammo', name: 'Max Ammo', category: 'combat', effect: 'Fills all ammo to maximum.', unlock: 'Win 25 Bronze medals or higher at shooting ranges', code: 'DURDLLUUDL', codeSources: ALL3,
    dispute: 'One outlet (PC Gamer) lists 20 bronze medals; Insider Gaming and PowerPyx list 25.' },
  { id: 'infinite-ammo', name: 'Infinite Ammo', category: 'combat', effect: 'Ammo never runs out.', unlock: 'Win 25 Silver medals or higher at shooting ranges', code: 'DURDLLUDDD', codeSources: ALL3 },
  { id: 'no-reload', name: 'No Reload', category: 'combat', effect: 'Ammo never runs out and you never need to reload.', unlock: 'Win 25 Gold medals at shooting ranges', code: 'DURDLLUDDU', codeSources: ALL3 },
  { id: 'all-explosive-weapons', name: 'All Explosive Weapons', category: 'combat', effect: 'Adds all explosive weapons to your loadout with full ammo.', unlock: 'Throw 100 grenades' },
  { id: 'incendiary-ammo', name: 'Incendiary Ammo', category: 'combat', effect: 'All ammo is incendiary.', unlock: 'Burn 100 enemies with fire damage' },
  { id: 'exploding-bottles', name: 'Exploding Bottles', category: 'combat', effect: 'All bottles explode when damaged.', unlock: 'Throw 100 Molotovs' },
  { id: 'explosive-shotgun', name: 'Explosive Shotgun', category: 'combat', effect: 'Adds a Mason & Keen Shortstraw to your loadout that fires explosive shells.', unlock: 'Hit 100 enemies with explosive damage' },
  { id: 'hauners-h-at', name: 'Hauners H-AT', category: 'combat', effect: 'Adds a Hauners H-AT to your loadout.', unlock: 'Blow up 100 vehicles' },
  { id: 'attack-force', name: 'Attack Force', category: 'combat', effect: 'Bullets and melee attacks launch targets on impact.', unlock: 'Finish the main story', code: 'DULLRDDUD', codeSources: ALL3 },
  { id: 'exploding-balls', name: 'Exploding Balls', category: 'combat', effect: 'Sports balls explode on impact.', unlock: 'Hit 20 enemies with explosive damage', code: 'DULLRDDUR', codeSources: ALL3 },
  { id: 'vehicle-force', name: 'Vehicle Force', category: 'combat', effect: 'Vehicle collisions launch targets.', unlock: 'Kill 25 enemies with a vehicle (running over civilians counts too)', code: 'DULLRDLUD', codeSources: ALL3 },

  // ============ VEHICLES (21) ============
  { id: 'interstate-ambulance', name: 'Interstate Ambulance', category: 'vehicles', effect: 'Spawns an Interstate Ambulance.', unlock: 'Discover the Interstate Ambulance in the Progress menu' },
  { id: 'airboat-09', name: 'Airboat 09', category: 'vehicles', effect: 'Spawns an Airboat 09.', unlock: 'Complete 5 survival challenges' },
  { id: 'bravado-banshee', name: 'Bravado Banshee', category: 'vehicles', effect: 'Spawns a Bravado Banshee.', unlock: 'Complete all combat challenges' },
  { id: 'tuff-bmx', name: 'Tuff BMX', category: 'vehicles', effect: 'Spawns a Tuff BMX.', unlock: 'Complete 5 fitness challenges' },
  { id: 'maibatsu-boomazoom', name: 'Maibatsu Boomazoom', category: 'vehicles', effect: 'Spawns a Maibatsu Boomazoom at your current location.', unlock: 'Complete 5 shopping challenges', code: 'LURDLLUL', codeSources: ALL3 },
  { id: 'nagasaki-carbon-rs', name: 'Nagasaki Carbon RS', category: 'vehicles', effect: 'Spawns a Nagasaki Carbon RS.', unlock: 'Complete all exploration challenges' },
  { id: 'vapid-dominator-65', name: "'65 Vapid Dominator", category: 'vehicles', effect: "Spawns a '65 Vapid Dominator.", unlock: 'Complete all fitness challenges' },
  { id: 'progen-emerus', name: 'Progen Emerus', category: 'vehicles', effect: 'Spawns a Progen Emerus.', unlock: 'Complete all vehicle challenges' },
  { id: 'inflatable-flamingo', name: 'Inflatable Flamingo', category: 'vehicles', effect: 'Spawns an Inflatable Flamingo.', unlock: 'Destroy 50 cocaine flamingos' },
  { id: 'mtl-pumper', name: 'MTL Pumper', category: 'vehicles', effect: 'Spawns an MTL Pumper (fire truck).', unlock: 'Discover the MTL Pumper in the Progress menu', code: 'LURDLRRU', codeSources: ALL3,
    dispute: 'Two guides give the "discover it in the Progress menu" requirement; the third calls the requirement disputed.' },
  { id: 'vapid-stanier-g2-taxi', name: 'Vapid Stanier G2 Taxi', category: 'vehicles', effect: 'Spawns a Vapid Stanier G2 Taxi.', unlock: 'Complete 5 sports challenges' },
  { id: 'hauners-p996-lazer', name: 'Hauners P-996 Lazer', category: 'vehicles', effect: 'Spawns a Hauners P-996 Lazer.', unlock: 'Complete all challenges' },
  { id: 'hvy-bulldozer', name: 'HVY Bulldozer', category: 'vehicles', effect: 'Spawns an HVY Bulldozer.', unlock: 'Discover the HVY Bulldozer in the Progress menu', code: 'LURDLRRD', codeSources: ALL3 },
  { id: 'lapwing-mallard', name: 'Lapwing Mallard', category: 'vehicles', effect: 'Spawns a Lapwing Mallard.', unlock: 'Complete 5 vehicle challenges' },
  { id: 'brimstone-golfer', name: 'Brimstone Golfer', category: 'vehicles', effect: 'Spawns a Brimstone Golfer.', unlock: 'Complete all sports challenges' },
  { id: 'hauners-rhino-tank', name: 'Hauners Rhino Tank', category: 'vehicles', effect: 'Spawns a Hauners Rhino Tank.', unlock: 'Complete all survival challenges' },
  { id: 'maibatsu-sanchez', name: 'Maibatsu Sanchez', category: 'vehicles', effect: 'Spawns a Maibatsu Sanchez.', unlock: 'Complete 5 criminal challenges' },
  { id: 'nagasaki-sea-sparrow', name: 'Nagasaki Sea Sparrow', category: 'vehicles', effect: 'Spawns a Nagasaki Sea Sparrow.', unlock: 'Complete 5 exploration challenges' },
  { id: 'speeder-700-gt', name: 'Speeder 700 GT', category: 'vehicles', effect: 'Spawns a Speeder 700 GT.', unlock: 'Complete 5 combat challenges' },
  { id: 'truffade-thrax', name: 'Truffade Thrax', category: 'vehicles', effect: 'Spawns a Truffade Thrax.', unlock: 'Complete all shopping challenges' },
  { id: 'western-zombie-bobber', name: 'Western Zombie Bobber', category: 'vehicles', effect: 'Spawns a Western Zombie Bobber.', unlock: 'Complete all criminal challenges' },

  // ============ ENVIRONMENT (3) ============
  { id: 'move-time-forward', name: 'Move Time Forward', category: 'environment', effect: 'Moves the time of day forward.', unlock: 'Find 10 collectible watches' },
  { id: 'pause-time-of-day', name: 'Pause Time of Day', category: 'environment', effect: 'Pauses the current time of day.', unlock: 'Find 20 collectible watches' },
  { id: 'cycle-weather', name: 'Cycle Weather', category: 'environment', effect: 'Adjusts the weather conditions.', unlock: 'Reveal the entire map', code: 'DRUDRUR', codeSources: ALL3,
    dispute: 'The guides disagree: one says "reveal the entire map", another says "finish the main story", and a third calls it disputed.' },

  // ============ SCREEN FILTERS (16) ============
  { id: 'golden-hour', name: 'Golden Hour', category: 'filters', effect: 'Applies a golden filter with a widescreen aspect ratio.', unlock: 'Spend 4 hours holding hands' },
  { id: 'powdered-sugar', name: 'Powdered Sugar', category: 'filters', effect: 'Turns the world white with sparkling highlights.', unlock: 'Scan all space debris with WAiNK' },
  { id: 'pinhole', name: 'Pinhole', category: 'filters', effect: 'Applies a pinhole camera filter.', unlock: 'Clear 25 gang operations with your partner' },
  { id: 'neon-jungle', name: 'Neon Jungle', category: 'filters', effect: 'Applies neon highlights to the world.', unlock: 'Discover all 16 Girlypop vehicles' },
  { id: 'yesteryear', name: 'Yesteryear', category: 'filters', effect: 'Applies a black & white CRT TV filter.', unlock: 'Discover the Ridgway', note: 'Some guides spell it "Ridgeway".' },
  { id: 'cataclysm', name: 'Cataclysm', category: 'filters', effect: 'Fills the world with murky smoke.', unlock: "Discover Martha's Vamos in the Progress menu", code: 'DDURRULLRR', codeSources: ALL3 },
  { id: 'videotape', name: 'Videotape', category: 'filters', effect: 'Applies a videotape-style filter.', unlock: 'Complete 50 activities with your partner' },
  { id: 'dark-mirror', name: 'Dark Mirror', category: 'filters', effect: 'Flips the world upside down and turns it black.', unlock: 'Make $500,000 selling vehicles' },
  { id: 'migraine', name: 'Migraine', category: 'filters', effect: 'Applies a blurred, distorted filter.', unlock: 'Survive 6 minutes with a 6-star Wanted Level' },
  { id: 'dollhouse', name: 'Dollhouse', category: 'filters', effect: 'Applies a vivid filter with a narrow aspect ratio.', unlock: 'Spend 8 hours with your partner', code: 'DDURRULLDR', codeSources: ALL3 },
  { id: 'bubblegum', name: 'Bubblegum', category: 'filters', effect: 'Turns the world purple and yellow with sparkling highlights.', unlock: 'Find all 24 collectible cards for the Vice City Flamingos' },
  { id: 'fast-forward', name: 'Fast Forward', category: 'filters', effect: 'Applies a motion blur and accelerates cloud movements.', unlock: 'Complete 50 meditations' },
  { id: 'fisheye', name: 'Fisheye', category: 'filters', effect: 'Applies a fisheye filter.', unlock: 'Catch 100 fish' },
  { id: 'faded-glory', name: 'Faded Glory', category: 'filters', effect: 'Applies a color CRT TV filter.', unlock: 'Rob 50 stores with your partner', code: 'DDURRULLLR', codeSources: ALL3 },
  { id: 'pixel-art', name: 'Pixel Art', category: 'filters', effect: 'Applies a pixelated filter.', unlock: 'Make $250,000 selling collectibles' },
  { id: 'hellscape', name: 'Hellscape', category: 'filters', effect: 'Turns the world red and orange with a heat haze.', unlock: 'Steal 100 cop vehicles' },
];

export const CHEATS: Cheat[] = RAW.map((r) => {
  const codeSources = r.codeSources ?? [];
  const n = codeSources.length;
  const status: CheatStatus = !r.code ? 'tbc' : n >= 2 ? 'community-reported' : 'unverified';
  return {
    id: r.id, name: r.name, effect: r.effect, category: r.category, unlock: r.unlock,
    sequence: seq(r.code),
    status,
    source: r.code ? `Code listed by ${n} of ${TOTAL_GUIDES} guides` : 'Code not yet published in any of the 3 guides',
    codeSources, agreement: n, dispute: r.dispute, note: r.note, updatedAt: DATA_UPDATED,
  };
});

// ---------------------------------------------------------------------------
// Derived numbers (never hand-type these)
// ---------------------------------------------------------------------------
export const CHEAT_COUNTS = {
  total: CHEATS.length,
  official: CHEATS.filter((c) => c.status === 'official').length,
  tested: CHEATS.filter((c) => c.status === 'tested').length,
  reported: CHEATS.filter((c) => c.status === 'community-reported').length,
  unverified: CHEATS.filter((c) => c.status === 'unverified').length,
  tbc: CHEATS.filter((c) => c.status === 'tbc').length,
  withCode: CHEATS.filter((c) => c.sequence).length,
};

const CATEGORY_DEFS: { id: CheatCategory; label: string; blurb: string }[] = [
  { id: 'player', label: 'Player', blurb: 'Money, armor, focus, wanted level and movement helpers.' },
  { id: 'combat', label: 'Combat', blurb: 'Ammo, explosive weapons and physics-style attack effects.' },
  { id: 'vehicles', label: 'Vehicles', blurb: 'Spawn cars, bikes, boats, planes and a tank.' },
  { id: 'environment', label: 'Environment', blurb: 'Control the time of day and the weather.' },
  { id: 'filters', label: 'Screen filters', blurb: 'Cosmetic filters, from CRT TV to fisheye to heat haze.' },
];

export const CHEAT_CATEGORIES = CATEGORY_DEFS.map((c) => ({
  ...c,
  count: CHEATS.filter((x) => x.category === c.id).length,
}));

// ---------------------------------------------------------------------------
// Helpers for display and copy
// ---------------------------------------------------------------------------
const ARROW: Record<Dir, string> = { UP: '↑', RIGHT: '→', DOWN: '↓', LEFT: '←' };
const WORD: Record<Dir, string> = { UP: 'Up', RIGHT: 'Right', DOWN: 'Down', LEFT: 'Left' };
export const arrowText = (s: Dir[]) => s.map((d) => ARROW[d]).join(' ');
export const wordText = (s: Dir[]) => s.map((d) => WORD[d]).join(', ');

// ---------------------------------------------------------------------------
// How to enter cheats (reported by VICE and the Resurrect guide; same on PS5 and Xbox)
// ---------------------------------------------------------------------------
export const CHEAT_STEPS = [
  { title: 'Finish the main story', text: 'The Cheats list only appears in the Progress menu after the campaign is complete. Entering a code earlier does not work.' },
  { title: 'Unlock the cheat you want', text: 'Almost every cheat has its own requirement (medals, challenges, collectibles). Progress made during the story counts. Check Progress → Cheats to see what is unlocked on your save.' },
  { title: 'Open the phone', text: 'Press Up on the D-pad to pull out the in-game phone.' },
  { title: 'Hold L1 and press R1', text: 'On PS5 hold L1 and press R1. On Xbox Series X|S it is LB and RB. One guide says to keep both held while you enter the code.' },
  { title: 'Enter the D-pad sequence', text: 'Press the arrows in order. The directions are identical on PS5 and Xbox.' },
];

export const CHEAT_RULES = [
  { id: 'story', title: 'Story first', text: 'Cheats unlock only after you finish the main story. Rockstar designed them as a post-game sandbox reward, according to a Press Start report cited by one guide.' },
  { id: 'saving', title: 'Saving is disabled', text: 'Using any cheat turns off saving for that session. Make a manual save first, then quit and reload it when you are done.' },
  { id: 'trophies', title: 'Trophies and achievements are blocked', text: 'Using a cheat disables trophies and achievements for the current session. Quitting to a clean save restores normal progress.' },
  { id: 'money', title: 'The money cheat is temporary', text: 'The $250,000 cheat cannot raise your saved bank balance, because you cannot save afterwards. It will not help complete savings goals in the story.' },
  { id: 'pc', title: 'No PC cheats yet', text: 'GTA 6 launches on PS5 and Xbox Series X|S. No PC release date is announced, so any "PC cheat" list is guesswork.' },
  { id: 'unlock', title: 'Each cheat has its own unlock', text: 'Knowing a code is not enough: if you have not met that cheat\'s requirement on your save, the input will not work.' },
];

// ---------------------------------------------------------------------------
// Where the guides disagree (shown on the page — this is our credibility)
// ---------------------------------------------------------------------------
export const CHEAT_DISPUTES = [
  { cheat: 'Max Ammo', text: 'Requirement is 25 Bronze shooting-range medals in most guides, but PC Gamer lists 20.' },
  { cheat: 'Cycle Weather', text: 'Unlock is given as "reveal the entire map" in one guide and "finish the main story" in another; a third calls it disputed.' },
  { cheat: 'MTL Pumper', text: 'Two guides say "discover it in the Progress menu"; the third marks the requirement disputed.' },
  { cheat: 'Drunk', text: 'Only one guide prints a code for it. The other two list it as unconfirmed, so we mark it Single source.' },
  { cheat: 'Raise Wanted Level', text: 'Two guides print the code; the third lists it as TBC.' },
  { cheat: 'Yesteryear', text: 'The requirement mentions the "Ridgway"; some guides spell it "Ridgeway".' },
  { cheat: 'Older pages', text: 'Some pages written before the review embargo lifted still say Rockstar has not confirmed cheats. Newer guides, based on review builds, document the post-story system above.' },
];

export const BEST_CHEATS = {
  useful: ['infinite-ammo', 'no-reload', 'unlimited-nitrous', 'repair-vehicle', 'body-armor'],
  chaos: ['hauners-rhino-tank', 'hauners-p996-lazer', 'attack-force', 'vehicle-force', 'all-explosive-weapons'],
};

// ---------------------------------------------------------------------------
// FAQ — answers use only what the 3 guides say; anything unknown says so.
// ---------------------------------------------------------------------------
const C = CHEAT_COUNTS;
export const CHEAT_FAQ: { q: string; a: string }[] = [
  { q: 'How many cheats are in GTA 6?',
    a: 'The guides document 61 cheats: 10 player cheats, 11 combat cheats, 21 vehicle spawns, 3 environment cheats and 16 screen filters.' },
  { q: 'How do I enter cheat codes in GTA 6 on PS5?',
    a: 'After finishing the story and unlocking the cheat, press Up on the D-pad to open the phone, hold L1 and press R1, then enter the D-pad sequence. On Xbox use LB and RB. The arrows are the same on both consoles.' },
  { q: 'Can I use GTA 6 cheats before finishing the story?',
    a: 'No. According to the guides, the Cheats list only appears in the Progress menu after you complete the main story, and a code entered earlier does nothing.' },
  { q: 'Do GTA 6 cheats disable trophies?',
    a: 'Yes. Using a cheat disables trophies and achievements for the current session. Quit and reload a clean save to earn them again.' },
  { q: 'Can I save the game after using a cheat?',
    a: 'No. Saving is disabled for the session once a cheat is active. Make a manual save before entering a code and reload it afterwards.' },
  { q: 'What is the GTA 6 money cheat?',
    a: `The $250,000 cheat is Up, Right, Down, Left, Up, Left, Down, Right on the D-pad. It unlocks when you finish the story. Because saving is disabled afterwards, the cash does not carry into your save.` },
  { q: 'Are the GTA 6 cheat codes the same on PS5 and Xbox?',
    a: 'Yes. The D-pad directions are identical. Only the shoulder buttons you hold differ: L1 and R1 on PS5, LB and RB on Xbox Series X|S.' },
  { q: 'Are there GTA 6 PC cheat codes?',
    a: 'Not yet. GTA 6 launches on PS5 and Xbox Series X|S and no PC release date has been announced, so any PC cheat list is speculation.' },
  { q: 'Where is the cheats menu in GTA 6?',
    a: 'Open the Progress menu and select the Cheats page. It appears after you finish the story and shows which cheats you have unlocked on that save.' },
  { q: 'Why is my cheat code not working?',
    a: 'Check Progress → Cheats to confirm the cheat is unlocked on your current save. Each cheat has its own requirement, such as shooting-range medals or challenge completion, even if you know the code.' },
  { q: 'Which GTA 6 cheats unlock when I finish the story?',
    a: 'The $250,000 cheat, Unlimited Focus and Attack Force are all unlocked by finishing the main story. Cycle Weather is also reported as a story-completion unlock by one guide, but the guides disagree on that one.' },
  { q: 'What is the GTA 6 Rhino Tank cheat?',
    a: 'The Hauners Rhino Tank spawn cheat unlocks after completing all survival challenges. Its D-pad code has not been published in the guides we cross-checked, so it is marked TBC.' },
  { q: 'What do I need for the Infinite Ammo and No Reload cheats?',
    a: 'Infinite Ammo needs 25 Silver medals or higher at shooting ranges. No Reload needs 25 Gold medals. Max Ammo needs Bronze medals or higher (25 in most guides, 20 in one).' },
  { q: 'Are all the GTA 6 cheat codes known yet?',
    a: `No. Of the ${C.total} cheats, ${C.withCode} have a published D-pad code and ${C.tbc} are still TBC. The cheat exists in the game menu, but nobody has published its sequence in the guides we checked.` },
  { q: 'Have you tested these cheat codes on PS5?',
    a: `Not yet. Codes marked Reported appear in at least two published guides; Single source means only one guide lists it. We will mark a code Tested only after we enter it on a PS5 and record it.` },
  { q: 'Why do guides disagree about some cheats?',
    a: 'Review-build guides were published at slightly different times and some requirements were recorded differently. We list every known disagreement in the "Where the guides disagree" section instead of guessing.' },
  { q: 'What does Raise Heat Level do?',
    a: 'It raises your level of heat across the map. It unlocks after you lose a 3-star Wanted Level 25 times. Raise Wanted Level is a separate cheat that needs 50 escapes.' },
  { q: 'What are the GTA 6 screen filter cheats?',
    a: 'There are 16 cosmetic filters such as Golden Hour, Fisheye, Pixel Art, Videotape and Hellscape. They unlock through activities like spending time with your partner, catching fish or robbing stores. Only three have a published code so far: Cataclysm, Dollhouse and Faded Glory.' },
  { q: 'What are the best GTA 6 cheats?',
    a: 'For utility, one guide recommends Infinite Ammo, No Reload, Unlimited Nitrous, Repair Vehicle and Body Armor. For chaos it points to the Rhino Tank, P-996 Lazer, Attack Force, Vehicle Force and the explosive weapon cheats.' },
  { q: 'Can I use GTA 6 cheats to get 100% completion?',
    a: 'No. Cheats disable saving and trophies for the session, so they are designed as a sandbox extra after the story rather than a shortcut to completion.' },
  { q: 'Can I use cheats in GTA Online?',
    a: 'The guides we checked only cover single-player. We have no confirmed information about cheats online, so do not test cheats in an online session.' },
];

export const CHEAT_META = {
  title: 'GTA 6 Cheats PS5: All 61 Cheat Codes & Unlocks (Nov 2026)',
  description: `All 61 GTA 6 cheats for PS5 with D-pad codes, unlock requirements and how to enter them. ${C.withCode} codes reported so far; every disagreement flagged.`,
};