import React, { useState } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  QrCode, 
  Sparkles,
  Lock,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SkaterLoginPageProps {
  onSuccess?: () => void;
  onNavigateToRegistration: () => void;
  onNavigateToActivation?: () => void;
  onNavigateToVerifyAthlete?: () => void;
  onSwitchToAdmin?: () => void;
}

export const SkaterLoginPage: React.FC<SkaterLoginPageProps> = ({
  onSuccess,
  onNavigateToRegistration,
  onNavigateToActivation,
  onNavigateToVerifyAthlete,
  onSwitchToAdmin
}) => {
  const { login, setSessionSkater } = useAuth();
  const [skaterId, setSkaterId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedId = skaterId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setError('Please enter your official Skater ID and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login({
        registrationNumber: trimmedId,
        email: trimmedId.includes('@') ? trimmedId : undefined,
        password: trimmedPass
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        // Professional sanitized error message
        const msg = res.message || '';
        if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
          setError('Unable to connect right now. Please try again.');
        } else if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('invalid')) {
          setError('Invalid Skater ID or password.');
        } else {
          setError('Your account could not be verified. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setError('Unable to connect right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSkater = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await login({
        registrationNumber: 'UPRSA/2026/LKO/00101',
        password: 'aarav@123'
      });
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Your account could not be verified. Please check your credentials.');
      }
    } catch {
      setError('Unable to connect right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#070d18] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <div className="w-full max-w-2xl text-center space-y-3 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1329] border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>OFFICIAL SKATER PORTAL</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          UTTAR PRADESH ROLLER SPORTS
          <span className="block text-amber-400 mt-1">ASSOCIATION</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Access your digital athlete card, verified athlete profile, championship entries, and official state performance history.
        </p>
      </div>

      {/* 2. Centered Login Card */}
      <div className="w-full max-w-[460px] mx-auto bg-[#0b1329] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative z-10">
        
        {/* Card Header & Icon */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#070e20] border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner shadow-amber-500/10">
            <span className="text-2xl select-none" role="img" aria-label="Key">🔑</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            SKATER LOGIN
          </h2>

          <p className="text-xs font-semibold text-amber-400/90 tracking-wide">
            स्केटर लॉगिन (Digital Athlete Portal)
          </p>

          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal pt-1">
            Log in using your official Skater ID and the password created during registration.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div 
            id="skater-login-error"
            role="alert"
            className="mb-5 bg-red-950/70 border border-red-500/50 p-3.5 rounded-2xl text-red-200 text-xs flex items-center gap-2.5 shadow-sm animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Skater ID */}
          <div>
            <label 
              htmlFor="skater-id-input"
              className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              SKATER ID / REGISTRATION NUMBER
            </label>
            <div className="relative">
              <input
                id="skater-id-input"
                type="text"
                required
                disabled={loading}
                autoComplete="username"
                value={skaterId}
                onChange={(e) => setSkaterId(e.target.value)}
                placeholder="UPRSA-LKO-2026-00001"
                className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 text-sm text-white font-medium placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="skater-password-input"
                className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider"
              >
                PASSWORD
              </label>
            </div>
            <div className="relative">
              <input
                id="skater-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 pr-11 text-sm text-white font-medium placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                id="toggle-skater-password"
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
            id="skater-submit-button"
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
                <span>LOGIN (लॉगिन करें)</span>
                <ArrowRight className="w-4 h-4 text-slate-950 font-bold" />
              </>
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Don't have a Skater ID yet?
          </p>
          <button
            type="button"
            id="register-skater-button"
            onClick={onNavigateToRegistration}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Register Skater (नया पंजीकरण) →</span>
          </button>
        </div>

        {/* Secondary Portal Utilities */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          {onNavigateToActivation && (
            <button
              type="button"
              onClick={onNavigateToActivation}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Activate with <strong>DOB & Reg No →</strong>
            </button>
          )}

          {onNavigateToVerifyAthlete && (
            <button
              type="button"
              onClick={onNavigateToVerifyAthlete}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Public <strong>Athlete Registry →</strong>
            </button>
          )}
        </div>

        {/* Quick Demo Athlete Helper */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 text-center">
          <button
            type="button"
            onClick={handleQuickDemoSkater}
            disabled={loading}
            className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>⚡ Demo Login as State Athlete (Aarav Sharma)</span>
          </button>
        </div>

      </div>

      {/* Switch to Admin link */}
      {onSwitchToAdmin && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>State Secretariat & Official Console Access →</span>
          </button>
        </div>
      )}
    </div>
  );
};
