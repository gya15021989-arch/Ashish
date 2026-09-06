import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Smartphone, 
  Compass, 
  Play, 
  Trophy, 
  Check, 
  X,
  Activity,
  ArrowRight,
  Sparkles,
  Link,
  Zap,
  Flame,
  HelpCircle,
  MoveUp,
  Volume2
} from 'lucide-react';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../context/SiteSettingsContext';
import { api } from '../../services/api';
import { TickerItem, LiveScoreConfig, TopTickerConfig } from '../../types';

export const LiveScoreCMSManager: React.FC = () => {
  const { settings, updateSettings, reloadSettings } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Top LIVE NOW Bar & Ticker Config
  const [topTickerConfig, setTopTickerConfig] = useState<TopTickerConfig>(
    settings.topTickerConfig || DEFAULT_SITE_SETTINGS.topTickerConfig || {
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
    }
  );

  // Bottom Floating Live Score Button Config
  const [widgetConfig, setWidgetConfig] = useState<LiveScoreConfig>(
    settings.liveScoreWidget || DEFAULT_SITE_SETTINGS.liveScoreWidget || {
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
    }
  );

  // Top Live Ticker Items List
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [loadingTicker, setLoadingTicker] = useState(true);
  const [tickerModalOpen, setTickerModalOpen] = useState(false);
  const [editingTickerItem, setEditingTickerItem] = useState<TickerItem | null>(null);
  const [tickerForm, setTickerForm] = useState({
    title: '',
    tag: 'LIVE NOW',
    link: 'live_score',
    isActive: true,
    priority: 1
  });

  // Active Sub-Tab: 'top_live_now' | 'ticker_items' | 'bottom_widget'
  const [activeSection, setActiveSection] = useState<'top_live_now' | 'ticker_items' | 'bottom_widget'>('top_live_now');

  useEffect(() => {
    if (settings.topTickerConfig) {
      setTopTickerConfig(settings.topTickerConfig);
    }
    if (settings.liveScoreWidget) {
      setWidgetConfig(settings.liveScoreWidget);
    }
    loadTickerItems();
  }, [settings]);

  const loadTickerItems = async () => {
    try {
      setLoadingTicker(true);
      const res = await api.getTickerItems();
      if (res.success && res.data) {
        setTickerItems(res.data);
      }
    } catch (e) {
      console.error('Failed to load ticker items:', e);
    } finally {
      setLoadingTicker(false);
    }
  };

  const handleSaveAllConfig = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const ok = await updateSettings({
        topTickerConfig,
        liveScoreWidget: widgetConfig
      });

      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError('सेव करने में समस्या आई। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      setSaveError('सर्वर त्रुटि। सेटिंग्स सहेजने में विफल।');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('क्या आप सभी लाइव सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      if (DEFAULT_SITE_SETTINGS.topTickerConfig) {
        setTopTickerConfig(DEFAULT_SITE_SETTINGS.topTickerConfig);
      }
      if (DEFAULT_SITE_SETTINGS.liveScoreWidget) {
        setWidgetConfig(DEFAULT_SITE_SETTINGS.liveScoreWidget);
      }
    }
  };

  // Test Opening Links
  const handleTestOpenTopBadgeLink = () => {
    if (topTickerConfig.badgeActionType === 'external') {
      const url = topTickerConfig.badgeExternalUrl || 'https://youtube.com';
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
    } else {
      const target = topTickerConfig.badgeTargetPage || 'live_score';
      window.open(`/#${target}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTestOpenTopRightBtnLink = () => {
    if (topTickerConfig.rightButtonActionType === 'external') {
      const url = topTickerConfig.rightButtonExternalUrl || 'https://youtube.com';
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
    } else {
      const target = topTickerConfig.rightButtonTargetPage || 'live_score';
      window.open(`/#${target}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTestOpenWidgetLink = () => {
    if (widgetConfig.actionType === 'external') {
      const url = widgetConfig.externalUrl || 'https://youtube.com';
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
    } else {
      const target = widgetConfig.targetPage || 'live_score';
      window.open(`/#${target}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTestOpenTickerLink = (link?: string) => {
    if (!link) return;
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('www.')) {
      const url = link.startsWith('www.') ? `https://${link}` : link;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`/#${link}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Ticker items handlers
  const handleOpenAddTicker = () => {
    setEditingTickerItem(null);
    setTickerForm({
      title: '',
      tag: 'LIVE NOW',
      link: 'live_score',
      isActive: true,
      priority: tickerItems.length + 1
    });
    setTickerModalOpen(true);
  };

  const handleOpenEditTicker = (item: TickerItem) => {
    setEditingTickerItem(item);
    setTickerForm({
      title: item.title,
      tag: item.tag || 'LIVE NOW',
      link: item.link || 'live_score',
      isActive: item.isActive,
      priority: item.priority || 1
    });
    setTickerModalOpen(true);
  };

  const handleToggleTickerActive = async (item: TickerItem) => {
    try {
      const updated = { ...item, isActive: !item.isActive };
      const res = await api.updateTickerItem(item.id, updated);
      if (res.success) {
        setTickerItems(tickerItems.map(i => i.id === item.id ? { ...i, isActive: !item.isActive } : i));
      }
    } catch (err) {
      console.error('Failed to toggle ticker item:', err);
    }
  };

  const handleDeleteTicker = async (id: string) => {
    if (!confirm('क्या आप इस लाइव टिकर नोटिफिकेशन को हटाना चाहते हैं?')) return;
    try {
      const res = await api.deleteTickerItem(id);
      if (res.success) {
        setTickerItems(tickerItems.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete ticker item:', err);
    }
  };

  const handleSaveTickerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerForm.title.trim()) return;

    try {
      setSaving(true);
      if (editingTickerItem) {
        const res = await api.updateTickerItem(editingTickerItem.id, tickerForm);
        if (res.success && res.data) {
          setTickerItems(tickerItems.map(i => i.id === editingTickerItem.id ? res.data! : i));
        }
      } else {
        const res = await api.createTickerItem(tickerForm);
        if (res.success && res.data) {
          setTickerItems([res.data, ...tickerItems]);
        }
      }
      setTickerModalOpen(false);
    } catch (err) {
      console.error('Failed to save ticker item:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" id="live-score-cms-manager">
      {/* Top Title Banner */}
      <div className="bg-gradient-to-r from-[#0a1224] via-[#0f1d38] to-[#16223e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE NOW & LIVE SCORE CMS CONTROL</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              ऊपर लाइव नाउ (LIVE NOW) व लाइव स्कोर सीएमएस
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              वेबसाइट पर सबसे ऊपर दिखने वाले <strong className="text-red-400">"LIVE NOW"</strong> बैज, टिकर लिंक्स, यूट्यूब लाइव/वेबस्ट्रीम URL, दाएँ बटन एवं नीचे के फ्लोटिंग लाइव स्कोर विजेट को यहाँ से सीधे एडिट, लिंक चेंज और टेस्ट करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefault}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
              title="डिफ़ॉल्ट सेटिंग्स रीसेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>

            <button
              onClick={handleSaveAllConfig}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xl cursor-pointer ${
                saving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-500/30 active:scale-95'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'सहेज रहे हैं...' : 'परिवर्तन सेव करें (Publish All)'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>लाइव सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं और लाइव वेबसाइट पर तुरंत लागू हैं!</span>
          </div>
        )}

        {saveError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}
      </div>

      {/* Sub Navigation Bar - 3 Clear Tabs */}
      <div className="bg-[#0b1329] border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveSection('top_live_now')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'top_live_now'
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black shadow-lg shadow-red-500/25'
              : 'text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80'
          }`}
        >
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>1. ऊपर का LIVE NOW बैज व लिंक (Top Header Badge)</span>
        </button>

        <button
          onClick={() => setActiveSection('ticker_items')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'ticker_items'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-500/25'
              : 'text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span>2. लाइव टिकर समाचार व परिणाम लिंक्स ({tickerItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('bottom_widget')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'bottom_widget'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black shadow-lg shadow-amber-500/25'
              : 'text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80'
          }`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>3. नीचे का फ्लोटिंग लाइव स्कोर बटन (Bottom Widget)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TOP "LIVE NOW" BADGE & TOP BAR SETTINGS */}
      {/* ========================================================================= */}
      {activeSection === 'top_live_now' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Controls (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Header with Status Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 font-bold">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
                      <span>टॉप "LIVE NOW" बैज व लिंक सेटिंग्स</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      वेबसाइट पर सबसे ऊपर दिखने वाले LIVE NOW बटन का टेक्स्ट, लिंक और क्लिक एक्शन सेट करें
                    </p>
                  </div>
                </div>

                {/* Master Active / Disabled Switch for Top Ticker Bar */}
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300">टॉप टिकर बार:</span>
                  <button
                    type="button"
                    onClick={() => setTopTickerConfig({ ...topTickerConfig, enabled: !topTickerConfig.enabled })}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      topTickerConfig.enabled
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {topTickerConfig.enabled ? 'सक्रिय (ACTIVE)' : 'छुपा हुआ (DISABLED)'}
                  </button>
                </div>
              </div>

              {/* LIVE NOW Badge Settings */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-sm font-black text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span>A. "LIVE NOW" बैज टेक्स्ट व एनिमेशन</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestOpenTopBadgeLink}
                    className="text-xs bg-red-600 hover:bg-red-500 text-white font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>LIVE NOW लिंक टेस्ट करें</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Badge Text */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                      <span>बैज का नाम / टेक्स्ट (Badge Label)</span>
                      <span className="text-[10px] text-red-400 font-mono">जैसे: LIVE NOW</span>
                    </label>
                    <input
                      type="text"
                      value={topTickerConfig.badgeText || ''}
                      onChange={(e) => setTopTickerConfig({ ...topTickerConfig, badgeText: e.target.value })}
                      placeholder="LIVE NOW"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono uppercase font-black focus:border-red-400 focus:outline-none"
                    />
                  </div>

                  {/* Pulse Effect */}
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-700/80 cursor-pointer h-[46px]">
                      <input
                        type="checkbox"
                        checked={topTickerConfig.badgePulse !== false}
                        onChange={(e) => setTopTickerConfig({ ...topTickerConfig, badgePulse: e.target.checked })}
                        className="w-4 h-4 rounded text-red-500"
                      />
                      <div>
                        <span className="font-bold text-white block text-xs">रेड ब्लिंकिंग पल्स बीकन</span>
                        <span className="text-[10px] text-slate-400">लाइव इंडिकेटर एनीमेशन दिखाएं</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Where does clicking "LIVE NOW" go? */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-300">
                    जब कोई ऊपर <strong className="text-red-400">"{topTickerConfig.badgeText || 'LIVE NOW'}"</strong> पर क्लिक करे, तो क्या खुले?
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label
                      onClick={() => setTopTickerConfig({ ...topTickerConfig, badgeActionType: 'internal' })}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        topTickerConfig.badgeActionType !== 'external'
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="badgeActionType"
                        checked={topTickerConfig.badgeActionType !== 'external'}
                        onChange={() => setTopTickerConfig({ ...topTickerConfig, badgeActionType: 'internal' })}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-bold block text-amber-300">आंतरिक पोर्टल पेज (Internal View)</span>
                        <span className="text-[11px] text-slate-400">लाइव स्कोरबोर्ड, रेस कंसोल या रिजल्ट्स खोलें</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setTopTickerConfig({ ...topTickerConfig, badgeActionType: 'external' })}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        topTickerConfig.badgeActionType === 'external'
                          ? 'bg-red-500/10 border-red-500/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="badgeActionType"
                        checked={topTickerConfig.badgeActionType === 'external'}
                        onChange={() => setTopTickerConfig({ ...topTickerConfig, badgeActionType: 'external' })}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-bold block text-red-400">यूट्यूब लाइव / बाहरी वेब लिंक (External URL)</span>
                        <span className="text-[11px] text-slate-400">YouTube Live, Facebook Live या अन्य पोर्टल URL</span>
                      </div>
                    </label>
                  </div>

                  {/* Target input */}
                  {topTickerConfig.badgeActionType !== 'external' ? (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-bold text-slate-300">
                        आंतरिक पेज चुनें (Target Internal Page)
                      </label>
                      <select
                        value={topTickerConfig.badgeTargetPage || 'live_score'}
                        onChange={(e) => setTopTickerConfig({ ...topTickerConfig, badgeTargetPage: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="live_score">🏆 लाइव स्कोरबोर्ड (Live Race Scoreboard - live_score)</option>
                        <option value="race_console">⚡ लाइव हीट्स टाइमिंग कंसोल (Live Heats Console - race_console)</option>
                        <option value="results">🥇 आधिकारिक परिणाम व मेडल (Results & Medals - results)</option>
                        <option value="tournaments">📅 चैंपियनशिप कैलेंडर (Tournament Calendar - tournaments)</option>
                        <option value="rankings">📊 स्टेट लीडरबोर्ड व रैंकिंग्स (State Rankings - rankings)</option>
                        <option value="register">📝 खिलाड़ी पंजीकरण (Athlete Registration - register)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>यूट्यूब लाइव स्ट्रीम / एक्सटर्नल URL लिंक (Full Web Link)</span>
                        <span className="text-[10px] text-red-400 font-mono">जैसे: https://youtube.com/live/...</span>
                      </label>
                      <input
                        type="text"
                        value={topTickerConfig.badgeExternalUrl || ''}
                        onChange={(e) => setTopTickerConfig({ ...topTickerConfig, badgeExternalUrl: e.target.value })}
                        placeholder="https://youtube.com/live/your-match-id or https://rsfi.live"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Quick Action Button Settings */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-sm font-black text-white">
                    <Play className="w-4 h-4 text-amber-400 fill-current" />
                    <span>B. दाएँ तरफ का क्विक बटन (Right Action Button)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestOpenTopRightBtnLink}
                    className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>दायाँ बटन टेस्ट करें</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Button Text */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      बटन टेक्स्ट (Button Text)
                    </label>
                    <input
                      type="text"
                      value={topTickerConfig.rightButtonText || ''}
                      onChange={(e) => setTopTickerConfig({ ...topTickerConfig, rightButtonText: e.target.value })}
                      placeholder="Scoreboard"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Show Right Button Toggle */}
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-700/80 cursor-pointer h-[46px]">
                      <input
                        type="checkbox"
                        checked={topTickerConfig.showRightButton !== false}
                        onChange={(e) => setTopTickerConfig({ ...topTickerConfig, showRightButton: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500"
                      />
                      <div>
                        <span className="font-bold text-white block text-xs">दायाँ बटन प्रदर्शित करें</span>
                        <span className="text-[10px] text-slate-400">डेस्कटॉप स्क्रीन पर यह बटन दिखेगा</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Right Button Link Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      लिंक प्रकार (Link Type)
                    </label>
                    <select
                      value={topTickerConfig.rightButtonActionType || 'internal'}
                      onChange={(e) => setTopTickerConfig({ ...topTickerConfig, rightButtonActionType: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold"
                    >
                      <option value="internal">आंतरिक पोर्टल पेज (Internal Page)</option>
                      <option value="external">बाहरी वेब लिंक (External URL)</option>
                    </select>
                  </div>

                  <div>
                    {topTickerConfig.rightButtonActionType === 'external' ? (
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          एक्सटर्नल URL (External URL)
                        </label>
                        <input
                          type="text"
                          value={topTickerConfig.rightButtonExternalUrl || ''}
                          onChange={(e) => setTopTickerConfig({ ...topTickerConfig, rightButtonExternalUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          टारगेट पेज (Target Page)
                        </label>
                        <select
                          value={topTickerConfig.rightButtonTargetPage || 'live_score'}
                          onChange={(e) => setTopTickerConfig({ ...topTickerConfig, rightButtonTargetPage: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs"
                        >
                          <option value="live_score">live_score (लाइव स्कोर)</option>
                          <option value="race_console">race_console (रेस कंसोल)</option>
                          <option value="results">results (परिणाम)</option>
                          <option value="tournaments">tournaments (प्रतियोगिताएं)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Speed & Pause Settings */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-white border-b border-slate-800 pb-3">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span>C. टिकर स्क्रॉल गति व होवर व्यवहार</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">
                      स्क्रॉल स्पीड (Scroll Speed)
                    </label>
                    <select
                      value={topTickerConfig.scrollSpeed || 'medium'}
                      onChange={(e) => setTopTickerConfig({ ...topTickerConfig, scrollSpeed: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold"
                    >
                      <option value="slow">धीमी (Slow - पढ़ने में आसान)</option>
                      <option value="medium">मध्यम (Medium - अनुशंसित)</option>
                      <option value="fast">तेज (Fast)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-700/80 cursor-pointer h-[46px]">
                      <input
                        type="checkbox"
                        checked={topTickerConfig.pauseOnHover !== false}
                        onChange={(e) => setTopTickerConfig({ ...topTickerConfig, pauseOnHover: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500"
                      />
                      <div>
                        <span className="font-bold text-white block text-xs">माउस ले जाने पर रोकें (Pause on Hover)</span>
                        <span className="text-[10px] text-slate-400">पढ़ने में सुविधा के लिए स्क्रॉल रुक जाएगा</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Live Preview (1 col) */}
          <div className="space-y-6">
            <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>टॉप लाइव बार प्रिव्यू (Live Preview)</span>
              </h3>

              <p className="text-xs text-slate-400">
                वेबसाइट के शीर्ष पर यह लाइव टिकर इस तरह दिखाई देगा। सीधे इस पर क्लिक करके टेस्ट कर सकते हैं:
              </p>

              {/* Rendered Live Ticker Header Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {topTickerConfig.enabled ? (
                  <div className="relative z-10 w-full bg-[#050b18] border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-lg">
                    {/* Badge */}
                    <button
                      type="button"
                      onClick={handleTestOpenTopBadgeLink}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/30 border border-red-500/70 text-red-400 hover:text-white hover:bg-red-600 shrink-0 font-black text-[10px] transition-all cursor-pointer shadow-md"
                      title="क्लिक करके लाइव लिंक खोलें"
                    >
                      {topTickerConfig.badgePulse !== false && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                      <Radio className="w-3 h-3 text-red-400" />
                      <span>{topTickerConfig.badgeText || 'LIVE NOW'}</span>
                      {topTickerConfig.badgeActionType === 'external' && <ExternalLink className="w-2.5 h-2.5" />}
                    </button>

                    {/* Dummy ticker text */}
                    <div className="text-[11px] text-slate-300 truncate max-w-[130px]">
                      {tickerItems[0]?.title || '36th UP State Championship: Heat 3 Sub-Junior 500m...'}
                    </div>

                    {/* Right button */}
                    {topTickerConfig.showRightButton !== false && (
                      <button
                        type="button"
                        onClick={handleTestOpenTopRightBtnLink}
                        className="text-[10px] font-bold text-amber-400 bg-slate-900 border border-amber-500/40 px-2 py-0.8 rounded-lg shrink-0 flex items-center gap-1"
                      >
                        <span>{topTickerConfig.rightButtonText || 'Scoreboard'}</span>
                        <Play className="w-2 h-2 fill-current" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-xs font-bold">
                    [टॉप टिकर बार वर्तमान में बंद (Hidden) है]
                  </div>
                )}
              </div>

              {/* Status Info Box */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>LIVE NOW लिंक:</span>
                  <span className="text-red-400 font-mono font-bold truncate max-w-[150px]">
                    {topTickerConfig.badgeActionType === 'external' ? (topTickerConfig.badgeExternalUrl || 'External URL') : topTickerConfig.badgeTargetPage}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>दायाँ बटन लिंक:</span>
                  <span className="text-amber-400 font-mono font-bold truncate max-w-[150px]">
                    {topTickerConfig.rightButtonActionType === 'external' ? (topTickerConfig.rightButtonExternalUrl || 'External URL') : topTickerConfig.rightButtonTargetPage}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveAllConfig}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'सहेज रहे हैं...' : 'परिवर्तन सेव करें (Save Top LIVE NOW)'}</span>
              </button>
            </div>

            {/* Quick Helper */}
            <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-5 shadow-xl text-xs space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>त्वरित सुझाव (Help Tip)</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                यदि किसी प्रतियोगिता का लाइव प्रसारण यूट्यूब पर चल रहा है, तो <strong>"यूट्यूब लाइव / बाहरी वेब लिंक"</strong> चुनकर अपना यूट्यूब लाइव लिंक पेस्ट करें। दर्शक जब भी ऊपर <strong>LIVE NOW</strong> पर क्लिक करेंगे, वे सीधे लाइव स्ट्रीम पर पहुँच जाएंगे।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TOP TICKER ITEMS & ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      {activeSection === 'ticker_items' && (
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>लाइव टिकर की खबरें व सूचनाएं (Top Marquee Ticker Items)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                वेबसाइट पर सबसे ऊपर स्क्रॉल होने वाली प्रत्येक लाइव रेस खबर, रिजल्ट और उनके लिंक को जोड़ें, एडिट करें व टेस्ट करें
              </p>
            </div>

            <button
              onClick={handleOpenAddTicker}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नया लाइव टिकर आइटम जोड़ें</span>
            </button>
          </div>

          {/* Ticker List */}
          {loadingTicker ? (
            <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">
              लोड हो रहा है...
            </div>
          ) : tickerItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              कोई टिकर आइटम नहीं मिला। "नया लाइव टिकर आइटम जोड़ें" पर क्लिक करके नया जोड़ें।
            </div>
          ) : (
            <div className="space-y-3">
              {tickerItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.isActive
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-slate-950/50 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-black uppercase">
                        {item.tag || 'LIVE NOW'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        टारगेट लिंक: <strong className="text-amber-400">{item.link || 'live_score'}</strong>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      {item.title}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Test & Open Link Button */}
                    <button
                      type="button"
                      onClick={() => handleTestOpenTickerLink(item.link)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="लिंक खोलें व टेस्ट करें"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>खोलें / टेस्ट करें</span>
                    </button>

                    {/* Toggle Active Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleTickerActive(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        item.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>चालू</span>
                        </>
                      ) : (
                        <span>बंद</span>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditTicker(item)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                      title="एडिट करें"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTicker(item.id)}
                      className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: BOTTOM FLOATING LIVE SCORE WIDGET */}
      {/* ========================================================================= */}
      {activeSection === 'bottom_widget' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Controls (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white uppercase">
                      नीचे का फ्लोटिंग लाइव बटन (Floating Widget)
                    </h2>
                    <p className="text-xs text-slate-400">
                      स्क्रीन के निचले कोने पर तैरने वाले लाइव स्कोर बटन की सेटिंग्स
                    </p>
                  </div>
                </div>

                {/* Master Switch */}
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300">स्टेटस:</span>
                  <button
                    type="button"
                    onClick={() => setWidgetConfig({ ...widgetConfig, enabled: !widgetConfig.enabled })}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      widgetConfig.enabled
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {widgetConfig.enabled ? 'सक्रिय (ACTIVE)' : 'छुपा हुआ (DISABLED)'}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                    <span>मुख्य शीर्षक (Primary Heading)</span>
                    <span className="text-[10px] text-amber-400 font-mono">जैसे: LIVE SCORING</span>
                  </label>
                  <input
                    type="text"
                    value={widgetConfig.title || ''}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, title: e.target.value })}
                    placeholder="LIVE SCORING"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                    <span>उप-शीर्षक / इवेंट नाम (Subtitle / Event)</span>
                    <span className="text-[10px] text-amber-400 font-mono">जैसे: 36th State Trials</span>
                  </label>
                  <input
                    type="text"
                    value={widgetConfig.subtitle || ''}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, subtitle: e.target.value })}
                    placeholder="36th State Trials - 500m Sprint"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Status Badge */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                    <span>बैज टेक्स्ट (Live Status Badge)</span>
                    <span className="text-[10px] text-red-400 font-mono">जैसे: LIVE NOW, FINALS</span>
                  </label>
                  <input
                    type="text"
                    value={widgetConfig.badge || ''}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, badge: e.target.value })}
                    placeholder="LIVE NOW"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono uppercase focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    स्क्रीन पोज़ीशन (Button Position)
                  </label>
                  <select
                    value={widgetConfig.position || 'bottom-right'}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, position: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-bold focus:border-amber-400 focus:outline-none"
                  >
                    <option value="bottom-right">दाएँ नीचे (Bottom Right - अनुशंसित)</option>
                    <option value="bottom-left">बाएँ नीचे (Bottom Left)</option>
                  </select>
                </div>
              </div>

              {/* Action Type & Target URL Section */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>क्लिक करने पर खुलने वाला लिंक (Target Destination)</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleTestOpenWidgetLink}
                    className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>खोलें / टेस्ट करें</span>
                  </button>
                </div>

                {/* Choice: Internal Portal Page vs External Web Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label 
                    onClick={() => setWidgetConfig({ ...widgetConfig, actionType: 'internal' })}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      widgetConfig.actionType !== 'external'
                        ? 'bg-amber-500/10 border-amber-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="widgetActionType"
                      checked={widgetConfig.actionType !== 'external'}
                      onChange={() => setWidgetConfig({ ...widgetConfig, actionType: 'internal' })}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-bold block text-amber-300">आंतरिक पोर्टल पेज (Internal View)</span>
                      <span className="text-[11px] text-slate-400">लाइव स्कोरबोर्ड, रेस कंसोल या परिणाम खोलें</span>
                    </div>
                  </label>

                  <label 
                    onClick={() => setWidgetConfig({ ...widgetConfig, actionType: 'external' })}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      widgetConfig.actionType === 'external'
                        ? 'bg-red-500/10 border-red-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="widgetActionType"
                      checked={widgetConfig.actionType === 'external'}
                      onChange={() => setWidgetConfig({ ...widgetConfig, actionType: 'external' })}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-bold block text-red-400">यूट्यूब / बाहरी लाइव लिंक (External URL)</span>
                      <span className="text-[11px] text-slate-400">यूट्यूब लाइव स्ट्रीम, फेसबुक लाइव, या अन्य लिंक</span>
                    </div>
                  </label>
                </div>

                {/* Conditional Inputs */}
                {widgetConfig.actionType !== 'external' ? (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-bold text-slate-300">
                      आंतरिक पेज चुनें (Target Internal Page)
                    </label>
                    <select
                      value={widgetConfig.targetPage || 'live_score'}
                      onChange={(e) => setWidgetConfig({ ...widgetConfig, targetPage: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="live_score">🏆 लाइव स्कोरबोर्ड (Live Race Scoreboard - live_score)</option>
                      <option value="race_console">⚡ लाइव रेस कंसोल (Live Heats Timing Console - race_console)</option>
                      <option value="results">🥇 परिणाम एवं मेडल टैली (Official Results & Times - results)</option>
                      <option value="tournaments">📅 चैंपियनशिप कैलेंडर (Tournament Calendar - tournaments)</option>
                      <option value="rankings">📊 स्टेट लीडरबोर्ड व रैंकिंग्स (State Rankings - rankings)</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>बाहरी लाइव स्ट्रीमिंग URL (External Streaming / Portal Link)</span>
                      <span className="text-[10px] text-red-400 font-mono">जैसे: https://youtube.com/watch?v=...</span>
                    </label>
                    <input
                      type="text"
                      value={widgetConfig.externalUrl || ''}
                      onChange={(e) => setWidgetConfig({ ...widgetConfig, externalUrl: e.target.value })}
                      placeholder="https://youtube.com/live/your-stream-id or https://rsfi.live"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <label className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetConfig.pulseAnimation !== false}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, pulseAnimation: e.target.checked })}
                    className="w-4 h-4 rounded text-red-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-white block">पल्स एनीमेशन (Pulse Effect)</span>
                    <span className="text-[11px] text-slate-400">ब्लिंकिंग बीकन प्रदर्शित करें</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetConfig.showOnMobile !== false}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, showOnMobile: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-white block">मोबाइल पर दिखाएं (Show on Mobile)</span>
                    <span className="text-[11px] text-slate-400">स्मार्टफोन स्क्रीन पर भी प्रदर्शित करें</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="space-y-6">
            <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>फ्लोटिंग बटन प्रिव्यू (Live Preview)</span>
              </h3>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {widgetConfig.enabled ? (
                  <button
                    onClick={handleTestOpenWidgetLink}
                    className="relative z-10 group flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2.5 rounded-full shadow-2xl shadow-red-500/40 border border-red-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    {widgetConfig.pulseAnimation !== false && (
                      <div className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </div>
                    )}

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                        <span className="text-xs font-black tracking-wider uppercase">
                          {widgetConfig.title || 'LIVE SCORING'}
                        </span>
                        {widgetConfig.badge && (
                          <span className="bg-white/20 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight">
                            {widgetConfig.badge}
                          </span>
                        )}
                        {widgetConfig.actionType === 'external' && (
                          <ExternalLink className="w-3 h-3 text-amber-200" />
                        )}
                      </div>
                      {widgetConfig.subtitle && (
                        <span className="text-[10px] text-amber-100 font-medium block leading-tight max-w-[160px] truncate">
                          {widgetConfig.subtitle}
                        </span>
                      )}
                    </div>
                  </button>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs font-bold">
                    [फ्लोटिंग बटन वर्तमान में बंद (Hidden) है]
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveAllConfig}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'सहेज रहे हैं...' : 'परिवर्तन सेव करें (Save Bottom Widget)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT TICKER ITEM */}
      {/* ========================================================================= */}
      {tickerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b1329] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                <span>{editingTickerItem ? 'लाइव टिकर आइटम संपादित करें' : 'नया लाइव टिकर आइटम जोड़ें'}</span>
              </h3>
              <button
                onClick={() => setTickerModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTickerForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  टैग / लेबल (Badge Tag)
                </label>
                <select
                  value={tickerForm.tag}
                  onChange={(e) => setTickerForm({ ...tickerForm, tag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="LIVE NOW">🔴 LIVE NOW (लाइव स्कोर)</option>
                  <option value="LIVE RESULT">🏆 LIVE RESULT (लाइव परिणाम)</option>
                  <option value="STATE TRIALS">⚡ STATE TRIALS (राज्य ट्रायल्स)</option>
                  <option value="REGISTRATION">📝 REGISTRATION (पंजीकरण)</option>
                  <option value="CIRCULAR">📜 CIRCULAR (सर्कुलर / अधिसूचना)</option>
                  <option value="NOTICE">📢 NOTICE (सामान्य सूचना)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  समाचार / लाइव स्कोर विवरण (Notification Content)
                </label>
                <textarea
                  value={tickerForm.title}
                  onChange={(e) => setTickerForm({ ...tickerForm, title: e.target.value })}
                  rows={3}
                  placeholder="36th UP State Championship: Heat 3 Sub-Junior 500m Speed — Abhishek Verma leads with 00:48.32"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>टारगेट लिंक / URL (Target Link)</span>
                  <span className="text-[10px] text-amber-400 font-mono">जैसे: live_score, results, https://...</span>
                </label>
                <input
                  type="text"
                  value={tickerForm.link}
                  onChange={(e) => setTickerForm({ ...tickerForm, link: e.target.value })}
                  placeholder="live_score or https://youtube.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tickerForm.isActive}
                    onChange={(e) => setTickerForm({ ...tickerForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-500"
                  />
                  <span>सक्रिय (Active ON)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setTickerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  {saving ? 'सहेज रहे हैं...' : 'सेव करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
