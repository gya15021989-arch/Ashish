import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  X, 
  Printer, 
  Shield, 
  QrCode, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Certificate, Skater } from '../../types';
import { api } from '../../services/api';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';

interface CertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCertificateIssued: (cert: Certificate) => void;
  prefillSkater?: Skater | null;
}

export const CertificateGeneratorModal: React.FC<CertificateGeneratorModalProps> = ({
  isOpen,
  onClose,
  onCertificateIssued,
  prefillSkater
}) => {
  if (!isOpen) return null;

  const [recipientName, setRecipientName] = useState(prefillSkater ? `${prefillSkater.firstName} ${prefillSkater.lastName}` : '');
  const [recipientRegNo, setRecipientRegNo] = useState(prefillSkater?.registrationNumber || '');
  const [fatherName, setFatherName] = useState(prefillSkater?.fatherName || '');
  const [district, setDistrict] = useState(prefillSkater?.district || 'Lucknow');
  const [club, setClub] = useState(prefillSkater?.club || '');
  const [type, setType] = useState<'Merit' | 'Participation' | 'Official' | 'Appreciation'>('Merit');
  const [tournamentName, setTournamentName] = useState('37th UP State Roller Sports Championship 2026');
  const [eventName, setEventName] = useState('500m + D Speed Race');
  const [discipline, setDiscipline] = useState(prefillSkater?.discipline || 'Speed Skating (Quad)');
  const [ageCategory, setAgeCategory] = useState(prefillSkater?.ageCategory || 'Junior (15 to 18)');
  const [gender, setGender] = useState(prefillSkater?.gender || 'Male');
  const [position, setPosition] = useState('1st (Gold Medal)');
  const [signatoryPresident, setSignatoryPresident] = useState(UPRSA_INFO.executives.find(e => e.role.includes('President'))?.name || 'Dr. Arvind Mishra');
  const [signatorySecretary, setSignatorySecretary] = useState(UPRSA_INFO.executives.find(e => e.role.includes('Secretary'))?.name || 'Er. Sanjeev Kumar');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (prefillSkater) {
      setRecipientName(`${prefillSkater.firstName || ''} ${prefillSkater.lastName || ''}`.trim());
      setRecipientRegNo(prefillSkater.registrationNumber || '');
      setFatherName(prefillSkater.fatherName || '');
      setDistrict(prefillSkater.district || 'Lucknow');
      setClub(prefillSkater.club || '');
      setDiscipline(prefillSkater.discipline || 'Speed Skating (Quad)');
      setAgeCategory(prefillSkater.ageCategory || 'Junior (15 to 18)');
      setGender(prefillSkater.gender || 'Male');
    }
  }, [prefillSkater]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !tournamentName.trim()) {
      setError('Please provide recipient name and tournament name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Partial<Certificate> = {
        type,
        recipientName: recipientName.trim(),
        recipientRegNo: recipientRegNo.trim() || undefined,
        fatherName: fatherName.trim() || undefined,
        district,
        club: club.trim() || undefined,
        tournamentName,
        eventName,
        discipline,
        ageCategory,
        gender,
        position: type === 'Merit' ? position : undefined,
        issueDate: new Date().toISOString().split('T')[0],
        signatoryPresident,
        signatorySecretary,
        isRevoked: false
      };

      const res = await api.issueCertificate(payload);
      if (res.success && res.data) {
        onCertificateIssued(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to issue certificate.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with certification authority.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              Issue Official State Certificate
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {error && (
            <div className="bg-red-950/60 border border-red-500/40 p-3 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Certificate Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Merit">Merit Certificate (Gold / Silver / Bronze)</option>
                <option value="Participation">Participation Certificate</option>
                <option value="Official">Technical Official / Referee Certificate</option>
                <option value="Appreciation">Appreciation Award</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={recipientName || ''}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                State Registration Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. UPRSA-2026-SK-1001"
                value={recipientRegNo || ''}
                onChange={(e) => setRecipientRegNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Father / Guardian Name
              </label>
              <input
                type="text"
                value={fatherName || ''}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                District Unit *
              </label>
              <input
                type="text"
                required
                value={district || ''}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Club / Academy
              </label>
              <input
                type="text"
                value={club || ''}
                onChange={(e) => setClub(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Championship / Tournament *
            </label>
            <input
              type="text"
              required
              value={tournamentName || ''}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Discipline
              </label>
              <input
                type="text"
                value={discipline || ''}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Age Category
              </label>
              <input
                type="text"
                value={ageCategory || ''}
                onChange={(e) => setAgeCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {type === 'Merit' && (
              <div>
                <label className="text-[11px] font-bold text-amber-400 block mb-1">
                  Position / Standing *
                </label>
                <select
                  value={position || '1st (Gold Medal)'}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="1st (Gold Medal)">1st (Gold Medal)</option>
                  <option value="2nd (Silver Medal)">2nd (Silver Medal)</option>
                  <option value="3rd (Bronze Medal)">3rd (Bronze Medal)</option>
                  <option value="4th (Finalist)">4th (Finalist)</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Generating Registry Record...' : 'Issue & Sign Certificate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
