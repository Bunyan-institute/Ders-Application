import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { useTheme, useScaledFont, useTranslation } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  category: Category;
  onPress: (category: Category) => void;
}

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  book: 'book-outline',
  'book-open': 'book-outline',
  bookmark: 'bookmark-outline',
  scale: 'scale-outline',
  clock: 'time-outline',
  type: 'document-text-outline',
  mic: 'mic-outline',
  heart: 'heart-outline',
};

export const CategoryCard = memo(({ category, onPress }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();

  const localized = t.categories[category.id];
  const displayName = localized?.name || category.name;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.75}
      accessibilityLabel={displayName}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Ionicons
          name={ICON_MAP[category.icon] || 'book-outline'}
          size={22}
          color={colors.primary}
        />
      </View>
      <Text
        style={[
          styles.name,
          {
            color: colors.text,
            fontSize: fonts.sm,
            writingDirection: isRTL ? 'rtl' : 'ltr',
          },
        ]}
        numberOfLines={2}
      >
        {displayName}
      </Text>
      <View style={styles.countRow}>
        <Text style={[styles.count, { color: colors.textSecondary, fontSize: fonts.xs }]}>
          {t.common.lessonsCount(category.courseCount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    margin: Spacing.xs,
    minHeight: 112,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 18,
  },
  countRow: {
    marginTop: 'auto',
    paddingTop: Spacing.xs,
  },
  count: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
