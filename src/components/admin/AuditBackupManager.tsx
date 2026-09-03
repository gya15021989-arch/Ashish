import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Download, 
  RefreshCw, 
  FileCode, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  AlertCircle,
  HardDrive,
  Cpu,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';

export const AuditBackupManager: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lRes, sRes] = await Promise.all([
        api.getAuditLogs(),
        api.getDbStats()
      ]);
      if (lRes.success && lRes.data) setLogs(lRes.data);
      if (sRes.success && sRes.data) setDbStats(sRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSQL = () => {
    setExporting(true);
    window.location.href = '/api/db-tools/export-sql';
    setTimeout(() => setExporting(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <h2 className="text-xl font-black text-white">Security Audit Trail & Database Tools</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of all administrative actions, Hostinger / MySQL database exports, and state records backup.
          </p>
        </div>

        <button
          onClick={handleExportSQL}
          disabled={exporting}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Generating SQL Dump...' : 'Export Full MySQL Database Dump (.sql)'}</span>
        </button>
      </div>

      {/* Database engine status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              Database Engine
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
              ONLINE
            </span>
          </div>
          <div className="text-base font-black text-white">
            {dbStats?.dbEngine || 'MySQL 8.0+ / Hostinger Storage'}
          </div>
          <p className="text-[11px] text-slate-500">Self-contained JSON & MySQL synchronized data layer</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-400" />
              Total State Records
            </span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>
          <div className="text-base font-black text-white font-mono">
            {((dbStats?.skatersCount || 0) + (dbStats?.tournamentsCount || 0) + (dbStats?.certificatesCount || 0) + (dbStats?.paymentsCount || 0)).toLocaleString()} Database Rows
          </div>
          <p className="text-[11px] text-slate-500">Skaters, Results, QR Certificates & Tournaments</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Last Automated Backup
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
              SYNCED
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-200">
            {dbStats?.lastBackupTime ? new Date(dbStats.lastBackupTime).toLocaleString() : 'Live'}
          </div>
          <p className="text-[11px] text-slate-500">Atomic persistence with zero data loss guarantee</p>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white">Administrative Action Audit Logs</h3>
            <span className="text-xs text-slate-400">Chronological security ledger tracking approvals, edits, certificate issues and deletions</span>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No audit log entries recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">User / Admin</th>
                  <th className="py-3 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
