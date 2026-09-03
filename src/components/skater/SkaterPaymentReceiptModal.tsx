import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  X, 
  CreditCard, 
  Shield, 
  Calendar,
  User
} from 'lucide-react';
import { PaymentRecord, Skater, TournamentRegistration } from '../../types';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';

interface SkaterPaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  skater?: Skater | null;
  registration?: TournamentRegistration | null;
  payment?: PaymentRecord | null;
}

export const SkaterPaymentReceiptModal: React.FC<SkaterPaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  skater,
  registration,
  payment
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = payment?.id || registration?.id || `REC-${Date.now()}`;
  const amount = payment?.amount || registration?.totalFee || 500;
  const utr = payment?.utrNumber || registration?.paymentUtr || 'ONLINE';
  const skaterName = skater ? `${skater.firstName} ${skater.lastName}` : (registration?.skaterName || payment?.skaterName || 'Athlete');
  const regNo = skater?.registrationNumber || registration?.skaterRegNo || 'UPRSA-2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Official State Fee Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-white text-slate-900 space-y-4 select-text">
          <div className="text-center space-y-1 pb-3 border-b-2 border-slate-200">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">
              STATE SECRETARIAT RECEIPT
            </span>
            <h4 className="text-lg font-black text-slate-950 uppercase">
              Uttar Pradesh Roller Sports Association
            </h4>
            <p className="text-[11px] text-slate-500">
              Receipt No: <span className="font-mono font-bold text-slate-900">{receiptNo}</span> • Date: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Athlete Name:</span>
              <span className="font-bold text-slate-900">{skaterName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Registration Number:</span>
              <span className="font-mono font-bold text-blue-900">{regNo}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">District:</span>
              <span className="font-semibold text-slate-900">{skater?.district || registration?.district || 'Lucknow'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Purpose / Head:</span>
              <span className="font-semibold text-slate-900">
                {registration ? `Tournament Entry: ${registration.tournamentTitle}` : 'Annual State Affiliation (2026)'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Mode / UTR:</span>
              <span className="font-mono font-bold text-emerald-800">{utr}</span>
            </div>

            <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black">
              <span>Total Amount Paid:</span>
              <span className="font-mono text-emerald-800">₹{amount}.00</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>This is an official computer-generated receipt from UPRSA State Secretariat.</span>
          </div>
        </div>

        {/* Action footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
