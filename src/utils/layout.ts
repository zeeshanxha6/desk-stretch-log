import { Dimensions } from 'react-native';

const win = Dimensions.get('window');

export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/** Horizontal page padding used by every screen. */
export const PAGE_PAD = 20;

/** Width of the content column — explicit numbers keep buttons sized, never intrinsic. */
export const CONTENT_W = Math.min(SCREEN_W - PAGE_PAD * 2, 380);

/** Board max width (rule #5): leave room for padding + border. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);

export type BoardMetrics = {
  frame: number;
  cell: number;
  width: number;
};

/**
 * Rule #4 — the parent's padding + border are NOT part of the children's
 * content box, so subtract them before dividing by the column count.
 */
export function boardMetrics(cols: number, pad: number, border: number, maxW = BOARD_MAX_W): BoardMetrics {
  const frame = pad + border;
  const cell = Math.floor((maxW - 2 * frame) / cols);
  return { frame, cell, width: cell * cols + 2 * frame };
}

/** Split a row of `count` equal items that share `gap` inside `total` width. */
export function splitRow(total: number, count: number, gap: number) {
  return Math.floor((total - gap * (count - 1)) / count);
}

// --- vertical budget for the Game screen ----------------------------------
/** paddingTop 44 + 60px content row + 10px bottom (see ScreenHeader). */
export const HEADER_TOTAL_H = 114;
export const STRIP_H = 56;
export const CONTROLS_H = 158;

const PICKER_AREA_H = Math.max(240, SCREEN_H - HEADER_TOTAL_H - STRIP_H - CONTROLS_H - 40);

export const TILE_GAP = 10;

/**
 * The picker always shows five tiles without scrolling (rule #3), so the tile
 * height is derived from the space that is actually left over. 72 on a roomy
 * phone, a little tighter on a short one — never an overflow.
 */
export const PICKER_TILE_H = Math.max(
  56,
  // Five tiles each carry a trailing gap, so budget for five gaps, not four.
  Math.min(72, Math.floor((PICKER_AREA_H - TILE_GAP * 5) / 5)),
);

/** Hold ring diameter. */
export const RING_SIZE = Math.min(SCREEN_W - 96, 260);
