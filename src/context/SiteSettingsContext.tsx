import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  organizationName: 'Uttar Pradesh Roller Sports Association',
  organizationNameHindi: 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन',
  shortName: 'UPRSA',
  tagline: 'STATE GOVERNING BODY FOR ROLLER SPORTS IN UTTAR PRADESH',
  taglineHindi: 'उत्तर प्रदेश में रोलर स्पोर्ट्स की राज्य नियामक संस्था',
  heroTitle: 'UTTAR PRADESH ROLLER SPORTS ASSOCIATION',
  heroTitleHindi: 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन',
  heroSubtitle: 'Promoting Roller Sports Across Uttar Pradesh • Building Champions, Building Nation. State Governing Body Affiliated with Roller Skating Federation of India (RSFI).',
  heroSubtitleHindi: 'उत्तर प्रदेश भर में रोलर स्पोर्ट्स को प्रोत्साहन • चैंपियंस का निर्माण, राष्ट्र का निर्माण। भारतीय रोलर स्केटिंग महासंघ (RSFI) से मान्यता प्राप्त राज्य नियामक संस्था।',
  affiliationNotice: 'Affiliated to Roller Skating Federation of India (RSFI) & UP Olympic Association (UPOA)',
  affiliationNoticeHindi: 'भारतीय रोलर स्केटिंग महासंघ (RSFI) एवं यूपी ओलंपिक संघ (UPOA) से संबद्ध',
  logoUrl: '',
  logoShape: 'shield',
  contactEmail: 'sec.uprsa@gmail.com',
  contactPhone: '+91 94150 23456',
  officialAddress: 'UPRSA State Secretariat, K.D. Singh Babu Stadium Complex, Hazratganj, Lucknow, UP - 226001',
  registrationOpen: true,
  liveStreamingActive: true,
  headerNotice: 'OFFICIAL RSFI RECOGNIZED STATE GOVERNING BODY',
  socialLinks: {
    facebook: 'https://facebook.com/uprsa',
    instagram: 'https://instagram.com/uprsa_official',
    youtube: 'https://youtube.com/@uprsa',
    whatsapp: '919415021989',
    twitter: 'https://x.com/uprsa_official',
    linkedin: 'https://linkedin.com/company/uprsa',
    telegram: 'https://t.me/uprsa_official',
    whatsappMessage: 'Hello UPRSA Secretariat, I have a query regarding Roller Skating in Uttar Pradesh.'
  },
  socialVisibility: {
    facebook: true,
    instagram: true,
    youtube: true,
    whatsapp: true,
    twitter: true,
    linkedin: true,
    telegram: false,
    threads: false,
    floatingBarEnabled: true,
    floatingBarPosition: 'right'
  },
  customSocialLinks: [],
  liveScoreWidget: {
    enabled: true,
    title: 'LIVE SCORING',
    subtitle: '36th State Trials',
    badge: 'LIVE NOW',
    actionType: 'internal',
    targetPage: 'live_score',
    externalUrl: '',
    pulseAnimation: true,
    position: 'bottom-right',
    showOnMobile: true,
    announcementText: 'Live Race Scoring & Track Heats in Progress'
  },
  topTickerConfig: {
    enabled: true,
    badgeText: 'LIVE NOW',
    badgeActionType: 'internal',
    badgeTargetPage: 'live_score',
    badgeExternalUrl: '',
    badgePulse: true,
    rightButtonText: 'Scoreboard',
    rightButtonActionType: 'internal',
    rightButtonTargetPage: 'live_score',
    rightButtonExternalUrl: '',
    showRightButton: true,
    scrollSpeed: 'medium',
    pauseOnHover: true
  },
  stats: {
    registeredSkaters: 1248,
    affiliatedDistricts: 75,
    stateChampionships: 36,
    recognizedClubs: 84
  }
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  reloadSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  loading: false,
  updateSettings: async () => false,
  reloadSettings: async () => {}
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const reloadSettings = async () => {
    try {
      const res = await api.getSiteSettings();
      if (res.success && res.data) {
        setSettings(prev => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      const res = await api.updateSiteSettings(merged);
      if (res.success && res.data) {
        setSettings(res.data);
        return true;
      }
      return res.success;
    } catch (err) {
      console.error('Error updating site settings:', err);
      return false;
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSettings, reloadSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
