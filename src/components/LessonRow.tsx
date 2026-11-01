import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson, LessonProgress } from '../types';
import { useTheme, useScaledFont } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface Props {
  lesson: Lesson;
  index: number;
  progress?: LessonProgress;
  isBookmarked: boolean;
  isDownloaded: boolean;
  onPress: (lesson: Lesson) => void;
  onBookmark: (lessonId: string, courseId: string) => void;
}

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  video: 'videocam-outline',
  audio: 'mic-outline',
  pdf: 'document-text-outline',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const LessonRow = memo(({ lesson, index, progress, isBookmarked, isDownloaded, onPress, onBookmark }: Props) => {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const isCompleted = progress?.status === 'completed';
  const isInProgress = progress?.status === 'in_progress';

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderLight,
        },
      ]}
      onPress={() => onPress(lesson)}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.indexBox,
          {
            backgroundColor: isCompleted
              ? colors.primary
              : isInProgress
              ? colors.surfaceVariant
              : colors.surfaceVariant,
            borderColor: isInProgress ? colors.primary : colors.borderLight,
          },
        ]}
      >
        {isCompleted ? (
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        ) : (
          <Text
            style={[
              styles.indexText,
              {
                color: isInProgress ? colors.primary : colors.textSecondary,
                fontSize: fonts.xs,
              },
            ]}
          >
            {index}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.text, fontSize: fonts.sm }]}
          numberOfLines={2}
        >
          {lesson.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons
            name={TYPE_ICONS[lesson.type] || 'mic-outline'}
            size={13}
            color={colors.textSecondary}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} · {formatDuration(lesson.duration)}
          </Text>
          {isDownloaded && (
            <Ionicons name="cloud-done" size={14} color={colors.primary} style={{ marginLeft: 6 }} />
          )}
        </View>
        {isInProgress && progress && (
          <View style={styles.resumeRow}>
            <View style={[styles.miniProgress, { backgroundColor: colors.progressTrack }]}>
              <View
                style={[
                  styles.miniProgressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.round((progress.lastPositionSeconds / progress.durationSeconds) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.resumeText, { color: colors.primary, fontSize: fonts.xs }]}>
              {formatDuration(Math.round(progress.lastPositionSeconds))} / {formatDuration(progress.durationSeconds)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => onBookmark(lesson.id, lesson.courseId)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="حفظ الدرس"
      >
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={isBookmarked ? colors.accent : colors.textTertiary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  indexBox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    writingDirection: 'rtl',
    textAlign: 'left',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontWeight: '400',
  },
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  miniProgress: {
    flex: 1,
    height: 3,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  resumeText: {
    fontWeight: '500',
  },
});
