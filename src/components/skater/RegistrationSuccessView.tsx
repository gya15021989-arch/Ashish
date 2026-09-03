import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Shield, 
  Printer, 
  Download, 
  QrCode, 
  ArrowRight, 
  Home, 
  UserCheck, 
  Copy, 
  Check, 
  AlertCircle,
  FileText,
  CreditCard,
  Clock
} from 'lucide-react';
import { Skater } from '../../types';
import { DigitalIDCard } from './DigitalIDCard';
import { RegistrationSlipModal } from './RegistrationSlipModal';
import { CURRENT_SEASON_DISPLAY, CURRENT_SEASON_CODE, OFFICIAL_SEASON_LABELS } from '../../config/season';

interface RegistrationSuccessViewProps {
  skater: Skater;
  onNavigateToPortal: () => void;
  onNavigateToVerify: (regNo: string) => void;
  onNavigateHome: () => void;
}

export const RegistrationSuccessView: React.FC<RegistrationSuccessViewProps> = ({
  skater,
  onNavigateToPortal,
  onNavigateToVerify,
  onNavigateHome
}) => {
  const [copied, setCopied] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'id_card' | 'details'>('id_card');

  const handleCopyRegNo = () => {
    navigator.clipboard.writeText(skater.registrationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintSlip = () => {
    setIsSlipOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Success Banner Hero */}
        <div className="bg-gradient-to-b from-emerald-950/60 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider">
              <span>REGISTRATION RECORD CREATED IN STATE LEDGER</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Registration Successful!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Your athlete affiliation for <strong className="text-amber-400">{OFFICIAL_SEASON_LABELS.ATHLETE_AFFILIATION}</strong> has been saved directly to the database.
            </p>
          </div>

          {/* Registration Number Highlight Block */}
          <div className="bg-slate-950/90 border border-slate-700 rounded-2xl p-4 sm:p-5 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Permanent State Registration Number:
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-amber-400">
                {skater.registrationNumber}
              </span>
            </div>

            <button
              onClick={handleCopyRegNo}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-600 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Under Scrutiny Status Badge & Explainer */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 max-w-xl mx-auto flex items-start gap-3 text-left">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  🟠 UNDER SCRUTINY
                </span>
                <span className="text-[11px] text-slate-400">Status Verification Pending</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Your dossier (Aadhaar, Municipal DOB, Medical certificate, and ₹500 fee reference) is currently undergoing administrative scrutiny by the UPRSA technical scrutiny panel.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Button 1: Login to Skater Portal */}
          <button
            onClick={onNavigateToPortal}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-105"
          >
            <UserCheck className="w-4 h-4" />
            <span>LOGIN TO PORTAL</span>
          </button>

          {/* Button 2: Print Registration Slip */}
          <button
            onClick={handlePrintSlip}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>PRINT SLIP</span>
          </button>

          {/* Button 3: Download / View Digital ID */}
          <button
            onClick={() => setActiveTab('id_card')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
          >
            <Shield className="w-4 h-4 text-blue-200" />
            <span>DIGITAL ID CARD</span>
          </button>

          {/* Button 4: Verify ID Publicly */}
          <button
            onClick={() => onNavigateToVerify(skater.registrationNumber)}
            className="bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 font-bold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-indigo-700/60 cursor-pointer transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>VERIFY ID RECORD</span>
          </button>

          {/* Button 5: Return to Home */}
          <button
            onClick={onNavigateHome}
            className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold px-4 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-800 cursor-pointer transition-colors sm:col-span-2 lg:col-span-1"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </button>
        </div>

        {/* Tab View: Digital ID Card or Application Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Official Athlete State Affiliation Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Season {CURRENT_SEASON_DISPLAY} • Registered with Uttar Pradesh Roller Sports Association
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('id_card')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'id_card'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Digital ID
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'details'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Full Dossier
              </button>
            </div>
          </div>

          {activeTab === 'id_card' ? (
            <div className="space-y-4">
              <DigitalIDCard skater={skater} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block text-[11px] uppercase">
                  Personal Details
                </span>
                <div>
                  <span className="text-slate-500 text-[10px] block">Athlete Name:</span>
                  <span className="font-bold text-white text-sm">{skater.firstName} {skater.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Date of Birth & Category:</span>
                  <span className="font-semibold text-slate-200">{skater.dateOfBirth} ({skater.ageCategory})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Father / Guardian:</span>
                  <span className="font-semibold text-slate-200">{skater.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Gender / Blood Group:</span>
                  <span className="font-semibold text-slate-200">{skater.gender} • {skater.bloodGroup}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block text-[11px] uppercase">
                  District & Sports Details
                </span>
                <div>
                  <span className="text-slate-500 text-[10px] block">Registered District:</span>
                  <span className="font-bold text-white">{skater.district} ({skater.mandal || 'State'})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Affiliated Club / Academy:</span>
                  <span className="font-semibold text-slate-200">{skater.club}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Discipline:</span>
                  <span className="font-semibold text-indigo-300">{skater.discipline}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Annual Affiliation Fee (₹500):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    UTR: {skater.annualFeeUtr || 'Pending Admin Confirmation'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Printable Registration Slip Modal */}
        <RegistrationSlipModal
          isOpen={isSlipOpen}
          onClose={() => setIsSlipOpen(false)}
          skater={skater}
        />
      </div>
    </div>
  );
};
