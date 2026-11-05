/** Pure functions over the break log. No React, no side effects. */

export type BreakEntry = {
  id: string;
  stretchId: string;
  /** Minutes from midnight when the break was recorded. */
  minute: number;
  heldSeconds: number;
};

export type DaySummary = {
  /** 0 = today, 1 = yesterday, ... */
  offset: number;
  count: number;
};

export type Stretch = {
  id: string;
  name: string;
  /** Index into the sprite_1..sprite_5 contract. */
  spriteIndex: number;
  logged: number;
};

let seq = 0;

export function makeBreak(stretchId: string, minute: number, heldSeconds: number): BreakEntry {
  seq += 1;
  return { id: 'b' + seq + '-' + minute, stretchId, minute, heldSeconds };
}

export function addBreak(log: BreakEntry[], entry: BreakEntry): BreakEntry[] {
  return log.concat(entry).sort((a, b) => a.minute - b.minute);
}

export function countForDay(log: BreakEntry[]): number {
  return log.length;
}

export function lastBreakMinute(log: BreakEntry[]): number {
  return log.length > 0 ? log[log.length - 1].minute : -1;
}

export type Gap = { start: number; end: number; length: number };

/**
 * Widest stretch of sitting inside the work window, counting the edges.
 */
export function longestGap(log: BreakEntry[], startMin: number, endMin: number): Gap {
  const marks = [startMin]
    .concat(log.map(b => b.minute).filter(m => m >= startMin && m <= endMin))
    .concat([endMin])
    .sort((a, b) => a - b);

  let best: Gap = { start: startMin, end: startMin, length: 0 };
  for (let i = 1; i < marks.length; i += 1) {
    const length = marks[i] - marks[i - 1];
    if (length > best.length) {
      best = { start: marks[i - 1], end: marks[i], length };
    }
  }
  return best;
}

export type StretchUse = { stretch: Stretch; count: number };

export function topStretches(log: BreakEntry[], stretches: Stretch[], limit = 3): StretchUse[] {
  const tally: Record<string, number> = {};
  log.forEach(b => {
    tally[b.stretchId] = (tally[b.stretchId] || 0) + 1;
  });
  return stretches
    .map(s => ({ stretch: s, count: (tally[s.id] || 0) + s.logged }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Rows of `cols` day summaries, oldest row first, today in the last cell. */
export function weekMatrix(days: DaySummary[], weeks: number, cols = 7): DaySummary[][] {
  const total = weeks * cols;
  const ordered = days.slice(0, total).reverse();
  const padded: DaySummary[] = [];
  for (let i = ordered.length; i < total; i += 1) {
    padded.push({ offset: total - i, count: 0 });
  }
  const all = padded.concat(ordered);
  const rows: DaySummary[][] = [];
  for (let r = 0; r < weeks; r += 1) {
    rows.push(all.slice(r * cols, r * cols + cols));
  }
  return rows;
}

export function totalBreaks(days: DaySummary[]): number {
  return days.reduce((sum, d) => sum + d.count, 0);
}

export function bestDay(days: DaySummary[]): number {
  return days.reduce((best, d) => (d.count > best ? d.count : best), 0);
}

export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const next = index + delta;
  if (index < 0 || index >= list.length || next < 0 || next >= list.length) {
    return list;
  }
  const copy = list.slice();
  const tmp = copy[index];
  copy[index] = copy[next];
  copy[next] = tmp;
  return copy;
}
