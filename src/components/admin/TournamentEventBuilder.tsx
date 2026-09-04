import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { Tournament, TournamentEvent } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES, AGE_CATEGORIES_2026 } from '../../data/uprsaKnowledge';

export const TournamentEventBuilder: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Tournament Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [district, setDistrict] = useState('Lucknow');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-10-05');
  const [entryFeeBase, setEntryFeeBase] = useState(1000);
  const [level, setLevel] = useState<'State' | 'National' | 'Zonal' | 'District' | 'Invitational'>('State');
  const [events, setEvents] = useState<TournamentEvent[]>([
    {
      id: 'ev-1',
      tournamentId: '',
      eventName: '500m + D Sprint',
      discipline: 'Speed Skating (Quad)',
      ageCategory: 'Junior (15 to 18)',
      gender: 'Male',
      distance: '500m',
      entryFee: 300,
      maxParticipants: 60
    },
    {
      id: 'ev-2',
      tournamentId: '',
      eventName: '1000m Rink Race',
      discipline: 'Speed Skating (Inline)',
      ageCategory: 'Junior (15 to 18)',
      gender: 'Male',
      distance: '1000m',
      entryFee: 300,
      maxParticipants: 60
    }
  ]);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const res = await api.getTournaments();
      if (res.success) {
        setTournaments(res.data);
      }
    } catch (e) {
      console.error('Failed to load tournaments:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    const newEv: TournamentEvent = {
      id: `ev-${Date.now()}`,
      tournamentId: '',
      eventName: '1 Lap Time Trial (FL)',
      discipline: 'Speed Skating (Inline)',
      ageCategory: 'Sub-Junior (12 to 15)',
      gender: 'Male',
      distance: '200m',
      entryFee: 300,
      maxParticipants: 50
    };
    setEvents([...events, newEv]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleUpdateEvent = (index: number, field: keyof TournamentEvent, val: any) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: val };
    setEvents(updated);
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) return;

    setSaving(true);
    try {
      const payload: Partial<Tournament> = {
        title: title.trim(),
        description: description.trim() || undefined,
        venue: venue.trim(),
        district,
        startDate,
        endDate,
        registrationDeadline,
        level,
        status: 'open',
        entryFeeBase: Number(entryFeeBase),
        events
      };

      const res = await api.createTournament(payload);
      if (res.success && res.data) {
        setTournaments([res.data, ...tournaments]);
        setIsCreating(false);
        // reset
        setTitle('');
        setVenue('');
      }
    } catch (err) {
      console.error('Failed to create tournament:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">
            State Tournament & Championship Builder
          </h3>
          <p className="text-xs text-slate-400">
            Publish state championships, configure age categories, distance events, and base entry fee structure.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Builder' : '+ Add New Championship'}</span>
        </button>
      </div>

      {/* Create New Tournament Form */}
      {isCreating && (
        <form onSubmit={handleCreateTournament} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-lg font-bold text-white">Championship Details & Sanction</h4>
            <span className="text-xs text-slate-400">Fill in official technical information.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Tournament Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 38th UP State Roller Skating Championship 2026"
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Sanction Level *
              </label>
              <select
                value={level || 'State'}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="State">State Championship (Ranking Points: 5-3-1)</option>
                <option value="Zonal">Zonal Championship</option>
                <option value="District">District Championship</option>
                <option value="Invitational">State Invitational</option>
                <option value="National">National Games Trials</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Track / Arena Venue *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Synthetic Banked Track, KD Singh Babu Stadium, Lucknow"
                value={venue || ''}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Host District *
              </label>
              <input
                type="text"
                required
                value={district || 'Lucknow'}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Entry Deadline *
              </label>
              <input
                type="date"
                required
                value={registrationDeadline || ''}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Base Entry Fee (₹) *
              </label>
              <input
                type="number"
                required
                value={entryFeeBase ?? 1000}
                onChange={(e) => setEntryFeeBase(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Sub-Events List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Championship Race Categories / Events:</h4>
              <button
                type="button"
                onClick={handleAddEvent}
                className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Race Event</span>
              </button>
            </div>

            <div className="space-y-2">
              {events.map((ev, idx) => (
                <div key={ev.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-6 gap-2 items-center text-xs">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Event Name, e.g. 500m + D"
                      value={ev.eventName || ''}
                      onChange={(e) => handleUpdateEvent(idx, 'eventName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <select
                      value={ev.discipline || 'Speed Skating (Quad)'}
                      onChange={(e) => handleUpdateEvent(idx, 'discipline', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      {DISCIPLINES.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <select
                      value={ev.ageCategory || 'Junior (15 to 18)'}
                      onChange={(e) => handleUpdateEvent(idx, 'ageCategory', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      {AGE_CATEGORIES_2026.map(a => <option key={a.category} value={a.category}>{a.category}</option>)}
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Fee"
                      value={ev.entryFee ?? 0}
                      onChange={(e) => handleUpdateEvent(idx, 'entryFee', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(ev.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : 'Save & Publish Championship'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tournaments List Cards */}
      <div className="grid grid-cols-1 gap-4">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  {t.level}
                </span>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                  {t.status}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white">{t.title}</h4>
              <p className="text-xs text-slate-400">
                {t.venue} • {t.startDate} to {t.endDate} • Deadline: <strong className="text-amber-400">{t.registrationDeadline}</strong>
              </p>
              <span className="text-[11px] text-slate-500 block">
                {t.events.length} Race Categories Configured • Base Fee: ₹{t.entryFeeBase}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xl font-mono font-black text-amber-400">
                  {t.totalRegisteredSkaters || 0}
                </div>
                <span className="text-[10px] text-slate-500 uppercase">Skaters Entered</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
