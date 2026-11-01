import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScaledFont, useTranslation } from '../src/hooks';
import { Spacing, BorderRadius } from '../src/theme';

export default function AboutScreen() {
  const { colors, isDark } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [prayed, setPrayed] = useState(false);

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: "Sheikh's Islamic Learning App - Bunyan",
        message:
          "Seek authentic Islamic knowledge with the Sheikh's Islamic Learning App (Bunyan). 100% Free, no ads, offline downloads, and structured courses in Aqeedah, Tafsir, Hadith, Fiqh & Arabic.\n\nPlease keep the Sheikh and the Bunyan team in your prayers!",
      });
    } catch (e) {
      // Ignored
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: t.about.headerTitle,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerBackTitle: t.common.back,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <View style={[styles.bannerCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.arabicLogo, { color: colors.accentLight }]}>بُنْيَان</Text>
          <Text style={styles.bannerTitle}>{t.about.bannerTitle}</Text>
          <Text style={[styles.bannerSubtitle, { color: '#FFFFFFCC' }]}>
            {t.about.bannerSubtitle}
          </Text>
        </View>

        {/* Section 1: The Sheikh & Dua */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Ionicons name="heart-outline" size={18} color={colors.accent} />
            </View>
            <View style={styles.headerTextGroup}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text, fontSize: fonts.md, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.about.sheikhTitle}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.about.sheikhSubtitle}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.cardBody,
              { color: colors.textSecondary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            {t.about.sheikhBody}
          </Text>

          {/* Sincere Dua Box */}
          <View
            style={[
              styles.duaCard,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.borderLight,
                borderLeftColor: colors.accent,
              },
            ]}
          >
            <Text style={[styles.duaArabic, { color: colors.primary }]}>
              {t.about.duaText}
            </Text>
            <Text style={[styles.duaTranslation, { color: colors.textSecondary, fontSize: fonts.xs }]}>
              {t.about.duaTranslation}
            </Text>

            <TouchableOpacity
              style={[
                styles.prayButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: prayed ? colors.error : colors.borderLight,
                },
              ]}
              onPress={() => setPrayed(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={prayed ? 'heart' : 'heart-outline'}
                size={16}
                color={prayed ? colors.error : colors.accent}
              />
              <Text
                style={[
                  styles.prayButtonText,
                  { color: prayed ? colors.error : colors.primary },
                ]}
              >
                {prayed ? t.about.ameenDone : t.about.sayAmeen}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: The Courses & Curricula */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Ionicons name="book-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.headerTextGroup}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text, fontSize: fonts.md, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.about.curriculaTitle}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.about.curriculaSubtitle}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.cardBody,
              { color: colors.textSecondary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            <Text style={{ fontStyle: 'italic', fontWeight: '600' }}>
              {t.about.hadithKnowledgeQuote}
            </Text>{' '}
            {t.about.hadithKnowledgeSource}
          </Text>

          <Text
            style={[
              styles.cardBody,
              {
                color: colors.textSecondary,
                fontSize: fonts.sm,
                marginTop: 4,
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
          >
            {t.about.curriculaBody}
          </Text>

          {/* Features List */}
          <View style={styles.pillarList}>
            <View style={styles.pillarRow}>
              <Ionicons name="checkmark-outline" size={16} color={colors.primary} />
              <Text style={[styles.pillarText, { color: colors.text }]}>
                <Text style={{ fontWeight: '600' }}>{t.about.pillarCurricula} </Text>
                {t.about.pillarCurriculaDesc}
              </Text>
            </View>

            <View style={styles.pillarRow}>
              <Ionicons name="checkmark-outline" size={16} color={colors.primary} />
              <Text style={[styles.pillarText, { color: colors.text }]}>
                <Text style={{ fontWeight: '600' }}>{t.about.pillarOffline} </Text>
                {t.about.pillarOfflineDesc}
              </Text>
            </View>

            <View style={styles.pillarRow}>
              <Ionicons name="checkmark-outline" size={16} color={colors.primary} />
              <Text style={[styles.pillarText, { color: colors.text }]}>
                <Text style={{ fontWeight: '600' }}>{t.about.pillarResume} </Text>
                {t.about.pillarResumeDesc}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: What is Bunyan? */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Ionicons name="layers-outline" size={18} color={colors.accent} />
            </View>
            <View style={styles.headerTextGroup}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text, fontSize: fonts.md, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.about.bunyanTitle}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
              >
                {t.about.bunyanSubtitle}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.cardBody,
              { color: colors.textSecondary, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
            ]}
          >
            <Text style={{ fontStyle: 'italic', fontWeight: '600' }}>
              {t.about.hadithBunyanQuote}
            </Text>{' '}
            {t.about.hadithBunyanSource}
          </Text>

          <Text
            style={[
              styles.cardBody,
              {
                color: colors.textSecondary,
                fontSize: fonts.sm,
                marginTop: 4,
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
          >
            {t.about.bunyanBody}
          </Text>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
            onPress={handleShareApp}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>{t.about.shareBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* Replay Onboarding Button */}
        <TouchableOpacity
          style={[
            styles.replayBtn,
            { borderColor: colors.borderLight, backgroundColor: colors.surface },
          ]}
          onPress={() => router.push('/onboarding')}
          activeOpacity={0.75}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
          <Text style={[styles.replayBtnText, { color: colors.primary }]}>
            {t.about.walkthroughBtn}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  bannerCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  arabicLogo: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
  },
  cardSubtitle: {
    fontWeight: '500',
    marginTop: 1,
  },
  cardBody: {
    lineHeight: 20,
  },
  duaCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 3,
    gap: 6,
    marginTop: 4,
  },
  duaArabic: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  duaTranslation: {
    textAlign: 'center',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xs,
    paddingVertical: 8,
    marginTop: 4,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  prayButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillarList: {
    gap: 8,
    marginTop: 2,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pillarText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BorderRadius.xs,
    gap: 6,
    marginTop: 4,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
    marginTop: 2,
  },
  replayBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
