import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useScaledFont, useTranslation } from '../../src/hooks';
import { courses, lessons, categories } from '../../src/data/mockData';
import { EmptyState } from '../../src/components';
import { Spacing, BorderRadius } from '../../src/theme';

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: 'course' | 'lesson' | 'category';
  icon: string;
};

const MULTILINGUAL_SEARCH_MAP: Record<string, string[]> = {
  'crs-1': [
    'riyadus saliheen', 'riyad us saliheen', 'hadith', 'sheikh muhammed ferej', 'ferej', 'africa tv',
    'ሪያዱ ሷሊሂን', 'ሀዲስ', 'ሸይኽ ሙሐመድ ፈረጅ', 'ሙሐመድ ፈረጅ', 'ስነ-ምግባር', 'አፍሪካ ቲቪ',
    'riyaadus saalihiin', 'hadiisa', 'sheekh muhaammad faraj', 'faraj', 'akhlaaqa',
  ],
  'crs-2': [
    'usool', 'usul', 'thalatha', 'three principles', 'aqeedah', 'fundamentals',
    'ኡሱል', 'ሰላሰቱል ኡሱል', 'ሶስቱ መሰረቶች', 'አቂዳ',
    'usuula', "bu'uura sadan", 'salaasatul usuul', 'aqiidaa',
  ],
  'crs-3': [
    'qawaid', 'four principles', 'four rules', 'qawaid arbaa', 'aqeedah',
    'ቀዋዒድ', 'አልቀዋዒዱል አርበዓ', 'አራቱ ህጎች', 'መርሆዎች', 'አቂዳ',
    "qawaa'ida", 'qajeelfama afuran', "qawaa'idul arba'aa",
  ],
  'crs-4': [
    'hadith', 'nawawi', '40 hadith', 'forty hadith', 'arbaeen', 'arbaun',
    'ሐዲስ', 'ነወዊ', 'አርበዒን', 'አርባ ሐዲሶች', 'አርባኢን',
    'hadiisa', 'nawawii', "arba'iin", 'hadiisa 40',
  ],
  'crs-5': [
    'shuroot', 'conditions of prayer', 'salah', 'pillars of prayer', 'fiqh', 'prayer obligations',
    'ሹሩጡ ሰላት', 'ሶላት', 'ሰላት', 'የሰላት መስፈርቶች', 'ፊቅህ', 'ኢባዳ',
    'ulaagaalee salaataa', 'shuruuxu salaat', 'salaata', 'sagada', 'fiqhii',
  ],
  'crs-6': [
    'safinah', 'safinat an-najah', 'ship of salvation', 'fiqh', 'taharah', 'worship',
    'ሰፊና', 'ሰፊነቱ ነጃህ', 'የመዳኛ መርከብ', 'ፊቅህ', 'ጦሀራ', 'ሰላት',
    'doonii nagaa', 'safiinaa', 'safiinatu najaah', 'fiqhii', 'qulqullina',
  ],
  'crs-7': [
    'tanbihat', 'women rulings', 'believing women', 'fiqh', 'fawzan', 'hijab', 'family',
    'ተንቢሓት', 'ተንቢሃት', 'የሴቶች ህግጋት', 'ፊቅህ', 'ሂጃብ', 'ፈውዛን', 'የሴቶች ኪታብ',
    'tanbihaata', 'seera dubartootaa', 'fiqhii', 'tanbiihaat', 'hijaaba',
  ],
};

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase();
}

export default function SearchScreen() {
  const { colors } = useTheme();
  const fonts = useScaledFont();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return [];
    const qRaw = query.trim().toLowerCase();
    const qNorm = normalizeArabic(qRaw);
    const found: SearchResult[] = [];

    // 1. Search Categories (with translated names)
    categories.forEach(c => {
      const loc = t.categories[c.id];
      const match =
        normalizeArabic(c.name).includes(qNorm) ||
        (loc && (loc.name.toLowerCase().includes(qRaw) || loc.description.toLowerCase().includes(qRaw))) ||
        (c.arabicName && normalizeArabic(c.arabicName).includes(qNorm)) ||
        c.description.toLowerCase().includes(qRaw);

      if (match) {
        found.push({
          id: c.id,
          title: loc?.name || c.name,
          subtitle: loc?.description || c.description,
          type: 'category',
          icon: 'folder-outline',
        });
      }
    });

    // 2. Search Courses / Kitabs (multilingual terms)
    courses.forEach(c => {
      const translits = MULTILINGUAL_SEARCH_MAP[c.id] || [];
      const match =
        normalizeArabic(c.title).includes(qNorm) ||
        normalizeArabic(c.description).includes(qNorm) ||
        normalizeArabic(c.instructor).includes(qNorm) ||
        translits.some(term => term.toLowerCase().includes(qRaw) || qRaw.includes(term.toLowerCase()));

      if (match) {
        found.push({
          id: c.id,
          title: c.title,
          subtitle: `${c.instructor} · ${t.common.lessonsCount(c.totalLessons)}`,
          type: 'course',
          icon: 'book-outline',
        });
      }
    });

    // 3. Search Lessons
    lessons.forEach(l => {
      const match =
        normalizeArabic(l.title).includes(qNorm) ||
        normalizeArabic(l.description).includes(qNorm) ||
        l.title.toLowerCase().includes(qRaw);

      if (match) {
        found.push({
          id: l.id,
          title: l.title,
          subtitle: l.type === 'audio' ? t.search.lessonAudioBadge : t.search.lessonPdfBadge,
          type: 'lesson',
          icon: l.type === 'audio' ? 'mic-outline' : 'document-text-outline',
        });
      }
    });

    return found.slice(0, 30);
  }, [query, t]);

  const handlePress = useCallback((item: SearchResult) => {
    if (item.type === 'category') router.push(`/category/${item.id}`);
    else if (item.type === 'course') router.push(`/course/${item.id}`);
    else router.push(`/lesson/${item.id}`);
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
          {t.search.title}
        </Text>
      </View>

      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Ionicons name="search-outline" size={18} color={colors.icon} />
        <TextInput
          style={[
            styles.input,
            { color: colors.text, fontSize: fonts.md, textAlign: isRTL ? 'right' : 'left' },
          ]}
          placeholder={t.search.inputPlaceholder}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultRow, { borderColor: colors.borderLight }]}
            onPress={() => handlePress(item)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.resultIcon,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Ionicons name={item.icon as any} size={18} color={colors.primary} />
            </View>
            <View style={styles.resultInfo}>
              <Text
                style={[
                  styles.resultTitle,
                  { color: colors.text, fontSize: fonts.sm, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.resultSubtitle,
                  { color: colors.textSecondary, fontSize: fonts.xs, writingDirection: isRTL ? 'rtl' : 'ltr' },
                ]}
                numberOfLines={1}
              >
                {item.subtitle}
              </Text>
            </View>
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => `${item.type}-${item.id}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          query.length >= 2 ? (
            <EmptyState
              icon="search-outline"
              title={t.search.noResultsTitle}
              subtitle={t.search.noResultsSubtitle(query)}
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title={t.search.emptyQueryTitle}
              subtitle={t.search.emptyQuerySubtitle}
            />
          )
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
    paddingBottom: Spacing.sm,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 2,
  },
  resultSubtitle: {
    textAlign: 'left',
  },
});
