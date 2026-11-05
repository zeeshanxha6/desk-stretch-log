/** Tunable parameters for DeskStretchLog. */

// --- timing ---------------------------------------------------------------
/** Splash length. Exactly 8000 (rule #13) — shorter races the screenshot gate. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_OUT_MS = 320;
export const SCREEN_SLIDE_MS = 240;
export const FADE_MS = 300;
export const WIGGLE_MS = 260;
export const CONFETTI_MS = 500;
export const PULSE_MS = 500;
export const BADGE_POP_MS = 260;
export const BREATHE_MS = 2600;

// --- springs --------------------------------------------------------------
export const PILL_SPRING = { tension: 90, friction: 7 };
export const PRESS_SPRING = { tension: 300, friction: 12 };
export const CARD_SPRING = { tension: 55, friction: 8 };
export const BRAND_SPRING = { tension: 42, friction: 7 };
export const CTA_SPRING = { tension: 60, friction: 8 };

// --- hold timer -----------------------------------------------------------
/** 0 means "no timer" — log straight away. */
export const HOLD_OPTIONS: number[] = [15, 30, 60, 0];
export const DEFAULT_HOLD = 30;
export const FINAL_PULSE_FROM_SEC = 3;
export const TIMER_TICK_MS = 200;

// --- workday --------------------------------------------------------------
export const WORK_START_MIN = 540; // 09:00
export const WORK_END_MIN = 1080; // 18:00
export const WORK_STEP_MIN = 30;
export const DEFAULT_TARGET = 8;
export const MIN_TARGET = 2;
export const MAX_TARGET = 16;
export const LONG_GAP_MIN = 90;

// --- layout ---------------------------------------------------------------
export const PICKER_TILES = 5;
export const TILE_H = 72;
export const HEADER_CONTENT_H = 60;
export const STATUS_PAD = 44;
export const CONFETTI_COUNT = 18;
export const WEEK_GRID_WEEKS = 4;
export const HISTORY_ROWS = 6;
