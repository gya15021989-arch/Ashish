import React, { useState } from 'react';
import { 
  User, 
  Key, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccountActivationProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const AccountActivation: React.FC<AccountActivationProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { activateSkaterAccount } = useAuth();
  const [regNo, setRegNo] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!regNo.trim() || !dob) {
      setError('Please provide your Registration Number and Date of Birth.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await activateSkaterAccount({
        registrationNumber: regNo.trim(),
        dateOfBirth: dob,
        password: password.trim() || undefined
      });

      if (res.success) {
        onSuccess();
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
    <div className="max-w-[460px] mx-auto bg-[#0b1329] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#070e20] border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Key className="w-7 h-7 text-amber-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
          Activate Skater Portal Access
        </h3>
        <p className="text-xs font-semibold text-amber-400/90">
          खाता सक्रियण (State Registration Registry)
        </p>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed pt-1">
          Already registered in official state records? Enter your Registration Number & Date of Birth to activate your digital portal.
        </p>
      </div>

      {error && (
        <div 
          role="alert"
          className="bg-red-950/70 border border-red-500/50 p-3.5 rounded-2xl text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            STATE REGISTRATION NUMBER *
          </label>
          <input
            type="text"
            required
            disabled={loading}
            placeholder="e.g. UPRSA/2026/LKO/00101"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 text-sm text-white uppercase placeholder:normal-case font-mono outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            DATE OF BIRTH *
          </label>
          <input
            type="date"
            required
            disabled={loading}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 text-sm text-white outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            SET PORTAL PASSWORD (OPTIONAL)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              disabled={loading}
              placeholder="Create password for future logins"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050b18] border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl px-4 py-3 pr-11 text-sm text-white outline-none transition-all"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-5 rounded-2xl text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>VERIFYING STATE RECORDS...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 font-bold" />
              <span>Verify & Enter Skater Portal</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-800/80 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          Already have password credentials? <strong>Login here →</strong>
        </button>
      </div>
    </div>
  );
};
