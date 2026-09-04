import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, 
  X, 
  Save, 
  User, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Trophy, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Upload,
  Camera
} from 'lucide-react';
import { Skater, DisciplineType, AgeCategory, Gender, BloodGroup } from '../../types';
import { api } from '../../services/api';

interface SkaterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  skater: Skater;
  onSkaterUpdated: (updated: Skater) => void;
  adminUser?: string;
}

const UP_DISTRICTS = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 
  'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 
  'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 
  'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 
  'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 
  'Kheri (Lakhimpur)', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 
  'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 
  'Prayagraj (Allahabad)', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 
  'Shahjahanpur', 'Shamli', 'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 
  'Unnao', 'Varanasi'
];

const DISCIPLINES: DisciplineType[] = [
  'Speed Skating (Inline)',
  'Speed Skating (Quad)',
  'Inline Freestyle',
  'Roller Freestyle',
  'Artistic Skating',
  'Roller Hockey',
  'Inline Hockey',
  'Skateboarding',
  'Roller Derby',
  'Alpine / Downhill'
];

const AGE_CATEGORIES: AgeCategory[] = [
  'Tots (Under 6)',
  'Minis (6 to 8)',
  'Cadet (8 to 10)',
  'Cadet (10 to 12)',
  'Sub-Junior (12 to 15)',
  'Junior (15 to 18)',
  'Senior (Above 18)',
  'Masters (Above 35)'
];

export const SkaterEditModal: React.FC<SkaterEditModalProps> = ({
  isOpen,
  onClose,
  skater,
  onSkaterUpdated,
  adminUser
}) => {
  const [formData, setFormData] = useState({
    firstName: skater.firstName || '',
    lastName: skater.lastName || '',
    fatherName: skater.fatherName || '',
    motherName: skater.motherName || '',
    dateOfBirth: skater.dateOfBirth || '',
    gender: skater.gender || 'Male',
    bloodGroup: skater.bloodGroup || 'O+',
    phone: skater.phone || '',
    emergencyPhone: skater.emergencyPhone || '',
    email: skater.email || '',
    address: skater.address || '',
    district: skater.district || 'Lucknow',
    club: skater.club || '',
    coachName: skater.coachName || '',
    coachPhone: skater.coachPhone || '',
    discipline: skater.discipline || 'Speed Skating (Inline)',
    ageCategory: skater.ageCategory || 'Sub-Junior (12 to 15)',
    skateModel: skater.skateModel || '',
    wheelSize: skater.wheelSize || '',
    aadhaarNumberMasked: skater.aadhaarNumberMasked || '',
    licenseNumber: skater.licenseNumber || '',
    applicationNumber: skater.applicationNumber || '',
    annualFeeUtr: skater.annualFeeUtr || '',
    adminRemarks: skater.adminRemarks || '',
    photoUrl: skater.photoUrl || ''
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (skater) {
      setFormData({
        firstName: skater.firstName || '',
        lastName: skater.lastName || '',
        fatherName: skater.fatherName || '',
        motherName: skater.motherName || '',
        dateOfBirth: skater.dateOfBirth || '',
        gender: skater.gender || 'Male',
        bloodGroup: skater.bloodGroup || 'O+',
        phone: skater.phone || '',
        emergencyPhone: skater.emergencyPhone || '',
        email: skater.email || '',
        address: skater.address || '',
        district: skater.district || 'Lucknow',
        club: skater.club || '',
        coachName: skater.coachName || '',
        coachPhone: skater.coachPhone || '',
        discipline: skater.discipline || 'Speed Skating (Inline)',
        ageCategory: skater.ageCategory || 'Sub-Junior (12 to 15)',
        skateModel: skater.skateModel || '',
        wheelSize: skater.wheelSize || '',
        aadhaarNumberMasked: skater.aadhaarNumberMasked || '',
        licenseNumber: skater.licenseNumber || '',
        applicationNumber: skater.applicationNumber || '',
        annualFeeUtr: skater.annualFeeUtr || '',
        adminRemarks: skater.adminRemarks || '',
        photoUrl: skater.photoUrl || ''
      });
      setError(null);
      setSuccessMsg(null);
    }
  }, [skater, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError('Photo file size exceeds 8MB. Please select a smaller JPG/JPEG image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      setSuccessMsg(`Athlete photo loaded successfully (${(file.size / 1024).toFixed(0)} KB)`);
    };
    reader.onerror = () => {
      setError('Failed to process image file. Please retry with a valid JPG/JPEG.');
    };
    reader.readAsDataURL(file);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return undefined;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and Last name are mandatory.');
      return;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Primary phone number is required.');
      return;
    }
    if (!formData.district) {
      setError('Please select athlete District affiliation.');
      return;
    }

    setIsSaving(true);
    try {
      const calculatedAge = calculateAge(formData.dateOfBirth);
      const payload: Partial<Skater> = {
        ...formData,
        age: calculatedAge
      };

      const res = await api.updateSkater(skater.id, payload, adminUser || 'admin@uprsa.org');
      if (res.success && res.data) {
        onSkaterUpdated(res.data);
        setSuccessMsg('Skater profile updated and saved to official registry!');
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        setError(res.message || 'Failed to save skater profile changes.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error updating skater profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  EDIT SKATER DOSSIER
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {skater.registrationNumber}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                Modify Application: {skater.firstName} {skater.lastName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Notice Banner */}
        {error && (
          <div className="px-5 py-2.5 bg-red-950/50 border-b border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="px-5 py-2.5 bg-emerald-950/50 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Section 1: Athlete Personal Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                1. Personal & Guardian Details
              </h3>
            </div>

            {/* Skater Photo Field with JPG Option */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Skater Passport / Profile Photo</span>
                </label>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  JPG / JPEG Supported • Max 8MB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {formData.photoUrl ? (
                    <img 
                      src={formData.photoUrl} 
                      alt="Skater preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData.photoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://... or click Upload JPG"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload JPG</span>
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Father's Name *
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Date of Birth (YYYY-MM-DD) *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender || 'Male'}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || 'O+'}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Aadhaar (Masked)
                </label>
                <input
                  type="text"
                  name="aadhaarNumberMasked"
                  value={formData.aadhaarNumberMasked || ''}
                  onChange={handleChange}
                  placeholder="****-****-1234"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Residency */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                2. Contact & Residential Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Mobile / WhatsApp *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  name="emergencyPhone"
                  value={formData.emergencyPhone || ''}
                  onChange={handleChange}
                  placeholder="+91 94150 00000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="athlete@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Complete Residential / Postal Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Sports Affiliation & Equipment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                3. District, Club, Discipline & Equipment
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  District Affiliation *
                </label>
                <select
                  name="district"
                  value={formData.district || 'Lucknow'}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {UP_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Club Affiliation
                </label>
                <input
                  type="text"
                  name="club"
                  value={formData.club || ''}
                  onChange={handleChange}
                  placeholder="e.g. Awadh Roller Sports Club"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Discipline *
                </label>
                <select
                  name="discipline"
                  value={formData.discipline || 'Speed Skating (Inline)'}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {DISCIPLINES.map(disc => (
                    <option key={disc} value={disc}>{disc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Age Category *
                </label>
                <select
                  name="ageCategory"
                  value={formData.ageCategory || 'Sub-Junior (12 to 15)'}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {AGE_CATEGORIES.map(ac => (
                    <option key={ac} value={ac}>{ac}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Coach Name
                </label>
                <input
                  type="text"
                  name="coachName"
                  value={formData.coachName || ''}
                  onChange={handleChange}
                  placeholder="Coach Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Coach Contact Phone
                </label>
                <input
                  type="text"
                  name="coachPhone"
                  value={formData.coachPhone || ''}
                  onChange={handleChange}
                  placeholder="+91 94150 00000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Skate Model / Setup
                </label>
                <input
                  type="text"
                  name="skateModel"
                  value={formData.skateModel || ''}
                  onChange={handleChange}
                  placeholder="e.g. Powerslide 110mm"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Wheel Size
                </label>
                <input
                  type="text"
                  name="wheelSize"
                  value={formData.wheelSize || ''}
                  onChange={handleChange}
                  placeholder="e.g. 100mm, 110mm, Quad 62mm"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleChange}
                  placeholder="e.g. UP-SK-LKO-2026-0101"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Administration & Remarks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider">
                4. Administrative Remarks & Financial UTR
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Annual Fee UTR Number
                </label>
                <input
                  type="text"
                  name="annualFeeUtr"
                  value={formData.annualFeeUtr || ''}
                  onChange={handleChange}
                  placeholder="e.g. UPI-20260110-897612"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Application Number (Ref)
                </label>
                <input
                  type="text"
                  name="applicationNumber"
                  value={formData.applicationNumber || ''}
                  onChange={handleChange}
                  placeholder="e.g. UPRSA-APP-2026-0042"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-[11px] font-medium mb-1">
                  Admin Scrutiny Notes & Remarks
                </label>
                <textarea
                  name="adminRemarks"
                  rows={2}
                  value={formData.adminRemarks || ''}
                  onChange={handleChange}
                  placeholder="Official notes for internal secretariat verification..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/30"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Skater Details</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
