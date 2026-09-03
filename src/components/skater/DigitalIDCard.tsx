import React, { useState } from 'react';
import { 
  Shield, 
  Printer, 
  RotateCw, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  User, 
  Award,
  QrCode,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Skater } from '../../types';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';
import { CURRENT_SEASON_DISPLAY, CURRENT_SEASON_CODE, OFFICIAL_SEASON_LABELS } from '../../config/season';

interface DigitalIDCardProps {
  skater: Skater;
}

export const DigitalIDCard: React.FC<DigitalIDCardProps> = ({ skater }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isVerified = skater.status === 'VERIFIED' || skater.status === 'APPROVED' || skater.status === 'verified' || skater.status === 'approved';
  const displayStatus = isVerified ? 'VERIFIED' : 'PENDING VERIFICATION';
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/athlete/${skater.registrationNumber}`
    : `https://uprsa.org/verify/athlete/${skater.registrationNumber}`;
  const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=4&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Action Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Flip to {isFlipped ? 'Front' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Card</span>
          </button>
        </div>
      </div>

      {/* The 3D Card Container */}
      <div className="relative aspect-[1.586/1] w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-slate-800">
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-2 border-amber-500/60 p-4 flex flex-col justify-between relative select-none">
            {/* Watermark Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute right-4 bottom-10 opacity-5 font-black text-6xl text-white pointer-events-none">
              UPRSA
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-amber-500/50 p-1 flex flex-col items-center justify-center font-black text-amber-400 text-[10px]">
                  <span>UP</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xs leading-none">
                    UTTAR PRADESH ROLLER SPORTS ASSOCIATION
                  </h4>
                  <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">
                    {OFFICIAL_SEASON_LABELS.ATHLETE_AFFILIATION}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-wider ${
                isVerified 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {displayStatus}
              </span>
            </div>

            {/* Skater Main Info */}
            <div className="flex items-center gap-3.5 z-10 py-1">
              {/* Photo */}
              <div className="w-20 h-24 rounded-xl bg-slate-800 border-2 border-amber-500/60 overflow-hidden shrink-0 shadow-md">
                {skater.photoUrl ? (
                  <img
                    src={skater.photoUrl}
                    alt={`${skater.firstName} ${skater.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-bold">
                    PHOTO
                  </div>
                )}
              </div>

              {/* Data fields */}
              <div className="space-y-1 text-[11px] leading-tight flex-1">
                <div>
                  <span className="text-slate-400 text-[8px] block uppercase font-semibold">Athlete Name:</span>
                  <span className="font-extrabold text-white text-sm">
                    {skater.firstName} {skater.lastName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 text-[8px] block uppercase font-semibold">State Reg No:</span>
                    <span className="font-mono font-bold text-amber-400 text-[11px]">{skater.registrationNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] block uppercase font-semibold">DOB / Bracket:</span>
                    <span className="font-medium text-slate-200 text-[10px]">{skater.dateOfBirth} ({skater.ageCategory})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 text-[8px] block uppercase font-semibold">District (Mandal):</span>
                    <span className="font-semibold text-slate-200 truncate block">{skater.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] block uppercase font-semibold">Discipline:</span>
                    <span className="font-semibold text-white truncate block">{skater.discipline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[8px] text-slate-400 z-10">
              <span className="font-mono">Valid Thru: {skater.validUntil || OFFICIAL_SEASON_LABELS.VALID_UNTIL}</span>
              <span className="font-mono font-bold text-amber-400">RSFI & UPOA RECOGNIZED</span>
            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="w-full h-full bg-slate-950 border-2 border-amber-500/60 p-4 flex flex-col justify-between relative select-none">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-slate-300">
                STATE SECRETARIAT & ATHLETE EMERGENCY
              </span>
              <span className="text-[9px] font-mono font-bold text-amber-400">
                Blood: {skater.bloodGroup || 'O+'}
              </span>
            </div>

            {/* Back Details & QR */}
            <div className="flex items-center justify-between gap-4 py-1 text-[10px] text-slate-300">
              <div className="space-y-1 flex-1">
                <div>
                  <span className="text-slate-500 text-[8px] uppercase font-bold block">Father / Guardian:</span>
                  <span className="font-semibold text-white">{skater.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[8px] uppercase font-bold block">Emergency Phone:</span>
                  <span className="font-semibold text-amber-400 font-mono">{skater.emergencyPhone || skater.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[8px] uppercase font-bold block">Affiliated Club / Academy:</span>
                  <span className="text-slate-300 truncate block text-[9px]">{skater.club}</span>
                </div>
              </div>

              {/* High-Contrast QR Code for Public Verification */}
              <div className="w-20 h-20 bg-white rounded-xl p-1 flex flex-col items-center justify-between shrink-0 border border-slate-700 shadow-sm">
                <img 
                  src={qrCodeImgSrc} 
                  alt={`QR Verification: ${skater.registrationNumber}`}
                  className="w-14 h-14 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to SVG icon if network blocked
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-[6px] text-slate-900 font-mono font-black uppercase tracking-tight">SCAN TO VERIFY</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="pt-1.5 border-t border-slate-800 text-[7.5px] text-slate-400 leading-tight">
              <span>
                Mandatory for entering tournament calling areas. Issued under the authority of UPRSA Executive Board.
                Helpline: {UPRSA_INFO.phone}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

