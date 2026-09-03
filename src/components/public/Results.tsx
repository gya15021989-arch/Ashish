import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Medal, 
  Award,
  ChevronDown
} from 'lucide-react';
import { TournamentResult, Tournament } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES, AGE_CATEGORIES_2026 } from '../../data/uprsaKnowledge';

export const Results: React.FC = () => {
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('All');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedAge, setSelectedAge] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resRes, tourRes] = await Promise.all([
        api.getResults(),
        api.getTournaments()
      ]);

      if (resRes.success) setResults(resRes.data);
      if (tourRes.success) setTournaments(tourRes.data);
    } catch (e) {
      console.error('Failed to load results:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter(r => {
    const matchesSearch = r.skaterName.toLowerCase().includes(search.toLowerCase()) ||
                          r.district.toLowerCase().includes(search.toLowerCase()) ||
                          r.eventName.toLowerCase().includes(search.toLowerCase());
    const matchesTour = selectedTournament === 'All' || r.tournamentId === selectedTournament;
    const matchesDisc = selectedDiscipline === 'All' || r.discipline === selectedDiscipline;
    const matchesAge = selectedAge === 'All' || r.ageCategory === selectedAge;
    const matchesGender = selectedGender === 'All' || r.gender === selectedGender;
    return matchesSearch && matchesTour && matchesDisc && matchesAge && matchesGender;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL TIMESHEETS & PODIUMS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tournament Results Archive
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Authentic state timesheets, gold/silver/bronze medal lists, and selection trial standings approved by the UPRSA Chief Referee.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skater, event, or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Timesheet</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Tournament
              </label>
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Tournaments</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Discipline
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Disciplines</option>
                {DISCIPLINES.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Age Group
              </label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Age Groups</option>
                {AGE_CATEGORIES_2026.map(a => (
                  <option key={a.category} value={a.category}>{a.category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Gender
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Genders</option>
                <option value="Male">Boys / Men</option>
                <option value="Female">Girls / Women</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Pos / Medal</th>
                  <th className="py-3.5 px-4">Skater Name & Reg No</th>
                  <th className="py-3.5 px-4">District & Club</th>
                  <th className="py-3.5 px-4">Event & Discipline</th>
                  <th className="py-3.5 px-4">Age Category</th>
                  <th className="py-3.5 px-4 text-right">Official Time / Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Loading tournament results...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No results match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                            res.position === 1 
                              ? 'bg-amber-500 text-slate-950 font-black' 
                              : res.position === 2 
                                ? 'bg-slate-300 text-slate-950 font-black' 
                                : res.position === 3 
                                  ? 'bg-amber-700 text-white font-bold'
                                  : 'bg-slate-800 text-slate-400'
                          }`}>
                            {res.position}
                          </span>
                          {res.medal && (
                            <span className="font-semibold text-white">
                              {res.medal}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{res.skaterName}</div>
                        {res.skaterRegNo && (
                          <div className="text-[10px] font-mono text-amber-400">
                            {res.skaterRegNo}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{res.district}</div>
                        <div className="text-[10px] text-slate-400">{res.club}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{res.eventName}</div>
                        <div className="text-[10px] text-slate-400">{res.discipline}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          {res.ageCategory} ({res.gender})
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-amber-400 text-sm">
                          {res.timeRecord || '-'}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          +{res.points} State Pts
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
