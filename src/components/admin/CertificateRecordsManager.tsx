import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  RefreshCw,
  Award,
  Trophy,
  Calendar,
  User,
  Building2,
  FileCheck,
  Filter,
  Eye,
  Check,
  X,
  LayoutGrid,
  AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Certificate, DisciplineType, AgeCategory, Gender } from '../../types';
import { api } from '../../services/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface CertificateRecordsManagerProps {
  onOpenVerification?: (code: string) => void;
}

export const CertificateRecordsManager: React.FC<CertificateRecordsManagerProps> = ({
  onOpenVerification
}) => {
  const { settings } = useSiteSettings();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tableMode, setTableMode] = useState<'excel' | 'compact'>('excel');
  const [isUploading, setIsUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewImportRows, setPreviewImportRows] = useState<any[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; certNumber?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form for single addition
  const [formData, setFormData] = useState({
    recipientName: '',
    fatherName: '',
    recipientRegNo: '',
    district: 'Varanasi',
    club: 'Kashi Roller Skating Club',
    tournamentName: 'UP State Roller Sports Championship 2026',
    eventName: 'Quad Speed (3 Races)',
    discipline: 'Speed Skating (Quad)',
    ageCategory: 'Sub-Junior (12 to 15)',
    gender: 'Female',
    position: '1st Place - Gold Medal (State Champion)',
    // Multi-race fields (for skaters who play multiple races like Riya Srivastava)
    race1Name: '500m Rink Race (Quad)',
    race1Position: '1st Place - Gold Medal (State Champion)',
    race2Name: '1000m Rink Race (Quad)',
    race2Position: '2nd Place - Silver Medal',
    race3Name: '1 Lap Road Race (Quad)',
    race3Position: '3rd Place - Bronze Medal',
    tournamentStartDate: '2026-08-20',
    tournamentEndDate: '2026-08-22',
    tournamentVenue: 'KD Singh Babu Stadium, Lucknow',
    tournamentCity: 'Lucknow',
    issueDate: new Date().toISOString().split('T')[0],
    type: 'Merit' as Certificate['type']
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.getCertificates();
      if (res.success && res.data) {
        setCertificates(res.data);
      }
    } catch (err) {
      console.error('Error loading certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 1. Download Excel (.xlsx) of all certificate records with multi-race support
  const handleDownloadExcel = () => {
    if (certificates.length === 0) {
      showNotification('error', 'डाउनलोड करने के लिए कोई सर्टिफिकेट रिकॉर्ड उपलब्ध नहीं है।');
      return;
    }

    const exportRows = certificates.map((c) => {
      const r1Name = c.race1Name || c.races?.[0]?.raceName || c.eventName || '';
      const r1Pos = c.race1Position || c.races?.[0]?.position || c.position || 'Participation';
      const r2Name = c.race2Name || c.races?.[1]?.raceName || '';
      const r2Pos = c.race2Position || c.races?.[1]?.position || '';
      const r3Name = c.race3Name || c.races?.[2]?.raceName || '';
      const r3Pos = c.race3Position || c.races?.[2]?.position || '';

      return {
        'Certificate Number': c.certificateNumber,
        'Recipient / Child Name': c.recipientName,
        'Father Name': c.fatherName || '',
        'Registration No': c.recipientRegNo || '',
        'District': c.district,
        'Club / Academy': c.club || '',
        'Tournament / Championship': c.tournamentName || '',
        'Discipline': c.discipline || '',
        'Age Category': c.ageCategory || '',
        'Gender': c.gender || '',
        'Race 1 / Event 1': r1Name,
        'Position 1': r1Pos,
        'Race 2 / Event 2': r2Name,
        'Position 2': r2Pos,
        'Race 3 / Event 3': r3Name,
        'Position 3': r3Pos,
        'Certificate Type': c.type,
        'Tournament Start Date': c.tournamentStartDate || '',
        'Tournament End Date': c.tournamentEndDate || '',
        'Tournament Venue': c.tournamentVenue || '',
        'Issue Date': c.issueDate || '',
        'Status': c.status || 'valid'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UPRSA_Certificates');
    
    // Auto-fit column widths
    const maxCols = 22;
    worksheet['!cols'] = Array(maxCols).fill({ wch: 22 });

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `UPRSA_Certificate_Registry_${today}.xlsx`);
    showNotification('success', `सर्टिफिकेट एक्सेल फ़ाइल (.xlsx) सफलतापूर्वक डाउनलोड हो गई (${certificates.length} रिकॉर्ड्स)।`);
  };

  // 2. Download Sample Excel Template for Import (Exact 22 columns as requested)
  const handleDownloadSampleTemplate = () => {
    const sampleRows = [
      {
        'Certificate Number': 'UPRSA/CERT/2026/00202',
        'Recipient / Child Name': 'Riya Srivastava',
        'Father Name': 'Sanjay Srivastava',
        'Registration No': 'UPRSA/2026/VAR/00202',
        'District': 'Varanasi',
        'Club / Academy': 'Kashi Roller Skating Club',
        'Tournament / Championship': 'UP State Roller Sports Championship 2026',
        'Discipline': 'Speed Skating (Quad)',
        'Age Category': 'Sub-Junior (12 to 15)',
        'Gender': 'Female',
        'Race 1 / Event 1': '500m Rink Race (Quad)',
        'Position 1': '1st Place - Gold Medal (State Champion)',
        'Race 2 / Event 2': '1000m Rink Race (Quad)',
        'Position 2': '2nd Place - Silver Medal',
        'Race 3 / Event 3': '1 Lap Road Race (Quad)',
        'Position 3': '3rd Place - Bronze Medal',
        'Certificate Type': 'Merit',
        'Tournament Start Date': '2026-08-20',
        'Tournament End Date': '2026-08-22',
        'Tournament Venue': 'KD Singh Babu Stadium, Lucknow',
        'Issue Date': '2026-08-22',
        'Status': 'valid'
      },
      {
        'Certificate Number': 'UPRSA/CERT/2026/00101',
        'Recipient / Child Name': 'Aarav Sharma',
        'Father Name': 'Rajesh Sharma',
        'Registration No': 'UPRSA/2026/LKO/00101',
        'District': 'Lucknow',
        'Club / Academy': 'Awadh Roller Sports Club',
        'Tournament / Championship': 'UP State Roller Sports Championship 2026',
        'Discipline': 'Speed Skating (Inline)',
        'Age Category': 'Sub-Junior (12 to 15)',
        'Gender': 'Male',
        'Race 1 / Event 1': '500m Sprint Inline Speed',
        'Position 1': '1st Place - Gold Medal (State Champion)',
        'Race 2 / Event 2': '1000m Inline Speed',
        'Position 2': '1st Place - Gold Medal',
        'Race 3 / Event 3': '5000m Elimination Inline',
        'Position 3': '2nd Place - Silver Medal',
        'Certificate Type': 'Merit',
        'Tournament Start Date': '2026-08-20',
        'Tournament End Date': '2026-08-22',
        'Tournament Venue': 'KD Singh Babu Stadium, Lucknow',
        'Issue Date': '2026-08-22',
        'Status': 'valid'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificate_Template');
    worksheet['!cols'] = Array(22).fill({ wch: 25 });
    XLSX.writeFile(workbook, 'UPRSA_Certificate_Import_Template.xlsx');
    showNotification('success', 'मल्टी-रेस 22-कॉलम एक्सेल टेम्पलेट डाउनलोड हो गया (रियायत श्रीवास्तव व आरव शर्मा के उदाहरण सहित)।');
  };

  // 3. Download Official PDF Register of all certificates
  const handleDownloadPDF = () => {
    if (certificates.length === 0) {
      showNotification('error', 'पीडीएफ बनाने के लिए कोई सर्टिफिकेट उपलब्ध नहीं है।');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      const today = new Date().toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 842, 60, 'F');

      doc.setTextColor(245, 158, 11); // amber-500
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(
        settings?.associationNameEn || 'UTTAR PRADESH ROLLER SPORTS ASSOCIATION',
        30,
        28
      );

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL CERTIFICATE AUTHENTICATION REGISTRY & RECORD DIRECTORY', 30, 44);

      doc.setTextColor(203, 213, 225);
      doc.text(`Generated: ${today} | Total Certificates: ${certificates.length}`, 600, 36);

      // Table Header
      let y = 85;
      doc.setFillColor(30, 41, 59); // slate-800
      doc.rect(30, y - 12, 782, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Cert No', 35, y);
      doc.text('Athlete / Child Name', 160, y);
      doc.text('Father Name', 280, y);
      doc.text('District', 380, y);
      doc.text('Tournament Name', 460, y);
      doc.text('Position / Standing', 640, y);
      doc.text('Issue Date', 745, y);

      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      certificates.slice(0, 40).forEach((c, idx) => {
        if (y > 540) {
          doc.addPage();
          y = 40;
        }

        // Alternating row background
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(30, y - 10, 782, 16, 'F');
        }

        doc.setTextColor(15, 23, 42);
        doc.text(c.certificateNumber || '-', 35, y);
        doc.setFont('helvetica', 'bold');
        doc.text(c.recipientName || '-', 160, y);
        doc.setFont('helvetica', 'normal');
        doc.text(c.fatherName || '-', 280, y);
        doc.text(c.district || '-', 380, y);
        doc.text((c.tournamentName || '-').substring(0, 32), 460, y);
        
        doc.setTextColor(180, 83, 9); // amber-700
        doc.setFont('helvetica', 'bold');
        doc.text((c.position || 'Participation').substring(0, 20), 640, y);
        
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(c.issueDate || '-', 745, y);

        y += 16;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Official State Registry • Authenticated by UPRSA Executive Board', 30, 575);

      doc.save(`UPRSA_Certificates_Registry_${new Date().toISOString().split('T')[0]}.pdf`);
      showNotification('success', 'सर्टिफिकेट रजिस्ट्री की आधिकारिक पीडीएफ डाउनलोड हो गई।');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showNotification('error', 'पीडीएफ जनरेट करने में समस्या आई।');
    }
  };

  // 4. Handle Excel or CSV file upload and parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonRows.length === 0) {
          showNotification('error', 'चयनित एक्सेल/CSV फाइल खाली है।');
          return;
        }

        // Map column names flexibly (supporting multi-race columns like Race 1, Race 2, Race 3)
        const mappedList = jsonRows.map((row) => {
          const r1Name = (row['Race 1 / Event 1'] || row['Race 1 Name'] || row['Race 1'] || row['Event 1'] || row['Event / Race Name'] || row['Event'] || row['eventName'] || '').toString().trim();
          const r1Pos = (row['Position 1'] || row['Position 1 / Result 1'] || row['Standing 1'] || row['Race 1 Position'] || row['Position / Standing'] || row['Position'] || row['position'] || row['Rank'] || '').toString().trim();

          const r2Name = (row['Race 2 / Event 2'] || row['Race 2 Name'] || row['Race 2'] || row['Event 2'] || row['race2Name'] || '').toString().trim();
          const r2Pos = (row['Position 2'] || row['Position 2 / Result 2'] || row['Standing 2'] || row['Race 2 Position'] || row['race2Position'] || '').toString().trim();

          const r3Name = (row['Race 3 / Event 3'] || row['Race 3 Name'] || row['Race 3'] || row['Event 3'] || row['race3Name'] || '').toString().trim();
          const r3Pos = (row['Position 3'] || row['Position 3 / Result 3'] || row['Standing 3'] || row['Race 3 Position'] || row['race3Position'] || '').toString().trim();

          const races: { raceName: string; position: string }[] = [];
          if (r1Name) races.push({ raceName: r1Name, position: r1Pos || 'Participation' });
          if (r2Name) races.push({ raceName: r2Name, position: r2Pos || 'Participation' });
          if (r3Name) races.push({ raceName: r3Name, position: r3Pos || 'Participation' });

          const primaryEventName = races.length > 1
            ? `${races.length} Races / Events`
            : (r1Name || row['Event / Race Name'] || row['Event'] || row['eventName'] || 'Speed Skating');

          const primaryPosition = races.length > 0 ? races[0].position : (row['Position / Standing'] || row['Position'] || row['position'] || 'Participation');

          return {
            certificateNumber: row['Certificate Number'] || row['Certificate No'] || row['CertNo'] || row['certificateNumber'] || '',
            verificationCode: row['Auth Code'] || row['Verification Code'] || row['verificationCode'] || '',
            recipientName: row['Recipient / Child Name'] || row['Child Name'] || row['Athlete Name'] || row['Name'] || row['recipientName'] || '',
            fatherName: row['Father Name'] || row['Father'] || row['fatherName'] || '',
            recipientRegNo: row['Registration No'] || row['Reg No'] || row['Skater Reg'] || row['recipientRegNo'] || '',
            district: row['District'] || row['district'] || 'Uttar Pradesh',
            club: row['Club / Academy'] || row['Club'] || row['club'] || '',
            tournamentName: row['Tournament / Championship'] || row['Tournament'] || row['tournamentName'] || 'UP State Roller Sports Championship 2026',
            eventName: primaryEventName,
            discipline: row['Discipline'] || row['discipline'] || 'Speed Skating',
            ageCategory: row['Age Category'] || row['Age'] || row['ageCategory'] || '',
            gender: row['Gender'] || row['gender'] || 'Mixed',
            position: primaryPosition,
            tournamentStartDate: row['Tournament Start Date'] || row['Tournament Date'] || row['tournamentStartDate'] || '',
            tournamentEndDate: row['Tournament End Date'] || row['tournamentEndDate'] || '',
            tournamentVenue: row['Tournament Venue'] || row['Venue'] || row['tournamentVenue'] || '',
            issueDate: row['Issue Date'] || row['issueDate'] || new Date().toISOString().split('T')[0],
            type: row['Certificate Type'] || row['Type'] || row['type'] || 'Merit',
            status: 'valid',
            races,
            race1Name: races[0]?.raceName || r1Name,
            race1Position: races[0]?.position || r1Pos,
            race2Name: races[1]?.raceName || r2Name,
            race2Position: races[1]?.position || r2Pos,
            race3Name: races[2]?.raceName || r3Name,
            race3Position: races[2]?.position || r3Pos
          };
        }).filter(r => r.recipientName && r.recipientName.trim().length > 0);

        if (mappedList.length === 0) {
          showNotification('error', 'फाइल में कोई मान्य खिलाड़ी/बच्चे का नाम (Recipient Name) नहीं मिला।');
          return;
        }

        setPreviewImportRows(mappedList);
      } catch (err: any) {
        console.error('Error reading excel file:', err);
        showNotification('error', 'फाइल पढ़ने में त्रुटि: ' + (err.message || 'अमान्य फाइल'));
      }
    };

    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 5. Confirm and Save Imported Rows to Database
  const handleConfirmImport = async () => {
    if (!previewImportRows || previewImportRows.length === 0) return;
    setIsUploading(true);

    try {
      const res = await api.bulkImportCertificates(previewImportRows);
      if (res.success) {
        showNotification('success', res.message || `${previewImportRows.length} सर्टिफिकेट सफलतापूर्वक डेटाबेस में इंपोर्ट हो गए! अब ये वेरिफाई सर्टिफिकेट स्क्रीन पर तुरंत दिखेंगे।`);
        setPreviewImportRows(null);
        loadCertificates();
      } else {
        showNotification('error', res.message || 'इंपोर्ट करने में विफल।');
      }
    } catch (err: any) {
      showNotification('error', 'सर्वर एरर: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // 6. Handle single certificate creation
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName.trim()) {
      showNotification('error', 'कृपया बच्चे/खिलाड़ी का नाम दर्ज करें।');
      return;
    }

    // Build multi-races array
    const races: { raceName: string; position: string }[] = [];
    if (formData.race1Name.trim()) {
      races.push({ raceName: formData.race1Name.trim(), position: formData.race1Position?.trim() || 'Participation' });
    }
    if (formData.race2Name.trim()) {
      races.push({ raceName: formData.race2Name.trim(), position: formData.race2Position?.trim() || 'Participation' });
    }
    if (formData.race3Name.trim()) {
      races.push({ raceName: formData.race3Name.trim(), position: formData.race3Position?.trim() || 'Participation' });
    }

    const payload = {
      ...formData,
      races,
      eventName: races.length > 1 ? `${races.length} Races / Events` : (formData.race1Name || formData.eventName),
      position: races[0]?.position || formData.position || 'Participation',
    };

    try {
      const res = await api.createCertificate(payload);
      if (res.success && res.data) {
        showNotification('success', `सर्टिफिकेट सफलतापूर्वक जारी हुआ! सर्टिफिकेट नंबर: ${res.data.certificateNumber}`);
        setShowAddModal(false);
        loadCertificates();
        // Reset form
        setFormData({
          recipientName: '',
          fatherName: '',
          recipientRegNo: '',
          district: 'Lucknow',
          club: '',
          tournamentName: 'UP State Roller Sports Championship 2026',
          eventName: '500m Sprint Inline Speed',
          discipline: 'Speed Skating (Inline)',
          ageCategory: 'Sub-Junior (12 to 15)',
          gender: 'Male',
          position: '1st Place - Gold Medal (State Champion)',
          race1Name: '500m Rink Race (Quad)',
          race1Position: '1st Place - Gold Medal (State Champion)',
          race2Name: '1000m Rink Race (Quad)',
          race2Position: '2nd Place - Silver Medal',
          race3Name: '1 Lap Road Race (Quad)',
          race3Position: '3rd Place - Bronze Medal',
          tournamentStartDate: '2026-08-20',
          tournamentEndDate: '2026-08-22',
          tournamentVenue: 'Dr. Ram Manohar Lohia Sports Arena, Lucknow',
          tournamentCity: 'Lucknow',
          issueDate: new Date().toISOString().split('T')[0],
          type: 'Merit'
        });
      } else {
        showNotification('error', res.message || 'सर्टिफिकेट बनाने में समस्या आई।');
      }
    } catch (err: any) {
      showNotification('error', 'त्रुटि: ' + err.message);
    }
  };

  // 7. Delete Certificate (In-App Modal Confirmation to bypass iframe restrictions)
  const handleRequestDelete = (cert: Certificate) => {
    setDeleteTarget({
      id: cert.id,
      name: cert.recipientName,
      certNumber: cert.certificateNumber
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteCertificate(deleteTarget.id);
      if (res.success) {
        showNotification('success', `सर्टिफिकेट ${deleteTarget.certNumber || ''} (${deleteTarget.name}) सफलतापूर्वक हटा दिया गया।`);
        setCertificates(prev => prev.filter(c => c.id !== deleteTarget.id && c.certificateNumber !== deleteTarget.certNumber));
        setDeleteTarget(null);
      } else {
        showNotification('error', res.message || 'सर्टिफिकेट हटाने में विफल।');
      }
    } catch (err: any) {
      showNotification('error', 'हटाने में समस्या आई: ' + (err?.message || 'अज्ञात त्रुटि'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and search
  const filteredCerts = certificates.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      c.recipientName.toLowerCase().includes(q) ||
      c.certificateNumber.toLowerCase().includes(q) ||
      (c.recipientRegNo && c.recipientRegNo.toLowerCase().includes(q)) ||
      (c.fatherName && c.fatherName.toLowerCase().includes(q)) ||
      (c.tournamentName && c.tournamentName.toLowerCase().includes(q)) ||
      (c.district && c.district.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'gold') return (c.position || '').toLowerCase().includes('gold') || (c.position || '').toLowerCase().includes('1st');
    if (filterType === 'silver') return (c.position || '').toLowerCase().includes('silver') || (c.position || '').toLowerCase().includes('2nd');
    if (filterType === 'bronze') return (c.position || '').toLowerCase().includes('bronze') || (c.position || '').toLowerCase().includes('3rd');
    if (filterType === 'participation') return c.type === 'Participation';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>CMS • CERTIFICATE REGISTRY & EXCEL/PDF DATA HUB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            सर्टिफिकेट रिकॉर्ड्स व डेटा मैनेजर (Excel/PDF Manager)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            यहां से आप सभी सर्टिफिकेट्स का एक्सेल (.xlsx) या आधिकारिक पीडीएफ डाउनलोड कर सकते हैं, नया एक्सेल अपलोड कर सकते हैं, और नया सर्टिफिकेट सीधे जोड़ सकते हैं। ये सभी रिकॉर्ड्स पब्लिक पोर्टल पर <strong className="text-amber-300">"वेरिफाई सर्टिफिकेट"</strong> में तुरंत दिखने लगते हैं।
          </p>
        </div>

        {/* Top Action Buttons: Download Excel, PDF, Upload */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            title="सभी रिकॉर्ड्स एक्सेल (.xlsx) में डाउनलोड करें"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>डाउनलोड एक्सेल (.xlsx)</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            title="सर्टिफिकेट डायरेक्टरी की आधिकारिक पीडीएफ डाउनलोड करें"
          >
            <FileText className="w-4 h-4" />
            <span>डाउनलोड पीडीएफ (PDF)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            title="एक्सेल या CSV फाइल अपलोड करें"
          >
            <Upload className="w-4 h-4" />
            <span>अपलोड एक्सेल / CSV</span>
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया सर्टिफिकेट जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
            : 'bg-red-950/80 border-red-500/50 text-red-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Import Preview Modal / Section */}
      {previewImportRows && (
        <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-0.5 rounded-full text-xs font-bold mb-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>एक्सेल फाइल पार्स सफल • PREVIEW IMPORT</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                कुल {previewImportRows.length} सर्टिफिकेट रिकॉर्ड्स मिले। क्या आप इन्हें डेटाबेस में जोड़ना चाहते हैं?
              </h3>
              <p className="text-xs text-slate-400">
                सेव होते ही ये सारे रिकॉर्ड्स तुरंत पब्लिक 'वेरिफाई सर्टिफिकेट' पोर्टल पर सक्रिय हो जाएंगे।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewImportRows(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={isUploading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {isUploading ? (
                  <span>इंपोर्ट हो रहा है...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>पुष्टि करें व सेव करें ({previewImportRows.length} Records)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table Preview of first 5 rows */}
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">खिलाड़ी का नाम</th>
                  <th className="py-2.5 px-3">पिता का नाम</th>
                  <th className="py-2.5 px-3">जिला</th>
                  <th className="py-2.5 px-3">टूर्नामेंट</th>
                  <th className="py-2.5 px-3">इवेंट / रेस (Races)</th>
                  <th className="py-2.5 px-3">पोजीशन / मेडल</th>
                  <th className="py-2.5 px-3">सर्टिफिकेट नंबर</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {previewImportRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-850">
                    <td className="py-2 px-3 font-bold text-white">{r.recipientName}</td>
                    <td className="py-2 px-3 text-slate-300">{r.fatherName || '-'}</td>
                    <td className="py-2 px-3">{r.district}</td>
                    <td className="py-2 px-3 text-slate-300 truncate max-w-[200px]">{r.tournamentName}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-400">
                      {r.races && r.races.length > 1 ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-amber-400">{r.races.length} Races:</span>
                          <ul className="list-disc pl-3 text-[10px] text-slate-300">
                            {r.races.map((rc, idx) => (
                              <li key={idx}>{rc.raceName}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span>{r.eventName || r.race1Name} • {r.discipline}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-amber-400">
                      {r.races && r.races.length > 1 ? (
                        <div className="space-y-0.5">
                          {r.races.map((rc, idx) => (
                            <div key={idx} className="text-[10px] text-emerald-400">
                              {rc.position}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>{r.position}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-emerald-400">{r.certificateNumber || 'Auto-Generate'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search, Filter & Template Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="खिलाड़ी का नाम, सर्टिफिकेट नंबर, जिला या टूर्नामेंट से खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              सभी ({certificates.length})
            </button>
            <button
              onClick={() => setFilterType('gold')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'gold' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              गोल्ड (Gold)
            </button>
            <button
              onClick={() => setFilterType('silver')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'silver' ? 'bg-slate-300 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              सिल्वर (Silver)
            </button>
            <button
              onClick={() => setFilterType('bronze')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'bronze' ? 'bg-amber-700 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              ब्रॉन्ज (Bronze)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadSampleTemplate}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-xl border border-amber-500/30 transition-all cursor-pointer"
            title="डेटा भरने हेतु नमूना एक्सेल टेम्पलेट डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5" />
            <span>सैंपल टेम्पलेट (.xlsx)</span>
          </button>

          <button
            onClick={loadCertificates}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>जारी प्रमाण पत्र डायरेक्टरी (Active Registry)</span>
              <span className="bg-emerald-500/20 text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {filteredCerts.length} Records
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              प्रत्येक रिकॉर्ड में बच्चे का नाम, पिता का नाम, टूर्नामेंट, रेस 1, 2, 3 और पोजीशन सत्यापित हैं
            </p>
          </div>

          {/* View Switcher: Excel Spreadsheet 22 Columns vs Compact View */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setTableMode('excel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                tableMode === 'excel'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="22 कॉलम एक्सेल स्प्रेडशीट ग्रिड व्यू"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>एक्सेल स्प्रेडशीट (22 Columns)</span>
            </button>
            <button
              onClick={() => setTableMode('compact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                tableMode === 'compact'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="कॉम्पैक्ट कार्ड/तालिका व्यू"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>कॉम्पैक्ट व्यू</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            सर्टिफिकेट रिकॉर्ड्स लोड हो रहे हैं...
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">कोई सर्टिफिकेट रिकॉर्ड नहीं मिला</p>
            <p className="text-xs text-slate-500">
              नया सर्टिफिकेट जोड़ने के लिए "+ नया सर्टिफिकेट जोड़ें" या "अपलोड एक्सेल / CSV" पर क्लिक करें।
            </p>
          </div>
        ) : tableMode === 'excel' ? (
          /* EXACT 22-COLUMN EXCEL SPREADSHEET VIEW */
          <div className="overflow-x-auto border border-slate-700/80 rounded-2xl shadow-inner max-h-[620px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-300 font-bold text-[11px] sticky top-0 z-10 shadow-sm border-b border-slate-700">
                <tr className="divide-x divide-slate-800">
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-amber-400">Certificate Number</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-white">Recipient / Child Name</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Father Name</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Registration No</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">District</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Club / Academy</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Tournament / Championship</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Discipline</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Age Category</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Gender</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-amber-300 bg-amber-950/20">Race 1 / Event 1</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-amber-300 bg-amber-950/20">Position 1</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-200 bg-slate-800/30">Race 2 / Event 2</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-200 bg-slate-800/30">Position 2</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-orange-300 bg-orange-950/20">Race 3 / Event 3</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-orange-300 bg-orange-950/20">Position 3</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Certificate Type</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Tournament Start Date</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Tournament End Date</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Tournament Venue</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Issue Date</th>
                  <th className="py-3 px-3 bg-slate-950 whitespace-nowrap text-slate-300">Status</th>
                  <th className="py-3 px-3 bg-slate-950 sticky right-0 z-20 whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-sans">
                {filteredCerts.map((cert) => {
                  const r1Name = cert.race1Name || cert.races?.[0]?.raceName || cert.eventName || '';
                  const r1Pos = cert.race1Position || cert.races?.[0]?.position || cert.position || 'Participation';
                  const r2Name = cert.race2Name || cert.races?.[1]?.raceName || '';
                  const r2Pos = cert.race2Position || cert.races?.[1]?.position || '';
                  const r3Name = cert.race3Name || cert.races?.[2]?.raceName || '';
                  const r3Pos = cert.race3Position || cert.races?.[2]?.position || '';

                  return (
                    <tr key={cert.id} className="hover:bg-slate-800/80 transition-colors divide-x divide-slate-800/70 text-slate-300">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">{cert.certificateNumber}</td>
                      <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">{cert.recipientName}</td>
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{cert.fatherName || '-'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">{cert.recipientRegNo || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">{cert.district}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">{cert.club || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap max-w-[240px] truncate" title={cert.tournamentName}>{cert.tournamentName}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">{cert.discipline || 'Speed Skating'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">{cert.ageCategory || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">{cert.gender || '-'}</td>
                      
                      {/* Race 1 & Position 1 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-amber-200 font-medium bg-amber-500/5">{r1Name || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-amber-300 bg-amber-500/10">{r1Pos || '-'}</td>

                      {/* Race 2 & Position 2 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-200 font-medium bg-slate-500/5">{r2Name || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-200 bg-slate-500/10">{r2Pos || '-'}</td>

                      {/* Race 3 & Position 3 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-orange-200 font-medium bg-orange-500/5">{r3Name || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-orange-300 bg-orange-500/10">{r3Pos || '-'}</td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {cert.type || 'Merit'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-slate-400">{cert.tournamentStartDate || '-'}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-slate-400">{cert.tournamentEndDate || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-300 max-w-[220px] truncate" title={cert.tournamentVenue}>{cert.tournamentVenue || '-'}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-slate-400">{cert.issueDate || '-'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {cert.status || 'valid'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 sticky right-0 z-10 bg-slate-900 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenVerification && (
                            <button
                              onClick={() => onOpenVerification(cert.certificateNumber)}
                              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                              title="पब्लिक वेरिफाई स्क्रीन पर देखें"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold hidden sm:inline">वेरिफाई</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleRequestDelete(cert)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                            title="सर्टिफिकेट हटाएं (Delete Record)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">हटाएं</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* COMPACT DIRECTORY VIEW */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">सर्टिफिकेट नंबर</th>
                  <th className="py-3 px-3">बच्चे/खिलाड़ी का नाम व पिता</th>
                  <th className="py-3 px-3">जिला व क्लब</th>
                  <th className="py-3 px-3">टूर्नामेंट व इवेंट</th>
                  <th className="py-3 px-3">खेली गई रेस एवं पोजीशन</th>
                  <th className="py-3 px-3">टूर्नामेंट व जारी दिनांक</th>
                  <th className="py-3 px-3 text-center">ऑथ कोड</th>
                  <th className="py-3 px-3 text-right">कार्रवाई (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      {cert.certificateNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{cert.recipientName}</span>
                      </div>
                      {cert.fatherName && (
                        <div className="text-[11px] text-slate-400">
                          पिता: <span className="text-slate-300">{cert.fatherName}</span>
                        </div>
                      )}
                      {cert.recipientRegNo && (
                        <div className="text-[10px] font-mono text-amber-400">
                          {cert.recipientRegNo}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{cert.district}</div>
                      {cert.club && <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{cert.club}</div>}
                    </td>
                    <td className="py-3 px-3 max-w-[240px]">
                      <div className="font-medium text-white truncate" title={cert.tournamentName}>
                        {cert.tournamentName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {cert.races && cert.races.length > 1 ? (
                          <span className="text-amber-400 font-bold">{cert.races.length} रेस खेलीं • {cert.discipline || 'Speed Skating'}</span>
                        ) : (
                          <span>{cert.eventName || cert.race1Name || '-'} • {cert.discipline || '-'}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {cert.races && cert.races.length > 1 ? (
                        <div className="space-y-1.5 py-1">
                          {cert.races.map((r, idx) => {
                            const isGold = (r.position || '').toLowerCase().includes('gold') || (r.position || '').toLowerCase().includes('1st');
                            const isSilver = (r.position || '').toLowerCase().includes('silver') || (r.position || '').toLowerCase().includes('2nd');
                            const isBronze = (r.position || '').toLowerCase().includes('bronze') || (r.position || '').toLowerCase().includes('3rd');
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                                <span className={`px-2 py-0.5 rounded-full font-black ${
                                  isGold ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                  isSilver ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                                  isBronze ? 'bg-orange-600/20 text-orange-300 border border-orange-500/40' :
                                  'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                                }`}>
                                  {r.position}
                                </span>
                                <span className="text-slate-400 text-[10px] truncate max-w-[120px]" title={r.raceName}>({r.raceName})</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black ${
                          (cert.position || '').toLowerCase().includes('gold') || (cert.position || '').toLowerCase().includes('1st')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : (cert.position || '').toLowerCase().includes('silver') || (cert.position || '').toLowerCase().includes('2nd')
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                            : (cert.position || '').toLowerCase().includes('bronze') || (cert.position || '').toLowerCase().includes('3rd')
                            ? 'bg-orange-600/20 text-orange-300 border border-orange-500/40'
                            : 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {cert.position || 'Participation'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-400">
                      {cert.tournamentStartDate && (
                        <div className="text-slate-300 text-[11px]">
                          प्रतियोगिता: <strong className="text-white">{cert.tournamentStartDate}</strong>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">
                        जारी: {cert.issueDate}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {cert.verificationCode}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenVerification && (
                          <button
                            onClick={() => onOpenVerification(cert.certificateNumber)}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                            title="पब्लिक वेरिफाई स्क्रीन पर देखें"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold hidden sm:inline">सत्यापित करें</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleRequestDelete(cert)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                          title="सर्टिफिकेट हटाएं (Delete Record)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold hidden sm:inline">हटाएं</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Single Certificate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">नया सर्टिफिकेट जोड़ें (Add Certificate)</h3>
                  <p className="text-xs text-slate-400">यह रिकॉर्ड तुरंत वेरिफाई सर्टिफिकेट रजिस्ट्री में जुड़ जाएगा</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingle} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    बच्चे/खिलाड़ी का पूरा नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Aarav Sharma"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    पिता का नाम (Father Name)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. Rajesh Sharma"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    UPRSA रजिस्ट्रेशन नंबर
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. UPRSA/2026/LKO/00101"
                    value={formData.recipientRegNo}
                    onChange={(e) => setFormData({ ...formData, recipientRegNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    गृह जिला (District) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. Lucknow"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    क्लब / अकादमी (Club)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. Awadh Roller Sports Club"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    सर्टिफिकेट प्रकार (Type)
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Merit">Merit Certificate</option>
                    <option value="Participation">Participation Certificate</option>
                    <option value="Official">Official / Referee Certificate</option>
                    <option value="Coach">Coach Accreditation Certificate</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    टूर्नामेंट / चैंपियनशिप का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tournamentName}
                    onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      टूर्नामेंट दिनांक (Tournament Date)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. 2026-08-20 से 2026-08-22"
                      value={formData.tournamentStartDate}
                      onChange={(e) => setFormData({ ...formData, tournamentStartDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      टूर्नामेंट स्थल / वेन्यू (Venue)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. KD Singh Babu Stadium, Lucknow"
                      value={formData.tournamentVenue}
                      onChange={(e) => setFormData({ ...formData, tournamentVenue: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                {/* Multi-Race Results Section (e.g. For athletes who competed in up to 3 races like Riya Srivastava) */}
                <div className="sm:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>खेली गई रेस एवं प्राप्त पोजीशन (1, 2 या 3 रेस दर्ज करें - जैसे रियायत श्रीवास्तव की 3 रेस)</span>
                    </label>
                    <span className="text-[10px] text-slate-400">एक ही सर्टिफिकेट में तीनों रेस व पोजीशन दिखाई देंगी</span>
                  </div>

                  {/* Race 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-slate-300 font-medium text-[11px] block mb-1">
                        रेस 1 का नाम * (Race 1 Name)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. 500m Rink Race (Quad)"
                        value={formData.race1Name}
                        onChange={(e) => setFormData({ ...formData, race1Name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium text-[11px] block mb-1">
                        रेस 1 में प्राप्त स्थान / मेडल * (Position 1)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. 1st Place - Gold Medal (State Champion)"
                        value={formData.race1Position}
                        onChange={(e) => setFormData({ ...formData, race1Position: e.target.value, position: e.target.value })}
                        className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2 text-xs text-amber-300 font-bold"
                      />
                    </div>
                  </div>

                  {/* Race 2 (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-slate-300 font-medium text-[11px] block mb-1">
                        रेस 2 का नाम (Race 2 Name - यदि खिलाड़ी ने खेली हो)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 1000m Rink Race (Quad)"
                        value={formData.race2Name}
                        onChange={(e) => setFormData({ ...formData, race2Name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium text-[11px] block mb-1">
                        रेस 2 में प्राप्त स्थान / मेडल (Position 2)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 2nd Place - Silver Medal"
                        value={formData.race2Position}
                        onChange={(e) => setFormData({ ...formData, race2Position: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-bold"
                      />
                    </div>
                  </div>

                  {/* Race 3 (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-slate-300 font-medium text-[11px] block mb-1">
                        रेस 3 का नाम (Race 3 Name - यदि खिलाड़ी ने खेली हो)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 1 Lap Road Race (Quad)"
                        value={formData.race3Name}
                        onChange={(e) => setFormData({ ...formData, race3Name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium text-[11px] block mb-1">
                        रेस 3 में प्राप्त स्थान / मेडल (Position 3)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 3rd Place - Bronze Medal"
                        value={formData.race3Position}
                        onChange={(e) => setFormData({ ...formData, race3Position: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-orange-300 font-bold"
                      />
                    </div>
                  </div>
                </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      खेल विधा (Discipline)
                    </label>
                    <select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Speed Skating (Inline)">Speed Skating (Inline)</option>
                      <option value="Speed Skating (Quad)">Speed Skating (Quad)</option>
                      <option value="Artistic Skating">Artistic Skating</option>
                      <option value="Inline Freestyle">Inline Freestyle</option>
                      <option value="Roller Hockey">Roller Hockey</option>
                      <option value="Inline Hockey">Inline Hockey</option>
                      <option value="Roller Freestyle">Roller Freestyle</option>
                      <option value="Roller Derby">Roller Derby</option>
                      <option value="Downhill">Downhill</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      सर्टिफिकेट जारी दिनांक (Issue Date)
                    </label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-300 space-y-1">
                <span className="font-bold block">सर्टिफिकेट नंबर व सुरक्षा कोड:</span>
                <span>सर्टिफिकेट नंबर व QR ऑथेंटिकेशन कोड सिस्टम द्वारा ऑटो-जनरेट किए जाएंगे और तुरंत पब्लिक वेरिफाई पोर्टल पर सक्रिय हो जाएंगे।</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>सर्टिफिकेट जारी करें व सेव करें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Bypasses iframe blocked window.confirm) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-white">सर्टिफिकेट रिकॉर्ड हटाएं?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  क्या आप वाकई यह प्रमाणपत्र रिकॉर्ड स्थायी रूप से हटाना चाहते हैं? यह क्रिया डेटाबेस और सार्वजनिक वेरिफिकेशन पोर्टल दोनों से रिकॉर्ड हटा देगी।
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>खिलाड़ी / बच्चे का नाम:</span>
                <span className="font-bold text-white">{deleteTarget.name}</span>
              </div>
              {deleteTarget.certNumber && (
                <div className="flex justify-between items-center text-slate-400">
                  <span>सर्टिफिकेट नंबर:</span>
                  <span className="font-mono font-bold text-amber-400">{deleteTarget.certNumber}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>हटाया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>हाँ, रिकॉर्ड हटाएं (Delete)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
