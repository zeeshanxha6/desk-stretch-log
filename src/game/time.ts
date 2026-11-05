/** Pure time helpers. Minutes are always "minutes from midnight". */

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function minutesFromMidnight(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

/** 700 -> "11:40" */
export function fmtClock(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return pad2(Math.floor(m / 60) % 24) + ':' + pad2(m % 60);
}

/** 100 -> "1H 40M", 45 -> "45M" */
export function fmtDuration(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h <= 0) {
    return rest + 'M';
  }
  if (rest === 0) {
    return h + 'H';
  }
  return h + 'H ' + rest + 'M';
}

/** 30 -> "30S", 0 -> "NO TIMER" */
export function fmtHold(seconds: number): string {
  return seconds > 0 ? seconds + 'S' : 'NO TIMER';
}

/** "TUESDAY · 05 NOV" */
export function fmtDayLine(date: Date = new Date()): string {
  return (
    DAY_NAMES[date.getDay()] + ' · ' + pad2(date.getDate()) + ' ' + MONTH_NAMES[date.getMonth()]
  );
}

export function weekdayInitial(dayIndex: number): string {
  return WEEKDAY_SHORT[((dayIndex % 7) + 7) % 7];
}

/** Left offset of a pill of width `pillW` inside a `trackW` wide track. */
export function ribbonX(
  minutes: number,
  trackW: number,
  pillW: number,
  startMin: number,
  endMin: number,
): number {
  const span = Math.max(1, endMin - startMin);
  const ratio = Math.min(1, Math.max(0, (minutes - startMin) / span));
  return Math.round(ratio * Math.max(0, trackW - pillW));
}

export function clampMinute(minutes: number, startMin: number, endMin: number): number {
  return Math.min(endMin, Math.max(startMin, minutes));
}
