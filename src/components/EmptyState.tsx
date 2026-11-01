import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

export const EmptyState = ({ icon, title, subtitle }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Ionicons name={icon} size={36} color={colors.accent} />
      </View>
      <Text style={[styles.title, { color: colors.text, fontSize: fonts.lg }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fonts.sm }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.sm,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 360,
  },
});
