import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design width (iPhone SE / small Android)
const BASE_WIDTH = 375;
export const MAX_CONTENT_WIDTH = 840;

export const scale = (size: number): number => {
  // Clamp effective screen width between 320 and 520 for typography/icon scaling
  const effectiveWidth = Math.min(Math.max(SCREEN_WIDTH, 320), 520);
  const ratio = effectiveWidth / BASE_WIDTH;
  const newSize = size * ratio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontSize = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  md: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(18),
  xxl: moderateScale(22),
  xxxl: moderateScale(28),
  display: moderateScale(34),
} as const;

export const BorderRadius = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 999,
} as const;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
