import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About UPRSA',
    'nav.activities': 'Disciplines',
    'nav.districts': 'Districts',
    'nav.clubs': 'Clubs & Academies',
    'nav.tournaments': 'Tournaments',
    'nav.results': 'Results',
    'nav.rankings': 'State Rankings',
    'nav.liveScore': 'Live Scoring',
    'nav.newsGallery': 'News & Media',
    'nav.contact': 'Contact Us',
    'nav.skaterPortal': 'Skater Portal',
    'nav.register': 'Register Skater',
    'nav.verifyCert': 'Verify Certificate',
    'nav.adminLogin': 'Admin Login',
    'hero.title': 'Uttar Pradesh Roller Sports Association',
    'hero.subtitle': 'Governing State Body for Roller, Inline & Speed Skating in Uttar Pradesh',
    'hero.affiliated': 'Affiliated with Roller Skating Federation of India (RSFI) & UP Olympic Association',
    'hero.registerBtn': 'Skater Registration 2026',
    'hero.verifyBtn': 'Verify Certificate',
    'hero.calendarBtn': 'Tournament Calendar',
    'footer.rights': 'All Rights Reserved. Official State Body of Roller Sports in UP.'
  },
  hi: {
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.activities': 'खेल विधाएं',
    'nav.districts': 'जिला इकाइयां',
    'nav.clubs': 'क्लब व अकादमियां',
    'nav.tournaments': 'प्रतियोगिताएं',
    'nav.results': 'परिणाम',
    'nav.rankings': 'राज्य रैंकिंग',
    'nav.liveScore': 'लाइव स्कोर',
    'nav.newsGallery': 'समाचार व गैलरी',
    'nav.contact': 'संपर्क करें',
    'nav.skaterPortal': 'स्केटर पोर्टल',
    'nav.register': 'स्केटर पंजीकरण',
    'nav.verifyCert': 'प्रमाणपत्र सत्यापन',
    'nav.adminLogin': 'एडमिन लॉगिन',
    'hero.title': 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन',
    'hero.subtitle': 'उत्तर प्रदेश में रोलर, इनलाइन एवं स्पीड स्केटिंग की आधिकारिक राज्य संस्था',
    'hero.affiliated': 'रोलर स्केटिंग फेडरेशन ऑफ इंडिया (RSFI) एवं यूपी ओलंपिक एसोसिएशन से संबद्ध',
    'hero.registerBtn': 'स्केटर पंजीकरण 2026',
    'hero.verifyBtn': 'प्रमाणपत्र सत्यापन',
    'hero.calendarBtn': 'प्रतियोगिता कैलेंडर',
    'footer.rights': 'सर्वाधिकार सुरक्षित। उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन (UPRSA)।'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string, def?: string) => def || key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('uprsa_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('uprsa_lang', lang);
  }, [lang]);

  const t = (key: string, defaultText?: string) => {
    return translations[lang][key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
