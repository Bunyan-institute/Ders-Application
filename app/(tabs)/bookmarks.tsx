import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { getLessonById } from '../../src/data/mockData';
import { LessonRow, EmptyState } from '../../src/components';
import { Spacing } from '../../src/theme';
import { Lesson } from '../../src/types';

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const bookmarks = useLearningStore(s => s.bookmarks);
  const progress = useLearningStore(s => s.progress);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);
  const downloads = useDownloadStore(s => s.downloads);

  const bookmarkedLessons = useMemo(() => {
    return bookmarks
      .map(b => getLessonById(b.lessonId))
      .filter((l): l is NonNullable<typeof l> => l !== undefined);
  }, [bookmarks]);

  const handlePress = useCallback((lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  }, []);

  const handleBookmark = useCallback((lessonId: string, courseId: string) => {
    toggleBookmark(lessonId, courseId);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: fonts.xl, writingDirection: isRTL ? 'rtl' : 'ltr' },
          ]}
        >
          {t.bookmarks.title}
        </Text>
        <Text
          style={[
            styles.count,
            { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
          ]}
        >
          {t.bookmarks.savedCount(bookmarkedLessons.length)}
        </Text>
      </View>

      <FlatList
        data={bookmarkedLessons}
        renderItem={({ item, index }) => (
          <LessonRow
            lesson={item}
            index={index + 1}
            progress={progress[item.id]}
            isBookmarked={true}
            isDownloaded={Object.values(downloads).some(
              d => d.lessonId === item.id && d.status === 'completed'
            )}
            onPress={handlePress}
            onBookmark={handleBookmark}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title={t.bookmarks.emptyTitle}
            subtitle={t.bookmarks.emptySubtitle}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  count: {
    marginTop: 2,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
});
