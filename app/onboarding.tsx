import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../src/store';
import { useTheme, useTranslation } from '../src/hooks';
import { Spacing, BorderRadius } from '../src/theme';
import { getWelcomeSlides, WelcomeSlide } from '../src/data/welcomeData';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useTranslation();
  const language = useSettingsStore(s => s.language);
  const slides = useMemo(() => getWelcomeSlides(language), [language]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayed, setPrayed] = useState(false);
  const flatListRef = useRef<FlatList<WelcomeSlide>>(null);
  const router = useRouter();
  const setOnboardingCompleted = useSettingsStore(s => s.setOnboardingCompleted);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: false });
      setCurrentIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: false });
      setCurrentIndex(prevIndex);
    }
  };

  const handleJumpToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      flatListRef.current?.scrollToIndex({ index, animated: false });
      setCurrentIndex(index);
    }
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const computedIndex = Math.round(offsetX / width);
    if (computedIndex >= 0 && computedIndex < totalSlides) {
      setCurrentIndex(computedIndex);
    }
  };

  const renderSlide = ({ item }: { item: WelcomeSlide; index: number }) => (
    <View style={[styles.slideContainer, { width }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category Badge */}
        <View
          style={[
            styles.badgeRow,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.arabicBadgeText, { color: colors.primary }]}>
            {item.arabicBadge}
          </Text>
          <View style={[styles.badgeDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
            {item.badge}
          </Text>
        </View>

        {/* Scholarly Hero Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Ionicons name={item.icon as any} size={36} color={colors.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

        {/* Classical Calligraphy Quote Card */}
        <View
          style={[
            styles.calligraphyCard,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.borderLight,
              borderLeftColor: colors.accent,
            },
          ]}
        >
          <Text style={[styles.arabicQuote, { color: colors.primary }]}>
            {item.arabicQuote}
          </Text>
          <Text style={[styles.quoteTranslation, { color: colors.textSecondary }]}>
            {item.quoteTranslation}
          </Text>
        </View>

        {/* Description Body */}
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {item.description}
        </Text>

        {/* SLIDE 1 (The Sheikhs): Sincere Dua Card */}
        {item.id === 'sheikhs' && item.duaCard && (
          <View
            style={[
              styles.specialBox,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.specialBoxHeader}>
              <Ionicons name="heart-outline" size={16} color={colors.accent} />
              <Text style={[styles.specialBoxTag, { color: colors.primary }]}>
                {item.duaCard.tag}
              </Text>
            </View>
            <Text style={[styles.duaArabic, { color: colors.primary }]}>
              {item.duaCard.arabic}
            </Text>
            <Text style={[styles.duaTranslation, { color: colors.textSecondary }]}>
              {item.duaCard.translation}
            </Text>

            <TouchableOpacity
              style={[
                styles.prayButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: prayed ? colors.error : colors.borderLight,
                },
              ]}
              onPress={() => setPrayed(prev => !prev)}
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
                {prayed ? item.duaCard.buttonActiveText : item.duaCard.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SLIDE 2 (The Courses): Core Disciplines Preview */}
        {item.id === 'courses' && item.curriculumCategories && (
          <View
            style={[
              styles.specialBox,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.specialBoxHeader}>
              <Ionicons name="library-outline" size={16} color={colors.primary} />
              <Text style={[styles.specialBoxTag, { color: colors.primary }]}>
                {language === 'ar'
                  ? 'العلوم الشرعية الأساسية في المنهج'
                  : language === 'am'
                  ? 'በስርዓተ-ትምህርቱ ውስጥ የተካተቱ ዋና ሳይንሶች'
                  : language === 'om'
                  ? "Barnoota Bu'uuraa Kharrii Keessatti"
                  : 'Core Disciplines in Curriculum'}
              </Text>
            </View>
            <View style={styles.categoryPillsGrid}>
              {item.curriculumCategories.map((cat, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.borderLight,
                    },
                  ]}
                >
                  <View style={[styles.categoryDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.categoryPillName, { color: colors.text }]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.categoryPillArabic, { color: colors.primary }]}>
                    {cat.arabic}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SLIDE 3 (Bunyan): Pillars Grid */}
        {item.id === 'bunyan' && item.pillars && (
          <View
            style={[
              styles.specialBox,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View style={styles.specialBoxHeader}>
              <Ionicons name="sparkles-outline" size={16} color={colors.accent} />
              <Text style={[styles.specialBoxTag, { color: colors.primary }]}>
                {language === 'ar'
                  ? 'أركان وركائز مبادرة بنيان'
                  : language === 'am'
                  ? 'የቡንያን መሰረታዊ ምሶሶዎች'
                  : language === 'om'
                  ? "Bu'uuraalee Masaraa Bunyaan"
                  : 'Foundations of Bunyan'}
              </Text>
            </View>
            <View style={styles.pillarsContainer}>
              {item.pillars.map((pillar, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.pillarItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.borderLight,
                    },
                  ]}
                >
                  <Ionicons name={pillar.icon as any} size={18} color={colors.accent} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pillarTitle, { color: colors.text }]}>
                      {pillar.title}
                    </Text>
                    <Text style={[styles.pillarSubtitle, { color: colors.textSecondary }]}>
                      {pillar.subtitle}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Highlights List on each slide */}
        <View style={styles.highlightsContainer}>
          {item.highlights.map((highlight, idx) => (
            <View
              key={idx}
              style={[
                styles.highlightRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <View
                style={[
                  styles.highlightIconBox,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.borderLight,
                  },
                ]}
              >
                <Ionicons name={highlight.icon as any} size={18} color={colors.accent} />
              </View>
              <View style={styles.highlightTextContainer}>
                <Text style={[styles.highlightTitle, { color: colors.text }]}>
                  {highlight.title}
                </Text>
                <Text style={[styles.highlightDescription, { color: colors.textSecondary }]}>
                  {highlight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.brandGroup}>
          <Text style={[styles.brandTitle, { color: colors.primary }]}>بُنْيَان</Text>
          <View style={[styles.stepCapsule, { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight }]}>
            <Text style={[styles.stepText, { color: colors.textSecondary }]}>
              {currentIndex + 1} / {totalSlides}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.skipBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.borderLight }]}
          onPress={completeOnboarding}
          activeOpacity={0.7}
          accessibilityLabel="Skip onboarding and go to lessons"
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>{t.onboarding.skip}</Text>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
          }, 50);
        }}
      />

      {/* Footer Controls */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.borderLight,
          },
        ]}
      >
        {/* Interactive Dots */}
        <View style={styles.dotsRow}>
          {slides.map((s, i) => {
            const isActive = i === currentIndex;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => handleJumpToSlide(i)}
                activeOpacity={0.7}
                style={[
                  styles.dotTouchTarget,
                  isActive && styles.activeDotTouchTarget,
                ]}
                accessibilityLabel={`Go to slide ${i + 1}: ${s.badge}`}
              >
                <View
                  style={[
                    styles.dot,
                    isActive
                      ? [styles.activeDot, { backgroundColor: colors.primary }]
                      : [styles.inactiveDot, { backgroundColor: colors.border }],
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              style={[
                styles.backBtn,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
              onPress={handleBack}
              activeOpacity={0.75}
              accessibilityLabel="Go back to previous slide"
            >
              <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={16} color={colors.text} />
              <Text style={[styles.backBtnText, { color: colors.text }]}>{t.onboarding.back}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtnSpacer} />
          )}

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: colors.primary },
              currentIndex === 0 ? styles.actionBtnFull : styles.actionBtnFlex,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
            accessibilityLabel={currentSlide.buttonLabel}
          >
            <Text style={styles.actionBtnText}>
              {currentIndex === totalSlides - 1
                ? t.onboarding.btnStart
                : currentSlide.nextStepTitle}
            </Text>
            <Ionicons
              name={
                currentIndex === totalSlides - 1
                  ? 'checkmark-outline'
                  : isRTL
                  ? 'arrow-back'
                  : 'arrow-forward'
              }
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stepCapsule: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.md,
    gap: 8,
  },
  arabicBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeDivider: {
    width: 1,
    height: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 28,
  },
  calligraphyCard: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 3,
    marginBottom: Spacing.md,
  },
  arabicQuote: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 6,
  },
  quoteTranslation: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  description: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  specialBox: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  specialBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 2,
  },
  specialBoxTag: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  duaArabic: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  duaTranslation: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
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
  categoryPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryPillName: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryPillArabic: {
    fontSize: 11,
    fontWeight: '600',
  },
  pillarsContainer: {
    gap: 6,
    marginTop: 2,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  pillarTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillarSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  highlightsContainer: {
    width: '100%',
    gap: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  highlightIconBox: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightTextContainer: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  highlightDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dotTouchTarget: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDotTouchTarget: {
    padding: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 20,
  },
  inactiveDot: {
    width: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtnSpacer: {
    width: 0,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  actionBtnFull: {
    flex: 1,
  },
  actionBtnFlex: {
    flex: 1,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
