export interface ColorScheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  error: string;
  success: string;
  warning: string;
  overlay: string;
  card: string;
  tabBar: string;
  tabBarBorder: string;
  icon: string;
  iconActive: string;
  progressTrack: string;
  progressFill: string;
}

export const Colors: { light: ColorScheme; dark: ColorScheme } = {
  light: {
    primary: '#1A4D2E',        // Deep scholarly emerald
    primaryLight: '#2C6641',   // Rich forest tone
    primaryDark: '#0E301B',    // Darkest evergreen
    accent: '#B8963E',         // Classical manuscript gold / ocher
    accentLight: '#D4B066',    // Warm soft gold
    background: '#F9F8F5',     // Elegant manuscript ivory / warm paper
    surface: '#FFFFFF',        // Clean white
    surfaceVariant: '#F2EFE8', // Soft warm parchment neutral
    text: '#1C1917',           // Deep warm ink
    textSecondary: '#57534E',  // Warm graphite
    textTertiary: '#A8A29E',   // Subtle stone
    border: '#E6E2D8',         // Subtle manuscript border
    borderLight: '#F0ECE3',    // Hairline warm border
    error: '#991B1B',          // Restrained crimson
    success: '#166534',        // Deep scholarly olive green
    warning: '#92400E',        // Deep amber
    overlay: 'rgba(28, 25, 23, 0.45)',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E6E2D8',
    icon: '#78716C',           // Warm stone icon
    iconActive: '#1A4D2E',     // Deep emerald active icon
    progressTrack: '#EAE6DC',  // Soft parchment track
    progressFill: '#1A4D2E',   // Deep emerald progress
  },
  dark: {
    primary: '#5AA373',        // Soothing scholar emerald
    primaryLight: '#7ABF90',   // Soft mint sage
    primaryDark: '#1A4D2E',    // Deep emerald base
    accent: '#D4B066',         // Illuminated manuscript gold
    accentLight: '#E8C986',    // Soft gold highlights
    background: '#121413',     // Very deep charcoal with olive undertone
    surface: '#1A1D1B',        // Restrained warm dark surface
    surfaceVariant: '#242926', // Elevated slate card surface
    text: '#F5F3EF',           // Off-white manuscript text
    textSecondary: '#A8A29E',  // Soft stone gray
    textTertiary: '#78716C',   // Muted charcoal gray
    border: '#2C332F',         // Subtle geometric dark border
    borderLight: '#232926',    // Hairline dark border
    error: '#EF4444',
    success: '#5AA373',
    warning: '#F59E0B',
    overlay: 'rgba(0, 0, 0, 0.75)',
    card: '#1A1D1B',
    tabBar: '#1A1D1B',
    tabBarBorder: '#2C332F',
    icon: '#9CA3AF',
    iconActive: '#5AA373',
    progressTrack: '#26302A',
    progressFill: '#5AA373',
  },
};
