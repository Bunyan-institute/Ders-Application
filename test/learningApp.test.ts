import './setup';
import { describe, it, expect } from 'bun:test';
import { categories, courses, lessons, getCoursesByCategory, getLessonsByCourse } from '../src/data/mockData';
import { useLearningStore, useDownloadStore, useSettingsStore, useAdminStore } from '../src/store';
import { DownloadService } from '../src/services/downloadService';
import { scale, moderateScale, FontSize } from '../src/theme/spacing';

describe("Sheikh's Islamic Learning App Core Tests", () => {
  it('loads all core categories correctly', () => {
    expect(categories.length).toBe(3);
    const names = categories.map(c => c.name);
    expect(names).toContain('العقيدة');
    expect(names).toContain('الحديث');
    expect(names).toContain('الفقه');
  });

  it('filters courses by category and lessons by course', () => {
    const aqeedahCourses = getCoursesByCategory('cat-1');
    expect(aqeedahCourses.length).toBeGreaterThan(0);

    const firstCourseLessons = getLessonsByCourse(aqeedahCourses[0].id);
    expect(firstCourseLessons.length).toBe(aqeedahCourses[0].totalLessons);
  });

  it('calculates course progress and continue learning properly', () => {
    const learningStore = useLearningStore.getState();

    learningStore.saveProgress('crs-1-les-1', 'crs-1', 300, 1200);
    const progress = useLearningStore.getState().getProgress('crs-1-les-1');
    expect(progress?.status).toBe('in_progress');
    expect(progress?.lastPositionSeconds).toBe(300);

    const continueList = useLearningStore.getState().getContinueLearning();
    expect(continueList.length).toBeGreaterThan(0);
    expect(continueList[0].lessonId).toBe('crs-1-les-1');

    learningStore.markCompleted('crs-1-les-1', 'crs-1', 1200);
    const updated = useLearningStore.getState().getProgress('crs-1-les-1');
    expect(updated?.status).toBe('completed');

    const courseProgress = useLearningStore.getState().getCourseProgress('crs-1', 12);
    expect(courseProgress.completed).toBe(1);
    expect(courseProgress.percentage).toBe(Math.round((1 / 12) * 100));
  });

  it('toggles bookmarks reliably', () => {
    const learningStore = useLearningStore.getState();
    expect(learningStore.isBookmarked('crs-3-les-1')).toBe(false);

    learningStore.toggleBookmark('crs-3-les-1', 'crs-3');
    expect(useLearningStore.getState().isBookmarked('crs-3-les-1')).toBe(true);

    learningStore.toggleBookmark('crs-3-les-1', 'crs-3');
    expect(useLearningStore.getState().isBookmarked('crs-3-les-1')).toBe(false);
  });

  it('handles download lifecycle: pause, resume, retry, cancel, and storage math', async () => {
    const downloadStore = useDownloadStore.getState();
    downloadStore.clearAllDownloads();

    const sampleLesson = lessons[0];
    DownloadService.downloadLesson(sampleLesson, 'audio');

    const downloads = useDownloadStore.getState().getAllDownloads();
    expect(downloads.length).toBe(1);
    expect(downloads[0].lessonId).toBe(sampleLesson.id);
    expect(downloads[0].format).toBe('audio');
    expect(downloads[0].status).toBe('downloading');

    // 1. Test Pause
    DownloadService.pause(downloads[0].id);
    expect(useDownloadStore.getState().downloads[downloads[0].id].status).toBe('paused');

    // 2. Test Resume
    DownloadService.resume(downloads[0].id);
    expect(useDownloadStore.getState().downloads[downloads[0].id].status).toBe('downloading');

    // 3. Test Offline Network Loss transition to 'waiting_for_internet'
    DownloadService.setNetworkStateForTesting(false);
    expect(useDownloadStore.getState().downloads[downloads[0].id].status).toBe('waiting_for_internet');

    // 4. Test Network Restore auto-resumes
    DownloadService.setNetworkStateForTesting(true);
    expect(useDownloadStore.getState().downloads[downloads[0].id].status).toBe('downloading');

    // 5. Simulate Complete and Storage Breakdown
    useDownloadStore.getState().completeDownload(downloads[0].id, 'file:///offline/test.mp3', 25000000);
    const completed = useDownloadStore.getState().getDownloadByLessonId(sampleLesson.id);
    expect(completed?.status).toBe('completed');
    expect(completed?.downloadedBytes).toBe(25000000);

    const breakdown = useDownloadStore.getState().getStorageBreakdown();
    expect(breakdown.audioBytes).toBe(25000000);
    expect(breakdown.totalBytes).toBe(25000000);
    expect(breakdown.completedCount).toBe(1);

    // 6. Test Clear Cache Only preserves completed downloads
    await useDownloadStore.getState().clearCacheOnly();
    expect(useDownloadStore.getState().downloads[downloads[0].id]).toBeDefined();

    // 7. Test Cancel removes download
    DownloadService.cancel(downloads[0].id);
    expect(useDownloadStore.getState().downloads[downloads[0].id]).toBeUndefined();
  });

  it('calculates font scaling and small-device dimensions correctly', () => {
    const settings = useSettingsStore.getState();
    settings.setTextSize('large');
    expect(useSettingsStore.getState().fontScale).toBe(1.2);

    settings.setTextSize('small');
    expect(useSettingsStore.getState().fontScale).toBe(0.85);

    expect(scale(16)).toBeGreaterThan(0);
    expect(moderateScale(16)).toBeGreaterThan(0);
  });

  it('validates admin analytics and CSV export with Arabic titles', () => {
    const admin = useAdminStore.getState();
    expect(admin.unlockAdmin('wrong')).toBe(false);
    expect(admin.unlockAdmin('1234')).toBe(true);

    const csv = admin.exportReportCsv();
    expect(csv).toContain('Course Title');
    expect(csv).toContain('شَرْحُ رِيَاضِ الصَّالِحِينَ');
    expect(csv).toContain('Total Registered Learners');
  });

  it('validates Arabic-only kitab titles across all courses without English transliterations', () => {
    expect(courses.length).toBe(7);
    courses.forEach(course => {
      // Must not contain English words like 'Kitab' or 'Foundations' in the title
      expect(course.title).not.toMatch(/[a-zA-Z]/);
      expect(course.title.length).toBeGreaterThan(0);
    });

    // Check all 7 authentic Kitab titles
    expect(courses[0].title).toBe('شَرْحُ رِيَاضِ الصَّالِحِينَ (ሪያዱ ሷሊሂን)');
    expect(courses[1].title).toBe('ثَلَاثَةُ الأُصُولِ وَأَدِلَّتُهَا');
    expect(courses[2].title).toBe('القَوَاعِدُ الأَرْبَعُ');
    expect(courses[3].title).toBe('الأَرْبَعُونَ النَّوَوِيَّةُ');
    expect(courses[4].title).toBe('شُرُوطُ الصَّلَاةِ وَأَرْكَانُهَا وَوَاجِبَاتُهَا');
    expect(courses[5].title).toBe('سَفِينَةُ النَّجَاةِ وَسَفِينَةُ الصَّلَاةِ');
    expect(courses[6].title).toBe('تَنْبِيهَاتٌ عَلَى أَحْكَامٍ تَخْتَصُّ بِالمُؤْمِنَاتِ');
  });

  it('validates exactly 3 welcome pages covering Bunyan (who built it), The App (what it is), and The Sheikhs (who the Sheikh is)', async () => {
    const { welcomeSlides, getWelcomeSlides } = await import('../src/data/welcomeData');
    expect(welcomeSlides.length).toBe(3);

    // Page 1: Bunyan (Who built it)
    const bunyanSlide = welcomeSlides[0];
    expect(bunyanSlide.id).toBe('bunyan');
    expect(bunyanSlide.title).toContain('Bunyan');
    expect(bunyanSlide.badge).toContain('Bunyan');
    expect(bunyanSlide.arabicBadge).toBe('مَنْ بَنَاهَا');
    expect(bunyanSlide.pillars).toBeDefined();
    expect(bunyanSlide.pillars?.length).toBe(3);
    expect(bunyanSlide.highlights.some(h => h.title.includes('Sadaqah Jariyah'))).toBe(true);
    expect(bunyanSlide.buttonLabel).toBe('Continue to The App');

    // Page 2: The Courses & App (What the app is)
    const coursesSlide = welcomeSlides[1];
    expect(coursesSlide.id).toBe('courses');
    expect(coursesSlide.title).toContain('App');
    expect(coursesSlide.arabicBadge).toBe('مَنَاهِجُ الدِّرَاسَةِ');
    expect(coursesSlide.curriculumCategories).toBeDefined();
    expect(coursesSlide.curriculumCategories?.length).toBe(3);
    expect(coursesSlide.highlights.some(h => h.title.includes('Offline'))).toBe(true);
    expect(coursesSlide.buttonLabel).toBe('Continue to The Sheikh');

    // Page 3: The Sheikhs (Who the Sheikh is & Dua -> Start Seeking Knowledge)
    const sheikhsSlide = welcomeSlides[2];
    expect(sheikhsSlide.id).toBe('sheikhs');
    expect(sheikhsSlide.title).toContain('Sheikh');
    expect(sheikhsSlide.badge).toContain('Sheikh');
    expect(sheikhsSlide.arabicBadge).toBe('ادْعُوا لِلشَّيْخِ');
    expect(sheikhsSlide.duaCard).toBeDefined();
    expect(sheikhsSlide.duaCard?.arabic).toContain('اللَّهُمَّ اغْفِرْ لَهُ');
    expect(sheikhsSlide.duaCard?.buttonText).toContain('Say Ameen');
    expect(sheikhsSlide.highlights.length).toBeGreaterThanOrEqual(3);
    expect(sheikhsSlide.buttonLabel).toBe('Start Seeking Knowledge');

    // Verify all 4 languages preserve the exact 3-step narrative order
    (['ar', 'en', 'am', 'om'] as const).forEach(lang => {
      const slides = getWelcomeSlides(lang);
      expect(slides.length).toBe(3);
      expect(slides[0].id).toBe('bunyan');
      expect(slides[1].id).toBe('courses');
      expect(slides[2].id).toBe('sheikhs');
      expect(slides[2].duaCard).toBeDefined();
    });
  });

  it('manages onboarding completion state in settings store', () => {
    const settings = useSettingsStore.getState();
    
    // Set completed
    settings.setOnboardingCompleted(true);
    expect(useSettingsStore.getState().onboardingCompleted).toBe(true);

    // Can be reset to replay onboarding
    settings.setOnboardingCompleted(false);
    expect(useSettingsStore.getState().onboardingCompleted).toBe(false);

    // Set back to completed
    settings.setOnboardingCompleted(true);
    expect(useSettingsStore.getState().onboardingCompleted).toBe(true);
  });

  it('verifies Cloudflare R2 integration and dual (audio & PDF) download resolution', async () => {
    const { getR2Url, CLOUDFLARE_R2_CONFIG } = await import('../src/config/cloudflare');
    expect(CLOUDFLARE_R2_CONFIG.bucketName).toBe('sheikhs-learning');
    expect(CLOUDFLARE_R2_CONFIG.publicUrl).toContain('r2.dev');

    const testUrl = getR2Url('kitabu-tawhid/lesson-01.mp3');
    expect(testUrl).toBe('https://pub-fef6f759612f4507b40841db6e61c2f4.r2.dev/kitabu-tawhid/lesson-01.mp3');

    // Verify Tawheed lessons use R2 URLs
    const tawheedLesson = lessons.find(l => l.courseId === 'crs-1');
    expect(tawheedLesson).toBeDefined();
    expect(tawheedLesson?.mediaUrl).toContain('r2.dev/kitabu-tawhid');
    expect(tawheedLesson?.pdfUrl).toContain('r2.dev/kitabu-tawhid/lesson-01.pdf');

    // Download both audio and PDF for lesson 1
    const downloadStore = useDownloadStore.getState();
    downloadStore.clearAllDownloads();

    if (tawheedLesson) {
      DownloadService.downloadLesson(tawheedLesson, 'audio');
      DownloadService.downloadLesson(tawheedLesson, 'pdf');

      const allDownloads = useDownloadStore.getState().getAllDownloads();
      expect(allDownloads.length).toBe(2);

      const audioDl = allDownloads.find(d => d.format === 'audio');
      const pdfDl = allDownloads.find(d => d.format === 'pdf');
      expect(audioDl).toBeDefined();
      expect(pdfDl).toBeDefined();
    }
  });

  it('validates complete 32-lesson curriculum path for Kitab At-Tawheed', () => {
    const tawheedLessons = getLessonsByCourse('crs-1');
    expect(tawheedLessons.length).toBe(32);

    tawheedLessons.forEach((lesson, index) => {
      const lessonNum = String(index + 1).padStart(2, '0');
      expect(lesson.audioOnlyUrl).toContain(`kitabu-tawhid/lesson-${lessonNum}.mp3`);
      expect(lesson.duration).toBeGreaterThan(0);
      expect(lesson.title).toContain(`الدرس ${index + 1}:`);
    });

    // ALL 32 Kitab At-Tawheed lessons must have the PDF study text openable by default
    tawheedLessons.forEach((lesson) => {
      expect(lesson.pdfUrl).toContain('kitabu-tawhid/lesson-01.pdf');
    });
  });

  it('verifies audio player hook, seekable progress bar, and pdf viewer export availability', async () => {
    const { useAudioPlayer } = await import('../src/hooks');
    expect(typeof useAudioPlayer).toBe('function');

    const { PdfViewer, SeekableProgressBar, KitabCover } = await import('../src/components');
    expect(PdfViewer).toBeDefined();
    expect(SeekableProgressBar).toBeDefined();
    expect(KitabCover).toBeDefined();
  });

  it('validates comprehensive 4-language multilingual translations (ar, en, am, om)', async () => {
    const { translations, getWelcomeSlides } = await import('../src/i18n');
    const { useSettingsStore } = await import('../src/store');

    const supportedLangs = ['ar', 'en', 'am', 'om'] as const;

    supportedLangs.forEach(lang => {
      const dict = translations[lang];
      expect(dict).toBeDefined();

      // Check Tabs
      expect(dict.tabs.home).toBeTruthy();
      expect(dict.tabs.search).toBeTruthy();
      expect(dict.tabs.downloads).toBeTruthy();
      expect(dict.tabs.bookmarks).toBeTruthy();
      expect(dict.tabs.settings).toBeTruthy();

      // Check Course & Lesson
      expect(dict.course.downloadAll).toBeTruthy();
      expect(dict.course.lessonsHeader).toBeTruthy();
      expect(dict.lesson.pdfTab).toBeTruthy();
      expect(dict.lesson.notesTab).toBeTruthy();

      // Check PdfViewer & About
      expect(dict.pdfViewer.badge).toBeTruthy();
      expect(dict.about.bannerTitle).toBeTruthy();
      expect(dict.about.sheikhTitle).toBeTruthy();

      // Check Welcome Slides for each language: 1. bunyan, 2. courses, 3. sheikhs
      const slides = getWelcomeSlides(lang);
      expect(slides.length).toBe(3);
      expect(slides[0].id).toBe('bunyan');
      expect(slides[1].id).toBe('courses');
      expect(slides[2].id).toBe('sheikhs');
      expect(slides[0].badge).toBeTruthy();
      expect(slides[1].badge).toBeTruthy();
      expect(slides[2].badge).toBeTruthy();
    });

    // Verify settings store language switcher
    useSettingsStore.getState().setLanguage('am');
    expect(useSettingsStore.getState().language).toBe('am');

    useSettingsStore.getState().setLanguage('om');
    expect(useSettingsStore.getState().language).toBe('om');

    useSettingsStore.getState().setLanguage('ar');
    expect(useSettingsStore.getState().language).toBe('ar');
  });
});
