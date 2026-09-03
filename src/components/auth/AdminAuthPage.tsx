import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  RotateCw, 
  Key, 
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminAuthPageProps {
  onSuccess?: () => void;
  onSwitchToSkater?: () => void;
}

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({
  onSuccess,
  onSwitchToSkater
}) => {
  const { login } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedId = adminId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setError('Please provide your administrator ID and security key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login({
        email: trimmedId,
        password: trimmedPass
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        // High security error: Do not expose email existence or stack traces
        setError('Invalid administrator credentials.');
      }
    } catch {
      setError('Unable to connect to state server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await login({
        email: 'admin@uprsa.org',
        password: 'uprsa@admin2026'
      });
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Invalid administrator credentials.');
      }
    } catch {
      setError('Unable to connect to state server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#070d18] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Background Security Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <div className="w-full max-w-2xl text-center space-y-3 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1329] border border-amber-500/40 text-amber-400 text-xs font-bold tracking-wider uppercase shadow-sm">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>STATE SECRETARIAT CONSOLE • गुप्त प्रशासन</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          ADMIN AUTHENTICATION
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Restricted portal for authorized UPRSA Executive Committee Officials & Technical Referees.
        </p>
      </div>

      {/* 2. Admin Login Card */}
      <div className="w-full max-w-[460px] mx-auto bg-[#0b1329] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 relative z-10">
        
        {/* Security Badge & Shield */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#070e20] border border-amber-500/50 text-amber-400 flex items-center justify-center mx-auto shadow-inner shadow-amber-500/20">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-400 tracking-widest uppercase">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>AUTHORIZED PERSONNEL ONLY</span>
          </div>

          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal pt-1">
            Enter authorized executive credentials to access the state management console.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div 
            id="admin-login-error"
            role="alert"
            className="mb-5 bg-red-950/70 border border-red-500/50 p-3.5 rounded-2xl text-red-200 text-xs flex items-center gap-2.5 shadow-sm animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Admin ID / Email */}
          <div>
            <label 
              htmlFor="admin-id-input"
              className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              ADMIN ID / EMAIL (प्रशासन आईडी / ईमेल)
            </label>
            <div className="relative">
              <input
                id="admin-id-input"
                type="text"
                required
                disabled={loading}
                autoComplete="username"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="admin@uprsa.org"
                className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 text-sm text-white font-medium placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="admin-password-input"
                className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider"
              >
                PASSWORD (पासवर्ड)
              </label>
            </div>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 pr-11 text-sm text-white font-medium placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                id="toggle-admin-password"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="admin-submit-button"
            disabled={loading}
            className="w-full min-h-[48px] bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-5 rounded-2xl text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <>
                <span>🔐 LOGIN • लॉगिन करें</span>
                <ArrowRight className="w-4 h-4 text-slate-950 font-bold" />
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setIsForgotModalOpen(true)}
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            Forgot Password? • पासवर्ड भूल गए?
          </button>
        </div>

        {/* Quick Demo Executive Admin Access */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            disabled={loading}
            className="text-[11px] font-semibold text-amber-300/90 hover:text-amber-300 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ 1-Click State Secretariat Access (Demo)</span>
          </button>
        </div>

      </div>

      {/* Switch to Skater Login */}
      {onSwitchToSkater && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToSkater}
            className="text-xs text-slate-400 hover:text-amber-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch to Skater / Athlete Portal Login →</span>
          </button>
        </div>
      )}

      {/* Official Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0b1329] border border-amber-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Official IT Secretariat Support</h3>
              </div>
              <button 
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To protect administrative state records and financial accounts, administrator passwords can only be reset through encrypted authentication tokens issued by the <strong>UPRSA Technical Committee</strong>.
            </p>

            <div className="bg-[#050b18] border border-slate-800 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-300">
              <p className="font-semibold text-white">Contact the Secretariat Desk:</p>
              <p>Email: <span className="text-amber-400 font-mono">it-admin@uprsa.org</span></p>
              <p>Phone: <span className="text-amber-400 font-mono">+91 94150 21989 / +91 522 2439812</span></p>
              <p className="text-[11px] text-slate-400 pt-1">Office Hours: Mon–Sat, 10:00 AM – 06:00 PM IST</p>
            </div>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
