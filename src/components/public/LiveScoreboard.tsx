import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Trophy, 
  Zap, 
  Clock, 
  MapPin, 
  User, 
  Flag,
  Calendar,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Race, HeatParticipant } from '../../types';
import { api } from '../../services/api';

interface LiveScoreboardProps {
  onNavigate?: (page: string) => void;
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({ onNavigate }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [activeRace, setActiveRace] = useState<Race | null>(null);
  const [activeHeatIndex, setActiveHeatIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchRaces();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchRaces();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchRaces = async () => {
    try {
      const res = await api.getRaces();
      if (res.success && res.data) {
        setRaces(res.data);
        // Find if any race is currently live or in_progress
        const live = res.data.find(r => 
          r.status === 'in_progress' || 
          (r.status as string) === 'live' ||
          r.heats?.some(h => h.status === 'in_progress' || (h.status as string) === 'live')
        );

        if (live) {
          setActiveRace(live);
          // Find heat that is in progress or default to 0
          const liveHeatIdx = live.heats?.findIndex(h => h.status === 'in_progress' || (h.status as string) === 'live');
          if (liveHeatIdx !== undefined && liveHeatIdx >= 0) {
            setActiveHeatIndex(liveHeatIdx);
          }
        } else {
          // No live race active
          setActiveRace(null);
        }
        setLastRefreshed(new Date());
      }
    } catch (e) {
      console.error('Error fetching live scoreboard races:', e);
    } finally {
      setLoading(false);
    }
  };

  const isLiveActive = activeRace && (
    activeRace.status === 'in_progress' || 
    (activeRace.status as string) === 'live' ||
    activeRace.heats?.some(h => h.status === 'in_progress' || (h.status as string) === 'live')
  );

  const activeHeat = activeRace?.heats?.[activeHeatIndex] || activeRace?.heats?.[0];

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ========================================================================= */}
        {/* HEADER CONTROLS (Live Broadcast Bar) */}
        {/* ========================================================================= */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              isLiveActive 
                ? 'bg-red-600/20 border-red-500/50 text-red-400' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              <Radio className={`w-6 h-6 ${isLiveActive ? 'animate-pulse text-red-500' : ''}`} />
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                {isLiveActive ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-red-400">
                      LIVE TRANSPONDER FEED ACTIVE
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    STADIUM ARENA FEED • STANDBY
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 uppercase">
                {isLiveActive 
                  ? `${activeRace.eventName} — ${activeRace.discipline}` 
                  : 'UPRSA Official Live Scoreboard'}
              </h1>
              <p className="text-xs text-slate-400">
                {isLiveActive
                  ? `${activeRace.ageCategory} • ${activeRace.gender} • Distance: ${activeRace.distance || 'Standard'}`
                  : 'Official electronic timing and lap tracking system for state roller championships.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                autoRefresh 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto-Sync (3s)' : 'Sync Paused'}</span>
            </button>

            <button
              onClick={fetchRaces}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 cursor-pointer"
              title="Manual Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE A: LIVE EVENT ACTIVE */}
        {/* ========================================================================= */}
        {isLiveActive && activeHeat ? (
          <div className="space-y-6">
            {/* Heat Rounds Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1527] border border-slate-800 p-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-xs text-slate-400 font-black uppercase tracking-wider px-2 shrink-0">
                  Select Heat:
                </span>
                {activeRace.heats.map((heat, idx) => {
                  const heatKey = heat.id || heat.heatId || `heat-${idx}`;
                  const heatLabel = heat.heatName || heat.roundName || `Heat ${heat.heatNumber || idx + 1}`;
                  const isCurrent = activeHeatIndex === idx;
                  const isHeatLive = heat.status === 'in_progress' || (heat.status as string) === 'live';

                  return (
                    <button
                      key={heatKey}
                      onClick={() => setActiveHeatIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{heatLabel}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isHeatLive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isHeatLive ? 'LIVE' : heat.status || 'OK'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Race Selector if multiple are loaded */}
              {races.length > 1 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 shrink-0">Other Events:</span>
                  <select
                    value={activeRace.id}
                    onChange={(e) => {
                      const r = races.find(rc => rc.id === e.target.value);
                      if (r) {
                        setActiveRace(r);
                        setActiveHeatIndex(0);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {races.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.eventName} - {r.ageCategory} ({r.gender})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Stadium Live Scoreboard Table */}
            <div className="bg-[#0c1527] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>{activeHeat.heatName || activeHeat.roundName || `Heat ${activeHeat.heatNumber || activeHeatIndex + 1}`} — Skaters on Track</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeHeat.participants.length} Competing Athletes • Official Electronic Finish Line System
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>HEAT IN PROGRESS</span>
                  </span>
                </div>
              </div>

              {/* Athletes Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#080d1a] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Position</th>
                      <th className="py-3 px-3">Lane</th>
                      <th className="py-3 px-3">Bib / ID</th>
                      <th className="py-3 px-3">Athlete Name & District</th>
                      <th className="py-3 px-3 text-right">Timing / Result</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeHeat.participants
                      .map((p, idx) => ({
                        ...p,
                        computedRank: p.currentRank !== undefined ? p.currentRank : (p.finishPosition !== undefined ? p.finishPosition : idx + 1),
                        uniqueKey: p.skaterId ? `${p.skaterId}-${p.bibNumber || idx}` : `skater-${idx}`
                      }))
                      .sort((a, b) => (a.computedRank || 99) - (b.computedRank || 99))
                      .map((skater, rankIdx) => (
                        <tr 
                          key={skater.uniqueKey}
                          className={`hover:bg-slate-900/80 transition-colors ${
                            skater.computedRank === 1 ? 'bg-amber-500/10' : ''
                          }`}
                        >
                          {/* Position */}
                          <td className="py-3 px-3 font-bold">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-mono ${
                              skater.computedRank === 1
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                                : skater.computedRank === 2
                                  ? 'bg-slate-300 text-slate-950'
                                  : skater.computedRank === 3
                                    ? 'bg-amber-800 text-white'
                                    : 'bg-slate-800 text-slate-300'
                            }`}>
                              #{skater.computedRank}
                            </div>
                          </td>

                          {/* Lane */}
                          <td className="py-3 px-3 font-mono text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-bold">
                              Lane {skater.lane || skater.laneNumber || rankIdx + 1}
                            </span>
                          </td>

                          {/* Bib / ID */}
                          <td className="py-3 px-3">
                            <span className="font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              {skater.bibNumber || `BIB-${rankIdx + 101}`}
                            </span>
                          </td>

                          {/* Athlete Name & District */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-white text-sm">
                              {skater.skaterName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>{skater.district}</span>
                              {skater.club && <span>• {skater.club}</span>}
                            </div>
                          </td>

                          {/* Timing / Result */}
                          <td className="py-3 px-3 text-right">
                            <div className="text-base font-black font-mono text-amber-400">
                              {skater.finishTime || skater.timeTaken || 'Racing...'}
                            </div>
                            {skater.remarks && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                {skater.remarks}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              skater.finishTime
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                            }`}>
                              {skater.qualificationStatus || (skater.finishTime ? 'FINISHED' : 'RACING')}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: NO LIVE EVENT CURRENTLY (Exact Specification Requirement) */
          /* ========================================================================= */
          <div className="bg-[#0c1527] border border-slate-800 rounded-3xl p-8 sm:p-14 text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                NO LIVE EVENT CURRENTLY
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                There are no active championship heats or races streaming on the stadium transponder feed at this moment. Live feeds automatically activate when the race starter sounds the gun.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate && onNavigate('results')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>View Official State Results</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate('tournaments')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Championship Calendar</span>
              </button>

              <button
                onClick={fetchRaces}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Check Live Feed</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
