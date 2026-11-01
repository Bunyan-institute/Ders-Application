import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { useDownloadStore } from '../../src/store';
import { EmptyState } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';
import { useRouter } from 'expo-router';
import { DownloadService } from '../../src/services/downloadService';
import { DownloadStatus } from '../../src/types';

export default function DownloadsScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const rawDownloads = useDownloadStore(s => s.downloads);
  const clearAllDownloads = useDownloadStore(s => s.clearAllDownloads);
  const isOnline = DownloadService.isNetworkAvailable();

  const downloads = useMemo(() => {
    return Object.values(rawDownloads).sort(
      (a, b) => (b.downloadedAt || '').localeCompare(a.downloadedAt || '')
    );
  }, [rawDownloads]);

  const storageUsed = useMemo(() => {
    return Object.values(rawDownloads)
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + (d.fileSize || d.downloadedBytes || 0), 0);
  }, [rawDownloads]);

  const handleClearAll = () => {
    Alert.alert(
      t.downloads.clearAlertTitle,
      t.downloads.clearAlertDesc,
      [
        { text: t.common.cancel, style: 'cancel' },
        { text: t.common.clearAll, style: 'destructive', onPress: clearAllDownloads },
      ]
    );
  };

  const getStatusLabel = (status: DownloadStatus): string => {
    return t.downloads.status[status] || t.downloads.status.pending;
  };

  const statusIcons: Record<string, string> = {
    completed: 'checkmark',
    downloading: 'arrow-down',
    paused: 'pause',
    waiting_for_internet: 'wifi-outline',
    pending: 'time-outline',
    failed: 'alert-circle-outline',
  };

  const getStatusColor = (status: DownloadStatus) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'downloading':
        return colors.primary;
      case 'paused':
        return colors.warning;
      case 'waiting_for_internet':
        return colors.warning;
      case 'failed':
        return colors.error;
      case 'pending':
      default:
        return colors.textTertiary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontSize: fonts.xl, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.downloads.title}
          </Text>
          <Text
            style={[
              styles.storage,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.downloads.storageInfo(t.common.formatBytes(storageUsed))}
          </Text>
        </View>
        {downloads.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            accessibilityLabel={t.downloads.clearAlertTitle}
            style={[styles.clearBtn, { borderColor: colors.borderLight }]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Offline Notice Banner */}
      {!isOnline && (
        <View
          style={[
            styles.offlineBanner,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.warning,
            },
          ]}
        >
          <Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
          <Text
            style={[
              styles.offlineText,
              { color: colors.text, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.downloads.offlineBanner}
          </Text>
        </View>
      )}

      {/* Downloads List */}
      <FlatList
        data={downloads}
        renderItem={({ item }) => {
          const currentBytes = item.downloadedBytes || Math.round(item.progress * item.fileSize);
          const totalBytes = item.fileSize;
          const percent = Math.round(item.progress * 100);
          const statusColor = getStatusColor(item.status);

          return (
            <TouchableOpacity
              style={[
                styles.downloadRow,
                { backgroundColor: colors.surface, borderColor: colors.borderLight },
              ]}
              onPress={() => router.push(`/lesson/${item.lessonId}`)}
              activeOpacity={0.75}
            >
              {/* Status Icon Box */}
              <View
                style={[
                  styles.statusIcon,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.borderLight,
                  },
                ]}
              >
                <Ionicons
                  name={(statusIcons[item.status] || 'ellipse-outline') as any}
                  size={16}
                  color={statusColor}
                />
              </View>

              {/* Download Info */}
              <View style={styles.downloadInfo}>
                <Text
                  style={[
                    styles.downloadTitle,
                    {
                      color: colors.text,
                      fontSize: fonts.sm,
                      writingDirection: isRTL ? 'rtl' : 'ltr',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                {/* Status Badge + Format */}
                <View style={styles.statusBadgeRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.borderLight,
                      },
                    ]}
                  >
                    <Text style={[styles.statusBadgeText, { color: statusColor, fontSize: fonts.xs }]}>
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>
                  <Text style={[styles.formatText, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                    {item.format === 'audio' ? t.downloads.format.audio : t.downloads.format.pdf}
                  </Text>
                </View>

                {/* Size & Percentage Math */}
                <Text style={[styles.downloadMeta, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                  {t.common.formatBytes(currentBytes)} / {t.common.formatBytes(totalBytes)} ({percent}%)
                </Text>

                {/* Progress Bar for Active Download or Paused */}
                {(item.status === 'downloading' ||
                  item.status === 'paused' ||
                  item.status === 'waiting_for_internet') && (
                  <View style={[styles.progressBar, { backgroundColor: colors.progressTrack }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: statusColor,
                          width: `${percent}%`,
                        },
                      ]}
                    />
                  </View>
                )}
              </View>

              {/* Actions Controls: Pause, Resume, Retry, Cancel */}
              <View style={styles.downloadActions}>
                {item.status === 'downloading' && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.borderLight,
                      },
                    ]}
                    onPress={() => DownloadService.pause(item.id)}
                    accessibilityLabel="Pause"
                  >
                    <Ionicons name="pause" size={14} color={colors.text} />
                  </TouchableOpacity>
                )}

                {(item.status === 'paused' || item.status === 'waiting_for_internet') && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => DownloadService.resume(item.id)}
                    accessibilityLabel="Resume"
                  >
                    <Ionicons name="play" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                )}

                {item.status === 'failed' && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.warning,
                      },
                    ]}
                    onPress={() => DownloadService.retry(item.id)}
                    accessibilityLabel={t.common.retry}
                  >
                    <Ionicons name="refresh" size={14} color={colors.warning} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.surfaceVariant,
                      borderColor: colors.borderLight,
                    },
                  ]}
                  onPress={() => DownloadService.cancel(item.id)}
                  accessibilityLabel={t.common.clear}
                >
                  <Ionicons name="trash-outline" size={14} color={colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="cloud-download-outline"
            title={t.downloads.emptyTitle}
            subtitle={t.downloads.emptySubtitle}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  storage: {
    marginTop: 2,
    fontWeight: '500',
  },
  clearBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    marginBottom: Spacing.sm,
  },
  offlineText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  statusIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadInfo: {
    flex: 1,
  },
  downloadTitle: {
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'left',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statusBadgeText: {
    fontWeight: '600',
  },
  formatText: {
    fontWeight: '500',
  },
  downloadMeta: {
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: BorderRadius.xs,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  downloadActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
