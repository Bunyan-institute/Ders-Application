import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { getCoursesByCategory, getCategoryById } from '../../src/data/mockData';
import { CourseCard, EmptyState } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';
import { Course } from '../../src/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const category = useMemo(() => getCategoryById(id), [id]);
  const coursesInCategory = useMemo(() => getCoursesByCategory(id), [id]);
  const localizedCat = category ? t.categories[category.id] : undefined;

  const handleCoursePress = useCallback((course: Course) => {
    router.push(`/course/${course.id}`);
  }, []);

  const categoryTitle = localizedCat?.name || category?.name || '';
  const categoryDesc = localizedCat?.description || category?.description || '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: categoryTitle,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerBackTitle: t.common.back,
          headerShadowVisible: false,
        }}
      />

      {category && (
        <View
          style={[
            styles.banner,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text
            style={[
              styles.bannerTitle,
              { color: colors.primary, fontSize: fonts.lg, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {categoryTitle}
          </Text>
          {category.arabicName && (
            <Text style={[styles.bannerArabic, { color: colors.accent, fontSize: fonts.md }]}>
              {category.arabicName}
            </Text>
          )}
          <Text
            style={[
              styles.bannerDesc,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {categoryDesc} · {t.common.lessonsCount(coursesInCategory.length)}
          </Text>
        </View>
      )}

      <FlatList
        data={coursesInCategory}
        renderItem={({ item }) => <CourseCard course={item} onPress={handleCoursePress} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="school-outline"
            title={t.course.noLessonsTitle}
            subtitle={t.course.noLessonsDesc}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  bannerTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bannerArabic: {
    fontWeight: '600',
  },
  bannerDesc: {
    marginTop: 2,
  },
  list: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.lg,
  },
});
