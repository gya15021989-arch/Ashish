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
  X
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';

const DEFAULT_SETTINGS: SiteSettings = {
  organizationName: 'Uttar Pradesh Roller Sports Association',
  shortName: 'UPRSA',
  tagline: 'STATE GOVERNING BODY FOR ROLLER SPORTS IN UTTAR PRADESH',
  affiliationNotice: 'Affiliated to Roller Skating Federation of India (RSFI) & UP Olympic Association (UPOA)',
  logoUrl: '',
  contactEmail: 'sec.uprsa@gmail.com',
  contactPhone: '+91 94150 23456',
  officialAddress: 'UPRSA State Secretariat, K.D. Singh Babu Stadium Complex, Hazratganj, Lucknow, UP - 226001',
  registrationOpen: true,
  liveStreamingActive: true,
  headerNotice: 'OFFICIAL RSFI RECOGNIZED STATE GOVERNING BODY',
  socialLinks: {
    facebook: 'https://facebook.com/uprsa.official',
    instagram: 'https://instagram.com/uprsa_official',
    youtube: 'https://youtube.com/@uprollersports',
    twitter: 'https://twitter.com/uprsa_sports'
  },
  stats: {
    registeredSkaters: 1248,
    affiliatedDistricts: 75,
    stateChampionships: 36,
    recognizedClubs: 84
  }
};

export const SiteSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please choose a smaller JPG image.');
      return;
    }
    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await api.uploadFile(file.name, base64, false);
        if (res.success && res.fileUrl) {
          setSettings(prev => ({ ...prev, logoUrl: res.fileUrl }));
        }
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setUploadingLogo(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSiteSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.error('Failed to load site settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.updateSiteSettings(settings);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to update site settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              HOMEPAGE & PORTAL CMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">
            Official Organization & Site Settings
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Update state federation legal name, affiliation notices, official contacts, portal statistics, and registration availability.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Site settings and homepage configurations updated successfully across all visitor sessions.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Identity & Legal Subtitle */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>State Association Brand & Affiliation</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Official Organization Name
              </label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Short Name / Acronym
              </label>
              <input
                type="text"
                value={settings.shortName}
                onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">
                Sub-title / Official State Body Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">
                Affiliation Notice
              </label>
              <input
                type="text"
                value={settings.affiliationNotice}
                onChange={(e) => setSettings({ ...settings, affiliationNotice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
              />
            </div>

            {/* Official Logo (JPG / PNG) */}
            <div className="md:col-span-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Official Organization Logo & Crest (JPG / PNG)
                </label>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  JPG UPLOAD
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={settings.logoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="https://... or upload a local JPG file"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono text-xs"
                />

                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{uploadingLogo ? 'Uploading...' : 'Upload JPG Logo'}</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>

              {settings.logoUrl && (
                <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 w-fit">
                  <img
                    src={settings.logoUrl}
                    alt="Logo Preview"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain bg-white/5 rounded-lg p-1"
                  />
                  <div className="text-xs">
                    <span className="text-white font-bold block">Current Logo Preview</span>
                    <span className="text-[10px] text-slate-500 font-mono">JPG / Image verified</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logoUrl: '' })}
                    className="p-1 text-slate-500 hover:text-rose-400 ml-2"
                    title="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Portal Operations & Status */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Portal Availability & Live Status</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">State Skater Registration</h4>
                <p className="text-slate-400 text-[11px]">Allow new skaters to register for digital athlete ID.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.registrationOpen}
                onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.checked })}
                className="w-5 h-5 text-amber-500 rounded bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Live Scoreboard Status</h4>
                <p className="text-slate-400 text-[11px]">Broadcast live stadium race transponder updates.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.liveStreamingActive}
                onChange={(e) => setSettings({ ...settings, liveStreamingActive: e.target.checked })}
                className="w-5 h-5 text-amber-500 rounded bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Secretariat Contact Info */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Official Secretariat Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                State Secretariat Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">
                State Headquarters Physical Address
              </label>
              <input
                type="text"
                value={settings.officialAddress}
                onChange={(e) => setSettings({ ...settings, officialAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* 4. Official Portal Stats */}
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>State Federation Key Metrics (Homepage Display)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Registered Skaters
              </label>
              <input
                type="number"
                value={settings.stats?.registeredSkaters || 1200}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, registeredSkaters: parseInt(e.target.value) || 0 }
                })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Affiliated Districts
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
                State Championships
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
                Recognized Clubs
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

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
