import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Award, 
  Shield, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  MapPin, 
  Trophy,
  QrCode
} from 'lucide-react';
import { Certificate } from '../../types';
import { api } from '../../services/api';

interface CertificateVerificationProps {
  initialCode?: string;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await api.verifyCertificate(codeToVerify.trim());
      if (res.success && res.data) {
        setCertificate(res.data);
      } else {
        setCertificate(null);
        setError(res.message || 'Certificate not found in official state registry.');
      }
    } catch (err: any) {
      setCertificate(null);
      setError('Network error while connecting to verification server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(code);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>STATE CERTIFICATE AUTHENTICATION REGISTRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Verify UPRSA Certificate
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Enter the certificate number or scan the QR code printed on the physical/digital certificate to authenticate official records.
          </p>
        </div>

        {/* Verification Form Bar */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Code, e.g. UPRSA-2026-M-1001 or UPRSA-CERT-2026-AR-001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Record</span>
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
            <span>Sample Verification Codes:</span>
            <button 
              onClick={() => { setCode('UPRSA-2026-M-1001'); handleVerify('UPRSA-2026-M-1001'); }}
              className="font-mono text-amber-400 hover:underline cursor-pointer"
            >
              UPRSA-2026-M-1001 (Merit)
            </button>
            <span>•</span>
            <button 
              onClick={() => { setCode('UPRSA-2026-P-2001'); handleVerify('UPRSA-2026-P-2001'); }}
              className="font-mono text-indigo-400 hover:underline cursor-pointer"
            >
              UPRSA-2026-P-2001 (Participation)
            </button>
          </div>
        </div>

        {/* Verification Results Display */}
        {searched && (
          <div>
            {certificate ? (
              <div className="bg-[#0f172a] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Official Verification Stamp */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-emerald-300 text-base flex items-center gap-1.5">
                        <span>OFFICIALLY VERIFIED CERTIFICATE</span>
                      </h4>
                      <p className="text-xs text-emerald-400/80 font-mono">
                        Verification Code: {certificate.verificationCode} • Issue Date: {certificate.issueDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Record</span>
                  </button>
                </div>

                {/* Certificate Details Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="text-center space-y-1 pb-4 border-b border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      UTTAR PRADESH ROLLER SPORTS ASSOCIATION
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {certificate.type} Certificate
                    </h3>
                    <p className="text-xs text-slate-400">
                      Certificate No: <span className="font-mono text-white font-bold">{certificate.certificateNumber}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Awarded / Issued To:</span>
                        <span className="font-bold text-white text-base">{certificate.recipientName}</span>
                        {certificate.recipientRegNo && (
                          <span className="text-amber-400 font-mono block text-xs">
                            Reg No: {certificate.recipientRegNo}
                          </span>
                        )}
                      </div>

                      {certificate.fatherName && (
                        <div>
                          <span className="text-slate-500 block text-[11px]">Father / Guardian:</span>
                          <span className="font-semibold text-slate-200">{certificate.fatherName}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-500 block text-[11px]">District & Club Unit:</span>
                        <span className="font-semibold text-white">{certificate.district}</span>
                        {certificate.club && <span className="text-slate-400 block">{certificate.club}</span>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Championship / Event:</span>
                        <span className="font-bold text-white">{certificate.tournamentName || 'Annual State Registry'}</span>
                        {certificate.eventName && <span className="text-slate-300 block">{certificate.eventName}</span>}
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Discipline & Age Bracket:</span>
                        <span className="font-semibold text-slate-200">
                          {certificate.discipline || '-'} • {certificate.ageCategory || '-'} ({certificate.gender || '-'})
                        </span>
                      </div>

                      {certificate.position && (
                        <div>
                          <span className="text-slate-500 block text-[11px]">Position / Standing:</span>
                          <span className="font-black text-amber-400 text-base">{certificate.position}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Signatories */}
                  <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-center text-xs">
                    <div>
                      <div className="font-serif italic text-amber-300 text-sm mb-1">
                        {certificate.signatoryPresident || 'President'}
                      </div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        President, UPRSA
                      </span>
                    </div>

                    <div>
                      <div className="font-serif italic text-amber-300 text-sm mb-1">
                        {certificate.signatorySecretary || 'General Secretary'}
                      </div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        General Secretary, UPRSA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0f172a] border border-red-500/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Verification Failed / Record Not Found
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {error || 'The entered certificate code could not be matched against any approved UPRSA state records. Please verify the code on your physical certificate.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
