import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { getCourseById, getLessonsByCourse } from '../../src/data/mockData';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { LessonRow, ProgressBar, EmptyState, KitabCover } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';
import { Lesson } from '../../src/types';
import { DownloadService } from '../../src/services/downloadService';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const course = useMemo(() => getCourseById(id), [id]);
  const lessons = useMemo(() => getLessonsByCourse(id), [id]);

  const progress = useLearningStore(s => s.progress);
  const bookmarks = useLearningStore(s => s.bookmarks);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);
  const downloads = useDownloadStore(s => s.downloads);

  const courseProgress = useMemo(() => {
    const totalLessons = course?.totalLessons || 0;
    const completed = Object.values(progress).filter(
      p => p.courseId === id && p.status === 'completed'
    ).length;
    return {
      completed,
      percentage: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
    };
  }, [id, progress, course?.totalLessons]);

  const downloadableLessons = useMemo(() => {
    return lessons.filter(l => Boolean(l.mediaUrl || l.audioOnlyUrl || l.pdfUrl));
  }, [lessons]);

  const handleLessonPress = useCallback((lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  }, []);

  const handleBookmark = useCallback((lessonId: string, courseId: string) => {
    toggleBookmark(lessonId, courseId);
  }, []);

  const handleDownloadAll = () => {
    if (downloadableLessons.length === 0) {
      Alert.alert(t.course.alertNoticeTitle, t.course.prepNotice);
      return;
    }

    Alert.alert(
      t.course.downloadAll,
      t.course.downloadAllPrompt(downloadableLessons.length),
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.download,
          onPress: () => {
            DownloadService.downloadCourse(downloadableLessons);
            Alert.alert(
              t.course.downloadsStartedTitle,
              t.course.downloadsStartedMsg(downloadableLessons.length)
            );
          },
        },
      ]
    );
  };

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="alert-circle-outline"
          title={t.course.notFoundTitle}
          subtitle={t.course.notFoundDesc}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: course.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerBackTitle: t.common.back,
          headerShadowVisible: false,
        }}
      />

      <FlatList
        data={lessons}
        renderItem={({ item, index }) => (
          <LessonRow
            lesson={item}
            index={index + 1}
            progress={progress[item.id]}
            isBookmarked={bookmarks.some(b => b.lessonId === item.id)}
            isDownloaded={Object.values(downloads).some(
              d => d.lessonId === item.id && d.status === 'completed'
            )}
            onPress={handleLessonPress}
            onBookmark={handleBookmark}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Authentic Kitab Hero Header */}
            <View style={styles.heroRow}>
              <KitabCover
                coverUrl={course.coverUrl || course.thumbnailUrl}
                arabicTitle={course.title}
                author={course.instructor}
                width={104}
                height={144}
                variant="detail"
              />
              <View style={styles.heroInfo}>
                <Text
                  style={[
                    styles.courseTitle,
                    { color: colors.text, fontSize: fonts.xl, writingDirection: isRTL ? 'rtl' : 'ltr' },
                  ]}
                >
                  {course.title}
                </Text>
                <View style={styles.authorBadgeRow}>
                  <Ionicons name="ribbon-outline" size={14} color={colors.accent} />
                  <Text
                    style={[
                      styles.instructorText,
                      { color: colors.primary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
                    ]}
                  >
                    {course.instructor}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.metaBadge,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.borderLight,
                      },
                    ]}
                  >
                    <Ionicons name="school-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                      {t.course.level[course.level as keyof typeof t.course.level] || course.level}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.metaBadge,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.borderLight,
                      },
                    ]}
                  >
                    <Ionicons name="mic-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                      {t.common.lessonsCount(course.totalLessons)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text
              style={[
                styles.courseDesc,
                { color: colors.textSecondary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
              ]}
            >
              {course.description}
            </Text>

            <ProgressBar
              percentage={courseProgress.percentage}
              completed={courseProgress.completed}
              total={course.totalLessons}
            />

            {downloadableLessons.length > 0 ? (
              <TouchableOpacity
                style={[styles.downloadAllBtn, { backgroundColor: colors.primary }]}
                onPress={handleDownloadAll}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-download-outline" size={17} color="#FFFFFF" />
                <Text style={styles.downloadAllText}>{t.course.downloadAll}</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.prepNoticeBox,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.borderLight,
                  },
                ]}
              >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                <Text style={[styles.prepNoticeText, { color: colors.textSecondary }]}>
                  {t.course.prepNotice}
                </Text>
              </View>
            )}

            <View style={styles.lessonsHeaderRow}>
              <View style={[styles.sectionBullet, { backgroundColor: colors.primary }]} />
              <Text
                style={[
                  styles.lessonsHeader,
                  { color: colors.text, fontSize: fonts.md, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.course.lessonsHeader}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="list-outline"
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
  list: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.lg,
  },
  headerSection: {
    marginBottom: Spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroInfo: {
    flex: 1,
    gap: 6,
  },
  courseTitle: {
    fontWeight: '700',
    writingDirection: 'rtl',
    lineHeight: 26,
  },
  authorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  instructorText: {
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  courseDesc: {
    lineHeight: 20,
    marginBottom: Spacing.md,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 2,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  metaText: {
    fontWeight: '500',
  },
  downloadAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.xs,
    gap: 6,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  downloadAllText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  prepNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  prepNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  lessonsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sectionBullet: {
    width: 4,
    height: 14,
    borderRadius: 2,
  },
  lessonsHeader: {
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'left',
  },
});
