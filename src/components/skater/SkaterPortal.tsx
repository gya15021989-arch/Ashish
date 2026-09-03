import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Award, 
  Trophy, 
  CreditCard, 
  FileText, 
  Calendar, 
  QrCode, 
  RotateCw, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Edit,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Skater, Certificate, TournamentRegistration, Tournament, PaymentRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DigitalIDCard } from './DigitalIDCard';
import { AnnualRegistrationPDF } from './AnnualRegistrationPDF';
import { SkaterPaymentReceiptModal } from './SkaterPaymentReceiptModal';
import { RegistrationSlipModal } from './RegistrationSlipModal';
import { CURRENT_SEASON_DISPLAY, OFFICIAL_SEASON_LABELS } from '../../config/season';

interface SkaterPortalProps {
  onNavigateToTournamentEntry: () => void;
  onNavigateToVerifyCert: (certCode: string) => void;
}

export const SkaterPortal: React.FC<SkaterPortalProps> = ({
  onNavigateToTournamentEntry,
  onNavigateToVerifyCert
}) => {
  const { skater, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'id_card' | 'tournaments' | 'certificates' | 'payments' | 'form_docket'>('id_card');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<PaymentRecord | null>(null);
  const [selectedReceiptReg, setSelectedReceiptReg] = useState<TournamentRegistration | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  useEffect(() => {
    if (skater) {
      loadSkaterRecords();
    }
  }, [skater]);

  const loadSkaterRecords = async () => {
    if (!skater) return;
    try {
      const [cRes, rRes, pRes] = await Promise.all([
        api.getCertificates(),
        api.getRegistrations({ skaterId: skater.id }),
        api.getPayments()
      ]);

      if (cRes.success) {
        // filter for this skater
        const skaterCerts = cRes.data.filter(c => 
          c.recipientRegNo === skater.registrationNumber ||
          c.recipientName.toLowerCase() === `${skater.firstName} ${skater.lastName}`.toLowerCase()
        );
        setCertificates(skaterCerts);
      }
      if (rRes.success) {
        setRegistrations(rRes.data);
      }
      if (pRes.success) {
        const skaterPayments = pRes.data.filter(p => p.skaterId === skater.id || p.skaterName.includes(skater.lastName));
        setPayments(skaterPayments);
      }
    } catch (e) {
      console.error('Failed to load skater records:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!skater) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md text-center space-y-4">
          <Shield className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Skater Session Active</h3>
          <p className="text-xs text-slate-400">
            Please register as a new athlete or activate your existing state registration number to enter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Skater Top Profile Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Athlete Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-amber-500/60 overflow-hidden shadow-lg shrink-0">
              {skater.photoUrl ? (
                <img
                  src={skater.photoUrl}
                  alt={`${skater.firstName} ${skater.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                  SKATER
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {skater.registrationNumber}
                </span>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                  {skater.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {skater.firstName} {skater.lastName}
              </h1>

              <p className="text-xs text-slate-300">
                {skater.discipline} • {skater.ageCategory} ({skater.gender}) • {skater.district}
              </p>

              <p className="text-[11px] text-slate-400">
                Club: <strong className="text-slate-200">{skater.club}</strong>
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setIsSlipOpen(true)}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Registration Slip</span>
            </button>

            <button
              onClick={onNavigateToTournamentEntry}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform hover:scale-105 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Enter State Championship</span>
            </button>

            <button
              onClick={logout}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('id_card')}
            className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'id_card'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Digital ID Card</span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tournaments'
                ? 'bg-blue-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tournament Entries ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'certificates'
                ? 'bg-emerald-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-purple-600 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab('form_docket')}
            className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'form_docket'
                ? 'bg-slate-700 text-white font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Annual Reg Docket</span>
          </button>
        </div>

        {/* Tab 1: Digital ID Card */}
        {activeTab === 'id_card' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h3 className="text-xl font-black text-white">
                Official UPRSA State Athlete ID Card
              </h3>
              <p className="text-xs text-slate-400">
                Mandatory for entering tournament marshalling and calling areas. Click "Flip" to view emergency contact and state QR authenticity stamp.
              </p>
            </div>

            <DigitalIDCard skater={skater} />
          </div>
        )}

        {/* Tab 2: Tournament Registrations */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Championship Nominations</h3>
              <button
                onClick={onNavigateToTournamentEntry}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
              >
                <span>+ Enter New Tournament</span>
              </button>
            </div>

            {registrations.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
                No active tournament entries found for this skater. Click above to nominate events.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 font-bold">
                          {reg.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {reg.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base">
                        {reg.tournamentTitle}
                      </h4>

                      <div className="text-xs text-slate-300">
                        Events: {reg.selectedEvents.join(', ')} • {reg.ageCategory} ({reg.gender})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-base font-black text-amber-400 font-mono">
                          ₹{reg.totalFee}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase">
                          UTR: {reg.paymentUtr || 'ONLINE'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedReceiptReg(reg);
                          setSelectedReceiptPayment(null);
                          setIsReceiptOpen(true);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Certificate Vault */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Verified State Merit & Participation Records</h3>

            {certificates.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
                No official state certificates issued yet under Registration Number {skater.registrationNumber}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-400">{cert.type} Certificate</span>
                      <span className="text-[10px] font-mono text-slate-400">{cert.certificateNumber}</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-white text-sm">{cert.tournamentName}</h4>
                      <p className="text-slate-400">
                        {cert.eventName} • {cert.position ? `Position: ${cert.position}` : 'Participated'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-500">Issued: {cert.issueDate}</span>
                      <button
                        onClick={() => onNavigateToVerifyCert(cert.verificationCode)}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Verify & Print Certificate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Payment & Transaction Receipts</h3>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Receipt ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">UTR Number</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-mono font-bold text-white">{p.id}</td>
                      <td className="py-3 px-4 text-slate-400">{p.date}</td>
                      <td className="py-3 px-4 text-white font-medium">{p.purpose}</td>
                      <td className="py-3 px-4 font-mono text-amber-400">{p.utrNumber || 'ONLINE'}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">₹{p.amount}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReceiptPayment(p);
                            setSelectedReceiptReg(null);
                            setIsReceiptOpen(true);
                          }}
                          className="text-amber-400 hover:underline font-bold"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Also show annual fee item if paid */}
                  {skater.annualFeePaid && (
                    <tr className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-mono font-bold text-white">REC-ANNUAL-2026</td>
                      <td className="py-3 px-4 text-slate-400">{skater.annualFeePaymentDate || '2026-01-10'}</td>
                      <td className="py-3 px-4 text-white font-medium">Annual State Skater Affiliation (2026)</td>
                      <td className="py-3 px-4 font-mono text-amber-400">{skater.annualFeeUtr || '408291038291'}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">₹500</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          VERIFIED
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReceiptPayment({
                              id: 'REC-ANNUAL-2026',
                              skaterId: skater.id,
                              skaterName: `${skater.firstName} ${skater.lastName}`,
                              amount: 500,
                              purpose: 'Annual State Skater Affiliation (2026)',
                              status: 'verified',
                              utrNumber: skater.annualFeeUtr || '408291038291',
                              date: skater.annualFeePaymentDate || '2026-01-10'
                            });
                            setSelectedReceiptReg(null);
                            setIsReceiptOpen(true);
                          }}
                          className="text-amber-400 hover:underline font-bold"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Annual Registration Docket */}
        {activeTab === 'form_docket' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h3 className="text-xl font-black text-white">
                Official State Registration Certificate & Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Formal printable certificate for school sports quotas, government merit admissions, and passport applications.
              </p>
            </div>

            <AnnualRegistrationPDF skater={skater} />
          </div>
        )}
      </div>

      {/* Payment Receipt Modal */}
      <SkaterPaymentReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        skater={skater}
        registration={selectedReceiptReg}
        payment={selectedReceiptPayment}
      />

      {/* Official Registration Slip Modal */}
      <RegistrationSlipModal
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        skater={skater}
      />
    </div>
  );
};
