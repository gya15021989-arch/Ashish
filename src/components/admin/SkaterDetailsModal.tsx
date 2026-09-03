import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Award, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Printer, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  X, 
  Trophy, 
  CreditCard, 
  Hash, 
  Key, 
  Clock, 
  Sparkles,
  RefreshCw,
  FolderOpen,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { Skater } from '../../types';
import { api } from '../../services/api';
import { getSkaterLicenseNumber, getDistrictCode } from '../../utils/districtCodes';

interface SkaterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skater: Skater;
  onEditRequested: () => void;
  onDocumentsRequested: () => void;
  onDeleteRequested: () => void;
  onPrintSlipRequested?: () => void;
  onSkaterUpdated: (updated: Skater) => void;
  adminUser?: string;
}

export const SkaterDetailsModal: React.FC<SkaterDetailsModalProps> = ({
  isOpen,
  onClose,
  skater,
  onEditRequested,
  onDocumentsRequested,
  onDeleteRequested,
  onPrintSlipRequested,
  onSkaterUpdated,
  adminUser
}) => {
  const [actionPrompt, setActionPrompt] = useState<'approve' | 'reject' | 'correction' | null>(null);
  const [remarksInput, setRemarksInput] = useState('');
  const [licenseInput, setLicenseInput] = useState(
    skater.licenseNumber || getSkaterLicenseNumber(skater)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password Management State (Part 22)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState<string | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [loginIdCopied, setLoginIdCopied] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!isOpen) return null;

  const skaterLoginId = skater.loginId || skater.email || skater.phone || skater.registrationNumber;

  const handleCopyLoginId = () => {
    navigator.clipboard.writeText(skaterLoginId);
    setLoginIdCopied(true);
    setTimeout(() => setLoginIdCopied(false), 2000);
  };

  const handleCopyTempPassword = () => {
    if (tempPasswordResult) {
      navigator.clipboard.writeText(tempPasswordResult);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$';
    let pwd = 'UP@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pwd);
    setConfirmPassword(pwd);
  };

  const handleOpenPasswordModal = (autoGen: boolean = false) => {
    setPasswordError(null);
    setTempPasswordResult(null);
    setPasswordCopied(false);
    if (autoGen) {
      generateRandomPassword();
    } else {
      setNewPassword('');
      setConfirmPassword('');
    }
    setShowPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = async (autoGenerate: boolean = false) => {
    setPasswordError(null);

    if (!autoGenerate) {
      if (!newPassword || newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match. Please verify.');
        return;
      }
    }

    setIsSavingPassword(true);
    try {
      const res = await api.updateSkaterPassword(skater.id, {
        password: autoGenerate ? undefined : newPassword,
        autoGenerate,
        adminEmail: adminUser || 'admin@uprsa.org'
      });

      if (res.success && res.data) {
        const tempPwd = res.data.temporaryPassword || newPassword;
        setTempPasswordResult(tempPwd);
        setNewPassword('');
        setConfirmPassword('');
        // Update local skater with loginId if updated
        if (res.data.loginId && res.data.loginId !== skater.loginId) {
          onSkaterUpdated({ ...skater, loginId: res.data.loginId });
        }
      } else {
        setPasswordError(res.message || 'Failed to update skater password.');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'An unexpected error occurred while updating password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Calculate age if not set
  const calculateAge = (dob: string) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age} yrs` : '—';
  };

  const currentAge = skater.age !== undefined ? `${skater.age} yrs` : calculateAge(skater.dateOfBirth);

  const handleApprove = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await api.updateSkaterStatus(
        skater.id,
        'approved',
        undefined,
        remarksInput || 'Approved by State Secretariat Board',
        licenseInput || undefined,
        adminUser
      );
      if (res.success && res.data) {
        onSkaterUpdated(res.data);
        setActionPrompt(null);
        setRemarksInput('');
      } else {
        setErrorMsg(res.message || 'Failed to approve application.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while approving application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!remarksInput.trim()) {
      setErrorMsg('Please enter an official rejection reason.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await api.updateSkaterStatus(
        skater.id,
        'rejected',
        remarksInput,
        undefined,
        undefined,
        adminUser
      );
      if (res.success && res.data) {
        onSkaterUpdated(res.data);
        setActionPrompt(null);
        setRemarksInput('');
      } else {
        setErrorMsg(res.message || 'Failed to reject application.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while rejecting application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!remarksInput.trim()) {
      setErrorMsg('Please specify what documents or data the skater must correct / re-upload.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await api.updateSkaterStatus(
        skater.id,
        'under_scrutiny',
        remarksInput,
        remarksInput,
        undefined,
        adminUser
      );
      if (res.success && res.data) {
        onSkaterUpdated(res.data);
        setActionPrompt(null);
        setRemarksInput('');
      } else {
        setErrorMsg(res.message || 'Failed to mark for correction.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while updating status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isApproved = skater.status === 'approved' || skater.status === 'verified' || (skater.status as string) === 'APPROVED' || (skater.status as string) === 'VERIFIED';
  const isRejected = skater.status === 'rejected' || (skater.status as string) === 'REJECTED';
  const isCorrection = skater.status === 'under_scrutiny' || (skater.status as string) === 'UNDER_SCRUTINY';

  // Available documents count
  const availableDocs = [
    skater.photoUrl,
    skater.dobProofUrl,
    skater.aadhaarDocUrl,
    skater.medicalCertUrl,
    skater.schoolIdDocUrl,
    skater.otherDocUrl
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {skater.photoUrl ? (
                <img
                  src={skater.photoUrl}
                  alt={skater.firstName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
                  {skater.firstName.charAt(0)}{skater.lastName.charAt(0)}
                </div>
              )}
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                isApproved ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-amber-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  REG: {skater.registrationNumber}
                </span>
                {skater.applicationNumber && (
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    APP: {skater.applicationNumber}
                  </span>
                )}
                {skater.licenseNumber && (
                  <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    LICENSE: {skater.licenseNumber}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                  isApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : isRejected
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {skater.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {skater.firstName} {skater.lastName}
              </h2>
              <p className="text-xs text-slate-400">
                {skater.district} • {skater.club || 'Individual / Unaffiliated'} • {skater.discipline} ({skater.ageCategory})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onEditRequested}
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Skater</span>
            </button>

            <button
              onClick={onDocumentsRequested}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Documents ({availableDocs}/6)</span>
            </button>

            {onPrintSlipRequested && (
              <button
                onClick={onPrintSlipRequested}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Registration Slip</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isApproved && (
              <button
                onClick={() => {
                  setActionPrompt('approve');
                  setErrorMsg(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            )}

            <button
              onClick={() => {
                setActionPrompt('correction');
                setErrorMsg(null);
              }}
              className="bg-amber-600/80 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Request Correction</span>
            </button>

            {!isRejected && (
              <button
                onClick={() => {
                  setActionPrompt('reject');
                  setErrorMsg(null);
                }}
                className="bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            )}

            <button
              onClick={onDeleteRequested}
              className="bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-500/40 p-1.5 rounded-xl transition-colors"
              title="Delete skater record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Prompt Drawer (Approval, Correction, Rejection) */}
        {actionPrompt && (
          <div className={`p-4 border-b animate-in slide-in-from-top-2 duration-150 ${
            actionPrompt === 'approve'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : actionPrompt === 'reject'
                ? 'bg-red-950/40 border-red-500/40'
                : 'bg-amber-950/40 border-amber-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                {actionPrompt === 'approve' && <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirm Official Athlete Approval & State License Issuance</>}
                {actionPrompt === 'reject' && <><XCircle className="w-4 h-4 text-red-400" /> Specify Rejection Reason</>}
                {actionPrompt === 'correction' && <><AlertTriangle className="w-4 h-4 text-amber-400" /> Mark Application for Athlete Correction / Resubmission</>}
              </h4>
              <button onClick={() => setActionPrompt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-300 mb-2 font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {actionPrompt === 'approve' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">
                    Assign Official State License Number (UPRSA/District Code/Number)
                  </label>
                  <input
                    type="text"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    placeholder={`e.g. UPRSA/${getDistrictCode(skater.district)}/00101`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">
                    Approval Remarks / Endorsement Note
                  </label>
                  <input
                    type="text"
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                    placeholder="e.g. All documents verified against RSFI standards"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(actionPrompt === 'reject' || actionPrompt === 'correction') && (
              <div className="mb-3">
                <label className="block text-[11px] text-slate-300 font-medium mb-1">
                  {actionPrompt === 'reject' ? 'Rejection Reason *' : 'Correction Instructions for Athlete *'}
                </label>
                <textarea
                  rows={2}
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder={
                    actionPrompt === 'reject'
                      ? 'e.g. Ineligible age documentation, forged municipal certificate, or non-compliant medical...'
                      : 'e.g. Please upload clear Municipal DOB certificate and high-resolution passport photo...'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActionPrompt(null)}
                disabled={isProcessing}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>

              {actionPrompt === 'approve' && (
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Confirm Approval</span>
                </button>
              )}

              {actionPrompt === 'reject' && (
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Confirm Rejection</span>
                </button>
              )}

              {actionPrompt === 'correction' && (
                <button
                  onClick={handleRequestCorrection}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>Send Correction Request</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Details Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Section 1: Official Identifiers & Status */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
              <Key className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Official State Identification & Credentials
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Application Number:</span>
                <span className="font-mono font-bold text-slate-200">
                  {skater.applicationNumber || skater.registrationNumber.replace('UPRSA', 'APP')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Registration Number:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {skater.registrationNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Portal Login ID:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {skater.loginId || skater.email || skater.phone || skater.registrationNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Official License Number:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {skater.licenseNumber || getSkaterLicenseNumber(skater)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Application Status:</span>
                <span className={`font-black uppercase text-[11px] ${
                  isApproved ? 'text-emerald-400' : isRejected ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {skater.status}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Approval Date:</span>
                <span className="font-semibold text-slate-200">
                  {skater.approvalDate || skater.verifiedAt || (isApproved ? '2026-01-11' : 'Pending')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Registration Date:</span>
                <span className="font-semibold text-slate-200">
                  {skater.created_at ? new Date(skater.created_at).toLocaleDateString('en-IN') : '2026-02-01'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Season Validity:</span>
                <span className="font-semibold text-emerald-400">
                  Valid Until {skater.validUntil || '2027-12-31'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Login Credentials & Security (Part 22) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Login Credentials & Athlete Portal Access
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                🔒 Bcrypt Salt-10 Hashed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Login ID:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-cyan-300 text-sm">{skaterLoginId}</span>
                  <button
                    onClick={handleCopyLoginId}
                    className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy Login ID"
                  >
                    {loginIdCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Password:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-400 text-sm tracking-widest">••••••••</span>
                  <span className="text-[10px] text-slate-500 italic">(Irreversible Hash)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <button
                  onClick={() => handleOpenPasswordModal(false)}
                  className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors text-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>

                <button
                  onClick={() => handleOpenPasswordModal(true)}
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Password</span>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-900 text-[10px] text-slate-500 leading-normal">
              Notice: Passwords must always be securely hashed using salted bcrypt. Stored passwords cannot be viewed in plain text to preserve athlete privacy.
            </div>
          </div>

          {/* Section 2: Personal & Guardian Details */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
              <User className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Personal & Family Information
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Full Name:</span>
                <span className="font-bold text-white text-sm">{skater.firstName} {skater.lastName}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Father's Name:</span>
                <span className="font-semibold text-slate-200">{skater.fatherName || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Mother's Name:</span>
                <span className="font-semibold text-slate-200">{skater.motherName || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Date of Birth & Age:</span>
                <span className="font-semibold text-slate-200">
                  {skater.dateOfBirth} <span className="text-amber-400 font-bold">({currentAge})</span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Gender:</span>
                <span className="font-semibold text-slate-200">{skater.gender}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Blood Group:</span>
                <span className="font-mono font-bold text-red-400">{skater.bloodGroup || 'O+'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Aadhaar (Masked):</span>
                <span className="font-mono font-semibold text-slate-300">{skater.aadhaarNumberMasked || '****-****-XXXX'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Residing State:</span>
                <span className="font-semibold text-slate-200">Uttar Pradesh (75 Dists)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Address */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
              <Phone className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Contact & Residential Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Primary Mobile:</span>
                <span className="font-mono font-bold text-slate-200">{skater.phone}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Emergency Contact Phone:</span>
                <span className="font-mono font-semibold text-slate-300">{skater.emergencyPhone || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Email Address:</span>
                <span className="font-semibold text-slate-200 truncate block" title={skater.email}>
                  {skater.email || '—'}
                </span>
              </div>

              <div className="sm:col-span-3">
                <span className="text-slate-500 text-[10px] block font-medium">Residential / Postal Address:</span>
                <span className="font-medium text-slate-300 leading-relaxed block">
                  {skater.address || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Sports Affiliation & Equipment */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Sports Affiliation, Category & Equipment
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">District:</span>
                <span className="font-bold text-white">{skater.district}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Club Affiliation:</span>
                <span className="font-semibold text-slate-200">{skater.club || 'Unaffiliated'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Discipline:</span>
                <span className="font-bold text-amber-400">{skater.discipline}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Age Category:</span>
                <span className="font-bold text-white">{skater.ageCategory}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Coach Details:</span>
                <span className="font-semibold text-slate-200">
                  {skater.coachName || 'Self / Independent'} {skater.coachPhone ? `(${skater.coachPhone})` : ''}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Skate Model / Setup:</span>
                <span className="font-mono text-slate-300">{skater.skateModel || 'Standard'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Wheel Size:</span>
                <span className="font-mono text-slate-300">{skater.wheelSize || 'N/A'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Affiliation Season:</span>
                <span className="font-semibold text-slate-200">{skater.season || '2026-27'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Financials & Admin Remarks */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                Fee Payment & Secretariat Audit Remarks
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Annual State Fee:</span>
                <span className={`font-mono font-bold ${skater.annualFeePaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {skater.annualFeePaid ? '₹500 (PAID)' : 'UNPAID'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">UTR / Transaction Ref:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {skater.annualFeeUtr || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Payment Date:</span>
                <span className="font-semibold text-slate-300">
                  {skater.annualFeePaymentDate || '—'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-medium">Verified By:</span>
                <span className="font-semibold text-slate-300">
                  {skater.verifiedBy || 'UPRSA Scrutiny Board'}
                </span>
              </div>

              {(skater.adminRemarks || skater.rejectionReason) && (
                <div className="col-span-2 sm:col-span-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-medium">Official Administrative Remarks:</span>
                  <span className="text-slate-200 font-medium leading-relaxed block mt-0.5">
                    {skater.adminRemarks || skater.rejectionReason}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Uploaded Documents Summary Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-xs">KYC & Document Verification Summary</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {availableDocs} of 6 official documents attached (Photo, DOB Proof, Aadhaar, Medical, School ID).
              </p>
            </div>

            <button
              onClick={onDocumentsRequested}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open Document Vault & Replace / Delete</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Last modified: {skater.updated_at ? new Date(skater.updated_at).toLocaleString('en-IN') : 'N/A'}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      {/* Password Management Dialog (Part 22) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {tempPasswordResult ? 'Temporary Password Issued' : 'Change Athlete Password'}
                  </h3>
                  <p className="text-xs text-slate-400">UPRSA Secure Credential Management</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Skater Summary */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Skater Name:</span>
                  <span className="font-bold text-white">{skater.firstName} {skater.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Login ID:</span>
                  <span className="font-mono font-bold text-cyan-400">{skaterLoginId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Number:</span>
                  <span className="font-mono text-amber-400">{skater.registrationNumber}</span>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 font-medium">
                  ⚠️ {passwordError}
                </div>
              )}

              {tempPasswordResult ? (
                /* Display temporary password ONCE */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Password updated successfully!</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-300 block mb-1">Temporary Password:</span>
                      <div className="flex items-center justify-between bg-slate-950 border border-emerald-500/50 p-2.5 rounded-xl">
                        <span className="font-mono font-black text-emerald-300 text-sm tracking-wider">
                          {tempPasswordResult}
                        </span>
                        <button
                          onClick={handleCopyTempPassword}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-xs transition-colors"
                        >
                          {passwordCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{passwordCopied ? 'Copied' : 'Copy Password'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-200/90 leading-relaxed font-medium">
                      Please share this password with the skater securely. This password will not be displayed again.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Change Password Form */
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter secure password (min 6 characters)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password to confirm"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Random Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-200 text-[11px]"
                    >
                      {showPassword ? 'Hide Characters' : 'Show Characters'}
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      disabled={isSavingPassword}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSavePassword(false)}
                      disabled={isSavingPassword || !newPassword}
                      className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
                    >
                      {isSavingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>Save Password</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
