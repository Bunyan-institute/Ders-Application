import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../types';
import { useTheme, useScaledFont } from '../hooks';
import { useLearningStore } from '../store';
import { Spacing, BorderRadius } from '../theme';
import { KitabCover } from './KitabCover';

interface Props {
  course: Course;
  onPress: (course: Course) => void;
}

const LEVEL_COLORS = {
  Beginner: '#1A4D2E',
  Intermediate: '#92400E',
  Advanced: '#991B1B',
};

const LEVEL_ARABIC = {
  Beginner: 'مبتدئ',
  Intermediate: 'متوسط',
  Advanced: 'متقدم',
};

export const CourseCard = memo(({ course, onPress }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const progress = useLearningStore(s => s.progress);

  const { completed, percentage } = useMemo(() => {
    const completedCount = Object.values(progress).filter(
      p => p.courseId === course.id && p.status === 'completed'
    ).length;
    return {
      completed: completedCount,
      percentage: course.totalLessons > 0 ? Math.round((completedCount / course.totalLessons) * 100) : 0,
    };
  }, [progress, course.id, course.totalLessons]);

  const levelColor = LEVEL_COLORS[course.level] || colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(course)}
      activeOpacity={0.75}
      accessibilityLabel={`فتح ${course.title}`}
    >
      <View style={styles.contentRow}>
        {/* Authentic Kitab Book Cover */}
        <View style={styles.coverWrapper}>
          <KitabCover
            coverUrl={course.coverUrl || course.thumbnailUrl}
            arabicTitle={course.title}
            author={course.instructor}
            width={84}
            height={116}
            variant="card"
          />
        </View>

        {/* Book Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.levelBadge,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text style={[styles.levelText, { color: levelColor, fontSize: fonts.xs }]}>
                {LEVEL_ARABIC[course.level] || course.level}
              </Text>
            </View>
            <View style={styles.lessonsCountBadge}>
              <Ionicons name="mic-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.lessonsCountText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {course.totalLessons} {course.totalLessons <= 10 ? 'دروس' : 'درساً'}
              </Text>
            </View>
          </View>

          {/* Arabic-Only Book Title */}
          <Text
            style={[styles.title, { color: colors.text, fontSize: fonts.md }]}
            numberOfLines={2}
          >
            {course.title}
          </Text>

          {/* Description */}
          <Text
            style={[styles.description, { color: colors.textSecondary, fontSize: fonts.xs }]}
            numberOfLines={2}
          >
            {course.description}
          </Text>

          {/* Footer Progress & Status */}
          <View style={styles.cardFooter}>
            {percentage > 0 ? (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.progressTrack }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: colors.progressFill, width: `${percentage}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.primary, fontSize: fonts.xs }]}>
                  {percentage}%
                </Text>
              </View>
            ) : (
              <View style={styles.instructorRow}>
                <Ionicons name="ribbon-outline" size={13} color={colors.accent} />
                <Text
                  style={[styles.instructorText, { color: colors.textSecondary, fontSize: fonts.xs }]}
                  numberOfLines={1}
                >
                  {course.instructor}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  coverWrapper: {
    alignSelf: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 116,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  levelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  levelText: {
    fontWeight: '600',
  },
  lessonsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonsCountText: {
    fontWeight: '500',
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  description: {
    lineHeight: 17,
    writingDirection: 'rtl',
    textAlign: 'left',
    marginBottom: 6,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  instructorText: {
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  progressText: {
    fontWeight: '600',
    minWidth: 28,
  },
});
