import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Shield, 
  Loader2, 
  FileDown, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Skater } from '../../types';
import { getSkaterLicenseNumber } from '../../utils/districtCodes';
import { AnnualRegistrationPDF } from './AnnualRegistrationPDF';
import { printDocketElement, downloadDocketPDF, downloadDocketImage } from '../../utils/printDocket';

interface RegistrationSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  skater: Skater;
}

export const RegistrationSlipModal: React.FC<RegistrationSlipModalProps> = ({
  isOpen,
  onClose,
  skater
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const safeRegNo = skater.registrationNumber || skater.id || 'REG';
  const skaterName = `${skater.firstName || ''}_${skater.lastName || ''}`.trim() || 'Skater';
  const filePrefix = `UPRSA_Registration_Slip_${safeRegNo}_${skaterName}`;

  const handlePrint = async () => {
    try {
      setPrinting(true);
      await printDocketElement('annual-reg-docket');
    } catch (err) {
      console.error('Print failed', err);
      window.print();
    } finally {
      setPrinting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      setFeedbackMsg('Generating official PDF docket...');
      await downloadDocketPDF('annual-reg-docket', filePrefix);
      setFeedbackMsg('PDF downloaded successfully!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      console.error('Download PDF failed', err);
      alert('PDF generation encountered an issue. You can use the "Print Docket" button or "Download Image".');
      setFeedbackMsg(null);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      setDownloadingImg(true);
      setFeedbackMsg('Generating registration slip image...');
      await downloadDocketImage('annual-reg-docket', filePrefix);
      setFeedbackMsg('Image downloaded successfully!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      console.error('Download Image failed', err);
      setFeedbackMsg(null);
    } finally {
      setDownloadingImg(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Official Skater Annual Registration Docket
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Verified Format
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono font-bold text-amber-400">
                  {skater.registrationNumber || 'State Registration Form'}
                </span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px]">
                  LIC: {skater.licenseNumber || getSkaterLicenseNumber(skater)}
                </span>
                <span>•</span>
                <span>{skater.firstName} {skater.lastName} ({skater.district})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {feedbackMsg && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium animate-in fade-in">
                <Check className="w-3 h-3" />
                {feedbackMsg}
              </span>
            )}

            {/* Download PDF Button */}
            <button
              id="slip-modal-download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Download official A4 PDF docket"
            >
              {downloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{downloadingPdf ? 'Saving PDF...' : 'Download PDF'}</span>
            </button>

            {/* Download Image Button */}
            <button
              id="slip-modal-download-img-btn"
              onClick={handleDownloadImage}
              disabled={downloadingImg}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
              title="Download high-resolution image"
            >
              {downloadingImg ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{downloadingImg ? 'Saving...' : 'PNG'}</span>
            </button>

            {/* Print Docket Button */}
            <button
              id="slip-modal-print-btn"
              onClick={handlePrint}
              disabled={printing}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Print official registration slip on A4"
            >
              {printing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>{printing ? 'Preparing...' : 'Print Docket'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-950/60 flex-1">
          <AnnualRegistrationPDF 
            skater={skater} 
            onDownloadRequested={handleDownloadPDF} 
            onPrintRequested={handlePrint} 
            isDownloading={downloadingPdf}
          />
        </div>
      </div>
    </div>
  );
};
