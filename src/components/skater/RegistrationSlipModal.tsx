import React from 'react';
import { 
  Printer, 
  X, 
  Shield
} from 'lucide-react';
import { Skater } from '../../types';
import { AnnualRegistrationPDF } from './AnnualRegistrationPDF';

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
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Official Skater Annual Registration Docket
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {skater.registrationNumber || 'State Registration Form'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Print Docket</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-950/60 flex-1">
          <AnnualRegistrationPDF skater={skater} />
        </div>
      </div>
    </div>
  );
};
