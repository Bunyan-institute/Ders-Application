import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont, useTranslation } from '../hooks';
import { Spacing, BorderRadius } from '../theme';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  localFileUri?: string;
  isDownloaded?: boolean;
  isDownloading?: boolean;
  onDownload?: () => void;
  height?: number;
}

// In-memory session cache of successfully opened PDFs
const sessionPdfCache = new Set<string>();

export function PdfViewer({
  pdfUrl,
  title,
  localFileUri,
  isDownloaded = false,
  isDownloading = false,
  onDownload,
  height = 560,
}: PdfViewerProps) {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If already in session cache, do not show blocking loader
  const effectiveSource = isDownloaded && localFileUri ? localFileUri : pdfUrl;
  const isCached = sessionPdfCache.has(effectiveSource);
  const [isLoading, setIsLoading] = useState(!isCached);

  useEffect(() => {
    setHasError(false);
    if (!sessionPdfCache.has(effectiveSource)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [effectiveSource]);

  const handleDocumentLoaded = () => {
    setIsLoading(false);
    sessionPdfCache.add(effectiveSource);
  };

  const handleOpenExternal = () => {
    if (effectiveSource) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(effectiveSource, '_blank', 'noopener,noreferrer');
      } else {
        Linking.openURL(effectiveSource).catch(err => {
          console.warn('Failed to open PDF URL:', err);
        });
      }
    }
  };

  const viewerHeight = isExpanded ? 780 : height;

  // Stream directly with page-1 view parameter to avoid downloading entire document upfront
  const iframeSrc = useGoogleViewer
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(effectiveSource)}&embedded=true`
    : `${effectiveSource}#page=1&view=FitH&pagemode=none&scrollbar=1&toolbar=1`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Top Header Bar */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.pdfBadge, { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight }]}>
            <Ionicons name="document-text-outline" size={13} color={colors.primary} />
            <Text style={[styles.pdfBadgeText, { color: colors.primary }]}>{t.pdfViewer.badge}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text, writingDirection: 'rtl' }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {isDownloaded ? t.pdfViewer.offlineSubtitle : t.pdfViewer.onlineSubtitle}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Download PDF Button */}
          {onDownload && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDownloaded ? colors.success + '15' : colors.surfaceVariant,
                  borderColor: isDownloaded ? colors.success : colors.border,
                },
              ]}
              onPress={onDownload}
              activeOpacity={0.7}
              accessibilityLabel="Download PDF"
            >
              <Ionicons
                name={isDownloaded ? 'checkmark-circle' : isDownloading ? 'arrow-down-circle' : 'cloud-download-outline'}
                size={15}
                color={isDownloaded ? colors.success : colors.text}
              />
              <Text style={[styles.actionBtnText, { color: isDownloaded ? colors.success : colors.text }]}>
                {isDownloaded ? t.pdfViewer.saved : isDownloading ? t.pdfViewer.downloading : t.pdfViewer.download}
              </Text>
            </TouchableOpacity>
          )}

          {/* Viewer Mode Toggle on Web */}
          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
              onPress={() => {
                setIsLoading(true);
                setUseGoogleViewer(prev => !prev);
              }}
              activeOpacity={0.7}
              accessibilityLabel="Toggle PDF viewer engine"
            >
              <Ionicons name="sync-outline" size={13} color={colors.text} />
              <Text style={[styles.actionBtnText, { color: colors.text }]}>
                {useGoogleViewer ? t.pdfViewer.fastStream : t.pdfViewer.gdocs}
              </Text>
            </TouchableOpacity>
          )}

          {/* Open in full external tab */}
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={handleOpenExternal}
            activeOpacity={0.7}
            accessibilityLabel="Open PDF in new tab or external reader"
          >
            <Ionicons name="open-outline" size={16} color={colors.text} />
          </TouchableOpacity>

          {/* Expand / Collapse Height on Web */}
          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => setIsExpanded(prev => !prev)}
              activeOpacity={0.7}
              accessibilityLabel="Toggle reader height"
            >
              <Ionicons name={isExpanded ? 'contract-outline' : 'expand-outline'} size={16} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main PDF Content View */}
      {Platform.OS === 'web' ? (
        <View style={[styles.frameContainer, { height: viewerHeight, backgroundColor: isDark ? '#1a1a1a' : '#525659' }]}>
          {isLoading && !hasError && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: '#E0E0E0' }]}>
                {t.pdfViewer.loadingPageOne}
              </Text>
            </View>
          )}

          {hasError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
              <Text style={[styles.errorTitle, { color: colors.text }]}>
                {t.pdfViewer.errorTitle}
              </Text>
              <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
                {t.pdfViewer.errorSubtitle}
              </Text>
              <View style={styles.errorBtnRow}>
                <TouchableOpacity
                  style={[styles.retryBtn, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    setHasError(false);
                    setIsLoading(true);
                  }}
                >
                  <Text style={styles.retryBtnText}>{t.pdfViewer.retry}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.retryBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderWidth: 1 }]}
                  onPress={handleOpenExternal}
                >
                  <Text style={[styles.retryBtnText, { color: colors.text }]}>{t.pdfViewer.openBrowser}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            React.createElement('iframe', {
              key: iframeSrc,
              src: iframeSrc,
              style: {
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'transparent',
              },
              onLoad: handleDocumentLoaded,
              onError: () => {
                setIsLoading(false);
                setHasError(true);
              },
              title: title,
            })
          )}
        </View>
      ) : (
        /* Mobile Native Document View */
        <View style={[styles.mobileCard, { backgroundColor: colors.surfaceVariant }]}>
          <View style={[styles.mobileCardIcon, { backgroundColor: colors.surface }]}>
            <Ionicons name="book-outline" size={44} color={colors.primary} />
          </View>
          <Text style={[styles.mobileCardTitle, { color: colors.text, writingDirection: 'rtl' }]}>
            {title}
          </Text>
          <Text style={[styles.mobileCardSubtitle, { color: colors.textSecondary }]}>
            {isDownloaded
              ? 'الكتاب محفوظ محلياً على جهازك ومتاح للقراءة دون اتصال بالإنترنت.'
              : 'النص الأصلي الكامل مع الضبط بالشكل والتعليقات المعتمدة.'}
          </Text>

          <View style={styles.mobileActionsRow}>
            <TouchableOpacity
              style={[styles.mobileOpenBtn, { backgroundColor: colors.primary }]}
              onPress={handleOpenExternal}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={17} color="#FFFFFF" />
              <Text style={styles.mobileOpenBtnText}>قراءة الكتاب (Full Screen)</Text>
            </TouchableOpacity>

            {onDownload && (
              <TouchableOpacity
                style={[
                  styles.mobileDownloadBtn,
                  {
                    borderColor: isDownloaded ? colors.success : colors.border,
                    backgroundColor: isDownloaded ? colors.success + '15' : colors.surface,
                  },
                ]}
                onPress={onDownload}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isDownloaded ? 'checkmark-circle' : 'cloud-download-outline'}
                  size={17}
                  color={isDownloaded ? colors.success : colors.text}
                />
                <Text
                  style={[
                    styles.mobileDownloadBtnText,
                    { color: isDownloaded ? colors.success : colors.text },
                  ]}
                >
                  {isDownloaded ? 'تم الحفظ' : 'تحميل PDF'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Reader Hint Footer */}
      <View style={[styles.footerHint, { borderTopColor: colors.border }]}>
        <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
        <Text style={[styles.footerHintText, { color: colors.textSecondary }]}>
          يتم تحميل الصفحة الأولى فوراً. يستمر مشغل الصوت في العمل أسفل الشاشة أثناء القراءة.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  pdfBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    width: '100%',
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: 8,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 8,
  },
  errorBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  mobileCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  mobileCardIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  mobileCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  mobileCardSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 340,
    marginBottom: 8,
  },
  mobileActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mobileOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  mobileOpenBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  mobileDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  mobileDownloadBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  footerHintText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
