import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { useLearningStore } from '../../src/store';
import { categories, courses } from '../../src/data/mockData';
import { CategoryCard, ContinueLearningCard, CourseCard } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';
import { Category, Course } from '../../src/types';

export default function HomeScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const progress = useLearningStore(s => s.progress);

  const continueLearning = useMemo(() => {
    return Object.values(progress)
      .filter(p => p.status === 'in_progress')
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);
  }, [progress]);

  const handleCategoryPress = useCallback((cat: Category) => {
    router.push(`/category/${cat.id}`);
  }, []);

  const handleCoursePress = useCallback((course: Course) => {
    router.push(`/course/${course.id}`);
  }, []);

  const handleContinuePress = useCallback((lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  }, []);

  const featuredCourses = courses;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Classical Bismillah Header */}
        <View style={styles.bismillahContainer}>
          <Text style={[styles.bismillahText, { color: colors.accent }]}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        </View>

        {/* Scholarly Brand Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.greeting,
                {
                  color: colors.textSecondary,
                  fontSize: fonts.xs,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t.home.greeting}
            </Text>
            <Text
              style={[
                styles.appTitle,
                {
                  color: colors.primary,
                  fontSize: fonts.xl,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t.home.appTitle}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderLight,
              },
            ]}
            onPress={() => router.push('/(tabs)/search')}
            accessibilityLabel={t.tabs.search}
            activeOpacity={0.75}
          >
            <Ionicons name="search-outline" size={18} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Elegant Bunyan & Dua Card */}
        <TouchableOpacity
          style={[
            styles.duaBanner,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderLight,
            },
          ]}
          onPress={() => router.push('/about')}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.duaBannerIcon,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <Ionicons name="heart-outline" size={16} color={colors.accent} />
          </View>
          <View style={styles.duaBannerContent}>
            <Text
              style={[
                styles.duaBannerTitle,
                {
                  color: colors.text,
                  fontSize: fonts.sm,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t.home.bunyanBannerTitle}
            </Text>
            <Text
              style={[
                styles.duaBannerSubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: fonts.xs,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
              numberOfLines={1}
            >
              {t.home.bunyanBannerSubtitle}
            </Text>
          </View>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={16}
            color={colors.textTertiary}
          />
        </TouchableOpacity>

        {/* Continue Learning */}
        {continueLearning.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionBullet, { backgroundColor: colors.accent }]} />
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                    fontSize: fonts.md,
                    writingDirection: isRTL ? 'rtl' : 'ltr',
                  },
                ]}
              >
                {t.home.continueLearning}
              </Text>
            </View>
            <FlatList
              data={continueLearning}
              renderItem={({ item }) => (
                <ContinueLearningCard progress={item} onPress={handleContinuePress} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.lessonId}
              contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
            />
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionBullet, { backgroundColor: colors.primary }]} />
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: fonts.md,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t.home.categories}
            </Text>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map(cat => (
              <View key={cat.id} style={styles.categoryItem}>
                <CategoryCard category={cat} onPress={handleCategoryPress} />
              </View>
            ))}
          </View>
        </View>

        {/* Featured Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionBullet, { backgroundColor: colors.accent }]} />
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: fonts.md,
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t.home.featuredCourses}
            </Text>
          </View>
          <View style={styles.coursesList}>
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} onPress={handleCoursePress} />
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Spacing.xxl,
  },
  bismillahContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  bismillahText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontWeight: '500',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  appTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  duaBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duaBannerContent: {
    flex: 1,
  },
  duaBannerTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  duaBannerSubtitle: {
    fontWeight: '400',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: 8,
  },
  sectionBullet: {
    width: 4,
    height: 14,
    borderRadius: 2,
  },
  sectionTitle: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
  },
  categoryItem: {
    width: '33.33%',
  },
  coursesList: {
    paddingHorizontal: Spacing.lg,
  },
});
