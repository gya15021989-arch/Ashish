import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Upload, 
  QrCode, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  FileText,
  CreditCard,
  Zap,
  Info,
  Lock,
  Check,
  Phone,
  Mail,
  Heart,
  Eye,
  FileCheck2
} from 'lucide-react';
import { Skater, District, Club, PaymentSettings, AgeCategory } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES, calculate2026AgeCategory } from '../../data/uprsaKnowledge';
import { useAuth } from '../../context/AuthContext';
import { RegistrationSuccessView } from './RegistrationSuccessView';
import { CURRENT_SEASON_DISPLAY, CURRENT_SEASON_CODE, OFFICIAL_SEASON_LABELS } from '../../config/season';
import { getMandalForDistrict } from '../../utils/districtCodes';

interface RegistrationFormProps {
  onSuccess?: (skater: Skater) => void;
  onCancel?: () => void;
  onNavigateToPortal?: () => void;
  onNavigateToVerify?: (regNo: string) => void;
  onNavigateHome?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSuccess, 
  onCancel,
  onNavigateToPortal,
  onNavigateToVerify,
  onNavigateHome
}) => {
  const { setSessionSkater } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSkater, setRegisteredSkater] = useState<Skater | null>(null);

  // Reference data
  const [districts, setDistricts] = useState<District[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    aadhaarNumberMasked: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    address: '',
    district: 'Lucknow',
    mandal: 'Lucknow',
    club: 'Lucknow Speed Skating Academy',
    coachName: '',
    discipline: 'Speed Skating (Quad)',
    skateModel: '',
    wheelSize: '100mm',
    photoUrl: '',
    medicalCertUrl: '',
    dobProofUrl: '',
    aadhaarDocUrl: '',
    schoolIdDocUrl: '',
    otherDocUrl: '',
    annualFeeUtr: '',
    password: '',
    declarationAccepted: false
  });

  // Document Upload States Tracker
  const [uploadStatus, setUploadStatus] = useState<Record<string, { fileName: string; status: 'EMPTY' | 'UPLOADING' | 'UPLOADED' | 'ERROR'; error?: string }>>({
    photoUrl: { fileName: '', status: 'EMPTY' },
    dobProofUrl: { fileName: '', status: 'EMPTY' },
    medicalCertUrl: { fileName: '', status: 'EMPTY' },
    aadhaarDocUrl: { fileName: '', status: 'EMPTY' },
    schoolIdDocUrl: { fileName: '', status: 'EMPTY' },
    otherDocUrl: { fileName: '', status: 'EMPTY' }
  });

  // Auto-calculated age category
  const [ageGroupInfo, setAgeGroupInfo] = useState<{ category: string; ageAsOfDec31: number; valid: boolean } | null>(null);

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    try {
      const [dRes, cRes, pRes] = await Promise.all([
        api.getDistricts(),
        api.getClubs(),
        api.getPaymentSettings()
      ]);

      if (dRes.success) setDistricts(dRes.data);
      if (cRes.success) setClubs(cRes.data);
      if (pRes.success) setPaymentSettings(pRes.data);
    } catch (e) {
      console.error('Failed to load form prerequisites:', e);
    }
  };

  // Recalculate age group on DOB change
  useEffect(() => {
    if (formData.dateOfBirth) {
      const info = calculate2026AgeCategory(formData.dateOfBirth);
      setAgeGroupInfo(info);
    } else {
      setAgeGroupInfo(null);
    }
  }, [formData.dateOfBirth]);

  // Update mandal when district changes
  useEffect(() => {
    if (formData.district) {
      const resolvedMandal = getMandalForDistrict(formData.district);
      setFormData(prev => ({ ...prev, mandal: resolvedMandal }));
    }
  }, [formData.district]);

  const handleFileUpload = (field: 'photoUrl' | 'dobProofUrl' | 'medicalCertUrl' | 'aadhaarDocUrl' | 'schoolIdDocUrl' | 'otherDocUrl') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus(prev => ({
        ...prev,
        [field]: { fileName: file.name, status: 'ERROR', error: 'File size exceeds 5MB limit.' }
      }));
      return;
    }

    setUploadStatus(prev => ({
      ...prev,
      [field]: { fileName: file.name, status: 'UPLOADING' }
    }));

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadFile(file.name, base64);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, [field]: res.fileUrl }));
          setUploadStatus(prev => ({
            ...prev,
            [field]: { fileName: file.name, status: 'UPLOADED' }
          }));
        } else {
          // Fallback to base64 preview
          setFormData(prev => ({ ...prev, [field]: base64 }));
          setUploadStatus(prev => ({
            ...prev,
            [field]: { fileName: file.name, status: 'UPLOADED' }
          }));
        }
      } catch (err) {
        // Fallback gracefully
        setFormData(prev => ({ ...prev, [field]: base64 }));
        setUploadStatus(prev => ({
          ...prev,
          [field]: { fileName: file.name, status: 'UPLOADED' }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Partial<Skater> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        aadhaarNumberMasked: formData.aadhaarNumberMasked || 'XXXX-XXXX-' + (Math.floor(1000 + Math.random() * 9000)),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        emergencyPhone: formData.emergencyPhone.trim() || formData.phone.trim(),
        address: formData.address.trim(),
        district: formData.district,
        mandal: formData.mandal || getMandalForDistrict(formData.district),
        club: formData.club,
        coachName: formData.coachName.trim(),
        discipline: formData.discipline,
        ageCategory: (ageGroupInfo?.category as AgeCategory) || 'Junior (15 to 18)',
        skateModel: formData.skateModel,
        wheelSize: formData.wheelSize,
        photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        dobProofUrl: formData.dobProofUrl,
        medicalCertUrl: formData.medicalCertUrl,
        aadhaarDocUrl: formData.aadhaarDocUrl,
        schoolIdDocUrl: formData.schoolIdDocUrl,
        otherDocUrl: formData.otherDocUrl,
        annualFeePaid: false,
        annualFeeUtr: formData.annualFeeUtr.trim() || undefined,
        annualFeePaymentDate: formData.annualFeeUtr.trim() ? new Date().toISOString().split('T')[0] : undefined,
        status: 'UNDER_SCRUTINY',
        season: CURRENT_SEASON_CODE
      };

      const res = await api.registerSkater(payload);
      if (res.success && res.data) {
        // Automatically activate session in AuthContext
        setSessionSkater(res.data, (res as any).user);
        setRegisteredSkater(res.data);
        if (onSuccess) onSuccess(res.data);
      } else {
        setError(res.message || 'Registration failed. Please verify inputs.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during submission.');
    } finally {
      setLoading(false);
    }
  };

  // If already registered, show the Success View
  if (registeredSkater) {
    return (
      <RegistrationSuccessView
        skater={registeredSkater}
        onNavigateToPortal={() => {
          if (onNavigateToPortal) onNavigateToPortal();
          else if (onSuccess) onSuccess(registeredSkater);
        }}
        onNavigateToVerify={(regNo) => {
          if (onNavigateToVerify) onNavigateToVerify(regNo);
        }}
        onNavigateHome={() => {
          if (onNavigateHome) onNavigateHome();
          else if (onCancel) onCancel();
        }}
      />
    );
  }

  const stepsList = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Age & DOB' },
    { num: 3, label: 'Address' },
    { num: 4, label: 'Discipline' },
    { num: 5, label: 'Documents' },
    { num: 6, label: 'Declaration' },
    { num: 7, label: 'Fee Payment' },
    { num: 8, label: 'Review & Submit' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-black tracking-wider uppercase">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{OFFICIAL_SEASON_LABELS.ATHLETE_AFFILIATION}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Athlete Registration & Digital ID Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Affiliate with Uttar Pradesh Roller Sports Association for Season {CURRENT_SEASON_DISPLAY} to obtain your official state registration and digital credential.
          </p>
        </div>

        {/* Multi-Step Wizard Navigation */}
        <div className="bg-slate-900 border border-slate-800 p-2.5 sm:p-3.5 rounded-2xl overflow-x-auto shadow-xl">
          <div className="flex items-center justify-between min-w-[550px] gap-1">
            {stepsList.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num as any);
                  }}
                  className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-xl transition-colors ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : step > s.num
                        ? 'text-emerald-400 hover:bg-slate-800 cursor-pointer'
                        : 'text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    step === s.num
                      ? 'bg-slate-950 text-amber-400'
                      : step > s.num
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span className="whitespace-nowrap">{s.label}</span>
                </button>
                {idx < stepsList.length - 1 && (
                  <div className={`h-0.5 flex-1 min-w-[12px] ${step > s.num ? 'bg-emerald-500/60' : 'bg-slate-800'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP FORMS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* STEP 1: Athlete Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 1 of 8: Athlete Personal Details
                  </h3>
                  <p className="text-[11px] text-slate-400">Basic identification of the competitor.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 1/8</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Father's / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunita Sharma"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Athlete / Parent Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav.skater@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Portal Access Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Create a portal password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Used to log into your Skater Dashboard.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Primary Contact Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9415055443"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Emergency Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9415055440"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.fatherName.trim() || !formData.email.trim() || !formData.phone.trim()) {
                      setError('Please fill in all mandatory fields marked with an asterisk (*).');
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date of Birth & Age Category */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 2 of 8: Date of Birth & Official Age Bracket
                  </h3>
                  <p className="text-[11px] text-slate-400">Determines competition age category as per RSFI national standards.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 2/8</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Male">Male / Boy</option>
                    <option value="Female">Female / Girl</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="O+">O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                  </select>
                </div>
              </div>

              {/* Calculated 2026 Age Group Badge */}
              {ageGroupInfo ? (
                <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                        Official 2026–27 RSFI Age Bracket: {ageGroupInfo.category}
                      </span>
                      <span className="text-[11px] text-amber-200/80 block">
                        Calculated Age as of 31-December-2026: <strong>{ageGroupInfo.ageAsOfDec31} Years</strong>
                        {(ageGroupInfo as any).cutoffDescription && (
                          <span className="text-amber-300/90 ml-1.5 font-medium">({(ageGroupInfo as any).cutoffDescription})</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-md">
                    STATE CERTIFIED
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>Please pick your Date of Birth to compute your official competition age bracket.</span>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.dateOfBirth) {
                      setError('Please select a valid Date of Birth.');
                      return;
                    }
                    setError(null);
                    setStep(3);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Continue to Step 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Residential Address & District */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 3 of 8: Residential Address & District Affiliation
                  </h3>
                  <p className="text-[11px] text-slate-400">Uttar Pradesh domicile unit selection.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 3/8</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Full Permanent Residential Address (with PIN Code) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 14/B, Gomti Nagar Extension, Lucknow, UP - 226010"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Registered District Unit *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name} ({d.zone} Zone)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Administrative Mandal (Zone)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${formData.mandal} Mandal`}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-400 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Resolved automatically based on district.</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.address.trim()) {
                      setError('Please enter your full residential address.');
                      return;
                    }
                    setError(null);
                    setStep(4);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Continue to Step 4</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Discipline, Club & Equipment */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 4 of 8: Sports Discipline, Club & Equipment
                  </h3>
                  <p className="text-[11px] text-slate-400">Select your competition format and training academy.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 4/8</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Primary Skating Discipline *
                  </label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {DISCIPLINES.map((d: any) => (
                      <option key={d.name || d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Affiliated Skating Club / Academy *
                  </label>
                  <select
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {clubs
                      .filter(c => c.district === formData.district || clubs.length < 5)
                      .map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    <option value="Awadh Roller Sports Club">Awadh Roller Sports Club</option>
                    <option value="Noida Speed Skating Academy">Noida Speed Skating Academy</option>
                    <option value="Independent Skater (Direct District Entry)">
                      Independent Skater (Direct District Entry)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Coach Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coach Vikram Singh"
                    value={formData.coachName}
                    onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Skate Frame / Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bont / Powerslide 110mm"
                    value={formData.skateModel}
                    onChange={(e) => setFormData({ ...formData, skateModel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Wheel Size
                  </label>
                  <select
                    value={formData.wheelSize}
                    onChange={(e) => setFormData({ ...formData, wheelSize: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="90mm">90mm</option>
                    <option value="100mm">100mm</option>
                    <option value="110mm">110mm</option>
                    <option value="Quad 62mm">Quad 62mm</option>
                    <option value="Artistic 57mm">Artistic 57mm</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(5);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Continue to Step 5 (Documents)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Mandatory Document Uploads & Validation */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 5 of 8: Athlete Document & Photo Verification
                  </h3>
                  <p className="text-[11px] text-slate-400">Upload clean, legible copies of official credentials (Max 5MB each).</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 5/8</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Passport Photo */}
                <div className={`p-4 bg-slate-950 border rounded-2xl space-y-2 transition-colors ${
                  uploadStatus.photoUrl.status === 'UPLOADED' || formData.photoUrl ? 'border-emerald-500/60' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      1. Athlete Headshot / Photo *
                    </span>
                    {(uploadStatus.photoUrl.status === 'UPLOADED' || formData.photoUrl) && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                        ✓ ATTACHED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Used on official UPRSA State Digital ID Card.</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload('photoUrl')}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {formData.photoUrl && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      ✓ Ready for State Scrutiny
                    </span>
                  )}
                </div>

                {/* 2. Municipal DOB Certificate */}
                <div className={`p-4 bg-slate-950 border rounded-2xl space-y-2 transition-colors ${
                  uploadStatus.dobProofUrl.status === 'UPLOADED' || formData.dobProofUrl ? 'border-emerald-500/60' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      2. Municipal Birth Certificate *
                    </span>
                    {(uploadStatus.dobProofUrl.status === 'UPLOADED' || formData.dobProofUrl) && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                        ✓ ATTACHED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Birth proof issued by Municipal Corp or Gazette.</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload('dobProofUrl')}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {formData.dobProofUrl && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      ✓ Ready for State Scrutiny
                    </span>
                  )}
                </div>

                {/* 3. Medical Fitness Certificate */}
                <div className={`p-4 bg-slate-950 border rounded-2xl space-y-2 transition-colors ${
                  uploadStatus.medicalCertUrl.status === 'UPLOADED' || formData.medicalCertUrl ? 'border-emerald-500/60' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-amber-400" />
                      3. MBBS Medical Fitness *
                    </span>
                    {(uploadStatus.medicalCertUrl.status === 'UPLOADED' || formData.medicalCertUrl) && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                        ✓ ATTACHED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Fitness certificate signed by registered MBBS doctor.</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload('medicalCertUrl')}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {formData.medicalCertUrl && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      ✓ Ready for State Scrutiny
                    </span>
                  )}
                </div>

                {/* 4. Aadhaar / Photo ID Proof */}
                <div className={`p-4 bg-slate-950 border rounded-2xl space-y-2 transition-colors ${
                  uploadStatus.aadhaarDocUrl.status === 'UPLOADED' || formData.aadhaarDocUrl ? 'border-emerald-500/60' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      4. Aadhaar Card / ID Proof *
                    </span>
                    {(uploadStatus.aadhaarDocUrl.status === 'UPLOADED' || formData.aadhaarDocUrl) && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                        ✓ ATTACHED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">UP domicile identity verification proof.</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload('aadhaarDocUrl')}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {formData.aadhaarDocUrl && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      ✓ Ready for State Scrutiny
                    </span>
                  )}
                </div>

                {/* 5. School / Institution ID (Optional) */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      5. School ID Card (Optional)
                    </span>
                    {formData.schoolIdDocUrl && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                        ✓ ATTACHED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Student ID from registered UP academic institution.</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload('schoolIdDocUrl')}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>

                {/* 6. Other Supporting Doc (Optional) */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      6. Other Supporting Document (Optional)
                    </span>
                    {formData.otherDocUrl && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                        ✓ ATTACHED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">State / National participation certificates or approvals.</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload('otherDocUrl')}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(6);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Continue to Step 6 (Declaration)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Athlete Anti-Doping & Code of Conduct Declaration */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 6 of 8: Athlete Declaration & Code of Conduct
                  </h3>
                  <p className="text-[11px] text-slate-400">Adherence to RSFI and UPRSA official state regulations.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 6/8</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white uppercase text-[11px] block">
                  Official Affiliation Undertaking ({OFFICIAL_SEASON_LABELS.ATHLETE_AFFILIATION}):
                </span>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300">
                  <li>
                    <strong>True & Accurate Information:</strong> I hereby certify that all information, date of birth proof, and documents submitted are authentic and genuine.
                  </li>
                  <li>
                    <strong>Anti-Doping Compliance:</strong> I agree to abide by the NADA/WADA anti-doping code and RSFI fair-play regulations.
                  </li>
                  <li>
                    <strong>Medical Fitness:</strong> I certify that the athlete is medically and physically fit to participate in high-speed roller sports championships.
                  </li>
                  <li>
                    <strong>Federation Discipline:</strong> I acknowledge that the UPRSA Executive Board reserves the right to suspend or cancel affiliation upon any breach of sportsmanship.
                  </li>
                </ol>

                <div className="pt-4 border-t border-slate-800">
                  <label className="flex items-start gap-3 cursor-pointer bg-slate-900/60 p-3 rounded-xl border border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.declarationAccepted}
                      onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-600"
                    />
                    <span className="text-xs font-bold text-white">
                      I have read, understood, and accept the official UPRSA athlete terms, constitution, and declaration.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.declarationAccepted) {
                      setError('Please accept the athlete declaration checkbox to continue.');
                      return;
                    }
                    setError(null);
                    setStep(7);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Continue to Step 7 (Fee Payment)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Annual Fee Payment (₹500 INR) */}
          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 7 of 8: Annual Federation Affiliation Fee (₹500.00)
                  </h3>
                  <p className="text-[11px] text-slate-400">Official fee for Season {CURRENT_SEASON_DISPLAY} registration & digital athlete badge.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 7/8</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Scan via Google Pay / PhonePe / Paytm / BHIM
                  </span>

                  <div className="w-44 h-44 bg-white rounded-2xl mx-auto p-3 flex flex-col items-center justify-center border border-slate-700 shadow-inner">
                    <QrCode className="w-36 h-36 text-slate-950" />
                  </div>

                  <div className="text-xs font-mono text-slate-300">
                    <span className="text-slate-500 block text-[10px]">Official UPRSA UPI Handle:</span>
                    <span className="font-bold text-white text-xs">{paymentSettings?.upiId || 'uprsa.state@sbi'}</span>
                  </div>
                </div>

                {/* Bank Account Details & UTR Entry */}
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-white block">Federation Bank Details:</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Account: <strong>UP Roller Sports Association</strong>
                      <br />
                      A/C No: <strong>{paymentSettings?.bankAccountNo || '38294829104'}</strong>
                      <br />
                      IFSC: <strong>{paymentSettings?.bankIfsc || 'BARB0GOMTIX'}</strong> (Bank of Baroda, Lucknow)
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-amber-400 block mb-1">
                      Transaction UTR / Reference Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="12-digit UTR, e.g. 408219873456"
                      value={formData.annualFeeUtr}
                      onChange={(e) => setFormData({ ...formData, annualFeeUtr: e.target.value })}
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder:normal-case font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Enter the 12-digit UPI/NEFT reference number generated after transferring the ₹500 fee.
                    </span>
                  </div>

                  <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 text-[11px] text-blue-300 leading-normal">
                    ℹ️ Upon submission, your athlete record is immediately entered into the state database under <strong>UNDER SCRUTINY</strong> status while payments are reconciled.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(8);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Review Dossier (Step 8)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Comprehensive Dossier Review & Final Submission */}
          {step === 8 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Step 8 of 8: Review & Submit Affiliation Dossier
                  </h3>
                  <p className="text-[11px] text-slate-400">Verify all details before registering with the state secretariat.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">Step 8/8</span>
              </div>

              {/* Dossier Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-amber-400 text-[11px] uppercase">1. Athlete Profile</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[10px] text-slate-400 hover:text-amber-400 cursor-pointer">Edit</button>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Full Name:</span>
                    <span className="font-bold text-white text-sm">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Date of Birth & Bracket:</span>
                    <span className="font-semibold text-slate-200">{formData.dateOfBirth} ({ageGroupInfo?.category})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Father / Guardian:</span>
                    <span className="font-semibold text-slate-200">{formData.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Contact & Emergency:</span>
                    <span className="font-mono text-slate-200">{formData.phone} • {formData.emergencyPhone}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-amber-400 text-[11px] uppercase">2. Sports Affiliation</span>
                    <button type="button" onClick={() => setStep(4)} className="text-[10px] text-slate-400 hover:text-amber-400 cursor-pointer">Edit</button>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">District & Mandal:</span>
                    <span className="font-bold text-white">{formData.district} ({formData.mandal} Mandal)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Club / Academy:</span>
                    <span className="font-semibold text-slate-200">{formData.club}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Discipline:</span>
                    <span className="font-semibold text-indigo-300">{formData.discipline}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Annual Fee (₹500):</span>
                    <span className="font-mono font-bold text-emerald-400">UTR: {formData.annualFeeUtr || 'SUBMITTED'}</span>
                  </div>
                </div>
              </div>

              {/* Status Guarantee Notice */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-white block">Instant Digital ID & Permanent Registration Number</span>
                  <p className="text-slate-300 text-[11px] leading-normal">
                    Clicking the button below will immediately generate your unique official registration number (e.g. <code>UPRSA-[DIST]-2026-XXXXX</code>) and record your profile in the state ledger.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalSubmit}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  {loading ? (
                    <span>Registering with State Secretariat...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>COMPLETE REGISTRATION & ISSUE DIGITAL ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
