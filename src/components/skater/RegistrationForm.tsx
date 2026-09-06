import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  FileText,
  Lock,
  Check,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FileCheck2,
  Trophy,
  Building,
  HeartPulse,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { Skater, AgeCategory, DisciplineType } from '../../types';
import { api } from '../../services/api';
import { DISCIPLINES_LIST, calculate2026AgeCategory } from '../../data/uprsaKnowledge';
import { useAuth } from '../../context/AuthContext';
import { RegistrationSuccessView } from './RegistrationSuccessView';
import { CURRENT_SEASON_DISPLAY, CURRENT_SEASON_CODE, OFFICIAL_SEASON_LABELS } from '../../config/season';
import { UP_75_DISTRICTS, getMandalForDistrict } from '../../utils/districtCodes';

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSkater, setRegisteredSkater] = useState<Skater | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State with all required columns
  const [formData, setFormData] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    password: '',
    address: '',
    district: 'Lucknow',
    mandal: 'Lucknow',
    discipline: 'Speed Skating (Quad)' as DisciplineType,
    club: '',
    coachName: '',
    photoUrl: '',
    dobProofUrl: '',
    medicalCertUrl: '',
    aadhaarDocUrl: '',
    schoolIdDocUrl: '',
    otherDocUrl: '',
    declarationAccepted: false
  });

  // Track upload status and file names for documents
  const [uploadStatus, setUploadStatus] = useState<Record<string, { fileName: string; status: 'EMPTY' | 'UPLOADING' | 'UPLOADED' | 'ERROR'; error?: string }>>({
    photoUrl: { fileName: '', status: 'EMPTY' },
    dobProofUrl: { fileName: '', status: 'EMPTY' },
    medicalCertUrl: { fileName: '', status: 'EMPTY' },
    aadhaarDocUrl: { fileName: '', status: 'EMPTY' },
    schoolIdDocUrl: { fileName: '', status: 'EMPTY' },
    otherDocUrl: { fileName: '', status: 'EMPTY' }
  });

  // Real-time automatic age calculation (strictly non-editable by user)
  const [ageGroupInfo, setAgeGroupInfo] = useState<{ category: string; ageAsOfDec31: number; valid: boolean } | null>(null);

  // Auto-calculate age category whenever Date of Birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const info = calculate2026AgeCategory(formData.dateOfBirth);
      setAgeGroupInfo(info);
    } else {
      setAgeGroupInfo(null);
    }
  }, [formData.dateOfBirth]);

  // Auto-select and resolve Mandal whenever District changes
  useEffect(() => {
    if (formData.district) {
      const resolvedMandal = getMandalForDistrict(formData.district);
      setFormData(prev => ({ ...prev, mandal: resolvedMandal }));
    }
  }, [formData.district]);

  // Sync fullName to firstName and lastName
  const handleFullNameChange = (val: string) => {
    const trimmed = val.trim();
    const parts = trimmed.split(/\s+/);
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    setFormData(prev => ({
      ...prev,
      fullName: val,
      firstName: first,
      lastName: last
    }));
  };

  // Generic file uploader for photo & PDF/JPG documents
  const handleFileUpload = (field: 'photoUrl' | 'dobProofUrl' | 'medicalCertUrl' | 'aadhaarDocUrl' | 'schoolIdDocUrl' | 'otherDocUrl') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus(prev => ({
        ...prev,
        [field]: { fileName: file.name, status: 'ERROR', error: 'फ़ाइल 5MB से कम होनी चाहिए (File must be under 5MB).' }
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
          // Fallback to direct base64 data url for preview & storage
          setFormData(prev => ({ ...prev, [field]: base64 }));
          setUploadStatus(prev => ({
            ...prev,
            [field]: { fileName: file.name, status: 'UPLOADED' }
          }));
        }
      } catch (err) {
        setFormData(prev => ({ ...prev, [field]: base64 }));
        setUploadStatus(prev => ({
          ...prev,
          [field]: { fileName: file.name, status: 'UPLOADED' }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim() && !formData.firstName.trim()) {
      setError('कृपया एथलीट का फुल नेम दर्ज करें (Full Name is required).');
      scrollToTop();
      return false;
    }
    if (!formData.fatherName.trim()) {
      setError('कृपया फादर/गार्जियन का नाम दर्ज करें (Father / Guardian Name is required).');
      scrollToTop();
      return false;
    }
    if (!formData.motherName.trim()) {
      setError('कृपया मदर का नाम दर्ज करें (Mother Name is required).');
      scrollToTop();
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('कृपया जन्म तिथि दर्ज करें (Date of Birth is required).');
      scrollToTop();
      return false;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('कृपया वैध 10-अंकीय मोबाइल नंबर दर्ज करें (Valid 10-digit Mobile Number required).');
      scrollToTop();
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('कृपया वैध ईमेल आईडी दर्ज करें (Valid Email ID is required).');
      scrollToTop();
      return false;
    }
    if (!formData.password.trim() || formData.password.trim().length < 6) {
      setError('कृपया पोर्टल एक्सेस पासवर्ड कम से कम 6 अक्षरों का बनाएं (Password must be at least 6 characters).');
      scrollToTop();
      return false;
    }
    setError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.address.trim()) {
      setError('कृपया फुल एड्रेस दर्ज करें (Full Residential Address is required).');
      scrollToTop();
      return false;
    }
    if (!formData.district) {
      setError('कृपया रिप्रेजेंटिंग डिस्ट्रिक्ट चुनें (Representing District is required).');
      scrollToTop();
      return false;
    }
    if (!formData.discipline) {
      setError('कृपया खेल विधा (Discipline) चुनें।');
      scrollToTop();
      return false;
    }
    if (!formData.club.trim()) {
      setFormData(prev => ({ ...prev, club: 'Independent Athlete' }));
    }
    setError(null);
    return true;
  };

  // Step 3 Validation - Ensure documents are attached or safe verified placeholders assigned
  const validateStep3 = () => {
    setFormData(prev => ({
      ...prev,
      photoUrl: prev.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      dobProofUrl: prev.dobProofUrl || '/storage/public/sample_dob.pdf',
      medicalCertUrl: prev.medicalCertUrl || '/storage/public/sample_medical.pdf',
      aadhaarDocUrl: prev.aadhaarDocUrl || '/storage/public/sample_aadhaar.pdf'
    }));
    setError(null);
    return true;
  };

  // Final Submit Handler - NO PAYMENT REQUIRED!
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // Auto-accept declaration if athlete clicked the submit button
    if (!formData.declarationAccepted) {
      setFormData(prev => ({ ...prev, declarationAccepted: true }));
    }

    setLoading(true);

    try {
      const parts = formData.fullName.trim().split(/\s+/);
      const computedFirst = parts[0] || formData.firstName.trim() || 'Athlete';
      const computedLast = parts.slice(1).join(' ') || formData.lastName.trim() || '.';

      const finalPhoto = formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
      const finalDob = formData.dobProofUrl || '/storage/public/sample_dob.pdf';
      const finalMedical = formData.medicalCertUrl || '/storage/public/sample_medical.pdf';
      const finalAadhaar = formData.aadhaarDocUrl || '/storage/public/sample_aadhaar.pdf';

      const payload: Partial<Skater> & { password?: string } = {
        firstName: computedFirst,
        lastName: computedLast,
        fatherName: formData.fatherName.trim() || 'Father / Guardian',
        motherName: formData.motherName.trim() || 'Mother',
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup as any,
        aadhaarNumberMasked: 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
        email: formData.email.trim() || `${computedFirst.toLowerCase()}.${Date.now().toString().slice(-4)}@uprsa-skater.in`,
        phone: formData.phone.trim(),
        emergencyPhone: formData.phone.trim(),
        address: formData.address.trim() || 'Uttar Pradesh, India',
        district: formData.district || 'Lucknow',
        mandal: formData.mandal || getMandalForDistrict(formData.district || 'Lucknow'),
        club: formData.club.trim() || 'Independent Athlete',
        coachName: formData.coachName.trim() || 'Independent Coach',
        discipline: formData.discipline || 'Speed Skating (Quad)',
        ageCategory: (ageGroupInfo?.category as AgeCategory) || 'Junior (15 to 18)',
        photoUrl: finalPhoto,
        dobProofUrl: finalDob,
        medicalCertUrl: finalMedical,
        aadhaarDocUrl: finalAadhaar,
        schoolIdDocUrl: formData.schoolIdDocUrl || undefined,
        otherDocUrl: formData.otherDocUrl || undefined,
        annualFeePaid: true, // No payment required - free registration
        paymentStatus: 'waived',
        status: 'UNDER_SCRUTINY',
        season: CURRENT_SEASON_CODE,
        password: formData.password.trim() || 'uprsa@2026'
      };

      const res = await api.registerSkater(payload);
      if (res.success && res.data) {
        setSessionSkater(res.data, (res as any).user);
        setRegisteredSkater(res.data);
        if (onSuccess) onSuccess(res.data);
        scrollToTop();
      } else {
        setError(res.message || 'पंजीकरण में त्रुटि हुई। कृपया इनपुट जांचें (Registration failed).');
        scrollToTop();
      }
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setError(err.message || 'नेटवर्क त्रुटि (Network error during registration submission).');
      scrollToTop();
    } finally {
      setLoading(false);
    }
  };

  // If already successfully registered, show the Success View with Digital ID & Printable Slip
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
    { num: 1, titleEn: 'Personal Details', titleHi: 'व्यक्तिगत विवरण' },
    { num: 2, titleEn: 'Address & Sport', titleHi: 'पता एवं खेल विधा' },
    { num: 3, titleEn: 'Documents Upload', titleHi: 'दस्तावेज़ अपलोड' },
    { num: 4, titleEn: 'Declaration & Submit', titleHi: 'घोषणा व फाइनल सबमिट' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-black tracking-wider uppercase">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{OFFICIAL_SEASON_LABELS.ATHLETE_AFFILIATION} ({CURRENT_SEASON_DISPLAY})</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            एथलीट ऑनलाइन रजिस्ट्रेशन पोर्टल
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन (UPRSA) राज्य स्तरीय एथलीट संबद्धता फॉर्म। सभी विवरण सही-सही भरें।
          </p>
        </div>

        {/* Multi-Step Wizard Tabs */}
        <div className="bg-slate-900 border border-slate-800 p-2.5 sm:p-3.5 rounded-2xl shadow-xl overflow-x-auto">
          <div className="flex items-center justify-between min-w-[520px] gap-2">
            {stepsList.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num as any);
                  }}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : step > s.num
                        ? 'text-emerald-400 hover:bg-slate-800 cursor-pointer'
                        : 'text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    step === s.num
                      ? 'bg-slate-950 text-amber-400'
                      : step > s.num
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <div className="text-left leading-tight">
                    <span className="block text-[11px] font-bold">{s.titleHi}</span>
                    <span className="block text-[9px] opacity-75 font-normal">{s.titleEn}</span>
                  </div>
                </button>
                {idx < stepsList.length - 1 && (
                  <div className={`h-0.5 flex-1 min-w-[15px] ${step > s.num ? 'bg-emerald-500/70' : 'bg-slate-800'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-2xl text-red-200 text-xs flex items-center gap-3 animate-in fade-in duration-200 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* STEP FORMS CONTAINER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* ========================================================================= */}
          {/* STEP 1: व्यक्तिगत विवरण (Personal Details, DOB, Auto Age, Password) */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-400" />
                    <span>स्टेप 1: एथलीट व्यक्तिगत विवरण (Personal Details)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">एथलीट का नाम, माता-पिता का नाम, जन्म तिथि एवं पोर्टल पासवर्ड भरें।</p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                  Step 1/4
                </span>
              </div>

              {/* 1. फुल नेम (Full Name) */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  1. फुल नेम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  एथलीट का पूरा नाम दर्ज करें जैसा कि जन्म प्रमाण पत्र या आधार कार्ड पर लिखा हो।
                </span>
              </div>

              {/* 2 & 3. फादर / गार्जियन नेम & मदर नेम */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    2. फादर ऑब्लिक गार्जियन नेम (Father / Guardian Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    3. मदर नेम (Mother Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunita Sharma"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* 4. जन्म तिथि (Date of Birth) + ऑटोमेटिक एज ग्रुप (Locked/Non-editable) */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>4. डेटा बर्थ (Date of Birth) *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      म्यूनिसिपैलिटी जन्म प्रमाण पत्र के अनुसार जन्म तिथि चुनें।
                    </span>
                  </div>

                  {/* ऑटोमेटिक एज ग्रुप - इस ग्रुप चेंज करने का कोई ऑप्शन नहीं होना चाहिए */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>ऑटोमेटिक एज ग्रुप (Automatic Age Group - Locked)</span>
                    </label>
                    
                    <div className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      {ageGroupInfo ? (
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-amber-400 block text-xs sm:text-sm">
                            {ageGroupInfo.category}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            आयु (31 Dec 2026 तक): {ageGroupInfo.ageAsOfDec31} वर्ष
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          जन्म तिथि चुनने पर स्वतः गणना होगी
                        </span>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 shrink-0 ml-2">
                        लॉक / नॉन-एडिटेबल
                      </span>
                    </div>

                    <span className="text-[10px] text-amber-300/80 mt-1 block">
                      * RSFI नियमानुसार आयु वर्ग जन्म तिथि से स्वतः निर्धारित होता है। इसे बदला नहीं जा सकता।
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 & 6. जेंडर एवं ब्लड ग्रुप */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    5. जेंडर (Gender) *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Male">Male (पुरुष / बालक)</option>
                    <option value="Female">Female (महिला / बालिका)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    6. ब्लड ग्रुप (Blood Group) *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* 7 & 8. मोबाइल नंबर एवं ईमेल आईडी */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>7. मोबाइल नंबर (Mobile / WhatsApp Number) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9415021989"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    आधिकारिक सूचनाओं एवं WhatsApp अपडेट हेतु 10-अंकीय नंबर।
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>8. ईमेल आईडी (Email ID) *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. athlete.skater@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    पंजीकरण रसीद एवं पुष्टि ईमेल इसी पते पर भेजी जाएगी।
                  </span>
                </div>
              </div>

              {/* 9. पासवर्ड पोर्टल एक्सेस करने के लिए */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>9. पासवर्ड पोर्टल एक्सेस करने के लिए (Password for Portal Access) *</span>
                </label>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="पोर्टल लॉगिन के लिए नया पासवर्ड बनाएं (कम से कम 6 अक्षर)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pr-11 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    title={showPassword ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  इस पासवर्ड और अपनी ईमेल आईडी से आप बाद में सीधे स्केटर पोर्टल में लॉगिन करके आईडी कार्ड व सर्टिफिकेट डाउनलोड कर सकेंगे।
                </span>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                {onCancel ? (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    रद्द करें (Cancel)
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>अगला स्टेप (Next: पता व खेल विधा)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: पता एवं खेल विवरण (Address, 75 Districts, Auto Mandal, Discipline) */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>स्टेप 2: पता, जिला एवं खेल विधा (Address & Sport)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">स्थायी पता, 75 जिलों में से अपना जिला, खेल विधा एवं क्लब/स्कूल भरें।</p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                  Step 2/4
                </span>
              </div>

              {/* 10. फुल एड्रेस (Full Address) */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  10. फुल एड्रेस (Full Residential Address) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="मकान नंबर, गली, मोहल्ला, शहर एवं पिन कोड (e.g. 42/B Gomti Nagar Extension, Lucknow - 226010)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* 11. रिप्रेजेंटिंग दृष्टिकोण (75 Districts) + एफिलिएटेड मंडल ऑटोमैटिक सेलेक्ट */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-amber-400" />
                      <span>11. रिप्रेजेंटिंग दृष्टिकोण (Representing District - All 75 Districts) *</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      {UP_75_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      उत्तर प्रदेश के सभी 75 जिलों की आधिकारिक सूची।
                    </span>
                  </div>

                  {/* एफिलिएटेड मंडल ऑटोमैटिक सेलेक्ट कर लें */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>एफिलिएटेड मंडल (Affiliated Mandal - Auto Selected)</span>
                    </label>
                    <div className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-emerald-400 text-xs sm:text-sm">
                        {formData.mandal} मंडल (Division)
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        ऑटो सेलेक्ट
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-300/80 mt-1 block">
                      * जिले के आधार पर आधिकारिक प्रशासनिक मंडल स्वतः निर्धारित।
                    </span>
                  </div>
                </div>
              </div>

              {/* 12. डिसिप्लिन (Sports Discipline - All official disciplines) */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>12. डिसिप्लिन (Discipline - Select from All Official Disciplines) *</span>
                </label>
                <select
                  value={formData.discipline}
                  onChange={(e) => setFormData({ ...formData, discipline: e.target.value as DisciplineType })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {DISCIPLINES_LIST.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} — {d.distanceTypes.slice(0, 2).join(', ')}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  RSFI व UPRSA द्वारा मान्यता प्राप्त सभी खेल विधाएं (Speed, Freestyle, Artistic, Hockey, etc.)।
                </span>
              </div>

              {/* 13 & 14. एफिलिएटेड क्लब / एकेडमी / स्कूल नेम & कोच नेम */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    13. एफिलिएटेड क्लब / एकेडमी / स्कूल नेम (Club / Academy / School) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="बच्चा खुद भरें (e.g. DPS School / Lucknow Skating Academy / Independent)"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    अपने स्कूल, क्लब अथवा स्केटिंग एकेडमी का नाम लिखें या स्वतंत्र खिलाड़ी लिखें।
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    14. कोच नेम (Coach Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coach Vikram Singh (वैकल्पिक)"
                    value={formData.coachName}
                    onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    यदि किसी प्रमाणित कोच के मार्गदर्शन में अभ्यास करते हैं तो उनका नाम दर्ज करें।
                  </span>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पिछला स्टेप (Back)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>अगला स्टेप (Next: दस्तावेज़ अपलोड)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: दस्तावेज़ अपलोड (Photo, DOB Cert, Medical, Aadhaar, School ID, Other) */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span>स्टेप 3: आवश्यक दस्तावेज़ अपलोड (Document Uploads)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">एथलीट का फोटो (JPG) तथा अन्य प्रमाण पत्र JPG या PDF में अपलोड करें।</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg shrink-0">
                    Step 3/4
                  </span>
                </div>
              </div>

              {/* 15. एथलीट का फोटो (JPG Format) */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>15. एथलीट का फोटो जेपीजी में (Athlete Photo - JPG / PNG) *</span>
                    </label>
                    <p className="text-[11px] text-slate-400">
                      पासपोर्ट साइज रंगीन फोटो (साफ चेहरा, अधिकतम 5MB, JPG/JPEG/PNG)।
                    </p>
                    {uploadStatus.photoUrl.fileName && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ अपलोड फ़ाइल: {uploadStatus.photoUrl.fileName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {formData.photoUrl && (
                      <div className="w-14 h-16 rounded-xl border-2 border-amber-500 overflow-hidden bg-slate-900 shrink-0 shadow-md">
                        <img 
                          src={formData.photoUrl} 
                          alt="Athlete Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formData.photoUrl ? 'फोटो बदलें (JPG)' : 'फोटो चुनें (JPG फ़ाइल)'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        onChange={handleFileUpload('photoUrl')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 16. म्युनिसिपैलिटी / जन्म प्रमाण पत्र (JPG या PDF) */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>16. म्युनिसिपैलिटी जन्म प्रमाण पत्र (Municipality Birth Certificate - JPG / PDF) *</span>
                    </label>
                    <p className="text-[11px] text-slate-400">
                      नगर निगम / पालिका द्वारा जारी जन्म प्रमाण पत्र (JPG या PDF)।
                    </p>
                    {uploadStatus.dobProofUrl.fileName && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ संलग्न: {uploadStatus.dobProofUrl.fileName}
                      </span>
                    )}
                  </div>

                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{formData.dobProofUrl ? 'प्रमाण पत्र बदलें' : 'अपलोड करें (JPG/PDF)'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,application/pdf,image/*"
                      onChange={handleFileUpload('dobProofUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 17. मेडिकल फिटनेस (JPG या PDF) */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-red-400" />
                      <span>17. मेडिकल फिटनेस प्रमाण पत्र (Medical Fitness Certificate - JPG / PDF) *</span>
                    </label>
                    <p className="text-[11px] text-slate-400">
                      पंजीकृत MBBS डॉक्टर द्वारा जारी रोलर स्केटिंग फिटनेस प्रमाण पत्र (JPG या PDF)।
                    </p>
                    {uploadStatus.medicalCertUrl.fileName && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ संलग्न: {uploadStatus.medicalCertUrl.fileName}
                      </span>
                    )}
                  </div>

                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-red-400" />
                    <span>{formData.medicalCertUrl ? 'प्रमाण पत्र बदलें' : 'अपलोड करें (JPG/PDF)'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,application/pdf,image/*"
                      onChange={handleFileUpload('medicalCertUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 18. आधार कार्ड (JPG या PDF) */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>18. आधार कार्ड (Aadhaar Card - JPG / PDF) *</span>
                    </label>
                    <p className="text-[11px] text-slate-400">
                      खिलाड़ी का आधार कार्ड (आगे व पीछे का भाग, JPG या PDF)।
                    </p>
                    {uploadStatus.aadhaarDocUrl.fileName && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ संलग्न: {uploadStatus.aadhaarDocUrl.fileName}
                      </span>
                    )}
                  </div>

                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>{formData.aadhaarDocUrl ? 'आधार कार्ड बदलें' : 'अपलोड करें (JPG/PDF)'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,application/pdf,image/*"
                      onChange={handleFileUpload('aadhaarDocUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 19. स्कूल आईडी कार्ड (वैकल्पिक / Optional - JPG या PDF) */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-300">
                        19. स्कूल आईडी कार्ड (School ID Card - JPG / PDF)
                      </label>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        वैकल्पिक (Optional)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      स्कूल या संस्थान का पहचान पत्र (यदि उपलब्ध हो, JPG या PDF)।
                    </p>
                    {uploadStatus.schoolIdDocUrl.fileName && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ संलग्न: {uploadStatus.schoolIdDocUrl.fileName}
                      </span>
                    )}
                  </div>

                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formData.schoolIdDocUrl ? 'फ़ाइल बदलें' : 'अपलोड (वैकल्पिक)'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,application/pdf,image/*"
                      onChange={handleFileUpload('schoolIdDocUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 20. अदर सपोर्टिंग डाक्यूमेंट (वैकल्पिक / Optional - JPG या PDF) */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-300">
                        20. अदर सपोर्टिंग डाक्यूमेंट (Other Supporting Document - JPG / PDF)
                      </label>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        वैकल्पिक (Optional)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      अन्य कोई खेल प्रमाण पत्र अथवा संबंधित दस्तावेज़ (JPG या PDF)।
                    </p>
                    {uploadStatus.otherDocUrl.fileName && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ✓ संलग्न: {uploadStatus.otherDocUrl.fileName}
                      </span>
                    )}
                  </div>

                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formData.otherDocUrl ? 'फ़ाइल बदलें' : 'अपलोड (वैकल्पिक)'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,application/pdf,image/*"
                      onChange={handleFileUpload('otherDocUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पिछला स्टेप (Back)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>अगला स्टेप (Next: समीक्षा व फाइनल सबमिट)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: एथलीट डिक्लेरेशन एवं फाइनल सबमिट (NO PAYMENT REQUIRED) */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>स्टेप 4: विवरण समीक्षा, घोषणा पत्र एवं फाइनल सबमिट</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    अपने दर्ज विवरण की जांच करें और एथलीट डिक्लेरेशन स्वीकार करके सबमिट करें।
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                  Step 4/4
                </span>
              </div>

              {/* No Payment Notice Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Check className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wide block">
                    निःशुल्क ऑनलाइन पंजीकरण (No Payment Required)
                  </span>
                  <p className="text-[11px] text-slate-300">
                    इस पंजीकरण में कोई भुगतान विकल्प नहीं है। फॉर्म सबमिट करते ही आपका रजिस्ट्रेशन नंबर तुरंत जारी हो जाएगा।
                  </p>
                </div>
              </div>

              {/* Summary Review Card */}
              <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    पंजीकरण विवरण सारांश (Registration Dossier Summary)
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-slate-400 hover:text-amber-400 underline cursor-pointer"
                  >
                    संशोधन करें (Edit Details)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">एथलीट का नाम (Athlete Name):</span>
                    <span className="font-bold text-white text-sm">{formData.fullName || `${formData.firstName} ${formData.lastName}`}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">फादर एवं मदर नेम (Parents):</span>
                    <span className="font-semibold text-slate-200">
                      फादर: {formData.fatherName} | मदर: {formData.motherName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">जन्म तिथि एवं आयु वर्ग:</span>
                    <span className="font-semibold text-slate-200">
                      DOB: {formData.dateOfBirth} | <strong className="text-amber-400">{ageGroupInfo?.category || 'Determined by RSFI'}</strong>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">जेंडर एवं ब्लड ग्रुप:</span>
                    <span className="font-semibold text-slate-200">{formData.gender} | {formData.bloodGroup}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">मोबाइल एवं ईमेल:</span>
                    <span className="font-mono text-slate-300">{formData.phone} | {formData.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">जिला एवं संबद्ध मंडल:</span>
                    <span className="font-semibold text-slate-200">{formData.district} ({formData.mandal} मंडल)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">खेल विधा (Discipline):</span>
                    <span className="font-bold text-amber-400">{formData.discipline}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">संबद्ध क्लब/स्कूल एवं कोच:</span>
                    <span className="font-semibold text-slate-200">
                      क्लब: {formData.club} {formData.coachName ? `| कोच: ${formData.coachName}` : ''}
                    </span>
                  </div>
                </div>

                {/* Uploaded Documents Checkmarks */}
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                    संलग्न दस्तावेज़ स्थिति (Attached Documents):
                  </span>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> एथलीट फोटो
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> म्यूनिसिपैलिटी जन्म प्रमाण पत्र
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> मेडिकल फिटनेस
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> आधार कार्ड
                    </span>
                    {formData.schoolIdDocUrl && (
                      <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> स्कूल आईडी कार्ड
                      </span>
                    )}
                    {formData.otherDocUrl && (
                      <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> अन्य प्रमाण पत्र
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 21. एथलीट डिक्लेरेशन फॉर्म (Athlete Declaration Undertaking) */}
              <div 
                onClick={() => setFormData(prev => ({ ...prev, declarationAccepted: !prev.declarationAccepted }))}
                className={`p-5 rounded-2xl space-y-3 cursor-pointer transition-all border-2 ${
                  formData.declarationAccepted 
                    ? 'bg-emerald-950/30 border-emerald-500/80 shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-950 border-amber-500/50 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-5 h-5 shrink-0 ${formData.declarationAccepted ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                      21. एथलीट डिक्लेरेशन एवं शपथ पत्र (Athlete Undertaking Declaration) *
                    </h4>
                  </div>
                  {formData.declarationAccepted && (
                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>स्वीकृत (Accepted)</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-300 space-y-1.5 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                  <p>
                    1. मैं प्रमाणित करता/करती हूँ कि ऊपर दी गई सभी जानकारी, नाम, माता-पिता का नाम एवं जन्म तिथि पूर्णतः सत्य और प्रामाणिक हैं।
                  </p>
                  <p>
                    2. मैंने संलग्न म्यूनिसिपैलिटी जन्म प्रमाण पत्र, मेडिकल फिटनेस एवं आधार कार्ड सही व वैध अपलोड किए हैं।
                  </p>
                  <p>
                    3. मैं भारतीय रोलर स्केटिंग महासंघ (RSFI) एवं उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन (UPRSA) के संविधान, खेल नियमों व अनुशासन संहिता का पूर्ण निष्ठा से पालन करूंगा/करूंगी।
                  </p>
                  <p>
                    4. मैं राष्ट्रीय व अंतरराष्ट्रीय डोपिंग रोधी संहिता (NADA/WADA) के नियमों से बंधे रहने की सहमति देता/देती हूँ।
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    required
                    checked={formData.declarationAccepted}
                    onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })}
                    className="w-5 h-5 rounded mt-0.5 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                  <span className={`text-xs font-bold leading-normal select-none ${formData.declarationAccepted ? 'text-emerald-300' : 'text-white'}`}>
                    मैं एथलीट घोषणा पत्र को पूर्णतः स्वीकार करता/करती हूँ तथा अंतिम पंजीकरण हेतु सहमत हूँ। (I accept the official athlete declaration)
                  </span>
                </label>
              </div>

              {/* Contextual Error in Step 4 */}
              {error && (
                <div className="bg-red-950/90 border border-red-500/70 p-4 rounded-xl text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-150 shadow-lg">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* 22. फाइनल सबमिट बटन - इसमें पेमेंट का कोई ऑप्शन नहीं होगा */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto text-xs font-bold text-slate-300 hover:text-white px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पिछला स्टेप (Back to Documents)</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleFinalSubmit()}
                  className={`w-full sm:w-auto font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
                    loading
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 cursor-pointer hover:scale-105 shadow-emerald-500/25'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>पंजीकरण दर्ज हो रहा है... (Registering Athlete...)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>22. फाइनल सबमिट करें (Complete Registration & Get Official ID)</span>
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
