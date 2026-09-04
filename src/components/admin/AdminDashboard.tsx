import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Award, 
  CreditCard, 
  Radio, 
  FileText, 
  Shield, 
  Settings, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  LogOut,
  Sparkles,
  LayoutTemplate,
  BellRing,
  Image as ImageIcon,
  Building2,
  Inbox,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SkaterVerificationTable } from './SkaterVerificationTable';
import { TournamentEventBuilder } from './TournamentEventBuilder';
import { LiveRaceConsole } from './LiveRaceConsole';
import { FinanceSettingsPanel } from './FinanceSettingsPanel';
import { CertificateGeneratorModal } from './CertificateGeneratorModal';
import { HeroSlidesManager } from './HeroSlidesManager';
import { NewsAnnouncementsManager } from './NewsAnnouncementsManager';
import { MediaGalleryManager } from './MediaGalleryManager';
import { DistrictsClubsManager } from './DistrictsClubsManager';
import { ExecutiveCommitteeManager } from './ExecutiveCommitteeManager';
import { ContactInquiriesManager } from './ContactInquiriesManager';
import { AuditBackupManager } from './AuditBackupManager';
import { TickerManager } from './TickerManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { AboutCMSManager } from './AboutCMSManager';
import { DisciplinesManager } from './DisciplinesManager';
import { ResultsRankingsManager } from './ResultsRankingsManager';
import { Certificate } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'skaters' | 'tournaments' | 'race_console' | 'results_rankings' | 'certificates' | 'finance' | 'cms' | 'inquiries' | 'backup'
  >('skaters');
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'about' | 'disciplines' | 'news' | 'media' | 'districts' | 'committee' | 'ticker' | 'settings'>('hero');
  const [stats, setStats] = useState<any>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [issuedCerts, setIssuedCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        api.getAdminStats(),
        api.getCertificates()
      ]);
      if (sRes.success) setStats(sRes.data);
      if (cRes.success) setIssuedCerts(cRes.data);
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Federation Admin Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-lg shrink-0">
              UP
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  EXECUTIVE BOARD PORTAL
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  Logged in as {user?.name || 'Administrator'} ({user?.role?.toUpperCase()})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                UPRSA State Secretariat Control Center
              </h1>
              <p className="text-xs text-slate-400">
                Official administration for 75 District Units • RSFI Affiliated State Federation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Issue State Certificate</span>
            </button>

            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Registered Skaters</span>
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {stats?.totalSkaters || 1248}
            </div>
            <span className="text-[10px] text-amber-400 font-semibold">
              {stats?.pendingSkaters || 2} Pending Verification
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>State Championships</span>
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {stats?.activeTournaments || 3}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {stats?.totalTournamentEntries || 412} Athletes Entered
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Certificates</span>
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {stats?.issuedCertificates || issuedCerts.length}
            </div>
            <span className="text-[10px] text-slate-500">QR Tamper-Proof</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              <span>Revenue Reconciled</span>
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ₹{(stats?.totalRevenue || 135000).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">State Affiliation & Entry Fees</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1.5 shadow-xl">
          <button
            onClick={() => setActiveTab('skaters')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'skaters'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Skater Approvals</span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tournaments'
                ? 'bg-blue-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Championship Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('race_console')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'race_console'
                ? 'bg-red-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Chief Referee Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('results_rankings')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'results_rankings'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Results & Rankings</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'certificates'
                ? 'bg-emerald-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'cms'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Website CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'bg-cyan-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Helpdesk Inquiries</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'finance'
                ? 'bg-purple-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment & Fees</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Audit & Backup</span>
          </button>
        </div>

        {/* Tab 1: Skaters */}
        {activeTab === 'skaters' && (
          <SkaterVerificationTable />
        )}

        {/* Tab 2: Tournament Builder */}
        {activeTab === 'tournaments' && (
          <TournamentEventBuilder />
        )}

        {/* Tab 3: Chief Referee Desk */}
        {activeTab === 'race_console' && (
          <LiveRaceConsole />
        )}

        {/* Tab: Results & Rankings Manager */}
        {activeTab === 'results_rankings' && (
          <ResultsRankingsManager />
        )}

        {/* Tab 4: Certificate Registry */}
        {activeTab === 'certificates' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Issued State Certificate Registry</h3>
                <span className="text-xs text-slate-400">All authenticated merit and participation certificates</span>
              </div>
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Issue New Certificate</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Certificate No</th>
                    <th className="py-3 px-3">Recipient / Reg No</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Championship & Event</th>
                    <th className="py-3 px-3">Position</th>
                    <th className="py-3 px-3">Issue Date</th>
                    <th className="py-3 px-3 text-center">Auth Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {issuedCerts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-850">
                      <td className="py-3 px-3 font-mono font-bold text-white">{c.certificateNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{c.recipientName}</div>
                        <div className="text-[10px] text-slate-400">{c.district} {c.recipientRegNo ? `• ${c.recipientRegNo}` : ''}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        <div>{c.tournamentName}</div>
                        <div className="text-[10px] text-slate-400">{c.eventName}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">
                        {c.position || 'Participated'}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{c.issueDate}</td>
                      <td className="py-3 px-3 text-center font-mono text-[10px] text-emerald-400">
                        {c.verificationCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Complete CMS Website Management */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            {/* CMS Sub navigation */}
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1">
              <button
                onClick={() => setCmsSubTab('hero')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'hero'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hero Banners</span>
              </button>

              <button
                onClick={() => setCmsSubTab('about')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'about'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>About Page CMS</span>
              </button>

              <button
                onClick={() => setCmsSubTab('disciplines')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'disciplines'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Disciplines CMS</span>
              </button>

              <button
                onClick={() => setCmsSubTab('news')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'news'
                    ? 'bg-blue-600 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Circulars & News</span>
              </button>

              <button
                onClick={() => setCmsSubTab('media')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'media'
                    ? 'bg-pink-600 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos & Videos</span>
              </button>

              <button
                onClick={() => setCmsSubTab('districts')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'districts'
                    ? 'bg-emerald-600 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>75 Districts & Clubs</span>
              </button>

              <button
                onClick={() => setCmsSubTab('committee')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'committee'
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Executive Committee</span>
              </button>

              <button
                onClick={() => setCmsSubTab('ticker')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'ticker'
                    ? 'bg-red-500 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Ticker</span>
              </button>

              <button
                onClick={() => setCmsSubTab('settings')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cmsSubTab === 'settings'
                    ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Site Settings</span>
              </button>
            </div>

            {/* CMS Sub-views */}
            {cmsSubTab === 'hero' && <HeroSlidesManager />}
            {cmsSubTab === 'about' && <AboutCMSManager />}
            {cmsSubTab === 'disciplines' && <DisciplinesManager />}
            {cmsSubTab === 'news' && <NewsAnnouncementsManager />}
            {cmsSubTab === 'media' && <MediaGalleryManager />}
            {cmsSubTab === 'districts' && <DistrictsClubsManager />}
            {cmsSubTab === 'committee' && <ExecutiveCommitteeManager />}
            {cmsSubTab === 'ticker' && <TickerManager />}
            {cmsSubTab === 'settings' && <SiteSettingsManager />}
          </div>
        )}

        {/* Tab 6: Helpdesk Inquiries */}
        {activeTab === 'inquiries' && (
          <ContactInquiriesManager />
        )}

        {/* Tab 7: Payment Gateway & Fees */}
        {activeTab === 'finance' && (
          <FinanceSettingsPanel />
        )}

        {/* Tab 8: Security Audit Trail & MySQL Dump */}
        {activeTab === 'backup' && (
          <AuditBackupManager />
        )}
      </div>

      {/* Global Certificate Issue Modal */}
      <CertificateGeneratorModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onCertificateIssued={(cert) => {
          setIssuedCerts([cert, ...issuedCerts]);
        }}
      />
    </div>
  );
};
