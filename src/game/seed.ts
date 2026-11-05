import { BreakEntry, DaySummary, Stretch, makeBreak } from './breakLog';
import { WEEK_GRID_WEEKS } from '../constants/config';

/**
 * Everything the app knows on first launch. Seeded so the ribbon, the week
 * grid and the stat cards are never empty — no network, no storage, no cloud.
 */

export const SEED_STRETCHES: Stretch[] = [
  { id: 'neck', name: 'NECK ROLL', spriteIndex: 1, logged: 12 },
  { id: 'shoulder', name: 'SHOULDER ROLL', spriteIndex: 2, logged: 9 },
  { id: 'wrist', name: 'WRIST OPENER', spriteIndex: 3, logged: 7 },
  { id: 'side', name: 'SIDE STRETCH', spriteIndex: 0, logged: 6 },
  { id: 'twist', name: 'SEATED TWIST', spriteIndex: 4, logged: 4 },
];

/** 7 breaks between 09:20 and 15:10, with a deliberate 1h40m gap after 11:40. */
const SEED_TIMES: Array<[string, number, number]> = [
  ['neck', 9 * 60 + 20, 30],
  ['shoulder', 9 * 60 + 55, 30],
  ['wrist', 10 * 60 + 40, 15],
  ['side', 11 * 60 + 40, 60],
  ['twist', 13 * 60 + 20, 30],
  ['neck', 14 * 60 + 15, 15],
  ['shoulder', 15 * 60 + 10, 30],
];

export function seedTodayLog(): BreakEntry[] {
  return SEED_TIMES.map(t => makeBreak(t[0], t[1], t[2]));
}

/** 24 plausible past days (0-9 breaks each), newest first. */
const PAST_COUNTS = [6, 8, 5, 9, 4, 2, 0, 7, 8, 6, 3, 5, 0, 1, 7, 9, 6, 4, 5, 8, 2, 0, 6, 7];

export function seedPastDays(): DaySummary[] {
  return PAST_COUNTS.map((count, i) => ({ offset: i + 1, count }));
}

export const SEED_WEEKS = WEEK_GRID_WEEKS;
