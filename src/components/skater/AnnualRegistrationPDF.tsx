import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileDown, 
  Loader2 
} from 'lucide-react';
import { Skater } from '../../types';
import { CURRENT_SEASON_CODE, CURRENT_SEASON_DISPLAY } from '../../config/season';
import { calculate2026AgeCategory } from '../../data/uprsaKnowledge';
import { printDocketElement, downloadDocketPDF } from '../../utils/printDocket';
import { getSkaterLicenseNumber } from '../../utils/districtCodes';

interface AnnualRegistrationPDFProps {
  skater: Skater;
  onDownloadRequested?: () => void;
  onPrintRequested?: () => void;
  isDownloading?: boolean;
}

export const AnnualRegistrationPDF: React.FC<AnnualRegistrationPDFProps> = ({ 
  skater,
  onDownloadRequested,
  onPrintRequested,
  isDownloading: externalDownloading = false
}) => {
  const [copied, setCopied] = useState(false);
  const [localDownloading, setLocalDownloading] = useState(false);
  const [localPrinting, setLocalPrinting] = useState(false);

  const safeRegNo = skater.registrationNumber || skater.id || 'REG';
  const skaterName = `${skater.firstName || ''}_${skater.lastName || ''}`.trim() || 'Skater';
  const filePrefix = `UPRSA_Registration_Slip_${safeRegNo}_${skaterName}`;

  const isDownloading = externalDownloading || localDownloading;

  const handlePrint = async () => {
    if (onPrintRequested) {
      onPrintRequested();
      return;
    }
    try {
      setLocalPrinting(true);
      await printDocketElement('annual-reg-docket');
    } catch (e) {
      console.error('Print failed', e);
      window.print();
    } finally {
      setLocalPrinting(false);
    }
  };

  const handleDownload = async () => {
    if (onDownloadRequested) {
      onDownloadRequested();
      return;
    }
    try {
      setLocalDownloading(true);
      await downloadDocketPDF('annual-reg-docket', filePrefix);
    } catch (e) {
      console.error('Download failed', e);
      alert('Could not download PDF. You can use the Print button to save as PDF.');
    } finally {
      setLocalDownloading(false);
    }
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

  const licenseNo = skater.licenseNumber && skater.licenseNumber.startsWith('UPRSA/')
    ? skater.licenseNumber
    : getSkaterLicenseNumber(skater);

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
          {/* Download PDF Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
            title="Download official PDF docket"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? 'Saving PDF...' : 'Download PDF'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={localPrinting}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all hover:scale-105"
            title="Print docket directly on A4 paper"
          >
            {localPrinting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>{localPrinting ? 'Preparing...' : 'Print Docket (A4)'}</span>
          </button>
        </div>
      </div>

      {/* Official A4 Registration Docket Container */}
      <div 
        id="annual-reg-docket" 
        className="bg-white text-black p-5 sm:p-6 border border-slate-300 shadow-2xl rounded-sm print:p-0 print:border-none print:shadow-none print:m-0 select-text font-sans"
        style={{ color: '#000000' }}
      >
        {/* ========================================================================= */}
        {/* HEADER SECTION: Federation Name, Recognition, Form Title (Logos Removed) */}
        {/* ========================================================================= */}
        <div className="border-b border-black pb-2 text-center">
          <div className="text-xs font-black text-amber-800 tracking-widest uppercase font-sans">
            UPRSA
          </div>
          <div className="text-base sm:text-lg md:text-xl font-black tracking-wide text-black uppercase font-sans leading-tight mt-0.5">
            UTTAR PRADESH ROLLER SPORTS ASSOCIATION
          </div>
          <div className="text-[10px] sm:text-[11px] font-black text-amber-900 uppercase tracking-wider mt-0.5">
            STATE GOVERNING BODY OF ROLLER SPORTS IN UTTAR PRADESH
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase tracking-widest mt-0.5">
            AFFILIATED TO ROLLER SKATING FEDERATION OF INDIA
          </div>

          {/* Form Main Title Bar */}
          <div className="text-center mt-2 pt-1.5 border-t border-black">
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-black">
              SKATER ANNUAL REGISTRATION 2026–27
            </h1>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-black mt-0.5">
              SKATER REGISTRATION FORM
            </h2>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOP METADATA ROW: District, State, Club, Discipline, Numbers & Date */}
        {/* ========================================================================= */}
        <div className="py-2.5 border-b border-black text-[10px] sm:text-[11px] leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* Left Column (7 cols): Registering District, Residing District, Club, Discipline */}
            <div className="md:col-span-7 space-y-1">
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

            {/* Right Column (5 cols): Registration Number, Official License Number, Application No & Date */}
            <div className="md:col-span-5 space-y-1 md:text-right bg-slate-50 p-2 rounded border border-black/20">
              <div className="flex justify-between md:justify-end gap-2">
                <span className="font-bold text-black">Registration Number:</span>
                <span className="font-mono font-black text-black text-xs">
                  {skater.registrationNumber}
                </span>
              </div>
              <div className="flex justify-between md:justify-end gap-2">
                <span className="font-bold text-black">Official License Number:</span>
                <span className="font-mono font-black text-black text-xs">
                  {skater.licenseNumber || 'PENDING APPROVAL'}
                </span>
              </div>
              <div className="flex justify-between md:justify-end gap-2 text-[9.5px]">
                <span className="font-semibold text-slate-700">Application Number:</span>
                <span className="font-mono font-bold text-slate-800">
                  {skater.applicationNumber || orderId}
                </span>
              </div>
              <div className="flex justify-between md:justify-end gap-2 text-[9.5px]">
                <span className="font-semibold text-slate-700">Registration Date:</span>
                <span className="font-mono text-slate-800">
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
                  <img 
                    src={qrCodeUrl} 
                    alt="Verify QR" 
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain" 
                  />
                  <span className="text-[6px] font-mono font-black uppercase text-black leading-none">SCAN VERIFY</span>
                </div>

                {/* Passport Photo */}
                <div className="w-24 h-28 border border-black bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {skater.photoUrl ? (
                    <img
                      src={skater.photoUrl}
                      alt={`${skater.firstName} ${skater.lastName}`}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
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
        <div className="pt-3 border-t border-black space-y-4 text-[10px] text-black font-semibold break-inside-avoid print:break-inside-avoid">
          {/* Row 1: Signature of Skater & Signature of Parent/Guardian */}
          <div className="flex justify-between items-end px-4">
            <div className="text-center">
              <div className="h-6 w-44 border-b border-black mb-1" />
              <span className="font-bold">Signature of Skater</span>
            </div>
            <div className="text-center">
              <div className="h-6 w-44 border-b border-black mb-1" />
              <span className="font-bold">Signature of Parent/Guardian</span>
            </div>
          </div>

          {/* Row 2: Seal & Signature of Club & District Association */}
          <div className="flex justify-between items-end px-4">
            <div className="text-center">
              <div className="h-7 w-48 border-b border-black mb-1" />
              <span className="font-bold">Seal &amp; Signature of the Club</span>
            </div>
            <div className="text-center">
              <div className="h-7 w-48 border-b border-black mb-1" />
              <span className="font-bold">Seal &amp; Signature of the District Association</span>
            </div>
          </div>

          {/* Row 3: Seal & Signature of the State Association */}
          <div className="flex justify-start items-end px-4">
            <div className="text-center">
              <div className="h-7 w-56 border-b border-black mb-1" />
              <span className="font-bold">Seal &amp; Signature of the State Association</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
