/**
 * DeskStretchLog theme — NORDIC_MINIMAL preset with the brief's teal / coral accents.
 * The `name` field stays exactly as in the preset (rule #11b).
 */

export const theme = {
  name: 'nordic-minimal',

  colors: {
    bg: {
      primary: '#F1F6F4',
      secondary: '#E6EFEC',
      tertiary: '#DCEAE5',
      accent: '#CFE3DD',
    },
    brand: {
      teal: '#2E8C7A',
      tealLight: '#3FA892',
      tealDeep: '#276F62',
      tealDark: '#1B4A42',
      night: '#0D2A25',
      coral: '#FF8A5C',
      coralDeep: '#F4703F',
      mint: '#7FE8C5',
    },
    surface: {
      card: '#FFFFFF',
      alt: '#E6EFEC',
      glass: 'rgba(255,255,255,0.75)',
      header: 'rgba(255,255,255,0.72)',
      strip: 'rgba(255,255,255,0.80)',
      darkGlass: 'rgba(255,255,255,0.10)',
      darkGlassStrong: 'rgba(255,255,255,0.16)',
    },
    text: {
      primary: '#1B2D2A',
      secondary: '#5A7470',
      muted: '#8FA5A0',
      onDark: '#FFFFFF',
      onDarkSoft: 'rgba(255,255,255,0.70)',
      onDarkFaint: 'rgba(255,255,255,0.45)',
    },
    ui: {
      border: '#CFE3DD',
      divider: '#E6EFEC',
      borderDark: 'rgba(255,255,255,0.28)',
      overlay: 'rgba(27,45,42,0.5)',
    },
  },

  gradients: {
    primary: ['#2E8C7A', '#3FA892'] as string[],
    coral: ['#FF8A5C', '#F4703F'] as string[],
    pill: ['#2E8C7A', '#3FA892'] as string[],
    progress: ['#2E8C7A', '#7FE8C5', '#FF8A5C'] as string[],
    loader: ['rgba(13,42,37,0.92)', 'rgba(27,45,42,0.88)', 'rgba(46,140,122,0.80)'] as string[],
    menu: ['rgba(241,246,244,0.90)', 'rgba(230,239,236,0.93)', 'rgba(220,234,229,0.95)'] as string[],
    game: ['rgba(241,246,244,0.93)', 'rgba(233,242,239,0.94)', 'rgba(223,237,232,0.96)'] as string[],
    result: ['rgba(46,140,122,0.90)', 'rgba(39,111,98,0.93)', 'rgba(27,74,66,0.95)'] as string[],
    panel: ['rgba(236,244,241,0.94)', 'rgba(224,237,232,0.95)', 'rgba(213,231,224,0.96)'] as string[],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '800' as const, letterSpacing: -0.5 },
    brand: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 3 },
    title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: 1 },
    heading: { fontSize: 20, fontWeight: '800' as const, letterSpacing: 0.4 },
    statValue: { fontSize: 24, fontWeight: '800' as const },
    timer: { fontSize: 48, fontWeight: '800' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    bodyStrong: { fontSize: 16, fontWeight: '700' as const },
    button: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 1.1 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.6 },
    micro: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.2 },
  },

  radius: { sm: 8, md: 14, lg: 18, xl: 22, xxl: 26, full: 9999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 },

  shadows: {
    card: {
      shadowColor: '#1B2D2A',
      shadowOpacity: 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
    cardSoft: {
      shadowColor: '#1B2D2A',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    chip: {
      shadowColor: '#1B2D2A',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    coral: {
      shadowColor: '#FF8A5C',
      shadowOpacity: 0.34,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    teal: {
      shadowColor: '#2E8C7A',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    sheet: {
      shadowColor: '#1B2D2A',
      shadowOpacity: 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -6 },
      elevation: 10,
    },
    result: {
      shadowColor: '#0B1F1B',
      shadowOpacity: 0.25,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
  },
};

export type Theme = typeof theme;
export default theme;
