import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { TickerItem } from '../../types';
import { api } from '../../services/api';

export const TickerManager: React.FC = () => {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TickerItem | null>(null);

  const [formState, setFormState] = useState({
    title: '',
    tag: 'NOTICE',
    link: 'home',
    isActive: true,
    priority: 1
  });

  useEffect(() => {
    loadTicker();
  }, []);

  const loadTicker = async () => {
    try {
      setLoading(true);
      const res = await api.getTickerItems();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (e) {
      console.error('Failed to load ticker items:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormState({
      title: '',
      tag: 'NOTICE',
      link: 'tournaments',
      isActive: true,
      priority: items.length + 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: TickerItem) => {
    setEditingItem(item);
    setFormState({
      title: item.title,
      tag: item.tag,
      link: item.link || 'home',
      isActive: item.isActive,
      priority: item.priority || 1
    });
    setShowModal(true);
  };

  const handleToggleActive = async (item: TickerItem) => {
    try {
      const updated = { ...item, isActive: !item.isActive };
      const res = await api.updateTickerItem(item.id, updated);
      if (res.success) {
        setItems(items.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
      }
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this ticker notification?')) return;
    try {
      const res = await api.deleteTickerItem(id);
      if (res.success) {
        setItems(items.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;
    setSaving(true);

    try {
      if (editingItem) {
        const res = await api.updateTickerItem(editingItem.id, formState);
        if (res.success && res.data) {
          setItems(items.map(i => i.id === editingItem.id ? res.data! : i));
        }
      } else {
        const res = await api.createTickerItem(formState);
        if (res.success && res.data) {
          setItems([res.data, ...items]);
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save ticker item:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">
              WEBSITE ANNOUNCEMENTS CMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">
            Top Live Scrolling Ticker Manager
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Broadcast breaking championship news, live race alerts, registration deadlines, and state circulars on the sticky top ticker.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ticker Item</span>
        </button>
      </div>

      {/* Ticker Items List */}
      <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
          <span>Active & Archived Ticker Notifications</span>
          <span className="text-xs font-mono font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
            {items.length} Items
          </span>
        </h3>

        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isActive 
                  ? 'bg-slate-950/70 border-slate-800 hover:border-amber-500/40' 
                  : 'bg-slate-950/30 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-[10px] font-black font-mono uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 shrink-0">
                  {item.tag}
                </span>

                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Target: <span className="font-mono text-slate-300">#{item.link || 'home'}</span></span>
                    <span>•</span>
                    <span className={item.isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {item.isActive ? '● Live on Portal' : '○ Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    item.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title={item.isActive ? 'Hide from live ticker' : 'Show on live ticker'}
                >
                  {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{item.isActive ? 'Active' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 cursor-pointer"
                  title="Edit Notification"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 cursor-pointer"
                  title="Delete Notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No ticker notifications created. Click "Add Ticker Item" to publish an announcement.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">
                {editingItem ? 'Edit Ticker Item' : 'New Ticker Notification'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Tag / Category (e.g. LIVE RESULT, REGISTRATION, NOTICE)
                </label>
                <input
                  type="text"
                  required
                  value={formState.tag}
                  onChange={(e) => setFormState({ ...formState, tag: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
                  placeholder="LIVE NOW, REGISTRATION, CIRCULAR"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Ticker Headline / Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  placeholder="36th UP State Championship: Heat 3 Sub-Junior 500m Speed is now LIVE..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Target Page Destination
                  </label>
                  <select
                    value={formState.link}
                    onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="live_score">Live Scoreboard</option>
                    <option value="results">Results & Records</option>
                    <option value="tournaments">Tournaments</option>
                    <option value="register">Registration</option>
                    <option value="news_gallery">News & Circulars</option>
                    <option value="home">Homepage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Display Status
                  </label>
                  <select
                    value={formState.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormState({ ...formState, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="true">Active (Published)</option>
                    <option value="false">Muted (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {saving ? 'Publishing...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
