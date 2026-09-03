import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trophy, 
  Flag, 
  User, 
  RotateCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  Sliders,
  X
} from 'lucide-react';
import { Race, Heat, HeatParticipant, Tournament } from '../../types';
import { api } from '../../services/api';

const OFFICIAL_2026_CATEGORIES = [
  'Tots (Under 6)',
  'Minis (6 to 8)',
  'Cadet (8 to 10)',
  'Cadet (10 to 12)',
  'Sub-Junior (12 to 15)',
  'Junior (15 to 18)',
  'Senior (Above 18)',
  'Masters (Above 35)'
];

const DISCIPLINES = [
  'Speed Skating (Inline)',
  'Speed Skating (Quad)',
  'Artistic Skating',
  'Freestyle Slalom',
  'Roller Hockey',
  'Inline Freestyle',
  'Roller Derby',
  'Skateboarding'
];

export const LiveRaceConsole: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedHeatIndex, setSelectedHeatIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // New Live Event Form State
  const [newEvent, setNewEvent] = useState({
    tournamentId: '',
    tournamentTitle: '36th Uttar Pradesh State Roller Skating Championship',
    discipline: 'Speed Skating (Inline)',
    ageCategory: 'Sub-Junior (12 to 15)',
    gender: 'Male',
    eventName: '500m Speed Sprint',
    distance: '500m',
    heatName: 'Heat 1'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [racesRes, tourRes] = await Promise.all([
        api.getRaces(),
        api.getTournaments()
      ]);

      if (tourRes.success && tourRes.data) {
        setTournaments(tourRes.data);
        if (tourRes.data.length > 0) {
          setNewEvent(prev => ({
            ...prev,
            tournamentId: tourRes.data[0].id,
            tournamentTitle: tourRes.data[0].title
          }));
        }
      }

      if (racesRes.success && racesRes.data && racesRes.data.length > 0) {
        setRaces(racesRes.data);
        setSelectedRace(racesRes.data[0]);
      }
    } catch (e) {
      console.error('Failed to load live console data:', e);
    } finally {
      setLoading(false);
    }
  };

  const activeHeat = selectedRace?.heats?.[selectedHeatIndex];

  // Update specific participant field
  const handleUpdateParticipant = (index: number, field: keyof HeatParticipant, value: any) => {
    if (!selectedRace || !activeHeat) return;
    const updatedHeats = [...selectedRace.heats];
    const heat = { ...updatedHeats[selectedHeatIndex] };
    const participants = [...heat.participants];
    participants[index] = { ...participants[index], [field]: value };
    heat.participants = participants;
    updatedHeats[selectedHeatIndex] = heat;

    setSelectedRace({
      ...selectedRace,
      heats: updatedHeats
    });
  };

  // Add new athlete to current heat
  const handleAddAthlete = () => {
    if (!selectedRace || !activeHeat) return;
    const nextLane = activeHeat.participants.length + 1;
    const newAthlete: HeatParticipant = {
      skaterId: `skater-${Date.now()}`,
      skaterName: 'New Skater',
      district: 'Lucknow',
      club: 'UPRSA Academy',
      bibNumber: `BIB-${100 + nextLane}`,
      lane: nextLane,
      laneNumber: nextLane,
      status: 'OK',
      finishTime: '',
      currentRank: undefined,
      qualificationStatus: 'DNQ'
    };

    const updatedHeats = [...selectedRace.heats];
    const heat = { ...updatedHeats[selectedHeatIndex] };
    heat.participants = [...heat.participants, newAthlete];
    updatedHeats[selectedHeatIndex] = heat;

    setSelectedRace({
      ...selectedRace,
      heats: updatedHeats
    });
  };

  // Remove athlete from current heat
  const handleRemoveAthlete = (index: number) => {
    if (!selectedRace || !activeHeat) return;
    const updatedHeats = [...selectedRace.heats];
    const heat = { ...updatedHeats[selectedHeatIndex] };
    heat.participants = heat.participants.filter((_, i) => i !== index);
    updatedHeats[selectedHeatIndex] = heat;

    setSelectedRace({
      ...selectedRace,
      heats: updatedHeats
    });
  };

  // Save current heat / race state to database
  const handleSaveRace = async (updatedFields?: Partial<Race>, updatedHeatStatus?: 'upcoming' | 'in_progress' | 'completed') => {
    if (!selectedRace) return;
    setSaving(true);

    try {
      let updatedHeats = [...selectedRace.heats];
      if (updatedHeatStatus && activeHeat) {
        updatedHeats[selectedHeatIndex] = {
          ...updatedHeats[selectedHeatIndex],
          status: updatedHeatStatus
        };
      }

      const payload: Partial<Race> = {
        ...selectedRace,
        heats: updatedHeats,
        ...updatedFields
      };

      const res = await api.updateRace(selectedRace.id, payload);
      if (res.success && res.data) {
        setSelectedRace(res.data);
        setRaces(races.map(r => r.id === res.data!.id ? res.data! : r));
      }
    } catch (err) {
      console.error('Failed to update live race:', err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle Live Broadcast on/off
  const handleTogglePublish = () => {
    if (!selectedRace) return;
    const isLive = selectedRace.status === 'in_progress' || (selectedRace.status as string) === 'live';
    const nextStatus = isLive ? 'upcoming' : 'in_progress';
    handleSaveRace({ status: nextStatus as any }, nextStatus === 'in_progress' ? 'in_progress' : 'upcoming');
  };

  // End Race completely
  const handleEndRace = () => {
    if (!selectedRace) return;
    handleSaveRace({ status: 'completed' }, 'completed');
  };

  // Move to Next Heat
  const handleMoveToNextHeat = () => {
    if (!selectedRace) return;
    if (selectedHeatIndex < selectedRace.heats.length - 1) {
      setSelectedHeatIndex(selectedHeatIndex + 1);
    } else {
      // Create a brand new heat (e.g. Heat N+1)
      const nextHeatNum = selectedRace.heats.length + 1;
      const heatId = `heat-${Date.now()}`;
      const newHeat: Heat = {
        id: heatId,
        heatId,
        raceId: selectedRace.id,
        roundName: 'Final',
        heatNumber: nextHeatNum,
        heatName: `Heat ${nextHeatNum}`,
        status: 'upcoming',
        participants: [
          {
            skaterId: `skater-seed-1`,
            skaterName: 'Qualified Finalist 1',
            district: 'Ghaziabad',
            bibNumber: `BIB-${nextHeatNum}01`,
            lane: 1,
            laneNumber: 1,
            status: 'OK'
          },
          {
            skaterId: `skater-seed-2`,
            skaterName: 'Qualified Finalist 2',
            district: 'Lucknow',
            bibNumber: `BIB-${nextHeatNum}02`,
            lane: 2,
            laneNumber: 2,
            status: 'OK'
          }
        ]
      };

      const updatedRace = {
        ...selectedRace,
        heats: [...selectedRace.heats, newHeat]
      };

      setSelectedRace(updatedRace);
      setSelectedHeatIndex(selectedRace.heats.length);
      api.updateRace(selectedRace.id, updatedRace);
    }
  };

  // Auto Rank Skaters by Lap / Finish Time
  const handleAutoRankByTime = () => {
    if (!selectedRace || !activeHeat) return;
    const sorted = [...activeHeat.participants].sort((a, b) => {
      if (!a.finishTime) return 1;
      if (!b.finishTime) return -1;
      return a.finishTime.localeCompare(b.finishTime);
    });

    const ranked = sorted.map((p, idx) => ({
      ...p,
      currentRank: idx + 1,
      finishPosition: idx + 1,
      qualificationStatus: idx === 0 ? 'Gold (1st)' : idx === 1 ? 'Silver (2nd)' : idx === 2 ? 'Bronze (3rd)' : (idx < 4 ? 'Q (Qualified)' : 'DNQ')
    }));

    const updatedHeats = [...selectedRace.heats];
    updatedHeats[selectedHeatIndex].participants = ranked;
    setSelectedRace({
      ...selectedRace,
      heats: updatedHeats
    });
  };

  // Create New Live Event Modal Submit
  const handleCreateLiveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const heatId = 'heat-' + Date.now();
      const initialHeat: Heat = {
        id: heatId,
        heatId,
        raceId: 'race-temp',
        roundName: 'Final',
        heatNumber: 1,
        heatName: newEvent.heatName || 'Heat 1',
        status: 'in_progress',
        participants: [
          {
            skaterId: 'skater-001',
            skaterName: 'Abhishek Verma',
            district: 'Ghaziabad',
            club: 'Indirapuram Skating Club',
            bibNumber: 'GZB-101',
            lane: 1,
            laneNumber: 1,
            status: 'OK',
            finishTime: '00:48.32'
          },
          {
            skaterId: 'skater-002',
            skaterName: 'Aarav Sharma',
            district: 'Lucknow',
            club: 'Awadh Roller Sports',
            bibNumber: 'LKO-101',
            lane: 2,
            laneNumber: 2,
            status: 'OK',
            finishTime: '00:48.85'
          },
          {
            skaterId: 'skater-003',
            skaterName: 'Ananya Singh',
            district: 'Varanasi',
            club: 'Kashi Skaters Club',
            bibNumber: 'VNS-104',
            lane: 3,
            laneNumber: 3,
            status: 'OK',
            finishTime: '00:49.20'
          }
        ]
      };

      const newRacePayload: Partial<Race> = {
        tournamentId: newEvent.tournamentId,
        discipline: newEvent.discipline,
        ageCategory: newEvent.ageCategory as any,
        gender: newEvent.gender as any,
        eventName: newEvent.eventName,
        distance: newEvent.distance,
        status: 'in_progress',
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        heats: [initialHeat]
      };

      const res = await api.createRace(newRacePayload);
      if (res.success && res.data) {
        setRaces([res.data, ...races]);
        setSelectedRace(res.data);
        setSelectedHeatIndex(0);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error('Error creating live race:', err);
    } finally {
      setSaving(false);
    }
  };

  const isCurrentRaceLive = selectedRace && (
    selectedRace.status === 'in_progress' || 
    (selectedRace.status as string) === 'live' ||
    selectedRace.heats?.some(h => h.status === 'in_progress' || (h.status as string) === 'live')
  );

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. OPERATOR ACTION BAR */}
      {/* ========================================================================= */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">
              CHIEF REFEREE & FINISH LINE TIMING DESK
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">
            Live Stadium Scoreboard Operator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Input transponder timing, set skater positions, control the public live scoreboard, and qualify athletes directly to the state record board.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Create Live Event Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Live Event</span>
          </button>

          {/* Preview Public Scoreboard */}
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Preview Scoreboard</span>
          </button>

          {/* Select Active Event */}
          {races.length > 0 && (
            <select
              value={selectedRace?.id || ''}
              onChange={(e) => {
                const r = races.find(rc => rc.id === e.target.value);
                if (r) {
                  setSelectedRace(r);
                  setSelectedHeatIndex(0);
                }
              }}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500"
            >
              {races.map(r => (
                <option key={r.id} value={r.id}>
                  {r.eventName} — {r.ageCategory} ({r.gender}) [{r.status}]
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACTIVE EVENT CONTROLS */}
      {/* ========================================================================= */}
      {selectedRace && activeHeat ? (
        <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xl">
          
          {/* Top Bar: Event metadata & Live Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {selectedRace.discipline}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-300">
                  {selectedRace.ageCategory} ({selectedRace.gender})
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400">
                  Distance: {selectedRace.distance || '500m'}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                {selectedRace.eventName} — {activeHeat.heatName || `Heat ${selectedHeatIndex + 1}`}
              </h3>
            </div>

            {/* Status & Control Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Publish / Unpublish Toggle */}
              <button
                onClick={handleTogglePublish}
                disabled={saving}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isCurrentRaceLive
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-lg shadow-red-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isCurrentRaceLive ? <Radio className="w-3.5 h-3.5 animate-pulse" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isCurrentRaceLive ? 'LIVE ON SCOREBOARD (Click to Unpublish)' : 'OFFLINE (Click to Publish)'}</span>
              </button>

              {/* End Race */}
              <button
                onClick={handleEndRace}
                disabled={saving}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>End Race</span>
              </button>

              {/* Move to Next Heat */}
              <button
                onClick={handleMoveToNextHeat}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Heat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Heats Navigation Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080d1a] border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-2 shrink-0">
                Heat Rounds:
              </span>
              {selectedRace.heats.map((heat, idx) => {
                const heatKey = heat.id || heat.heatId || `heat-${idx}`;
                const heatLabel = heat.heatName || heat.roundName || `Heat ${heat.heatNumber || idx + 1}`;
                const isCurrent = selectedHeatIndex === idx;
                const isHeatLive = heat.status === 'in_progress' || (heat.status as string) === 'live';

                return (
                  <button
                    key={heatKey}
                    onClick={() => setSelectedHeatIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{heatLabel}</span>
                    <span className={`text-[9px] px-1 rounded font-mono ${
                      isHeatLive ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {heat.status || 'draft'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions for Active Heat */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoRankByTime}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-lg text-xs border border-amber-500/30 flex items-center gap-1 cursor-pointer"
              >
                <span>⚡ Auto-Rank by Time</span>
              </button>

              <button
                onClick={handleAddAthlete}
                className="bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skater</span>
              </button>
            </div>
          </div>

          {/* Skaters Table with Inline Editing */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d1a] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">BIB No</th>
                  <th className="py-2.5 px-3">Athlete Name</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Lane</th>
                  <th className="py-2.5 px-3">Lap / Finish Time</th>
                  <th className="py-2.5 px-3 text-center">Rank</th>
                  <th className="py-2.5 px-3">Qualification</th>
                  <th className="py-2.5 px-3">Remarks</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeHeat.participants.map((p, idx) => (
                  <tr key={p.skaterId || idx} className="hover:bg-slate-900/60 transition-colors">
                    {/* Bib Number */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={p.bibNumber || ''}
                        onChange={(e) => handleUpdateParticipant(idx, 'bibNumber', e.target.value)}
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                        placeholder="BIB-101"
                      />
                    </td>

                    {/* Skater Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={p.skaterName || ''}
                        onChange={(e) => handleUpdateParticipant(idx, 'skaterName', e.target.value)}
                        className="w-36 sm:w-44 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                      />
                    </td>

                    {/* District */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={p.district || ''}
                        onChange={(e) => handleUpdateParticipant(idx, 'district', e.target.value)}
                        className="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                      />
                    </td>

                    {/* Lane */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={p.lane || p.laneNumber || idx + 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          handleUpdateParticipant(idx, 'lane', val);
                          handleUpdateParticipant(idx, 'laneNumber', val);
                        }}
                        className="w-12 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-bold"
                      />
                    </td>

                    {/* Lap / Finish Time */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="00:48.320"
                        value={p.finishTime || p.timeTaken || ''}
                        onChange={(e) => {
                          handleUpdateParticipant(idx, 'finishTime', e.target.value);
                          handleUpdateParticipant(idx, 'timeTaken', e.target.value);
                        }}
                        className="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                    </td>

                    {/* Rank */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={p.currentRank || p.finishPosition || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || undefined;
                          handleUpdateParticipant(idx, 'currentRank', val);
                          handleUpdateParticipant(idx, 'finishPosition', val);
                        }}
                        className="w-12 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center font-black"
                      />
                    </td>

                    {/* Qualification Status */}
                    <td className="py-2 px-3">
                      <select
                        value={p.qualificationStatus || 'DNQ'}
                        onChange={(e) => handleUpdateParticipant(idx, 'qualificationStatus', e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="Q (Qualified)">Q (Qualified)</option>
                        <option value="q (Fastest)">q (Fastest)</option>
                        <option value="Gold (1st)">🥇 Gold (1st)</option>
                        <option value="Silver (2nd)">🥈 Silver (2nd)</option>
                        <option value="Bronze (3rd)">🥉 Bronze (3rd)</option>
                        <option value="DNQ">DNQ</option>
                        <option value="DQ">DQ (Disqualified)</option>
                      </select>
                    </td>

                    {/* Remarks */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Notes / Gap"
                        value={p.remarks || ''}
                        onChange={(e) => handleUpdateParticipant(idx, 'remarks', e.target.value)}
                        className="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleRemoveAthlete(idx)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove Skater"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Save Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 gap-3">
            <div className="text-xs text-slate-400">
              * Changes saved here instantly update the public stadium scoreboard feed.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveRace()}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{saving ? 'Syncing Track Feeds...' : 'Save & Broadcast Live Results'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0c1527] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
          <p className="text-sm">No live race event currently active.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Live Event</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CREATE LIVE EVENT MODAL */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase">
                  Create New Live Stadium Event
                </h3>
                <p className="text-xs text-slate-400">
                  Configure event metadata, discipline, 2026 age category, and heat.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLiveEvent} className="space-y-4 text-xs">
              {/* Tournament */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Championship / Tournament
                </label>
                <select
                  value={newEvent.tournamentId}
                  onChange={(e) => {
                    const t = tournaments.find(tour => tour.id === e.target.value);
                    setNewEvent({
                      ...newEvent,
                      tournamentId: e.target.value,
                      tournamentTitle: t ? t.title : newEvent.tournamentTitle
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.startDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Discipline & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Discipline
                  </label>
                  <select
                    value={newEvent.discipline}
                    onChange={(e) => setNewEvent({ ...newEvent, discipline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {DISCIPLINES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Official 2026 Age Category
                  </label>
                  <select
                    value={newEvent.ageCategory}
                    onChange={(e) => setNewEvent({ ...newEvent, ageCategory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {OFFICIAL_2026_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender & Distance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Gender
                  </label>
                  <select
                    value={newEvent.gender}
                    onChange={(e) => setNewEvent({ ...newEvent, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Distance / Race Length
                  </label>
                  <input
                    type="text"
                    value={newEvent.distance}
                    onChange={(e) => setNewEvent({ ...newEvent, distance: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    placeholder="e.g. 500m, 1000m, 1 Lap"
                  />
                </div>
              </div>

              {/* Event Name & Heat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.eventName}
                    onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    placeholder="e.g. 500m Speed Sprint"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Initial Heat / Round Name
                  </label>
                  <input
                    type="text"
                    value={newEvent.heatName}
                    onChange={(e) => setNewEvent({ ...newEvent, heatName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    placeholder="Heat 1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {saving ? 'Creating Event...' : 'Create & Launch Heat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PREVIEW SCOREBOARD MODAL */}
      {/* ========================================================================= */}
      {showPreviewModal && selectedRace && activeHeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#070d18] border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                <h3 className="text-base font-black text-white uppercase">
                  Public Scoreboard Live Preview
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-red-400">● LIVE TRANSPONDER</span>
                  <h4 className="text-lg font-black text-white">{selectedRace.eventName}</h4>
                  <p className="text-xs text-slate-400">{selectedRace.ageCategory} • {selectedRace.gender}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {activeHeat.heatName || `Heat ${selectedHeatIndex + 1}`}
                </span>
              </div>

              <div className="space-y-2">
                {activeHeat.participants.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        #{p.currentRank || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs">{p.skaterName}</div>
                        <div className="text-[10px] text-slate-400">Lane {p.lane || idx + 1} • {p.bibNumber || 'BIB'} • {p.district}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400 text-xs">{p.finishTime || 'Racing...'}</div>
                      <div className="text-[10px] text-emerald-400">{p.qualificationStatus || 'OK'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
