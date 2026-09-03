import React, { useRef } from 'react';
import { Printer, Download, QrCode, CheckCircle2, Copy, Check } from 'lucide-react';
import { Skater } from '../../types';
import { CURRENT_SEASON_CODE, CURRENT_SEASON_DISPLAY } from '../../config/season';
import { calculate2026AgeCategory } from '../../data/uprsaKnowledge';

interface AnnualRegistrationPDFProps {
  skater: Skater;
}

export const AnnualRegistrationPDF: React.FC<AnnualRegistrationPDFProps> = ({ skater }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const copyRegNo = () => {
    if (skater.registrationNumber) {
      navigator.clipboard.writeText(skater.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper date formatting: "13-Mar-2017"
  const formatDOB = (dobStr?: string) => {
    if (!dobStr) return 'N/A';
    try {
      const d = new Date(dobStr);
      if (isNaN(d.getTime())) return dobStr;
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dobStr;
    }
  };

  // Helper datetime: "YYYY-MM-DD HH:MM:SS"
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '2026-02-06 16:00:14';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return dateStr;
    }
  };

  // Helper date payment: "DD/MM/YYYY HH:MM:SS"
  const formatPaymentDate = (dateStr?: string) => {
    if (!dateStr) return '06/02/2026 21:29:35';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return dateStr;
    }
  };

  // Calculate age & age category
  const ageCatData = skater.dateOfBirth ? calculate2026AgeCategory(skater.dateOfBirth) : null;
  const ageYears = ageCatData ? ageCatData.ageAsOfDec31 : (skater.age || 'N/A');

  // Format category string as in scan: "8 to 10 - Cadet (as on 31-12-2025)"
  const seasonYear = CURRENT_SEASON_CODE.includes('-') ? CURRENT_SEASON_CODE.split('-')[0] : '2026';
  const displayAgeGroup = skater.ageCategory
    ? `${skater.ageCategory.replace(/\((.*?)\)/, '$1 - ' + skater.ageCategory.split(' ')[0])} (as on 31-12-${seasonYear})`
    : `${ageCatData?.category || 'Cadet (8 to 10)'} (as on 31-12-${seasonYear})`;

  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/athlete/${skater.registrationNumber || skater.id}`
    : `https://uprsa.org/verify/athlete/${skater.registrationNumber || skater.id}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=3&data=${encodeURIComponent(verificationUrl)}`;

  const orderId = (skater as any).orderId || skater.registrationNumber?.replace(/[^0-9]/g, '') || `2026${skater.id?.slice(-5) || '02955'}`;
  const trackingId = skater.annualFeeUtr || (skater as any).trackingId || `11364${(skater.id || '987654').slice(-7)}`;
  const isPaid = skater.annualFeePaid || !!skater.annualFeeUtr;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Official Docket:</span>
          <span className="font-mono font-bold text-amber-400 text-xs">
            {skater.registrationNumber || 'UP/SKT/2026/0000'}
          </span>
          <button
            onClick={copyRegNo}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Copy Reg No"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Docket (A4)</span>
          </button>
        </div>
      </div>

      {/* Official A4 Registration Docket Container */}
      <div 
        id="annual-reg-docket" 
        className="bg-white text-black p-6 sm:p-8 border border-slate-300 shadow-2xl rounded-sm print:p-0 print:border-none print:shadow-none print:m-0 select-text font-sans"
        style={{ minHeight: '297mm', color: '#000000' }}
      >
        {/* ========================================================================= */}
        {/* HEADER SECTION: Logos, Federation Name, Recognition, Address */}
        {/* ========================================================================= */}
        <div className="border-b border-black pb-2">
          <div className="flex items-center justify-between gap-2">
            {/* Left: RSFI / Roller Skating Federation of India circular logo */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c2410c" strokeWidth="3" />
                <circle cx="50" cy="50" r="41" fill="#fff7ed" stroke="#15803d" strokeWidth="1.5" />
                {/* Ribbon accents */}
                <path d="M 25 80 Q 50 92 75 80 L 70 94 Q 50 98 30 94 Z" fill="#c2410c" />
                {/* Skate silhouette */}
                <circle cx="36" cy="62" r="5" fill="#1e3a8a" />
                <circle cx="64" cy="62" r="5" fill="#1e3a8a" />
                <rect x="33" y="54" width="34" height="4" rx="2" fill="#64748b" />
                <path d="M 35 54 L 40 38 L 52 38 L 58 46 L 66 48 L 66 54 Z" fill="#b91c1c" />
                {/* Circular Text */}
                <path id="rsfiCurve" d="M 18,50 A 32,32 0 1,1 82,50" fill="none" />
                <text className="text-[6.5px] font-black fill-red-800 tracking-wider">
                  <textPath href="#rsfiCurve" startOffset="50%" textAnchor="middle">
                    ROLLER SKATING FEDERATION OF INDIA
                  </textPath>
                </text>
                <text x="50" y="73" textAnchor="middle" className="text-[6px] font-black fill-emerald-800">
                  ESTD. 1955
                </text>
              </svg>
            </div>

            {/* Center: Federation Title & Recognition Details */}
            <div className="text-center flex-1 px-1">
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-orange-600 uppercase font-sans">
                  INDIA
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-700 uppercase font-sans">
                  SKATE
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-red-700 tracking-wide uppercase leading-tight mt-0.5">
                ROLLER SKATING FEDERATION OF INDIA ®
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-red-600 leading-tight">
                भारतीय रोलर स्केटिंग महासंघ
              </div>
              <div className="text-[8px] sm:text-[9px] font-bold text-slate-800 mt-0.5 leading-tight">
                भारत सरकार द्वारा मान्यता प्राप्त | RECOGNISED BY THE GOVERNMENT OF INDIA &amp; IOA
              </div>
              <div className="text-[7.5px] sm:text-[8px] text-slate-600 mt-0.5">
                A 695, Shastri Nagar, New Delhi-110052 | www.indiaskate.com
              </div>
              <div className="text-[8px] font-bold text-blue-900 uppercase tracking-wider mt-0.5">
                UTTAR PRADESH ROLLER SPORTS ASSOCIATION (UPRSA STATE AFFILIATE UNIT)
              </div>
            </div>

            {/* Right: Partner & Affiliation Logos (MYAS, SAI, IOA, World Skate) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* MYAS Emblem */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-full h-full text-slate-800">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#334155" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="4" fill="#334155" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={i}
                        x1="20"
                        y1="20"
                        x2={20 + 13 * Math.cos((i * 30 * Math.PI) / 180)}
                        y2={20 + 13 * Math.sin((i * 30 * Math.PI) / 180)}
                        stroke="#334155"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>
                <span className="text-[6px] font-bold text-slate-700 leading-tight text-center">MYAS</span>
              </div>

              {/* SAI Logo */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-white font-black text-[9px]">
                  SAI
                </div>
                <span className="text-[6px] font-bold text-slate-700 leading-tight text-center">SAI</span>
              </div>

              {/* IOA Rings */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 60 30" className="w-full h-full">
                    <circle cx="12" cy="12" r="7" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                    <circle cx="30" cy="12" r="7" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                    <circle cx="48" cy="12" r="7" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                    <circle cx="21" cy="18" r="7" fill="none" stroke="#eab308" strokeWidth="2.5" />
                    <circle cx="39" cy="18" r="7" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                  </svg>
                </div>
                <span className="text-[6px] font-bold text-slate-700 leading-tight text-center">INDIA IOA</span>
              </div>

              {/* World Skate */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-7 flex items-center justify-center border border-slate-700 rounded px-0.5">
                  <span className="text-[6.5px] font-black text-slate-900 leading-none text-center">
                    WORLD<br />SKATE
                  </span>
                </div>
                <span className="text-[6px] font-bold text-slate-700 leading-tight text-center">AFFILIATED</span>
              </div>
            </div>
          </div>

          {/* Form Main Title Bar */}
          <div className="text-center mt-2 pt-1 border-t border-slate-300">
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-black">
              SKATER ANNUAL REGISTRATION {skater.season || CURRENT_SEASON_DISPLAY}
            </h1>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900">
              SKATER REGISTRATION FORM
            </h2>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOP METADATA ROW: District, State, Club, Discipline, Application No, Date */}
        {/* ========================================================================= */}
        <div className="py-2 border-b border-black text-[10px] sm:text-[11px] leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* Left Column (8 cols): Registering District, Residing District, Club, Discipline */}
            <div className="md:col-span-8 space-y-1">
              <div className="grid grid-cols-12">
                <span className="col-span-5 font-bold text-black">Registering District &amp; State</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-6 font-bold text-black">
                  {skater.district} - Uttar Pradesh
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-5 font-bold text-black">Residing District &amp; State</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-6 font-bold text-black">
                  {skater.residingDistrict || skater.district} - Uttar Pradesh
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-5 font-bold text-black">Registering Club</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-6 font-bold text-black uppercase">
                  {skater.club || 'Individual / Direct State Affiliation'}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-5 font-bold text-black">Discipline</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-6 font-bold text-black">
                  {skater.discipline || 'Speed-Quad'}
                </span>
              </div>
            </div>

            {/* Right Column (4 cols): Application No & Date */}
            <div className="md:col-span-4 space-y-1 md:text-right">
              <div>
                <span className="font-bold text-black">Application No : </span>
                <span className="font-mono font-bold text-black">
                  {skater.registrationNumber || orderId}
                </span>
              </div>
              <div>
                <span className="font-bold text-black">Date : </span>
                <span className="font-mono text-black">
                  {formatDateTime(skater.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SKATER PROFILE PARTICULARS + PASSPORT PHOTO + PAYMENT SUMMARY BOX */}
        {/* ========================================================================= */}
        <div className="py-2.5 border-b border-black text-[10px] sm:text-[11px] leading-snug">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
            {/* Left Particulars (8 cols) */}
            <div className="md:col-span-8 space-y-1">
              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Name</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 font-black text-black text-xs sm:text-sm uppercase tracking-wide">
                  {skater.firstName} {skater.lastName}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Father Name</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 font-bold text-black uppercase">
                  {skater.fatherName || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Date of Birth</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 font-bold text-black font-mono">
                  {formatDOB(skater.dateOfBirth)}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Age &amp; Gender</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 font-bold text-black">
                  {ageYears} {skater.gender}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Age Group</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 font-bold text-black">
                  {displayAgeGroup}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Blood Group</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 font-bold text-black">
                  {skater.bloodGroup || 'O+'}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Phone &amp; Email</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 text-black font-mono">
                  {skater.phone} | {skater.email}
                </span>
              </div>

              <div className="grid grid-cols-12">
                <span className="col-span-4 font-bold text-black">Res. Address</span>
                <span className="col-span-1 text-center font-bold">:</span>
                <span className="col-span-7 text-black text-[9.5px] leading-tight">
                  {skater.address || `C/O ${skater.fatherName || skater.firstName}, ${skater.district}, Uttar Pradesh`}
                </span>
              </div>
            </div>

            {/* Right Column (4 cols): Photo + Bordered Payment Box */}
            <div className="md:col-span-4 flex flex-col items-end space-y-2">
              {/* Photo & QR Bar */}
              <div className="flex items-center gap-2">
                {/* Scannable QR Code */}
                <div className="w-16 h-16 border border-black p-0.5 flex flex-col items-center justify-center bg-white shrink-0">
                  <img src={qrCodeUrl} alt="Verify QR" className="w-12 h-12 object-contain" />
                  <span className="text-[6px] font-mono font-black uppercase text-black leading-none">SCAN VERIFY</span>
                </div>

                {/* Passport Photo */}
                <div className="w-24 h-28 border border-black bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {skater.photoUrl ? (
                    <img
                      src={skater.photoUrl}
                      alt={`${skater.firstName} ${skater.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-1 text-slate-400">
                      <span className="text-[8px] font-bold block uppercase leading-tight">PASSPORT PHOTO</span>
                      <span className="text-[6px] text-slate-400 block mt-1">(3.5 x 4.5 cm)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exact Payment Box as seen in Official Docket */}
              <div className="w-full border border-black p-1.5 text-[9.5px] leading-tight font-sans bg-white">
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-5 font-bold text-black">Fee</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-6 font-bold text-black">Rs.500/- for 1 Yr(s).</span>
                </div>
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-5 font-bold text-black">Payment Status</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-6 font-black text-black uppercase">
                    {isPaid ? 'Success' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-5 font-bold text-black">Order ID</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-6 font-mono text-black">{orderId}</span>
                </div>
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-5 font-bold text-black">Tracking ID</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-6 font-mono text-black">{trackingId}</span>
                </div>
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-5 font-bold text-black">Mode</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-6 text-black">Unified Payments (UPI)</span>
                </div>
                <div className="grid grid-cols-12 py-0.5">
                  <span className="col-span-5 font-bold text-black">Date</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-6 font-mono text-black">
                    {formatPaymentDate(skater.annualFeePaymentDate || skater.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DECLARATION: Verbatim clauses 1 to 25 + Clause 26 */}
        {/* ========================================================================= */}
        <div className="py-2 text-[8px] sm:text-[8.5px] leading-[1.32] text-black font-sans">
          <div className="font-bold text-black text-[10px] uppercase tracking-wide mb-0.5">
            Declaration
          </div>
          <div className="font-semibold text-black mb-1">
            I hereby declare that:
          </div>

          <ol className="space-y-0.5 list-none pl-0 text-justify">
            <li>
              <strong>1.</strong> I am/was not a registered skater with any State/U.T. Unit other than the present one.
            </li>
            <li>
              <strong>2.</strong> I am aware that only skaters registered with the Roller Skating Federation of India (RSFI) are allowed to participate in International, Asian, and RSFI-approved National, All India, Memorial, and Invitational Tournaments, as well as State/U.T.-approved State, District, and local championships. Therefore, I undertake not to participate in any competition or championship that does not have the approval of RSFI or the State/U.T. Unit as mentioned above.
            </li>
            <li>
              <strong>3.</strong> I am aware that I am permitted to participate only in the registered discipline (as mentioned above) in any District, State, National, Open Championships, and any violation of this rule will be subject to strict disciplinary action by RSFI.
            </li>
            <li>
              <strong>4.</strong> I also understand that multiple registrations are not allowed. Any violation of this rule will result in strict disciplinary action, invalidation of both registrations, and forfeiture of the registration fee.
            </li>
            <li>
              <strong>5.</strong> I do not participate in any skating sport/discipline/activity that is not recognized by RSFI. In case I intend to participate in any such tournament, I will seek prior permission well in advance.
            </li>
            <li>
              <strong>6.</strong> I have attached proof of identity, address, and date of birth as per RSFI guidelines and will produce the necessary original documents whenever requested by RSFI, the State Association, or the District Association.
            </li>
            <li>
              <strong>7.</strong> I understand that completing online registration and making the fee payment does not confirm the completion of the registration process. My registration is subject to approval by the District and State Units and RSFI.
            </li>
            <li>
              <strong>8.</strong> I consent to share the information provided by me with RSFI and any service providers associated with RSFI.
            </li>
            <li>
              <strong>9.</strong> I agree to receive newsletters and other communications from RSFI via mail, email, phone calls, or SMS.
            </li>
            <li>
              <strong>10.</strong> All the information provided in the online registration system (as furnished above) is true, and I take full responsibility for its accuracy.
            </li>
            <li>
              <strong>11.</strong> I accept that if any information provided is found to be incorrect, RSFI has the right to take appropriate action, including forfeiture of the fee and rejection or cancellation of my registration.
            </li>
            <li>
              <strong>12.</strong> I will produce all original and supporting documents whenever required by RSFI, the State Association, or the District Association. I undertake to abide by all the rules and regulations issued by RSFI, the State Association, and the District Association.
            </li>
            <li>
              <strong>13.</strong> I/my ward understand(s) that the rules and regulations are subject to change.
            </li>
            <li>
              <strong>14.</strong> I hereby declare that all the information provided by me is true and correct to the best of my knowledge and belief.
            </li>
            <li>
              <strong>15.</strong> I undertake not to tarnish the reputation of the game or championship on social media or in print media in any adverse manner.
            </li>
            <li>
              <strong>16.</strong> I agree not to oppose any decision made for the betterment of the game or championship by my coach, manager, organizing committee, district, state, or federation.
            </li>
            <li>
              <strong>17.</strong> I undertake not to cause any harm or damage to the reputation of the game, players, officials, spectators, or property during the championship.
            </li>
            <li>
              <strong>18.</strong> I will adhere to all rules and regulations laid down by the championship committee for the smooth functioning of the championship. In case of non-compliance, I accept the actions taken by the District/State Association, organizing committee, coach, manager, or federation.
            </li>
            <li>
              <strong>19.</strong> I/my ward will not participate in any event not organized by CBSE, KVS, SGFI, government organizations, or any event not approved by RSFI, the State Association, or the District Association. In case of any breach, RSFI, the State Association, or the District Association may take appropriate action.
            </li>
            <li>
              <strong>20.</strong> I/my ward agree that RSFI, its members, officials, affiliated units, organizers, or federation/association members shall not be held responsible for any injury, accident, or loss of any nature during practice, camps, championships, or journeys, whether on or off the playing area. I also waive the right to claim any damages from the organizers or association for any such incidents.
            </li>
            <li>
              <strong>21.</strong> I/my ward will obtain adequate accidental, medical, and life insurance policies for participation in tours, championships, tournaments, camps, etc.
            </li>
            <li>
              <strong>22.</strong> I understand that my/my ward’s registration is subject to the approval of the District/State/U.T. Unit, and I will submit the required form and documents to the respective authority promptly.
            </li>
            <li>
              <strong>23.</strong> I/my ward confirm that I/my ward have not participated in any unapproved championship or tournament during the 2024-26 season which did not have the approval of RSFI/State/District Unit.
            </li>
            <li>
              <strong>24.</strong> I/my ward accept that RSFI or the organizing committee has the right to conduct bone tests / DOPE test at any time during or after the championship, and I have no objections. I am aware that failing to comply will result in disciplinary action.
            </li>
            <li>
              <strong>25.</strong> I am aware that qualifying time standards set by RSFI must be met for participation in District, State, and National Championships. I understand that failure to achieve these times will result in ineligibility.
            </li>
            <li className="pt-1">
              <strong>26. Consent for Authentication</strong><br />
              I hereby consent to provide my/myward&apos;s Aadhaar Offline KYC Data and Passcode for Aadhaar based authentication for the purpose of establishing my identity with RSFI Registration as well as to club all sport activities (i.e. Championships) through my Aadhaar information by District, State Units and RSFI. I have no objection in authenticating myself/myward and fully understand that information provided by me shall be used for authenticating my identity through Aadhaar Authentication System for the purpose stated above and related services.
            </li>
          </ol>
        </div>

        {/* ========================================================================= */}
        {/* SIGNATURES & OFFICIAL SEALS BLOCK */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-black space-y-6 text-[10px] text-black font-semibold">
          {/* Row 1: Signature of Skater & Signature of Parent/Guardian */}
          <div className="flex justify-between items-end px-4">
            <div className="text-center">
              <div className="h-7 w-48 border-b border-black mb-1" />
              <span className="font-bold">Signature of Skater</span>
            </div>
            <div className="text-center">
              <div className="h-7 w-48 border-b border-black mb-1" />
              <span className="font-bold">Signature of Parent/Guardian</span>
            </div>
          </div>

          {/* Row 2: Seal & Signature of Club & District Association */}
          <div className="flex justify-between items-end px-4">
            <div className="text-center">
              <div className="h-9 w-52 border-b border-black mb-1" />
              <span className="font-bold">Seal &amp; Signature of the Club</span>
            </div>
            <div className="text-center">
              <div className="h-9 w-52 border-b border-black mb-1" />
              <span className="font-bold">Seal &amp; Signature of the District Association</span>
            </div>
          </div>

          {/* Row 3: Seal & Signature of the State Association */}
          <div className="flex justify-start items-end px-4">
            <div className="text-center">
              <div className="h-9 w-60 border-b border-black mb-1" />
              <span className="font-bold">Seal &amp; Signature of the State Association</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
