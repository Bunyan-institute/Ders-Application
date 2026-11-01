import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont, useAudioPlayer, useTranslation } from '../../src/hooks';
import { getLessonById, getCourseById, getLessonsByCourse } from '../../src/data/mockData';
import { useLearningStore, useDownloadStore } from '../../src/store';
import { DownloadService } from '../../src/services/downloadService';
import { PdfViewer, SeekableProgressBar } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();

  const lesson = getLessonById(id);
  const course = lesson ? getCourseById(lesson.courseId) : undefined;
  const courseLessons = lesson ? getLessonsByCourse(lesson.courseId) : [];

  const currentIndex = courseLessons.findIndex(l => l.id === id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : null;

  const progressMap = useLearningStore(s => s.progress);
  const bookmarks = useLearningStore(s => s.bookmarks);
  const saveProgress = useLearningStore(s => s.saveProgress);
  const markCompleted = useLearningStore(s => s.markCompleted);
  const toggleBookmark = useLearningStore(s => s.toggleBookmark);

  const existingProgress = progressMap[id];
  const bookmarked = bookmarks.some(b => b.lessonId === id);

  // Tab mode: Default to PDF when available
  const hasPdf = Boolean(lesson?.pdfUrl);
  const [activeTab, setActiveTab] = useState<'pdf' | 'notes'>(hasPdf ? 'pdf' : 'notes');

  // Sync tab if lesson changes
  useEffect(() => {
    if (lesson?.pdfUrl) {
      setActiveTab('pdf');
    } else {
      setActiveTab('notes');
    }
  }, [lesson?.id, hasPdf]);

  // Downloads state
  const downloadsMap = useDownloadStore(s => s.downloads);
  const audioDownload =
    downloadsMap[`dl-${id}`] ||
    Object.values(downloadsMap).find(d => d.lessonId === id && d.format !== 'pdf');
  const isAudioDownloaded = audioDownload?.status === 'completed';
  const isAudioDownloading = audioDownload?.status === 'downloading';

  const pdfDownload =
    downloadsMap[`dl-${id}-pdf`] ||
    Object.values(downloadsMap).find(d => d.lessonId === id && d.format === 'pdf');
  const isPdfDownloaded = pdfDownload?.status === 'completed';
  const isPdfDownloading = pdfDownload?.status === 'downloading';

  // Determine active audio source: local offline file if downloaded, else R2 streaming URL
  const audioSource = useMemo(() => {
    if (isAudioDownloaded && audioDownload?.fileUri) {
      return audioDownload.fileUri;
    }
    return lesson?.audioOnlyUrl || lesson?.mediaUrl || '';
  }, [isAudioDownloaded, audioDownload?.fileUri, lesson?.audioOnlyUrl, lesson?.mediaUrl]);

  // Real Audio Player Hook
  const {
    isPlaying,
    isLoading: isAudioLoading,
    currentTime,
    duration,
    speed,
    error: audioError,
    togglePlay,
    seekBy,
    seekTo,
    setSpeed,
  } = useAudioPlayer(
    audioSource,
    existingProgress?.lastPositionSeconds || 0,
    lesson?.duration || 1800,
    () => {
      if (lesson) {
        markCompleted(id, lesson.courseId, duration);
      }
    }
  );

  // Auto-save learning progress every 5 seconds of playback
  useEffect(() => {
    if (lesson && currentTime > 0 && currentTime < duration) {
      const timer = setTimeout(() => {
        saveProgress(id, lesson.courseId, Math.round(currentTime), Math.round(duration));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [Math.floor(currentTime / 5)]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (lesson && currentTime > 0) {
        saveProgress(id, lesson.courseId, Math.round(currentTime), Math.round(duration));
      }
    };
  }, [currentTime, duration]);

  const handleDownloadAudio = () => {
    if (isAudioDownloaded) {
      Alert.alert(t.lesson.audioSaved, t.lesson.audioSaved);
      return;
    }
    if (lesson) {
      DownloadService.downloadLesson(lesson, 'audio');
      Alert.alert(t.downloads.status.downloading, t.lesson.audioDownloading);
    }
  };

  const handleDownloadPdf = () => {
    if (isPdfDownloaded) {
      Alert.alert(t.lesson.pdfSaved, t.lesson.pdfSaved);
      return;
    }
    if (lesson && lesson.pdfUrl) {
      DownloadService.downloadLesson(lesson, 'pdf');
      Alert.alert(t.downloads.status.downloading, t.lesson.pdfDownloading);
    }
  };

  const handleShare = async () => {
    if (!lesson) return;
    try {
      await Share.share({
        title: lesson.title,
        message: `${lesson.title} - ${course?.title || 'Bunyan'}`,
      });
    } catch {}
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  if (!lesson) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>
          {t.lesson.notFound}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: course?.title || lesson.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerBackTitle: t.common.back,
          headerShadowVisible: false,
        }}
      />

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header & Breadcrumb */}
        <View style={styles.topInfo}>
          <View style={styles.courseBadgeRow}>
            <View
              style={[
                styles.courseBadgeBox,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text style={[styles.courseBadgeText, { color: colors.primary }]}>
                {course?.title || 'Course'}
              </Text>
            </View>
            <Text style={[styles.lessonOrder, { color: colors.textSecondary }]}>
              {t.lesson.orderInfo(lesson.order, courseLessons.length || course?.totalLessons || 1)}
            </Text>
          </View>
          <Text
            style={[
              styles.lessonTitle,
              { color: colors.text, fontSize: fonts.lg, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {lesson.title}
          </Text>
        </View>

        {/* Tab Switcher if PDF is present */}
        {hasPdf && (
          <View
            style={[
              styles.tabBar,
              { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'pdf' && [
                  styles.activeTabItem,
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                ],
              ]}
              onPress={() => setActiveTab('pdf')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="document-text-outline"
                size={15}
                color={activeTab === 'pdf' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'pdf' ? colors.text : colors.textSecondary },
                ]}
              >
                {t.lesson.pdfTab}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'notes' && [
                  styles.activeTabItem,
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                ],
              ]}
              onPress={() => setActiveTab('notes')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="information-circle-outline"
                size={15}
                color={activeTab === 'notes' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'notes' ? colors.text : colors.textSecondary },
                ]}
              >
                {t.lesson.notesTab}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 1. PDF VIEWER: Opened by default on screen */}
        {hasPdf && activeTab === 'pdf' && lesson.pdfUrl && (
          <PdfViewer
            pdfUrl={lesson.pdfUrl}
            localFileUri={pdfDownload?.fileUri}
            title={course?.title ? `${course.title} - ${lesson.title}` : lesson.title}
            isDownloaded={isPdfDownloaded}
            isDownloading={isPdfDownloading}
            onDownload={handleDownloadPdf}
            height={520}
          />
        )}

        {/* 2. OVERVIEW & TRANSCRIPT SECTION */}
        {(activeTab === 'notes' || !hasPdf) && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardIconBox,
                  { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight },
                ]}
              >
                <Ionicons name="book-outline" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fonts.sm }]}>
                {t.lesson.summaryHeader}
              </Text>
            </View>

            <Text
              style={[
                styles.cardBody,
                { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
              ]}
            >
              {lesson.description}
            </Text>

            {hasPdf && (
              <TouchableOpacity
                style={[
                  styles.pdfNoticeBtn,
                  { borderColor: colors.borderLight, backgroundColor: colors.surfaceVariant },
                ]}
                onPress={() => setActiveTab('pdf')}
                activeOpacity={0.75}
              >
                <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                <Text style={[styles.pdfNoticeText, { color: colors.primary }]}>
                  {t.lesson.pdfNoticeText}
                </Text>
              </TouchableOpacity>
            )}

            {lesson.transcriptText && (
              <View style={{ marginTop: Spacing.sm }}>
                <Text style={[styles.sectionSubtitle, { color: colors.text }]}>
                  {t.lesson.studyNotesHeader}
                </Text>
                <Text
                  style={[
                    styles.transcriptText,
                    { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
                  ]}
                >
                  {lesson.transcriptText}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: isAudioDownloaded ? colors.surfaceVariant : colors.surface,
                borderColor: isAudioDownloaded ? colors.primary : colors.borderLight,
              },
            ]}
            onPress={handleDownloadAudio}
            activeOpacity={0.75}
          >
            <Ionicons
              name={
                isAudioDownloaded
                  ? 'checkmark'
                  : isAudioDownloading
                  ? 'arrow-down'
                  : 'cloud-download-outline'
              }
              size={15}
              color={isAudioDownloaded ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: isAudioDownloaded ? colors.primary : colors.text },
              ]}
            >
              {isAudioDownloaded
                ? t.lesson.audioSaved
                : isAudioDownloading
                ? t.lesson.audioDownloading
                : t.lesson.downloadAudio}
            </Text>
          </TouchableOpacity>

          {hasPdf && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isPdfDownloaded ? colors.surfaceVariant : colors.surface,
                  borderColor: isPdfDownloaded ? colors.primary : colors.borderLight,
                },
              ]}
              onPress={handleDownloadPdf}
              activeOpacity={0.75}
            >
              <Ionicons
                name={
                  isPdfDownloaded
                    ? 'checkmark'
                    : isPdfDownloading
                    ? 'arrow-down'
                    : 'document-text-outline'
                }
                size={15}
                color={isPdfDownloaded ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  { color: isPdfDownloaded ? colors.primary : colors.text },
                ]}
              >
                {isPdfDownloaded
                  ? t.lesson.pdfSaved
                  : isPdfDownloading
                  ? t.lesson.pdfDownloading
                  : t.lesson.downloadPdf}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: colors.surface, borderColor: colors.borderLight },
            ]}
            onPress={handleShare}
            activeOpacity={0.75}
          >
            <Ionicons name="share-outline" size={15} color={colors.text} />
            <Text style={[styles.actionBtnText, { color: colors.text }]}>{t.common.share}</Text>
          </TouchableOpacity>
        </View>

        {/* Next / Previous Navigation Links */}
        <View style={styles.navRow}>
          {prevLesson ? (
            <TouchableOpacity
              style={[
                styles.navBtn,
                { borderColor: colors.borderLight, backgroundColor: colors.surface },
              ]}
              onPress={() => router.replace(`/lesson/${prevLesson.id}`)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={isRTL ? 'chevron-forward' : 'chevron-back'}
                size={15}
                color={colors.text}
              />
              <Text style={[styles.navBtnText, { color: colors.text }]} numberOfLines={1}>
                {t.lesson.prevLesson(prevLesson.order)}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {nextLesson && (
            <TouchableOpacity
              style={[
                styles.navBtn,
                { borderColor: colors.borderLight, backgroundColor: colors.surface },
              ]}
              onPress={() => router.replace(`/lesson/${nextLesson.id}`)}
              activeOpacity={0.75}
            >
              <Text style={[styles.navBtnText, { color: colors.text }]} numberOfLines={1}>
                {t.lesson.nextLesson(nextLesson.order)}
              </Text>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={15}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom spacer for sticky player */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* DOCKED STICKY AUDIO PLAYER AT THE BOTTOM */}
      <View
        style={[
          styles.bottomPlayer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderLight,
          },
        ]}
      >
        {/* Scrubber Progress Bar */}
        <View style={styles.scrubberContainer}>
          <SeekableProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
        </View>

        {/* Player Bar Content */}
        <View style={styles.playerInner}>
          {/* Top Row: Mini Info + Timestamps */}
          <View style={styles.playerHeaderRow}>
            <View style={styles.playerTitleGroup}>
              <Text style={[styles.miniLessonTitle, { color: colors.text }]} numberOfLines={1}>
                {lesson.title}
              </Text>
              <View style={styles.streamingBadgeRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.miniSourceText, { color: colors.textSecondary }]}>
                  {isAudioDownloaded ? t.lesson.offlineSource : t.lesson.onlineSource}
                </Text>
              </View>
            </View>

            <Text style={[styles.timeDisplay, { color: colors.textSecondary }]}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>

          {/* Controls Row */}
          <View style={styles.playerControlsRow}>
            {/* Speed Button */}
            <TouchableOpacity
              style={[
                styles.speedChip,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
              onPress={cycleSpeed}
              activeOpacity={0.75}
            >
              <Text style={[styles.speedChipText, { color: colors.text }]}>{speed}x</Text>
            </TouchableOpacity>

            {/* Seek -10s */}
            <TouchableOpacity style={styles.seekBtn} onPress={() => seekBy(-10)} activeOpacity={0.75}>
              <Ionicons name="play-back-outline" size={22} color={colors.text} />
              <Text style={[styles.seekSubText, { color: colors.textSecondary }]}>-10s</Text>
            </TouchableOpacity>

            {/* Main Big Play / Pause Button */}
            <TouchableOpacity
              style={[styles.playPauseBtn, { backgroundColor: colors.primary }]}
              onPress={togglePlay}
              activeOpacity={0.85}
              accessibilityLabel={isPlaying ? 'Pause lesson audio' : 'Play lesson audio'}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Seek +10s */}
            <TouchableOpacity style={styles.seekBtn} onPress={() => seekBy(10)} activeOpacity={0.75}>
              <Ionicons name="play-forward-outline" size={22} color={colors.text} />
              <Text style={[styles.seekSubText, { color: colors.textSecondary }]}>+10s</Text>
            </TouchableOpacity>

            {/* Bookmark Toggle */}
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => toggleBookmark(id, lesson.courseId)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={bookmarked ? colors.accent : colors.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 880,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  topInfo: {
    marginBottom: Spacing.md,
  },
  courseBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  courseBadgeBox: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  courseBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lessonOrder: {
    fontSize: 12,
    fontWeight: '500',
  },
  lessonTitle: {
    fontWeight: '700',
    lineHeight: 26,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 2,
    marginBottom: Spacing.md,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    gap: 6,
  },
  activeTabItem: {},
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardIconBox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '600',
  },
  cardBody: {
    lineHeight: 20,
  },
  pdfNoticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    marginTop: 6,
  },
  pdfNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  transcriptText: {
    lineHeight: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: Spacing.lg,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  scrubberContainer: {
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: Spacing.lg,
  },
  playerInner: {
    maxWidth: 880,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  playerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  playerTitleGroup: {
    flex: 1,
    marginRight: 12,
  },
  miniLessonTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  streamingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  miniSourceText: {
    fontSize: 10,
    fontWeight: '500',
  },
  timeDisplay: {
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  speedChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  seekBtn: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  seekSubText: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: -2,
  },
  playPauseBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  utilBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
