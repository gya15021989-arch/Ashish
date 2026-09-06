import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  Sliders, 
  Plus, 
  Trash2, 
  Sparkles, 
  HelpCircle,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Check,
  Globe,
  Radio,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../context/SiteSettingsContext';
import { SiteSettings, CustomSocialLink } from '../../types';

// Standard social platforms configuration
interface PlatformDef {
  key: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' | 'twitter' | 'linkedin' | 'telegram' | 'threads';
  name: string;
  nameHindi: string;
  defaultUrl: string;
  defaultTooltip: string;
  colorClass: string;
  bgColor: string;
  hoverBg: string;
  iconSvg: React.ReactNode;
  placeholder: string;
}

const STANDARD_PLATFORMS: PlatformDef[] = [
  {
    key: 'facebook',
    name: 'Facebook',
    nameHindi: 'फेसबुक पेज',
    defaultUrl: 'https://facebook.com/uprsa',
    defaultTooltip: 'Follow on Facebook',
    colorClass: 'text-blue-500',
    bgColor: 'bg-[#1877F2]',
    hoverBg: 'hover:bg-[#166fe5]',
    placeholder: 'https://facebook.com/your-page-or-profile',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    key: 'instagram',
    name: 'Instagram',
    nameHindi: 'इंस्टाग्राम हैंडल',
    defaultUrl: 'https://instagram.com/uprsa_official',
    defaultTooltip: 'Follow on Instagram',
    colorClass: 'text-pink-500',
    bgColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    hoverBg: 'hover:opacity-90',
    placeholder: 'https://instagram.com/uprsa_official',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    key: 'youtube',
    name: 'YouTube',
    nameHindi: 'यूट्यूब चैनल / लाइव स्ट्रीम',
    defaultUrl: 'https://youtube.com/@uprsa',
    defaultTooltip: 'Subscribe on YouTube',
    colorClass: 'text-red-500',
    bgColor: 'bg-[#FF0000]',
    hoverBg: 'hover:bg-[#e60000]',
    placeholder: 'https://youtube.com/@uprsa-official',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    nameHindi: 'व्हाट्सएप हेल्पलाइन / चैट',
    defaultUrl: '919415021989',
    defaultTooltip: 'Chat on WhatsApp',
    colorClass: 'text-emerald-500',
    bgColor: 'bg-[#25D366]',
    hoverBg: 'hover:bg-[#20bd5a]',
    placeholder: '919415021989 या https://wa.me/...',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    )
  },
  {
    key: 'twitter',
    name: 'X (Twitter)',
    nameHindi: 'एक्स / ट्विटर हैंडल',
    defaultUrl: 'https://x.com/uprsa_official',
    defaultTooltip: 'Follow on X',
    colorClass: 'text-slate-200',
    bgColor: 'bg-black border border-slate-700/80',
    hoverBg: 'hover:bg-slate-900',
    placeholder: 'https://x.com/uprsa_official',
    iconSvg: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    nameHindi: 'लिंक्डइन पेज',
    defaultUrl: 'https://linkedin.com/company/uprsa',
    defaultTooltip: 'Connect on LinkedIn',
    colorClass: 'text-blue-400',
    bgColor: 'bg-[#0A66C2]',
    hoverBg: 'hover:bg-[#084e96]',
    placeholder: 'https://linkedin.com/company/uprsa',
    iconSvg: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )
  },
  {
    key: 'telegram',
    name: 'Telegram',
    nameHindi: 'टेलीग्राम चैनल / ग्रुप',
    defaultUrl: 'https://t.me/uprsa_official',
    defaultTooltip: 'Join Telegram Channel',
    colorClass: 'text-sky-400',
    bgColor: 'bg-[#229ED9]',
    hoverBg: 'hover:bg-[#1e8bc0]',
    placeholder: 'https://t.me/your_telegram_channel',
    iconSvg: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    )
  }
];

export const SocialLinksCMSManager: React.FC = () => {
  const { settings: globalSettings, updateSettings } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(globalSettings || DEFAULT_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testLinkStatus, setTestLinkStatus] = useState<string | null>(null);

  // New custom link temporary state
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [newCustomTooltip, setNewCustomTooltip] = useState('');

  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
    }
  }, [globalSettings]);

  // Helper to format actual clickable URL for test opening
  const resolveClickableUrl = (key: string, rawVal: string, whatsappMsg?: string): string => {
    if (!rawVal) return '#';
    const trimmed = rawVal.trim();
    if (key === 'whatsapp') {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      const digits = trimmed.replace(/[^0-9]/g, '');
      const msg = whatsappMsg || settings.socialLinks?.whatsappMessage || 'Hello UPRSA Secretariat';
      return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  // Open link in new tab to test
  const handleTestOpenLink = (key: string, rawUrl: string, name: string) => {
    const url = resolveClickableUrl(key, rawUrl);
    if (url === '#' || !rawUrl) {
      alert(`कृपया पहले ${name} का मान्य लिंक अथवा नंबर दर्ज करें।`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    setTestLinkStatus(`${name} लिंक नए टैब में खोला गया (${url})`);
    setTimeout(() => setTestLinkStatus(null), 4000);
  };

  // Update specific platform link
  const handleUpdateLink = (key: string, val: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: val
      }
    }));
  };

  // Toggle platform visibility on floating toolbar & site
  const handleToggleVisibility = (key: string) => {
    setSettings(prev => {
      const currentVis = prev.socialVisibility?.[key as keyof typeof prev.socialVisibility];
      const isCurrentlyVisible = currentVis !== undefined ? currentVis : true;
      return {
        ...prev,
        socialVisibility: {
          ...prev.socialVisibility,
          [key]: !isCurrentlyVisible
        }
      };
    });
  };

  // Reset all to official UPRSA standard links
  const handleResetToDefaults = () => {
    if (!confirm('क्या आप सभी सोशल मीडिया लिंक्स को आधिकारिक UPRSA डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      return;
    }
    setSettings(prev => ({
      ...prev,
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
        telegram: true,
        threads: false,
        floatingBarEnabled: true,
        floatingBarPosition: 'right'
      }
    }));
  };

  // Add custom extra link
  const handleAddCustomLink = () => {
    if (!newCustomName.trim() || !newCustomUrl.trim()) {
      alert('कृपया लिंक का नाम और URL दर्ज करें।');
      return;
    }
    const newLink: CustomSocialLink = {
      id: 'custom-link-' + Date.now(),
      name: newCustomName.trim(),
      href: newCustomUrl.trim(),
      tooltip: newCustomTooltip.trim() || `Visit ${newCustomName.trim()}`,
      bgColor: 'bg-indigo-600',
      enabled: true
    };
    setSettings(prev => ({
      ...prev,
      customSocialLinks: [...(prev.customSocialLinks || []), newLink]
    }));
    setNewCustomName('');
    setNewCustomUrl('');
    setNewCustomTooltip('');
  };

  // Remove custom link
  const handleRemoveCustomLink = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customSocialLinks: (prev.customSocialLinks || []).filter(item => item.id !== id)
    }));
  };

  // Save all settings
  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const success = await updateSettings(settings);
      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Failed to save social links:', err);
    } finally {
      setSaving(false);
    }
  };

  const isBarEnabled = settings.socialVisibility?.floatingBarEnabled !== false;
  const barPosition = settings.socialVisibility?.floatingBarPosition || 'right';

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="bg-[#0b1329] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              OFFICIAL SOCIAL MEDIA CMS & FLOATING TOOLBAR DESK
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            साइड सोशल मीडिया लिंक्स, लाइव टेस्टिंग व बटन प्रबंधन
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            यहां से आप स्क्रीन के साइड में दिखने वाले सभी सोशल मीडिया (फेसबुक, इंस्टाग्राम, यूट्यूब, व्हाट्सएप, ट्विटर/X, लिंक्डइन, टेलीग्राम) लिंक्स बदल सकते हैं, नए लिंक जोड़ सकते हैं, सीधे क्लिक करके टेस्ट कर सकते हैं और ऑन/ऑफ कर सकते हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="आधिकारिक लिंक्स लोड करें"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>आधिकारिक लिंक्स लोड करें</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{saving ? 'सेव हो रहा है...' : 'सभी लिंक्स सेव करें (Save & Publish)'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-black">सफलतापूर्वक सेव हो गया!</span> सभी सोशल मीडिया लिंक्स अपडेट हो गए हैं और मुख्य वेबसाइट व साइड टूलबार पर तुरंत लागू हो गए हैं।
          </div>
        </div>
      )}

      {/* Test Link Toast Message */}
      {testLinkStatus && (
        <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-blue-400" />
          <span>{testLinkStatus}</span>
        </div>
      )}

      {/* Grid: Left Column (Platform Link Editors), Right Column (Live Interactive Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: All Social Link Settings (8 Columns on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Toolbar Controls Card */}
          <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  साइड सोशल बार सेटिंग्स (Toolbar Position & Display)
                </h3>
              </div>

              {/* Master Toolbar Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold">
                  साइड बार प्रदर्शित करें:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      socialVisibility: {
                        ...prev.socialVisibility,
                        floatingBarEnabled: !isBarEnabled
                      }
                    }));
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isBarEnabled
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isBarEnabled ? 'bg-slate-950 animate-pulse' : 'bg-rose-400'}`} />
                  <span>{isBarEnabled ? 'सक्रिय (Enabled)' : 'बंद (Disabled)'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  स्क्रीन पर स्थिति (Toolbar Position)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        socialVisibility: { ...prev.socialVisibility, floatingBarPosition: 'right' }
                      }));
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all ${
                      barPosition === 'right'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    दाहिनी तरफ (Right Side - Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        socialVisibility: { ...prev.socialVisibility, floatingBarPosition: 'left' }
                      }));
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all ${
                      barPosition === 'left'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    बाईं तरफ (Left Side)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  व्हाट्सएप डिफ़ॉल्ट इंक्वायरी संदेश (Default Query Text)
                </label>
                <input
                  type="text"
                  value={settings.socialLinks?.whatsappMessage || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, whatsappMessage: e.target.value }
                  }))}
                  placeholder="उदा. Hello UPRSA, I have a query..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Standard Platforms List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>प्रमुख सोशल मीडिया चैनल्स व लिंक्स ({STANDARD_PLATFORMS.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                प्रत्येक लिंक के सामने <strong>"खोलें / टेस्ट करें"</strong> बटन दिया गया है
              </span>
            </div>

            {STANDARD_PLATFORMS.map((platform) => {
              const currentVal = settings.socialLinks?.[platform.key] || '';
              const isVisible = settings.socialVisibility?.[platform.key] !== false;

              return (
                <div
                  key={platform.key}
                  className={`bg-[#0c1527] border rounded-2xl p-4 sm:p-5 shadow-lg transition-all ${
                    isVisible ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-slate-800/60 pb-2.5">
                    
                    {/* Platform Emblem & Title */}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${platform.bgColor} text-white flex items-center justify-center shrink-0 shadow-md`}>
                        {platform.iconSvg}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{platform.name}</h4>
                          <span className="text-[11px] text-slate-400">({platform.nameHindi})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          डिफ़ॉल्ट टूलटिप: "{platform.defaultTooltip}"
                        </span>
                      </div>
                    </div>

                    {/* Action Controls: Toggle Active & Test Open */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {/* Active/Inactive Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(platform.key)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isVisible
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                        title={isVisible ? 'इस आइकन को बंद करें' : 'इस आइकन को सक्रिय करें'}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isVisible ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        <span>{isVisible ? 'दिखाएं (Active)' : 'छुपाएं (Hidden)'}</span>
                      </button>

                      {/* Direct Test Open in New Tab Button */}
                      <button
                        type="button"
                        onClick={() => handleTestOpenLink(platform.key, currentVal, platform.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        title={`${platform.name} लिंक को नए टैब में खोलकर जांचें`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        <span>खोलें / टेस्ट करें</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Row */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 block">
                      {platform.name} आधिकारिक URL या पता:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => handleUpdateLink(platform.key, e.target.value)}
                          placeholder={platform.placeholder}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none pr-8"
                        />
                        {currentVal && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLink(platform.key, '')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400 text-xs font-bold"
                            title="साफ़ करें"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Quick Restore Default Button */}
                      <button
                        type="button"
                        onClick={() => handleUpdateLink(platform.key, platform.defaultUrl)}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
                        title="डिफ़ॉल्ट लिंक लगाएं"
                      >
                        डिफ़ॉल्ट
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Extra Links Section */}
          <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>अतिरिक्त कस्टम सोशल/वेबसाइट लिंक्स (Custom Links)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  यदि आप कोई अन्य प्लेटफ़ॉर्म (जैसे RSFI पोर्टल, डिस्कॉर्ड, खेल मंत्रालय पोर्टल) जोड़ना चाहते हैं
                </p>
              </div>
            </div>

            {/* List of Custom Links */}
            {(settings.customSocialLinks || []).length > 0 && (
              <div className="space-y-2">
                {(settings.customSocialLinks || []).map((customItem) => (
                  <div
                    key={customItem.id}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">{customItem.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">{customItem.href}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTestOpenLink('custom', customItem.href, customItem.name)}
                        className="px-2.5 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-blue-600/40 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>टेस्ट</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomLink(customItem.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Custom Link Form */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-amber-300 block">
                + नया कस्टम लिंक जोड़ें:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  placeholder="प्लेटफ़ॉर्म का नाम (उदा. RSFI Portal)"
                  className="bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={newCustomUrl}
                  onChange={(e) => setNewCustomUrl(e.target.value)}
                  placeholder="URL (https://...)"
                  className="bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCustomTooltip}
                    onChange={(e) => setNewCustomTooltip(e.target.value)}
                    placeholder="टूलटिप संदेश"
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLink}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                  >
                    जोड़ें
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Live Interactive Visual Preview (4 Columns on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6 bg-[#0c1527] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  लाइव साइडबार प्रिव्यू (Live Preview)
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                REAL-TIME
              </span>
            </div>

            <p className="text-xs text-slate-400">
              नीचे देखें कि साइडबार पोर्टल पर कैसा दिखेगा। आप किसी भी आइकन पर क्लिक करके सीधे उसे टेस्ट भी कर सकते हैं:
            </p>

            {/* Preview Box Frame */}
            <div className="relative bg-[#040811] rounded-2xl border border-slate-800 p-6 min-h-[360px] flex items-center justify-center overflow-hidden">
              
              {/* Simulated website background elements */}
              <div className="absolute inset-0 opacity-10 pointer-events-none p-4 space-y-3">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
                <div className="h-20 bg-slate-800 rounded w-full mt-4" />
              </div>

              {/* Simulated Floating Toolbar Widget */}
              {isBarEnabled ? (
                <div className={`absolute ${barPosition === 'left' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center`}>
                  <div className="flex flex-col gap-2 p-2 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">
                    {STANDARD_PLATFORMS.map((platform) => {
                      const isVis = settings.socialVisibility?.[platform.key] !== false;
                      if (!isVis) return null;
                      const rawUrl = settings.socialLinks?.[platform.key] || '';
                      const clickUrl = resolveClickableUrl(platform.key, rawUrl);

                      return (
                        <a
                          key={platform.key}
                          href={clickUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${platform.name}: ${rawUrl || 'No link set'} (Click to Test)`}
                          className={`w-9 h-9 rounded-xl ${platform.bgColor} ${platform.hoverBg} text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer relative group`}
                          onClick={(e) => {
                            if (!rawUrl) {
                              e.preventDefault();
                              alert(`कृपया ${platform.name} का लिंक पहले दर्ज करें।`);
                            }
                          }}
                        >
                          {platform.iconSvg}
                        </a>
                      );
                    })}

                    {/* Custom Links in Preview */}
                    {(settings.customSocialLinks || []).map((customItem) => (
                      <a
                        key={customItem.id}
                        href={customItem.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${customItem.name}: ${customItem.href}`}
                        className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <span className="text-xs text-rose-400 font-bold block">
                    साइड टूलबार अभी बंद (Disabled) है
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    ऊपर दिए गए 'सक्रिय' बटन से इसे चालू करें।
                  </span>
                </div>
              )}
            </div>

            {/* Quick Helper Tips */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>सलाह एवं दिशा-निर्देश:</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4">
                <li>व्हाट्सएप में आप केवल 10-अंकों का मोबाइल नंबर (जैसे <strong>9415021989</strong>) अथवा पूरा व्हाट्सएप लिंक डाल सकते हैं।</li>
                <li>सोशल लिंक्स अपडेट करने के बाद <strong>"सभी लिंक्स सेव करें"</strong> बटन दबाएं।</li>
                <li>परिवर्तन करते ही हेडर, फूटर एवं साइडबार सभी जगह नए लिंक्स स्वतः सक्रिय हो जाते हैं।</li>
              </ul>
            </div>

            {/* Bottom Save Action */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{saving ? 'सेव हो रहा है...' : 'परिवर्तन सेव व प्रकाशित करें'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
