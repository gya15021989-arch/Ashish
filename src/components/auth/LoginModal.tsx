import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRegistration: () => void;
  onNavigateToActivation?: () => void;
  initialRole?: 'skater' | 'admin';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRegistration,
  onNavigateToActivation,
  initialRole = 'skater'
}) => {
  if (!isOpen) return null;

  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'skater' | 'admin'>(initialRole);
  const [skaterId, setSkaterId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedPassword = password.trim();

    if (activeTab === 'skater') {
      const trimmedId = skaterId.trim();
      if (!trimmedId || !trimmedPassword) {
        setError('Please enter your official Skater ID and password.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await login({
          registrationNumber: trimmedId,
          email: trimmedId.includes('@') ? trimmedId : undefined,
          password: trimmedPassword
        });

        if (res.success) {
          onClose();
        } else {
          setError('Invalid Skater ID or password.');
        }
      } catch {
        setError('Unable to connect right now. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Admin Login
      const trimmedEmail = adminId.trim();
      if (!trimmedEmail || !trimmedPassword) {
        setError('Please provide your administrator ID and security key.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await login({
          email: trimmedEmail,
          password: trimmedPassword
        });

        if (res.success) {
          onClose();
        } else {
          setError('Invalid administrator credentials.');
        }
      } catch {
        setError('Unable to connect to state server. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'skater') => {
    setLoading(true);
    setError(null);
    try {
      if (role === 'admin') {
        const res = await login({
          email: 'admin@uprsa.org',
          password: 'uprsa@admin2026'
        });
        if (res.success) onClose();
        else setError('Invalid administrator credentials.');
      } else {
        const res = await login({
          registrationNumber: 'UPRSA/2026/LKO/00101',
          password: 'aarav@123'
        });
        if (res.success) onClose();
        else setError('Invalid Skater ID or password.');
      }
    } catch {
      setError('Unable to connect right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0b1329] border border-amber-500/30 w-full max-w-[460px] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col relative">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-[#070e20] border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-tight leading-tight">
                UPRSA Official State Portal
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Uttar Pradesh Roller Sports Association
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Skater vs Admin */}
        <div className="px-6 pt-4 bg-[#070e20]/60 border-b border-slate-800/80">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#050b18] rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('skater');
                setError(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'skater'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Skater Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setError(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Header depending on active tab */}
          {activeTab === 'skater' ? (
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#070e20] border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <span className="text-xl select-none" role="img" aria-label="Key">🔑</span>
              </div>
              <h4 className="text-lg font-black text-white">SKATER LOGIN</h4>
              <p className="text-xs font-semibold text-amber-400">स्केटर लॉगिन (Digital Athlete Portal)</p>
              <p className="text-xs text-slate-400 pt-1">
                Log in using your official Skater ID and the password created during registration.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#070e20] border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                AUTHORIZED PERSONNEL ONLY
              </div>
              <h4 className="text-lg font-black text-white pt-1">ADMIN AUTHENTICATION</h4>
              <p className="text-xs text-slate-400">
                Restricted portal for authorized UPRSA Executive Committee Officials & Referees.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div 
              role="alert"
              className="bg-red-950/70 border border-red-500/50 p-3 rounded-2xl text-red-200 text-xs flex items-center gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'skater' ? (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  SKATER ID / REGISTRATION NUMBER
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  autoComplete="username"
                  value={skaterId}
                  onChange={(e) => setSkaterId(e.target.value)}
                  placeholder="UPRSA-LKO-2026-00001"
                  className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-500 outline-none transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  ADMIN ID / EMAIL (प्रशासन आईडी / ईमेल)
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  autoComplete="username"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin@uprsa.org"
                  className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-500 outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {activeTab === 'skater' ? 'PASSWORD' : 'PASSWORD (पासवर्ड)'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-3.5 py-2.5 pr-10 text-sm text-white font-medium placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[46px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-2xl text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>VERIFYING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  {activeTab === 'skater' ? (
                    <>
                      <span>LOGIN (लॉगिन करें)</span>
                      <ArrowRight className="w-4 h-4 font-bold" />
                    </>
                  ) : (
                    <>
                      <span>🔐 LOGIN • लॉगिन करें</span>
                      <ArrowRight className="w-4 h-4 font-bold" />
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Bottom Actions based on tab */}
          {activeTab === 'skater' ? (
            <div className="space-y-3 pt-2">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Don't have a Skater ID yet?</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToRegistration();
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Register Skater (नया पंजीकरण) →
                </button>
              </div>

              {onNavigateToActivation && (
                <div className="text-center pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToActivation();
                    }}
                    className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Activate existing registration with <strong>DOB & Reg No →</strong>
                  </button>
                </div>
              )}

              {/* 1-Click Demo Athlete */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('skater')}
                  disabled={loading}
                  className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>⚡ Quick Demo Athlete Login (Aarav Sharma)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Forgot Password? • पासवर्ड भूल गए?
              </button>

              {/* 1-Click Demo Admin */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  className="text-[11px] font-semibold text-amber-300 bg-slate-900 border border-amber-500/30 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ 1-Click State Secretariat Access (Demo)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#0b1329] border border-amber-500/40 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Recovery Assistance</span>
            </h4>
            <p className="text-xs text-slate-300">
              For state administrative security, please contact the UPRSA IT Secretariat to generate a temporary recovery token:
            </p>
            <div className="bg-[#050b18] p-3 rounded-xl text-xs space-y-1 text-slate-300">
              <p>Email: <strong className="text-amber-400">it-admin@uprsa.org</strong></p>
              <p>Helpline: <strong className="text-amber-400">+91 94150 21989</strong></p>
            </div>
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
