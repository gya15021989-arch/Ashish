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
  X,
  Copy,
  Check,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

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

  // Forgot password reset state
  const [resetStep, setResetStep] = useState<'email' | 'verify'>('email');
  const [resetEmail, setResetEmail] = useState('uprsa.official@gmail.com');
  const [resetOtp, setResetOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Countdown timer effect
  React.useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

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
        setError(res.message || 'Invalid administrator credentials.');
      }
    } catch {
      setError('Unable to connect to state server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('कृपया अपना पंजीकृत एडमिन ईमेल दर्ज करें।');
      return;
    }

    setSendingOtp(true);
    setResetError(null);
    setResetSuccess(null);

    try {
      const res = await api.sendAdminOtp(resetEmail.trim());
      if (res.success) {
        setResetStep('verify');
        setSimulatedOtp(res.otp || null);
        setOtpCountdown(60);
        setResetSuccess(res.message || 'सुरक्षा कोड (Security Code) ईमेल पर भेज दिया गया है।');
      } else {
        setResetError(res.message || 'सुरक्षा कोड भेजने में विफल। कृपया ईमेल जांचें।');
      }
    } catch (err: any) {
      setResetError(err.message || 'नेटवर्क त्रुटि।');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('कृपया एडमिन ईमेल दर्ज करें।');
      return;
    }
    if (!resetOtp.trim() && !resetKey.trim()) {
      setResetError('कृपया ईमेल पर प्राप्त 6-अंकों का सुरक्षा कोड (OTP) दर्ज करें।');
      return;
    }
    if (!resetNewPass || resetNewPass.length < 6) {
      setResetError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    if (resetNewPass !== resetConfirmPass) {
      setResetError('दोनों पासवर्ड मेल नहीं खाते।');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);

    try {
      const res = await api.resetAdminPassword({
        email: resetEmail.trim(),
        otp: resetOtp.trim() || undefined,
        securityKey: resetKey.trim() || undefined,
        newPassword: resetNewPass.trim()
      });

      if (res.success) {
        setResetSuccess(res.message || 'सुरक्षा कोड सत्यापित हुआ! एडमिन पासवर्ड सफलतापूर्वक बदल दिया गया है।');
        setAdminId(resetEmail.trim());
        setPassword(resetNewPass.trim());
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setResetSuccess(null);
          setResetStep('email');
          setResetOtp('');
          setSimulatedOtp(null);
          setResetNewPass('');
          setResetConfirmPass('');
        }, 2200);
      } else {
        setResetError(res.message || 'पासवर्ड रीसेट करने में त्रुटि आई। कृपया सुरक्षा कोड जांचें।');
      }
    } catch (err: any) {
      setResetError(err.message || 'नेटवर्क त्रुटि।');
    } finally {
      setResetLoading(false);
    }
  };

  const handleCopyOtpToField = () => {
    if (simulatedOtp) {
      setResetOtp(simulatedOtp);
    }
  };

  const handleFillSecretariatKey = () => {
    setResetKey('UPRSA-SEC-2026');
    setResetError(null);
  };

  const handleCopyDefaultCreds = () => {
    navigator.clipboard.writeText('ID: admin@uprsa.org | Pass: uprsa@admin2026');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
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
                placeholder="uprsa.official@gmail.com"
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

      {/* Official Forgot Password & Self-Service Reset Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0b1329] border border-amber-500/40 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/90 space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Admin Password Recovery (पासवर्ड रीसेट)</h3>
                  <p className="text-[10px] text-slate-400">UPRSA State Secretariat IT Desk</p>
                </div>
              </div>
              <button 
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification messages */}
            {resetSuccess && (
              <div className="bg-emerald-950/70 border border-emerald-500/50 p-3.5 rounded-2xl text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            {resetError && (
              <div className="bg-red-950/70 border border-red-500/50 p-3.5 rounded-2xl text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {/* OTP Flow: Step 1 vs Step 2 */}
            {resetStep === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5 pt-1">
                <div className="bg-[#050b18] border border-amber-500/20 p-3.5 rounded-2xl text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>स्टेप 1: ईमेल पर सुरक्षा कोड (Security Code) मंगाएं</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    अपना पंजीकृत एडमिन ईमेल दर्ज करें। पासवर्ड बदलने के लिए उस ईमेल पर एक गोपनीय 6-अंकों का सिक्योरिटी कोड (OTP) भेजा जाएगा।
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    पंजीकृत एडमिन ईमेल (Registered Admin Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="uprsa.official@gmail.com / uprsa.support@gmail.com"
                    className="w-full bg-[#050b18] border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {sendingOtp ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>ईमेल पर सुरक्षा कोड भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>📧 सुरक्षा कोड (Security Code) ईमेल पर भेजें ➔</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 pt-1 animate-in fade-in">
                
                {/* OTP Sent Confirmation Banner */}
                <div className="bg-blue-950/40 border border-blue-500/40 p-3.5 rounded-2xl text-xs text-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>सुरक्षा कोड भेजा गया: <strong className="text-amber-300">{resetEmail}</strong></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep('email');
                        setResetError(null);
                        setResetSuccess(null);
                      }}
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      ईमेल बदलें
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    कृपया अपने ईमेल इनबॉक्स / स्पैम फोल्डर की जांच करें और प्राप्त 6-अंकों का सुरक्षा कोड यहां दर्ज करें।
                  </p>
                </div>

                {/* 6-Digit OTP Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase">
                      6-अंकों का सुरक्षा कोड (Security Code / OTP) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={sendingOtp || otpCountdown > 0}
                      className="text-[10px] text-amber-400 hover:underline disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {otpCountdown > 0 ? `पुनः भेजें (${otpCountdown}s)` : 'पुनः कोड भेजें (Resend)'}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-[#050b18] border border-amber-500/50 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-base text-amber-300 font-mono tracking-widest text-center font-black outline-none shadow-inner"
                  />
                </div>

                {/* New Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      नया पासवर्ड (New Password) *
                    </label>
                    <input
                      type="password"
                      required
                      value={resetNewPass}
                      onChange={(e) => setResetNewPass(e.target.value)}
                      placeholder="न्यूनतम 6 अक्षर"
                      className="w-full bg-[#050b18] border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      पासवर्ड पुष्टि (Confirm) *
                    </label>
                    <input
                      type="password"
                      required
                      value={resetConfirmPass}
                      onChange={(e) => setResetConfirmPass(e.target.value)}
                      placeholder="पुनः दर्ज करें"
                      className="w-full bg-[#050b18] border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {resetLoading ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>सुरक्षा कोड सत्यापित हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      <span>🔐 सुरक्षा कोड सत्यापित करें एवं पासवर्ड बदलें ➔</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep('email');
                      setResetError(null);
                      setResetSuccess(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-amber-400 cursor-pointer"
                  >
                    ← पिछला स्टेप (ईमेल बदलें)
                  </button>
                </div>
              </form>
            )}

            {/* Helpline Section */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">टेक्निकल सपोर्ट हेल्पलाइन:</span>
              <div className="flex items-center gap-4 flex-wrap text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>it-admin@uprsa.org</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>+91 94150 21989 / +91 522 2439812</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
