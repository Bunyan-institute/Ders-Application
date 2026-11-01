import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { useSettingsStore, useLearningStore, useDownloadStore } from '../../src/store';
import { Spacing, BorderRadius } from '../../src/theme';
import { ThemeMode, TextSize, SupportedLanguage } from '../../src/types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const router = useRouter();
  const { t, language, setLanguage, isRTL } = useTranslation();

  const theme = useSettingsStore(s => s.theme);
  const textSize = useSettingsStore(s => s.textSize);
  const setTheme = useSettingsStore(s => s.setTheme);
  const setTextSize = useSettingsStore(s => s.setTextSize);
  const setOnboardingCompleted = useSettingsStore(s => s.setOnboardingCompleted);
  const clearLearning = useLearningStore(s => s.clearAll);
  const clearDownloads = useDownloadStore(s => s.clearAllDownloads);
  const clearCacheOnly = useDownloadStore(s => s.clearCacheOnly);
  const rawDownloads = useDownloadStore(s => s.downloads);

  const storageBreakdown = useMemo(() => {
    const completed = Object.values(rawDownloads).filter(d => d.status === 'completed');
    let audioBytes = 0;
    let pdfBytes = 0;

    completed.forEach(item => {
      const size = item.fileSize || item.downloadedBytes || 0;
      if (item.format === 'audio') {
        audioBytes += size;
      } else if (item.format === 'pdf') {
        pdfBytes += size;
      }
    });

    return {
      audioBytes,
      pdfBytes,
      totalBytes: audioBytes + pdfBytes,
      completedCount: completed.length,
    };
  }, [rawDownloads]);

  const languagesList: { label: string; value: SupportedLanguage }[] = [
    { label: t.settings.languages.ar, value: 'ar' },
    { label: t.settings.languages.en, value: 'en' },
    { label: t.settings.languages.am, value: 'am' },
    { label: t.settings.languages.om, value: 'om' },
  ];

  const themes: { label: string; value: ThemeMode }[] = [
    { label: t.settings.themeModes.light, value: 'light' },
    { label: t.settings.themeModes.dark, value: 'dark' },
    { label: t.settings.themeModes.system, value: 'system' },
  ];

  const textSizes: { label: string; value: TextSize }[] = [
    { label: t.settings.textSizes.small, value: 'small' },
    { label: t.settings.textSizes.medium, value: 'medium' },
    { label: t.settings.textSizes.large, value: 'large' },
  ];

  const handleClearCache = async () => {
    await clearCacheOnly();
    Alert.alert(t.settings.clearCacheSuccessTitle, t.settings.clearCacheSuccessDesc);
  };

  const handleClearData = () => {
    Alert.alert(
      t.settings.clearDataConfirmTitle,
      t.settings.clearDataConfirmDesc,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.clearAll,
          style: 'destructive',
          onPress: () => {
            clearLearning();
            clearDownloads();
            Alert.alert(t.common.done, t.settings.clearAllData);
          },
        },
      ]
    );
  };

  const handleReplayOnboarding = () => {
    setOnboardingCompleted(false);
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontSize: fonts.xl, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.title}
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.language}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.languageGrid}>
              {languagesList.map(item => {
                const isSelected = language === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.languageChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                        borderColor: isSelected ? colors.primary : colors.borderLight,
                      },
                    ]}
                    onPress={() => setLanguage(item.value)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark' : 'globe-outline'}
                      size={15}
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text,
                          fontSize: fonts.sm,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.appearance}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Text
              style={[
                styles.label,
                { color: colors.text, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
              ]}
            >
              {t.settings.theme}
            </Text>
            <View style={styles.optionRow}>
              {themes.map(item => {
                const isSelected = theme === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                        borderColor: isSelected ? colors.primary : colors.borderLight,
                      },
                    ]}
                    onPress={() => setTheme(item.value)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text,
                          fontSize: fonts.xs,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Text Size */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.textSize}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Text
              style={[
                styles.label,
                { color: colors.text, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
              ]}
            >
              {t.settings.textSize}
            </Text>
            <View style={styles.optionRow}>
              {textSizes.map(item => {
                const isSelected = textSize === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                        borderColor: isSelected ? colors.primary : colors.borderLight,
                      },
                    ]}
                    onPress={() => setTextSize(item.value)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text,
                          fontSize: fonts.xs,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text
              style={[
                styles.previewText,
                { color: colors.textSecondary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
              ]}
            >
              {t.settings.previewText}
            </Text>
          </View>
        </View>

        {/* Storage & Cache Management */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.storage}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {t.settings.audioStorage}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.xs }]}>
                {formatBytes(storageBreakdown.audioBytes)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {t.settings.pdfStorage}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.xs }]}>
                {formatBytes(storageBreakdown.pdfBytes)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.aboutRow}>
              <Text
                style={[
                  styles.aboutLabel,
                  { color: colors.textSecondary, fontSize: fonts.xs, fontWeight: '600' },
                ]}
              >
                {t.settings.totalStorage}
              </Text>
              <Text
                style={[
                  styles.aboutValue,
                  { color: colors.primary, fontSize: fonts.xs, fontWeight: '600' },
                ]}
              >
                {formatBytes(storageBreakdown.totalBytes)} ({storageBreakdown.completedCount})
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={[
                styles.storageActionBtn,
                { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight },
              ]}
              onPress={handleClearCache}
              activeOpacity={0.75}
            >
              <Ionicons name="sparkles-outline" size={15} color={colors.accent} />
              <Text style={[styles.storageActionText, { color: colors.text, fontSize: fonts.xs }]}>
                {t.settings.clearCacheBtn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* General Menu */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.general}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/about')} activeOpacity={0.75}>
              <Ionicons name="heart-outline" size={18} color={colors.accent} />
              <Text
                style={[
                  styles.menuText,
                  { color: colors.text, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.settings.aboutMenu}
              </Text>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/admin')} activeOpacity={0.75}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
              <Text
                style={[
                  styles.menuText,
                  { color: colors.text, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.settings.adminMenu}
              </Text>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuRow} onPress={handleReplayOnboarding} activeOpacity={0.75}>
              <Ionicons name="refresh-outline" size={18} color={colors.icon} />
              <Text
                style={[
                  styles.menuText,
                  { color: colors.text, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.settings.walkthroughMenu}
              </Text>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity style={styles.menuRow} onPress={handleClearData} activeOpacity={0.75}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text
                style={[
                  styles.menuText,
                  { color: colors.error, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.settings.clearAllData}
              </Text>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Info */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.settings.aboutSection}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {t.settings.version}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.xs }]}>1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {t.settings.content}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.xs }]}>
                {t.settings.contentFree}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary, fontSize: fonts.xs }]}>
                {t.settings.privacy}
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text, fontSize: fonts.xs }]}>
                {t.settings.privacyText}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.md,
  },
  label: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontWeight: '600',
  },
  previewText: {
    lineHeight: 20,
    marginTop: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  menuText: {
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  aboutLabel: {},
  aboutValue: {
    fontWeight: '500',
  },
  storageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
    marginTop: Spacing.xs,
  },
  storageActionText: {
    fontWeight: '600',
  },
});
