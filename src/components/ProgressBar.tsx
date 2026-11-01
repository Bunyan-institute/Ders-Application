import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useScaledFont } from '../hooks';
import { BorderRadius } from '../theme';

interface Props {
  percentage: number;
  completed: number;
  total: number;
  showLabel?: boolean;
  height?: number;
}

export const ProgressBar = memo(({ percentage, completed, total, showLabel = true, height = 5 }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.progressTrack, height }]}>
        <View style={[styles.fill, { backgroundColor: colors.primary, width: `${percentage}%`, height }]} />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: fonts.xs }]}>
          {percentage}% · {completed}/{total} lessons
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  track: {
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.xs,
  },
  label: {
    fontWeight: '500',
  },
});
