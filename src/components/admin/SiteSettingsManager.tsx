import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Share2,
  Lock,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../context/SiteSettingsContext';
import { UprsaLogo } from '../layout/UprsaLogo';

// Preset sample logo choices for quick one-click preview & application
const PRESET_LOGOS = [
  {
    id: 'default-shield',
    name: 'आधिकारिक स्वर्ण शील्ड एम्बलम (Default Shield)',
    url: '',
    description: 'RSFI आधिकारिक स्वर्ण शील्ड, इनलाइन व्हील्स एवं तिरंगा पट्टी'
  },
  {
    id: 'tricolor-badge',
    name: 'तिरंगा रोलर स्केटिंग बैज (Tricolor Crest)',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=160&auto=format&fit=crop&q=80',
    description: 'भारतीय खेल तिरंगा थीम युक्त आधुनिक स्पीड स्केटिंग लोगो'
  },
  {
    id: 'gold-skater',
    name: 'गोल्डन स्पीड रेसर लोगो (Gold Inline)',
    url: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=160&auto=format&fit=crop&q=80',
    description: 'स्वर्ण रिम युक्त हाई-स्पीड रोलर एथलीट एम्बलम'
  }
];

export const SiteSettingsManager: React.FC = () => {
  const { settings: globalSettings, updateSettings: updateGlobalSettings } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(globalSettings || DEFAULT_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState<'hi' | 'en'>('hi');

  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
    }
  }, [globalSettings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please select a smaller JPG or PNG image.');
      return;
    }
    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        // Also call uploadFile on backend if possible, or store base64 directly
        try {
          const res = await api.uploadFile(file.name, base64, false);
          if (res.success && res.fileUrl) {
            setSettings(prev => ({ ...prev, logoUrl: res.fileUrl }));
          } else {
            setSettings(prev => ({ ...prev, logoUrl: base64 }));
          }
        } catch {
          setSettings(prev => ({ ...prev, logoUrl: base64 }));
        }
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const success = await updateGlobalSettings(settings);
      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Failed to update site settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Announcement Bar */}
      <div className="bg-[#0b1329] border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              PORTAL BRANDING & IDENTITY CONTROLS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            मेन स्क्रीन एसोसिएशन नाम, सब-टाइटल व लोगो प्रबंधन
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            यहां से आप मुख्य स्क्रीन पर दिखने वाले एसोसिएशन का नाम, "स्टेट गवर्निंग बॉडी" सब-टाइटल और मुख्य लोगो बदल या अपलोड कर सकते हैं। परिवर्तन करते ही पूरे पोर्टल (हेडर, हीरो बैनर और फूटर) पर तुरंत लागू हो जाएंगे।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{saving ? 'सेव हो रहा है...' : 'सभी परिवर्तन सेव करें (Save All)'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-extrabold text-white block">सफलतापूर्वक सेव हुआ! (Settings Saved Successfully)</span>
            <span>एसोसिएशन का नाम, स्टेट गवर्निंग बॉडी विवरण और लोगो पोर्टल की मुख्य स्क्रीन पर तुरंत अपडेट कर दिए गए हैं।</span>
          </div>
        </div>
      )}

      {/* 1. Live Visual Preview Card */}
      <div className="bg-[#070d18] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              लाइव हेडर व लोगो प्रीव्यू (Live Real-Time Header Preview)
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <span className="text-slate-400 text-[11px] px-2">भाषा देखें:</span>
            <button
              type="button"
              onClick={() => setPreviewLanguage('hi')}
              className={`px-3 py-1 rounded-lg transition-all ${
                previewLanguage === 'hi' 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setPreviewLanguage('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                previewLanguage === 'en' 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Mock Live Header Bar */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-3.5">
            <UprsaLogo 
              size="lg" 
              logoUrl={settings.logoUrl} 
              logoShape={settings.logoShape || 'shield'} 
            />
            <div>
              <h1 className="font-extrabold text-base sm:text-lg lg:text-xl text-white uppercase leading-none tracking-tight">
                {previewLanguage === 'hi'
                  ? (settings.organizationNameHindi || settings.organizationName || 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन')
                  : (settings.organizationName || 'UTTAR PRADESH ROLLER SPORTS ASSOCIATION')}
              </h1>
              <p className="text-xs text-amber-400 font-semibold tracking-wide mt-1 leading-tight uppercase">
                {previewLanguage === 'hi'
                  ? (settings.taglineHindi || settings.tagline || 'स्टेट गवर्निंग बॉडी ऑफ रोलर स्पोर्ट्स इन उत्तर प्रदेश')
                  : (settings.tagline || 'STATE GOVERNING BODY FOR ROLLER SPORTS IN UTTAR PRADESH')}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <span className="text-emerald-400 font-bold">● RSFI AFFILIATED</span>
                <span>•</span>
                <span>ESTD. 1988</span>
                <span>•</span>
                <span>REG. UP/S/294</span>
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Current Status</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ● Live on Main Website
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 2. Association Name & Governing Body Subtitles */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white uppercase">
                1. एसोसिएशन का नाम व स्टेट गवर्निंग बॉडी विवरण (Name & Subtitle)
              </h3>
              <p className="text-xs text-slate-400">
                मुख्य स्क्रीन के हेडर, हीरो स्लाइड व फूटर में प्रदर्शित होने वाला आधिकारिक नाम
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Hindi Name */}
            <div>
              <label className="block text-amber-300 font-bold mb-1.5 flex items-center justify-between">
                <span>एसोसिएशन का नाम (हिंदी में)</span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">मुख्य हिंदी हेडिंग</span>
              </label>
              <input
                type="text"
                value={settings.organizationNameHindi || ''}
                placeholder="उदा. उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन"
                onChange={(e) => setSettings({ ...settings, organizationNameHindi: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-white font-bold text-sm focus:outline-none"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                <span>Official Association Name (English)</span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">English Title</span>
              </label>
              <input
                type="text"
                value={settings.organizationName || ''}
                placeholder="e.g. UTTAR PRADESH ROLLER SPORTS ASSOCIATION"
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-white font-bold text-sm focus:outline-none uppercase"
              />
            </div>

            {/* Hindi Tagline */}
            <div>
              <label className="block text-amber-300 font-bold mb-1.5 flex items-center justify-between">
                <span>स्टेट गवर्निंग बॉडी विवरण / सब-टाइटल (हिंदी में)</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">सब-टाइटल</span>
              </label>
              <input
                type="text"
                value={settings.taglineHindi || ''}
                placeholder="उदा. स्टेट गवर्निंग बॉडी ऑफ रोलर स्पोर्ट्स इन उत्तर प्रदेश"
                onChange={(e) => setSettings({ ...settings, taglineHindi: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-slate-200 font-semibold text-xs focus:outline-none"
              />
            </div>

            {/* English Tagline */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                <span>State Governing Body Subtitle (English)</span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Subtitle</span>
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                placeholder="e.g. STATE GOVERNING BODY FOR ROLLER SPORTS IN UTTAR PRADESH"
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-slate-200 font-semibold text-xs focus:outline-none uppercase"
              />
            </div>

            {/* Short Name / Acronym */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                संक्षिप्त नाम / Short Acronym
              </label>
              <input
                type="text"
                value={settings.shortName || ''}
                placeholder="UPRSA"
                onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-amber-400 font-mono font-bold text-sm focus:outline-none uppercase"
              />
            </div>

            {/* Affiliation Notice */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                संबद्धता नोटिस / Affiliation Notice
              </label>
              <input
                type="text"
                value={settings.affiliationNotice || ''}
                placeholder="Affiliated to Roller Skating Federation of India (RSFI) & UP Olympic Association"
                onChange={(e) => setSettings({ ...settings, affiliationNotice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Logo Upload & Preset Management */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white uppercase">
                2. एसोसिएशन का आधिकारिक लोगो (Official Logo & Emblem)
              </h3>
              <p className="text-xs text-slate-400">
                नया लोगो फ़ाइल अपलोड करें, इमेज URL दर्ज करें, अथवा प्रीसेट आधिकारिक लोगो चुनें
              </p>
            </div>
          </div>

          {/* Current Logo & Shape Controls */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <UprsaLogo 
                size="xl" 
                logoUrl={settings.logoUrl} 
                logoShape={settings.logoShape || 'shield'} 
              />
              <div className="space-y-1">
                <span className="text-white font-bold text-sm block">
                  {settings.logoUrl ? 'कस्टम लोगो सक्रिय है (Custom Logo Active)' : 'डिफ़ॉल्ट आधिकारिक UPRSA शील्ड लोगो (Default Emblem Active)'}
                </span>
                <span className="text-xs text-slate-400 block">
                  {settings.logoUrl ? 'यह लोगो हेडर, फूटर, आईडी कार्ड व प्रमाणपत्रों पर प्रदर्शित होगा।' : 'आधिकारिक UPRSA गोल्डन शील्ड, स्केट व्हील्स व तिरंगा रिबन युक्त लोगो।'}
                </span>
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logoUrl: '' })}
                    className="mt-2 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>डिफ़ॉल्ट लोगो पर रीसेट करें (Reset to Default Logo)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Shape Chooser */}
            <div className="space-y-2 w-full md:w-auto">
              <label className="text-xs font-bold text-slate-300 block">लोगो फ्रेम आकार (Logo Shape):</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoShape: 'shield' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    (settings.logoShape || 'shield') === 'shield'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  शील्ड (Shield)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoShape: 'circle' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    settings.logoShape === 'circle'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  सर्कल (Circle)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoShape: 'rounded' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    settings.logoShape === 'rounded'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  स्क्वायर (Box)
                </button>
              </div>
            </div>
          </div>

          {/* Upload and URL Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Upload File Button */}
            <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>कंप्यूटर/मोबाइल से नया लोगो अपलोड करें</span>
              </label>
              <p className="text-[11px] text-slate-400">
                JPG, PNG, WebP या SVG फ़ाइल चुनें (अधिकतम 8MB)
              </p>
              <label className="cursor-pointer w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                <Upload className="w-4 h-4 text-slate-950" />
                <span>{uploadingLogo ? 'अपलोड हो रहा है...' : 'लोगो फ़ाइल चुनें (Upload JPG / PNG Logo)'}</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>

            {/* Direct Image URL */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>अथवा सीधे इमेज वेब URL (Web Image Link) पेस्ट करें</span>
              </label>
              <p className="text-[11px] text-slate-400">
                यदि लोगो किसी सर्वर या वेबसाइट पर उपलब्ध है तो उसका लिंक यहां पेस्ट करें
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.logoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="https://example.com/uprsa-logo.png"
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-200 font-mono text-xs focus:outline-none"
                />
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logoUrl: '' })}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer"
                    title="Clear URL"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preset Quick Select Options */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-300 block">
              तैयार प्रीसेट लोगो विकल्प (Click to Apply Preset Emblem):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = (settings.logoUrl || '') === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSettings({ ...settings, logoUrl: preset.url })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 p-1">
                      {preset.url ? (
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-contain rounded" />
                      ) : (
                        <Shield className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs truncate">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{preset.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Hero Banner Slides Title & Subtitle Settings */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white uppercase">
                3. मुख्य स्क्रीन हीरो बैनर शीर्षक व विवरण (Hero Banner Headline)
              </h3>
              <p className="text-xs text-slate-400">
                होमपेज पर सबसे ऊपर बड़े बैनर में दिखने वाला शीर्षक व विवरण
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-amber-300 font-bold mb-1.5">
                हीरो मुख्य शीर्षक (हिंदी में)
              </label>
              <input
                type="text"
                value={settings.heroTitleHindi || ''}
                placeholder="उदा. उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन"
                onChange={(e) => setSettings({ ...settings, heroTitleHindi: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-white font-bold text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Hero Main Headline (English)
              </label>
              <input
                type="text"
                value={settings.heroTitle || ''}
                placeholder="e.g. UTTAR PRADESH ROLLER SPORTS ASSOCIATION"
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-white font-bold text-sm focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-amber-300 font-bold mb-1.5">
                हीरो उपशीर्षक / विवरण (हिंदी में)
              </label>
              <textarea
                rows={3}
                value={settings.heroSubtitleHindi || ''}
                placeholder="उदा. उत्तर प्रदेश भर में रोलर स्पोर्ट्स को प्रोत्साहन • चैंपियंस का निर्माण, राष्ट्र का निर्माण..."
                onChange={(e) => setSettings({ ...settings, heroSubtitleHindi: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Hero Subtitle Description (English)
              </label>
              <textarea
                rows={3}
                value={settings.heroSubtitle || ''}
                placeholder="e.g. Promoting Roller Sports Across Uttar Pradesh • Building Champions, Building Nation..."
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-3 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. Official Secretariat Contact Info */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>4. आधिकारिक सचिवालय संपर्क विवरण (Secretariat Contacts)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                आधिकारिक ईमेल (Official Email)
              </label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                हेल्पलाइन फोन (Secretariat Phone)
              </label>
              <input
                type="text"
                value={settings.contactPhone || ''}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">
                मुख्यालय का पता (State Secretariat Address)
              </label>
              <input
                type="text"
                value={settings.officialAddress || ''}
                onChange={(e) => setSettings({ ...settings, officialAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* 5. Social Media & Side Floating Toolbar Links */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-black text-white uppercase">
                  5. सोशल मीडिया व साइड टूलबार लिंक्स (Social Media & Floating Bar)
                </h3>
                <p className="text-xs text-slate-400">
                  स्क्रीन के साइड में व फूटर में दिखने वाले सोशल मीडिया पेजों के लिंक्स बदलें व सीधे खोलकर टेस्ट करें
                </p>
              </div>
            </div>

            {/* Quick Master Bar Toggle */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-300 font-bold">साइडबार:</span>
              <button
                type="button"
                onClick={() => setSettings(prev => ({
                  ...prev,
                  socialVisibility: {
                    ...prev.socialVisibility,
                    floatingBarEnabled: prev.socialVisibility?.floatingBarEnabled === false ? true : false
                  }
                }))}
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg transition-all ${
                  settings.socialVisibility?.floatingBarEnabled !== false
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {settings.socialVisibility?.floatingBarEnabled !== false ? 'चालू (ON)' : 'बंद (OFF)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Facebook */}
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  फेसबुक पेज (Facebook URL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const url = settings.socialLinks?.facebook || 'https://facebook.com/uprsa';
                    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-[10px] text-blue-300 hover:text-white bg-blue-600/20 hover:bg-blue-600/40 px-2 py-0.5 rounded border border-blue-500/30 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>खोलें / टेस्ट करें</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/uprsa"
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            {/* Instagram */}
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-pink-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  इंस्टाग्राम हैंडल (Instagram URL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const url = settings.socialLinks?.instagram || 'https://instagram.com/uprsa_official';
                    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-[10px] text-pink-300 hover:text-white bg-pink-600/20 hover:bg-pink-600/40 px-2 py-0.5 rounded border border-pink-500/30 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>खोलें / टेस्ट करें</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/uprsa_official"
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            {/* YouTube */}
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  यूट्यूब चैनल (YouTube Channel URL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const url = settings.socialLinks?.youtube || 'https://youtube.com/@uprsa';
                    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-[10px] text-red-300 hover:text-white bg-red-600/20 hover:bg-red-600/40 px-2 py-0.5 rounded border border-red-500/30 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>खोलें / टेस्ट करें</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                })}
                placeholder="https://youtube.com/@uprsa"
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            {/* WhatsApp */}
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  व्हाट्सएप हेल्पलाइन (WhatsApp Chat)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const raw = (settings.socialLinks?.whatsapp || '919415021989').replace(/[^0-9]/g, '');
                    const msg = encodeURIComponent(settings.socialLinks?.whatsappMessage || 'Hello UPRSA Secretariat');
                    window.open(`https://wa.me/${raw}?text=${msg}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-[10px] text-emerald-300 hover:text-white bg-emerald-600/20 hover:bg-emerald-600/40 px-2 py-0.5 rounded border border-emerald-500/30 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>खोलें / टेस्ट चैट</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.socialLinks?.whatsapp || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                })}
                placeholder="919415021989"
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            {/* X / Twitter */}
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  एक्स / ट्विटर (X Twitter URL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const url = settings.socialLinks?.twitter || 'https://x.com/uprsa_official';
                    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-[10px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>खोलें / टेस्ट करें</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                })}
                placeholder="https://x.com/uprsa_official"
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            {/* LinkedIn */}
            <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  लिंक्डइन पेज (LinkedIn URL)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const url = settings.socialLinks?.linkedin || 'https://linkedin.com/company/uprsa';
                    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-[10px] text-blue-300 hover:text-white bg-blue-600/20 hover:bg-blue-600/40 px-2 py-0.5 rounded border border-blue-500/30 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>खोलें / टेस्ट करें</span>
                </button>
              </div>
              <input
                type="text"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/company/uprsa"
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 6. Portal Key Metrics & Stats */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>5. मुख्य सांख्यिकी (Homepage Official Metrics)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                पंजीकृत खिलाड़ी (Registered Skaters)
              </label>
              <input
                type="number"
                value={settings.stats?.registeredSkaters || 1248}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, registeredSkaters: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                संबद्ध जिले (Districts)
              </label>
              <input
                type="number"
                value={settings.stats?.affiliatedDistricts || 75}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, affiliatedDistricts: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                राज्य चैंपियनशिप (Championships)
              </label>
              <input
                type="number"
                value={settings.stats?.stateChampionships || 36}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, stateChampionships: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                मान्यता प्राप्त क्लब (Clubs)
              </label>
              <input
                type="number"
                value={settings.stats?.recognizedClubs || 84}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, recognizedClubs: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            <span>💡 सेव करते ही पूरे पोर्टल पर नाम, सब-टाइटल और नया लोगो तुरंत लागू हो जाएगा।</span>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{saving ? 'परिवर्तन सेव हो रहे हैं...' : 'परिवर्तन सेव करें और प्रकाशित करें (Save & Publish)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
