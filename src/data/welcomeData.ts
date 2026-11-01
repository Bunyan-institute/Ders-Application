import { SupportedLanguage } from '../types';

export interface WelcomeHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface WelcomeCategoryPreview {
  name: string;
  arabic: string;
  color: string;
}

export interface WelcomePillar {
  title: string;
  subtitle: string;
  icon: string;
}

export interface WelcomeSlide {
  id: 'bunyan' | 'courses' | 'sheikhs';
  badge: string;
  arabicBadge: string;
  icon: string;
  title: string;
  arabicQuote: string;
  quoteTranslation: string;
  description: string;
  highlightColor: string;
  accentColor: string;
  buttonLabel: string;
  nextStepTitle: string;
  highlights: WelcomeHighlight[];
  duaCard?: {
    tag: string;
    arabic: string;
    translation: string;
    buttonText: string;
    buttonActiveText: string;
  };
  curriculumCategories?: WelcomeCategoryPreview[];
  pillars?: WelcomePillar[];
}

export function getWelcomeSlides(lang: SupportedLanguage = 'ar'): WelcomeSlide[] {
  switch (lang) {
    case 'ar':
      return [
        {
          id: 'bunyan',
          badge: 'مُبَادَرَةُ بُنْيَان',
          arabicBadge: 'مَنْ بَنَاهَا',
          icon: 'layers-outline',
          title: 'بُنْيَان: حِصْنٌ رَقْمِيٌّ لِنَشْرِ العِلْمِ النَّافِعِ',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: 'حديث شريف في صحيحي البخاري ومسلم.',
          description:
            'مبادرة بنيان مشروع وقفي تقني غير ربحي، صُمم بأيدي أبناء الأمة لجمع التراث العلمي الأصيل وتيسيره للجميع بأحدث التقنيات مجاناً 100% ودون أي إعلانات لوجه الله تعالى كصدقة جارية.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'الانتقال إلى محتوى التطبيق',
          nextStepTitle: 'التالي: ما هو التطبيق',
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% وقف خيري · صدقة جارية',
              description: 'تطبيق مجاني خالص لوجه الله تعالى دون أي إعلانات أو رسوم إطلاقاً.',
            },
            {
              icon: 'shield-checkmark-outline',
              title: 'حصن رقمي للأمة',
              description: 'حفظ التراث الإسلامي الصافي وتسهيل وصول طلبة العلم والأسر المسلمة إليه.',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'تجربة تقنية متقدمة',
              description: 'خطوط عربية واضحة، تحكم بحجم النص، وضع ليلي، ودعم كامل للعمل دون اتصال.',
            },
          ],
          pillars: [
            { title: 'وقف دائم', subtitle: 'مجاني 100% وخالٍ من أي استغلال مادي', icon: 'sparkles-outline' },
            { title: 'نقل أمين', subtitle: 'حفاظ على أصالة المادة العلمية', icon: 'shield-checkmark-outline' },
            { title: 'حصن رقمي', subtitle: 'يعمل دون إنترنت وموثوق في كل مكان', icon: 'server-outline' },
          ],
        },
        {
          id: 'courses',
          badge: 'مَحْتَوَى التَّطْبِيقِ وَالمَنَاهِجُ',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'مَا هُوَ التَّطْبِيق: مَكْتَبَةٌ عِلْمِيَّةٌ وَمَنَاهِجُ مُتَكَامِلَةٌ',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: 'حديث شريف رواه الإمام مسلم في صحيحه.',
          description:
            'أكاديمية رقمية متكاملة تضم 7 متون علمية أصيلة في العقيدة والحديث والفقه، مع مشغل صوتي دقيق، عارض كتب PDF مدمج، وتحميل كامل للاستماع دون اتصال بأربع لغات.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'الانتقال إلى فضيلة الشيخ',
          nextStepTitle: 'التالي: شيوخنا الأفاضل',
          highlights: [
            {
              icon: 'layers-outline',
              title: '7 متون علمية أصيلة',
              description: 'مناهج متدرجة تبدأ بالعقيدة (كتاب التوحيد، الأصول الثلاثة، القواعد الأربع) والحديث والفقه.',
            },
            {
              icon: 'document-text-outline',
              title: 'عرض متزامن لـ PDF',
              description: 'تصفح صفحات الكتاب الأصلي أثناء الاستماع لشرح الشيخ مباشرة دون أي تأخير.',
            },
            {
              icon: 'cloud-download-outline',
              title: 'دراسة دون اتصال 100%',
              description: 'تحميل ذكي يدعم الاستئناف التلقائي للاستماع والمطالعة في أي وقت دون إنترنت.',
            },
            {
              icon: 'language-outline',
              title: '4 لغات حية',
              description: 'واجهة وترجمة كاملة باللغة العربية، الإنجليزية، الأمهرية፣ والأورومية.',
            },
          ],
          curriculumCategories: [
            { name: 'العقيدة', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'الحديث', arabic: 'حديث', color: '#BF360C' },
            { name: 'الفقه', arabic: 'فقه', color: '#4A148C' },
          ],
        },
        {
          id: 'sheikhs',
          badge: 'الوفاء للشيوخ والدعاء لهم',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'مَنْ هُوَ الشَّيْخ: حَمَلَةُ العِلْمِ الشَّرِيفِ وَأَهْلُهُ',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation: 'نسأل الله أن يجزي شيوخنا خير الجزاء، وأن يغفر لهم، وينفع الأمة بعلمهم المبارك.',
          description:
            'العلم الشرعي أمانة متوارثة نُقلت عبر أجيال من العلماء الربانيين والمعلمين المخلصين. كل درس وسلسلة علمية هنا هي ثمرة جهودهم المباركة في خدمة كتاب الله وسنة رسوله ﷺ، وواجبنا حفظ فضلهم بالدعاء المستمر لهم.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'ابدأ طلب العلم',
          nextStepTitle: 'ابدأ طلب العلم',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'أصالة المنهج',
              description: 'فهم شرعي سديد مستمد من الكتاب والسنة وإجماع سلف الأمة.',
            },
            {
              icon: 'archive-outline',
              title: 'أمانة الحفظ',
              description: 'تسجيلات ومواد وكتب محفوظة بعناية تامة دون تحريف أو تشويش.',
            },
            {
              icon: 'heart-outline',
              title: 'الدعاء الصادق',
              description: 'وفاءً لفضل المعلم وحثاً على استدامة بركة علمه بالدعاء المستمر له.',
            },
          ],
          duaCard: {
            tag: 'دعاء خالص لفضيلة الشيخ',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'اللهم اغفر له وارحمه وأكرم نزله واجعل علمه النافع صدقة جارية ترفعه في درجات الجنان.',
            buttonText: 'أَمِّنْ على دعاء الشيخ',
            buttonActiveText: 'آمين · جَزَاكَ ٱللَّٰهُ خَيْرًا',
          },
        },
      ];

    case 'am':
      return [
        {
          id: 'bunyan',
          badge: 'የቡንያን ተነሳሽነት',
          arabicBadge: 'مَنْ بَنَاهَا',
          icon: 'layers-outline',
          title: 'ቡንያን: ትክክለኛ የእስልምና እውቀት ዲጂታል ምሽግ',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: '«አማኝ ለአማኝ ልክ እንደ ህንጻ ነው፤ አንዱ ሌላውን ያጠናክራል።» (ቡኻሪ እና ሙስሊም)',
          description:
            'ቡንያን ትክክለኛ የእስልምና እውቀትን ከዘመናዊ ቴክኖሎጂ ጋር በማጣመር የተቋቋመ ነጻ የዲጂታል ተነሳሽነት ነው። እንደ ቋሚ ወቅፍና ሰደቀቱል ጃሪያህ የተዘጋጀ ሆኖ ምንም አይነት ማስታወቂያ ወይም ክፍያ የለውም።',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'ወደ መተግበሪያው ቀጥል',
          nextStepTitle: 'ቀጣይ: ስለ መተግበሪያው',
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% ነጻ · ሰደቀቱል ጃሪያህ',
              description: 'ምንም አይነት ማስታወቂያ ወይም ክፍያ የሌለው ቋሚ ወቅፍ።',
            },
            {
              icon: 'shield-checkmark-outline',
              title: 'ለኡማው የተገነባ ምሽግ',
              description: 'ትክክለኛውን እውቀት በመጠበቅ ለተማሪዎችና ለቤተሰብ ተደራሽ ማድረግ።',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'ቀላልና ዘመናዊ አጠቃቀም',
              description: 'ግልጽ ጽሑፎች፣ የፊደል መጠን ማስተካከያ፣ የምሽት ንባብና ያለ ኢንተርኔት መስራት።',
            },
          ],
          pillars: [
            { title: 'ቋሚ ወቅፍ', subtitle: 'ምንም የገንዘብ ክፍያ የሌለው፣ 100% ነጻ', icon: 'sparkles-outline' },
            { title: 'ታማኝ ስርጭት', subtitle: 'ትክክለኛውን እውቀት መጠበቅ', icon: 'shield-checkmark-outline' },
            { title: 'ዲጂታል ምሽግ', subtitle: 'ያለ ኢንተርኔት የሚሰራ አስተማማኝ', icon: 'server-outline' },
          ],
        },
        {
          id: 'courses',
          badge: 'የመተግበሪያው ይዘትና ኪታቦች',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'መተግበሪያው ምንድን ነው: ትክክለኛ የኪታቦች ቤተ-መጽሐፍት',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: '«እውቀትን ፍለጋ መንገድ የጀመረን ሰው አላህ ወደ ጀነት የሚወስደውን መንገድ ያቀልለታል።» (ሶሒሕ ሙስሊም)',
          description:
            'በዐቂዳ፣ በሐዲስና በፊቅህ የተዋቀሩ 7 ዋና ዋና ትክክለኛ ኪታቦች፣ ጥራት ያለው የድምጽ ማጫወቻ፣ የተሟላ ፒዲኤፍ (PDF) ንባብ እና ያለ ኢንተርኔት የማውረድ አሰራር የተካተቱበት መተግበሪያ ነው።',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'ወደ ሼኾቻችን ቀጥል',
          nextStepTitle: 'ቀጣይ: ስለ ሼኾቻችን',
          highlights: [
            {
              icon: 'layers-outline',
              title: '7 ትክክለኛ ኪታቦች',
              description: 'በሐዲስ (ሪያዱ ሷሊሂን)፣ ተፍሲር፣ ዐቂዳና ፊቅህ በሸይኽ ሙሐመድ ፈረጅ የተዘጋጁ።',
            },
            {
              icon: 'document-text-outline',
              title: 'የኪታብ ፒዲኤፍ (PDF) እይታ',
              description: 'ድምጹን እያደመጡ የኪታቡን ገጽ በቅጽበት አብሮ መከታተል።',
            },
            {
              icon: 'cloud-download-outline',
              title: '100% ያለ ኢንተርኔት',
              description: 'ትምህርቶችን አውርደው ያለ ኢንተርኔት በማንኛውም ሰዓት መማር።',
            },
            {
              icon: 'language-outline',
              title: '4 ቋንቋዎች',
              description: 'በዐረብኛ፣ በእንግሊዝኛ፣ በአማርኛ እና በኦሮምኛ የተሟላ አገልግሎት።',
            },
          ],
          curriculumCategories: [
            { name: 'ዐቂዳ', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'ሐዲስ', arabic: 'حديث', color: '#BF360C' },
            { name: 'ፊቅህ', arabic: 'فقه', color: '#4A148C' },
          ],
        },
        {
          id: 'sheikhs',
          badge: 'ለሼኾች ክብር መስጠትና ዱዓእ ማድረግ',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'ሼኾቹ እነማን ናቸው: የተቀደሰውን አደራ የተሸከሙ',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation: 'አላህ ለመምህሮቻችን ታላቅ ምንዳን ይስጣቸው፣ ይማራቸው፣ በእውቀታቸውም ኡማውን ይጠቅምበት።',
          description:
            'በእስልምና እውነተኛ እውቀት በታማኝ ዑለማዎችና መምህራን በኩል የሚተላለፍ አደራ ነው። እዚህ የቀረቡት ትምህርቶች ሼኾቻችን ለቁርኣንና ሐዲስ የሰጡትን ታላቅ አገልግሎት ያከብራሉ።',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'እውቀት መፈለግ ጀምር',
          nextStepTitle: 'እውቀት መፈለግ ጀምር',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'ትክክለኛ ቅርስ',
              description: 'ከቁርኣን፣ ከሐዲስና ከቀደምት ሊቃውንት የተገኘ ትክክለኛ ግንዛቤ።',
            },
            {
              icon: 'archive-outline',
              title: 'የተጠበቀ እውቀት',
              description: 'ያለ ምንም ቅነሳና ለውጥ በጥንቃቄ የተቀመጡ የትምህርት ድምጾችና ኪታቦች።',
            },
            {
              icon: 'heart-outline',
              title: 'ልባዊ ዱዓእ',
              description: 'ለሼኾቻችን በየቀኑ ዱዓእ በማድረግ የመምህርና የተማሪን ስነ-ምግባር ማክበር።',
            },
          ],
          duaCard: {
            tag: 'ለሼኹ የሚደረግ ልባዊ ዱዓእ',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'አላህ ሆይ! ማረዉ፣ እዘንለት፣ ምቹ ማረፊያን ስጠው፣ ጠቃሚ እውቀቱንም እስከ ትንሳኤ ቀን ድረስ ቀጣይ ሰደቃ (ሶደቀቱል ጃሪያህ) አድርግለት።',
            buttonText: 'ለሼኹ አሚን ይበሉ',
            buttonActiveText: 'አሚን · ጀዛከላሁ ኸይረን',
          },
        },
      ];

    case 'om':
      return [
        {
          id: 'bunyan',
          badge: 'Inisheetivii Bunyaan',
          arabicBadge: 'مَنْ بَنَاهَا',
          icon: 'layers-outline',
          title: 'Bunyaan: Masaraa Dijitaalaa Beekumsa Islaamaa Qulqulluu',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: '«Mu\'minni mu\'minaaf akka ijaarsa gamooti; gariin isaanii garii jabeessa.» (Bukhaarii fi Muslim)',
          description:
            'Bunyaan beekumsa Islaamaa qulqulluu teeknoolojii ammayyaa wajjin walitti fiduuf kan hundeeffame inisheetivii dhuunfaa bilisaati. Akka waqfii fi sadaqaa itti-fufaatti qophaa\'ee beeksisa fi kaffaltii tokkollee hin qabu.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'Gara Appiitti Itti Fufaa',
          nextStepTitle: "Itti Aanu: Waa'ee Appii",
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% Bilisa · Sadaqah Jariyah',
              description: 'Waqfii ummataaf ta\'e, beeksisa fi kaffaltii tokkollee hin qabu.',
            },
            {
              icon: 'shield-checkmark-outline',
              title: 'Masaraa Ummatichaa',
              description: 'Beekumsa dhugaa eeguun barattootaa fi maatiif akka qaqqabu gochuu.',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'Fayyadamuuf Salphaa',
              description: 'Barreeffama ifa, guddina qubee jijjiiruu, halkan dubbisuu fi intarneetii malee hojjechuu.',
            },
          ],
          pillars: [
            { title: 'Waqfii Dhaabbataa', subtitle: 'Kaffaltii hin qabu, 100% bilisa', icon: 'sparkles-outline' },
            { title: 'Dabarsa Amanamaa', subtitle: 'Beekumsa dhugaa eeguu', icon: 'shield-checkmark-outline' },
            { title: 'Masaraa Dijitaalaa', subtitle: 'Intarneetii malee amansiisaa', icon: 'server-outline' },
          ],
        },
        {
          id: 'courses',
          badge: 'Qabiyyee Appii fi Kitaabbilee',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'Appiin Kun Maali: Kitaabbilee Amanamaa fi Qorannoo',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: '«Nama beekumsa barbaachaaf karaa deeme, Allaahn gara jannataatti karaa isaaf laaffisa.» (Sahiih Muslim)',
          description:
            'Akaadaamii dijitaalaa kitaabbilee qulqulluu 7 Aqiidaa, Hadiisa fi Fiqhii of keessaa qabu. Sagalee qulqulluu, PDF kitaabaa dubbisuu fi intarneetii malee buufatanii barachuu dabalata.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'Gara Sheekotaatti Itti Fufaa',
          nextStepTitle: "Itti Aanu: Waa'ee Sheekotaa",
          highlights: [
            {
              icon: 'layers-outline',
              title: 'Kitaabbilee Qulqulluu 7',
              description: 'Aqiidaa (K/Towhiid, Salaasatul Usuul, Qawaa\'idul Arba\'aa), Hadiisa fi Fiqhii.',
            },
            {
              icon: 'document-text-outline',
              title: 'PDF Kitaabaa Dubbisuu',
              description: 'Sagalee dhaggeeffachaa fuula kitaabaa yeruma sanatti faana bu\'uu.',
            },
            {
              icon: 'cloud-download-outline',
              title: '100% Sarara Malee',
              description: 'Koorsoota buufachuun intarneetii malee yeroo barbaaddan baradhaa.',
            },
            {
              icon: 'language-outline',
              title: 'Afaanota 4',
              description: 'Afaan Arabaa, Ingiliffaa, Amaariffaa fi Afaan Oromoitiin qophaa\'e.',
            },
          ],
          curriculumCategories: [
            { name: 'Aqiidaa', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'Hadiisa', arabic: 'حديث', color: '#BF360C' },
            { name: 'Fiqhii', arabic: 'فقه', color: '#4A148C' },
          ],
        },
        {
          id: 'sheikhs',
          badge: 'Sheekota Kabajuu fi Du’aa’ii Gochuu',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'Sheekonni Eenyu: Abbootii Amana Beekumsa Qulqulluu',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation:
            'Allaahn barsiisota keenyaaf galata guddaa haa kennuuf, isaaniif haa araaramu, beekumsa isaaniitiinis Ummaticha haa fayyadu.',
          description:
            'Beekumsa Islaamaa keessatti beekumsa qulqulluu jechuun amana ulamaa\'ota fi barsiisota amanamaadhaan dhalootaaf darbedha. Barnoonni asitti dhihaate hundi tajaajila sheekonni keenya Qur\'aana fi Hadiisaaf kennan kan kabajudha.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'Beekumsa Barbaaduu Jalqabi',
          nextStepTitle: 'Beekumsa Barbaaduu Jalqabi',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'Dhaala Qulqulluu',
              description: 'Hubannoo sirrii Qur\'aana, Hadiisa fi ijmaa\'a saba duraanii irraa argame.',
            },
            {
              icon: 'archive-outline',
              title: 'Eegamaa fi Amanamaa',
              description: 'Waraabbileen sagalee fi kitaabbileen osoo hin jijjiiramin qulqullinaan eegaman.',
            },
            {
              icon: 'heart-outline',
              title: 'Du’aa’ii Qulqulluu',
              description: 'Sheekota keenya du’aa’ii keessatti yaadachuun naamusa barataa-barsiisaa kabajuu.',
            },
          ],
          duaCard: {
            tag: 'Du’aa’ii Qulqulluu Sheekichaaf',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'Yaa Allaah! Isaaniif araarami, rahmata godhiif, iddoo isaanii kabajaa godhiif, beekumsa isaaniis sadaqaa itti-fufaa (Sadaqah Jariyah) godhiif.',
            buttonText: 'Sheekichaaf Aamiin Jedhaa',
            buttonActiveText: 'Aamiin · جَزَاكَ ٱللَّٰهُ خَيْرًا',
          },
        },
      ];

    case 'en':
    default:
      return [
        {
          id: 'bunyan',
          badge: 'The Bunyan Initiative',
          arabicBadge: 'مَنْ بَنَاهَا',
          icon: 'layers-outline',
          title: 'The Bunyan Initiative: Who Built This App',
          arabicQuote: '« الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا »',
          quoteTranslation: '«The believer to another believer is like a solid structure, each part strengthening the other.» (Sahih al-Bukhari & Muslim)',
          description:
            'Bunyan (بُنْيَان) is an independent non-profit digital initiative built to unite authentic Islamic scholarship with modern technology. Established purely as an open perpetual Waqf and continuous charity (Sadaqah Jariyah), Bunyan provides a clean, distraction-free sanctuary for Muslims around the world with zero ads or subscriptions.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'Continue to The App',
          nextStepTitle: 'Next: What the App Is',
          highlights: [
            {
              icon: 'gift-outline',
              title: '100% Free · Sadaqah Jariyah',
              description: 'A perpetual Waqf for the Ummah with zero advertisements, paywalls, or subscriptions—ever.',
            },
            {
              icon: 'shield-checkmark-outline',
              title: 'Strengthening the Ummah',
              description: 'Built to empower individuals, families, and study circles with reliable knowledge.',
            },
            {
              icon: 'phone-portrait-outline',
              title: 'Universal Accessibility',
              description: 'Clean typography, adjustable font sizes, and dark mode for comfortable reading on any screen.',
            },
          ],
          pillars: [
            { title: 'Perpetual Waqf', subtitle: 'Zero monetization, 100% free', icon: 'sparkles-outline' },
            { title: 'Authentic Transmission', subtitle: 'Preserving sound knowledge', icon: 'shield-checkmark-outline' },
            { title: 'Digital Fortress', subtitle: 'Offline, secure & reliable', icon: 'server-outline' },
          ],
        },
        {
          id: 'courses',
          badge: 'What the App Is · Kitabs',
          arabicBadge: 'مَنَاهِجُ الدِّرَاسَةِ',
          icon: 'book-outline',
          title: 'What the App Is: Authentic Kitabs & Study System',
          arabicQuote: '« مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ »',
          quoteTranslation: 'Whoever treads a path seeking knowledge, Allah makes easy for him a path to Paradise. (Sahih Muslim)',
          description:
            'An authentic digital curriculum hosting 7 foundational classical Kitabs across Aqeedah, Hadith, and Fiqh. Features seamless synchronized PDF reading, seekable audio playback, offline range downloads, and complete 4-language support.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'Continue to The Sheikh',
          nextStepTitle: 'Next: The Sheikhs',
          highlights: [
            {
              icon: 'layers-outline',
              title: '7 Classical Kitabs',
              description: 'Structured curricula in Hadith (Riyad us-Saliheen), Tafsir, Aqeedah, and Fiqh expounded by Sheikh Muhammed Ferej.',
            },
            {
              icon: 'document-text-outline',
              title: 'Instant PDF Textbook Reader',
              description: 'Original Kitab manuscripts open immediately alongside audio playback with zero delays.',
            },
            {
              icon: 'cloud-download-outline',
              title: '100% Offline Study Mode',
              description: 'Smart range downloads allow pausing, resuming, and full offline learning anywhere.',
            },
            {
              icon: 'language-outline',
              title: '4 Authentic Languages',
              description: 'Full interface and translation support in Arabic, English, Amharic, and Afaan Oromoo.',
            },
          ],
          curriculumCategories: [
            { name: 'Aqeedah', arabic: 'عقيدة', color: '#1B5E20' },
            { name: 'Hadith', arabic: 'حديث', color: '#BF360C' },
            { name: 'Fiqh', arabic: 'فقه', color: '#4A148C' },
          ],
        },
        {
          id: 'sheikhs',
          badge: 'Honoring the Sheikhs',
          arabicBadge: 'ادْعُوا لِلشَّيْخِ',
          icon: 'heart-circle-outline',
          title: 'Who the Sheikh Is: Custodians of Sacred Knowledge',
          arabicQuote: '« جَزَاهُ ٱللَّٰهُ خَيْرًا وَغَفَرَ لَهُ وَنَفَعَ بِعِلْمِهِ »',
          quoteTranslation:
            'May Allah reward our teachers with the highest good, forgive them, and cause their sacred knowledge to benefit the Ummah.',
          description:
            'Sacred knowledge in Islam is an inherited trust, faithfully transmitted through dedicated scholars and sincere teachers. Every series, audio recording, and lesson hosted here honors the lifelong devotion of the Sheikhs who taught the Quran and Sunnah. We invite every seeker to pray for their continuous reward and elevated status.',
          highlightColor: '#1A4D2E',
          accentColor: '#B8963E',
          buttonLabel: 'Start Seeking Knowledge',
          nextStepTitle: 'Start Seeking Knowledge',
          highlights: [
            {
              icon: 'ribbon-outline',
              title: 'Authentic Heritage',
              description: 'Sound scholarly understanding rooted in the Quran, authentic Sunnah, and classical consensus.',
            },
            {
              icon: 'archive-outline',
              title: 'Preserved & Faithful',
              description: 'Recorded lectures, study materials, and transcripts preserved without modification or interruption.',
            },
            {
              icon: 'heart-outline',
              title: 'Sincere Supplication',
              description: 'Upholding the student-teacher ethic by remembering the Sheikhs in our daily prayers.',
            },
          ],
          duaCard: {
            tag: 'A Sincere Prayer for the Sheikh',
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاجْعَلْ عِلْمَهُ صَدَقَةً جَارِيَةً',
            translation:
              'O Allah! Forgive him, have mercy upon him, grant him well-being, make his final abode honorable, and let his beneficial knowledge be an ongoing charity (Sadaqah Jariyah) benefiting him until the Day of Judgment.',
            buttonText: 'Say Ameen for the Sheikh',
            buttonActiveText: 'Ameen · جَزَاكَ ٱللَّٰهُ خَيْرًا',
          },
        },
      ];
  }
}

export const welcomeSlides: WelcomeSlide[] = getWelcomeSlides('en');
