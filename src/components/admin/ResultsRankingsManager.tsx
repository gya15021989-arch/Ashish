import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Trophy, 
  Medal, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Filter, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  Camera, 
  Sparkles,
  MapPin, 
  Building2, 
  User, 
  Clock, 
  Hash, 
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  FileSpreadsheet,
  Download,
  FileUp,
  Table,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { 
  TournamentResult, 
  SkaterRanking, 
  DistrictRanking, 
  ClubRanking, 
  Tournament, 
  District, 
  Club,
  CustomRankingRecord
} from '../../types';

export const ResultsRankingsManager: React.FC = () => {
  // Navigation
  const [activeMainTab, setActiveMainTab] = useState<'results' | 'rankings'>('results');
  const [rankingCategory, setRankingCategory] = useState<'individual' | 'district' | 'club'>('individual');

  // Data states
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [individualRankings, setIndividualRankings] = useState<SkaterRanking[]>([]);
  const [districtRankings, setDistrictRankings] = useState<DistrictRanking[]>([]);
  const [clubRankings, setClubRankings] = useState<ClubRanking[]>([]);
  const [customRankings, setCustomRankings] = useState<CustomRankingRecord[]>([]);
  
  // Reference lists
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  // Loading & feedback
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Search & filters for Results
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTournament, setFilterTournament] = useState('ALL');
  const [filterDiscipline, setFilterDiscipline] = useState('ALL');
  const [filterMedal, setFilterMedal] = useState('ALL');

  // Search & filters for Rankings
  const [rankingSearch, setRankingSearch] = useState('');
  const [rankingDistrictFilter, setRankingDistrictFilter] = useState('ALL');

  // Modals
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<TournamentResult | null>(null);
  const [deleteResultConfirm, setDeleteResultConfirm] = useState<TournamentResult | null>(null);

  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [editingRanking, setEditingRanking] = useState<any | null>(null);
  const [deleteRankingConfirm, setDeleteRankingConfirm] = useState<any | null>(null);

  // Result Form Data
  const [resultForm, setResultForm] = useState<Partial<TournamentResult>>({
    tournamentId: '',
    tournamentName: '',
    discipline: 'Speed Skating (Inline)',
    ageCategory: 'Sub-Junior (12 to 15)',
    gender: 'Male',
    eventName: '500m+D Sprint Rink Race',
    round: 'Final',
    position: 1,
    medal: 'Gold',
    skaterName: '',
    skaterRegNo: '',
    district: 'Lucknow',
    club: 'Lucknow Roller Skating Academy',
    bibNumber: '',
    timeTaken: '00:44.82',
    points: 5,
    skaterPhotoUrl: '',
    notes: ''
  });

  // Ranking Form Data
  const [rankingForm, setRankingForm] = useState<{
    id?: string;
    type: 'individual' | 'district' | 'club';
    name: string;
    rank: number;
    district: string;
    club?: string;
    discipline?: string;
    ageCategory?: string;
    gender?: 'Male' | 'Female' | 'Mixed';
    registrationNumber?: string;
    goldCount: number;
    silverCount: number;
    bronzeCount: number;
    totalPoints: number;
    photoUrl?: string;
    eventsCount?: number;
    athletesCount?: number;
  }>({
    type: 'individual',
    name: '',
    rank: 1,
    district: 'Lucknow',
    club: '',
    discipline: 'Speed Skating (Inline)',
    ageCategory: 'Senior (17 & Above)',
    gender: 'Male',
    registrationNumber: '',
    goldCount: 1,
    silverCount: 0,
    bronzeCount: 0,
    totalPoints: 5,
    photoUrl: '',
    eventsCount: 1,
    athletesCount: 1
  });

  // File Upload Ref
  const resultPhotoInputRef = useRef<HTMLInputElement>(null);
  const rankingPhotoInputRef = useRef<HTMLInputElement>(null);
  const excelFileInputRef = useRef<HTMLInputElement>(null);

  // Excel File Upload States
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelRows, setExcelRows] = useState<Partial<TournamentResult>[]>([]);
  const [selectedDefaultTournamentId, setSelectedDefaultTournamentId] = useState('');
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [autoRecomputeRankings, setAutoRecomputeRankings] = useState(true);
  const [excelStats, setExcelStats] = useState<{
    total: number;
    golds: number;
    silvers: number;
    bronzes: number;
    tournamentsDetected: string[];
    athletesCount: number;
  }>({ total: 0, golds: 0, silvers: 0, bronzes: 0, tournamentsDetected: [], athletesCount: 0 });

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [resData, rankData, tourRes, distRes, clubRes] = await Promise.all([
        api.getResults(),
        api.getRankings(),
        api.getTournaments(),
        api.getDistricts(),
        api.getClubs()
      ]);

      if (resData.success && resData.data) {
        setResults(resData.data);
      }
      if (rankData.success && rankData.data) {
        setIndividualRankings(rankData.data.individualRankings || []);
        setDistrictRankings(rankData.data.districtRankings || []);
        setClubRankings(rankData.data.clubRankings || []);
        if (rankData.data.customRankings) {
          setCustomRankings(rankData.data.customRankings);
        }
      }
      if (tourRes.success && tourRes.data) {
        setTournaments(tourRes.data);
      }
      if (distRes.success && distRes.data) {
        setDistricts(distRes.data);
      }
      if (clubRes.success && clubRes.data) {
        setClubs(clubRes.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load results and rankings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate 5-3-1 points automatically
  const handleMedalChange = (medalVal: string) => {
    let pts = 0;
    let pos = resultForm.position || 1;
    if (medalVal === 'Gold') { pts = 5; pos = 1; }
    else if (medalVal === 'Silver') { pts = 3; pos = 2; }
    else if (medalVal === 'Bronze') { pts = 1; pos = 3; }
    else { pts = 0; }

    setResultForm(prev => ({
      ...prev,
      medal: medalVal as any,
      position: pos,
      points: pts
    }));
  };

  // Photo Upload Handler with base64 and explicit JPG/JPEG support
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'result' | 'ranking') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 8MB
    if (file.size > 8 * 1024 * 1024) {
      showToast('File size exceeds 8MB. Please upload a smaller JPG/JPEG image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      if (target === 'result') {
        setResultForm(prev => ({ ...prev, skaterPhotoUrl: base64Url }));
      } else {
        setRankingForm(prev => ({ ...prev, photoUrl: base64Url }));
      }
      showToast(`Photo loaded successfully (${(file.size / 1024).toFixed(0)} KB)`, 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image file. Please retry with a valid JPG/JPEG.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Open Excel Import Modal
  const handleOpenExcelModal = () => {
    const defTour = tournaments[0];
    setSelectedDefaultTournamentId(defTour?.id || 'tour-2026-01');
    setIsExcelModalOpen(true);
  };

  // Download Sample Excel Template
  const handleDownloadSampleTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();
      const headers = [
        'Tournament Name (टूर्नामेंट का नाम)',
        'Event Name (इवेंट का नाम)',
        'Discipline (डिसिप्लिन)',
        'Age Category (आयु वर्ग)',
        'Gender (लिंग: Male/Female)',
        'Athlete Name (बच्चे/खिलाड़ी का नाम)',
        'Registration Number (पंजीकरण संख्या)',
        'District (जिला)',
        'Club (क्लब/अकादमी)',
        'Position (स्थान/रैंक: 1, 2, 3...)',
        'Medal (मेडल: Gold/Silver/Bronze/None)',
        'Timing (समय: उदा. 00:44.82)',
        'Bib Number (बिब संख्या)',
        'Points (अंक: 5/3/1)',
        'Remarks (टिप्पणी)'
      ];

      const sampleRows = [
        [
          '36th UP State Roller Skating Championship 2026',
          '500m+D Sprint Rink Race',
          'Speed Skating (Inline)',
          'Sub-Junior (12 to 15)',
          'Male',
          'Aarav Sharma',
          'UPRSA/2026/LKO/00101',
          'Lucknow',
          'Awadh Roller Sports Club',
          1,
          'Gold',
          '00:44.82',
          '101',
          5,
          'State Champion - Gold Record'
        ],
        [
          '36th UP State Roller Skating Championship 2026',
          '500m+D Sprint Rink Race',
          'Speed Skating (Inline)',
          'Sub-Junior (12 to 15)',
          'Male',
          'Rohan Chaudhary',
          'UPRSA/2026/GZB/00103',
          'Ghaziabad',
          'Ghaziabad Speed Skating Club',
          2,
          'Silver',
          '00:45.10',
          '103',
          3,
          'State Silver Finish'
        ],
        [
          '36th UP State Roller Skating Championship 2026',
          '500m+D Sprint Rink Race',
          'Speed Skating (Inline)',
          'Sub-Junior (12 to 15)',
          'Male',
          'Devansh Mishra',
          'UPRSA/2026/KNP/00108',
          'Kanpur Nagar',
          'Kanpur Roller Skating Academy',
          3,
          'Bronze',
          '00:46.40',
          '108',
          1,
          'Bronze Podium Finish'
        ],
        [
          '36th UP State Roller Skating Championship 2026',
          'Classic Slalom',
          'Inline Freestyle',
          'Cadet (10 to 12)',
          'Female',
          'Ananya Saxena',
          'UPRSA/2026/GBN/00102',
          'Gautam Buddha Nagar (Noida)',
          'Noida Roller Skating Academy',
          1,
          'Gold',
          '00:38.15',
          '204',
          5,
          'Gold - Freestyle Cadet'
        ],
        [
          '36th UP State Roller Skating Championship 2026',
          '1000m Rink Race',
          'Speed Skating (Quad)',
          'Junior (15 to 18)',
          'Female',
          'Priya Verma',
          'UPRSA/2026/VNS/00115',
          'Varanasi',
          'Kashi Roller Sports Club',
          1,
          'Gold',
          '01:32.40',
          '305',
          5,
          'Gold Medalist'
        ],
        [
          '36th UP State Roller Skating Championship 2026',
          '1000m Rink Race',
          'Speed Skating (Quad)',
          'Junior (15 to 18)',
          'Female',
          'Suhani Singh',
          'UPRSA/2026/AGR/00118',
          'Agra',
          'Taj City Skaters Club',
          2,
          'Silver',
          '01:34.12',
          '308',
          3,
          'Silver Medalist'
        ]
      ];

      const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
      ws['!cols'] = [
        { wch: 45 },
        { wch: 28 },
        { wch: 24 },
        { wch: 24 },
        { wch: 14 },
        { wch: 22 },
        { wch: 24 },
        { wch: 20 },
        { wch: 30 },
        { wch: 12 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
        { wch: 10 },
        { wch: 30 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Championship Results');
      XLSX.writeFile(wb, 'UPRSA_Championship_Results_Sample_Template.xlsx');
      showToast('Sample Excel Template (.xlsx) downloaded successfully! Fill and upload.', 'success');
    } catch (err: any) {
      console.error('Download template error:', err);
      showToast('Failed to generate sample Excel file', 'error');
    }
  };

  // Handle Excel File Selection
  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseExcelFile(file);
  };

  // Flexible Excel File Parser
  const parseExcelFile = (file: File) => {
    setExcelFile(file);
    setExcelFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' }) as any[];

        if (!data || data.length === 0) {
          showToast('Uploaded spreadsheet contains no data rows.', 'error');
          return;
        }

        const resolvedRows: Partial<TournamentResult>[] = [];
        const tournamentsSet = new Set<string>();
        let golds = 0;
        let silvers = 0;
        let bronzes = 0;

        const norm = (s: any) => String(s || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, '');

        data.forEach((row, idx) => {
          const keys = Object.keys(row);
          const findVal = (predicates: string[]) => {
            for (const k of keys) {
              const nk = norm(k);
              if (predicates.some(p => nk.includes(norm(p)))) {
                const val = row[k];
                if (val !== undefined && val !== null && String(val).trim() !== '') {
                  return String(val).trim();
                }
              }
            }
            return '';
          };

          // Extract properties flexibly
          const tourName = findVal(['tournament', 'tour', 'pratiyogita', 'टूर्नामेंट', 'प्रतियोगिता']);
          const evName = findVal(['event', 'race', 'spardha', 'daud', 'इवेंट', 'स्पर्धा', 'दौड़']) || 'Championship Race';
          const athleteName = findVal(['skater', 'athlete', 'player', 'kid', 'child', 'name', 'naam', 'student', 'खिलाड़ी', 'बच्चे', 'छात्र', 'नाम']);
          const regNo = findVal(['regno', 'registration', 'uprsa', 'panjikaran', 'पंजीकरण', 'रजिस्ट्रेशन']);
          const dist = findVal(['district', 'dist', 'city', 'zila', 'jila', 'जिला']) || 'Lucknow';
          const clubName = findVal(['club', 'academy', 'team', 'sanstha', 'क्लब', 'अकादमी', 'संस्था']) || 'Affiliated Club';
          const disc = findVal(['discipline', 'sport', 'game', 'khel', 'डिसिप्लिन', 'खेल']) || 'Speed Skating (Inline)';
          const ageCat = findVal(['age', 'category', 'group', 'aayu', 'varg', 'आयु', 'वर्ग']) || 'Sub-Junior (12 to 15)';
          const gndr = findVal(['gender', 'sex', 'ling', 'लिंग']) || 'Male';
          const posStr = findVal(['position', 'pos', 'rank', 'sthan', 'स्थान', 'रैंक']);
          const medalStr = findVal(['medal', 'padak', 'पदक', 'मेडल']);
          const timing = findVal(['time', 'timing', 'duration', 'samay', 'समय', 'टाइम']);
          const bib = findVal(['bib', 'chest', 'चेस्ट', 'बिब']);
          const ptsStr = findVal(['point', 'score', 'ank', 'अंक']);

          // Resolve rank position and medal
          let pos = parseInt(posStr || '0', 10);
          let medal = medalStr;
          const ml = medal.toLowerCase();
          if (ml.includes('gold') || ml.includes('स्वर्ण') || ml.includes('1st') || ml.includes('first')) {
            medal = 'Gold';
            if (!pos) pos = 1;
          } else if (ml.includes('silver') || ml.includes('रजत') || ml.includes('2nd') || ml.includes('second')) {
            medal = 'Silver';
            if (!pos) pos = 2;
          } else if (ml.includes('bronze') || ml.includes('कांस्य') || ml.includes('3rd') || ml.includes('third')) {
            medal = 'Bronze';
            if (!pos) pos = 3;
          } else if (pos === 1 && !medal) {
            medal = 'Gold';
          } else if (pos === 2 && !medal) {
            medal = 'Silver';
          } else if (pos === 3 && !medal) {
            medal = 'Bronze';
          }

          if (medal === 'Gold') golds++;
          else if (medal === 'Silver') silvers++;
          else if (medal === 'Bronze') bronzes++;

          let points = parseInt(ptsStr || '0', 10);
          if (!points) {
            if (medal === 'Gold' || pos === 1) points = 5;
            else if (medal === 'Silver' || pos === 2) points = 3;
            else if (medal === 'Bronze' || pos === 3) points = 1;
            else points = 0;
          }

          if (tourName) tournamentsSet.add(tourName);

          resolvedRows.push({
            tournamentName: tourName,
            eventName: evName,
            skaterName: athleteName || `Athlete ${idx + 1}`,
            skaterRegNo: regNo,
            district: dist,
            club: clubName,
            discipline: disc as any,
            ageCategory: ageCat as any,
            gender: (gndr.toLowerCase().startsWith('f') || gndr.includes('महिला') || gndr.includes('female')) ? 'Female' : 'Male',
            position: pos || 1,
            medal: medal || null,
            timeTaken: timing || '00:45.00',
            bibNumber: bib || '',
            points,
            round: 'Final'
          });
        });

        setExcelRows(resolvedRows);
        setExcelStats({
          total: resolvedRows.length,
          golds,
          silvers,
          bronzes,
          tournamentsDetected: Array.from(tournamentsSet),
          athletesCount: resolvedRows.filter(r => r.skaterName).length
        });
        showToast(`Excel Sheet parsed: ${resolvedRows.length} results detected with ${golds} Golds, ${silvers} Silvers, ${bronzes} Bronzes!`, 'success');
      } catch (err: any) {
        console.error('Excel parse error:', err);
        showToast('Error reading Excel file: ' + (err.message || 'Invalid format'), 'error');
      }
    };

    reader.readAsBinaryString(file);
  };

  // Import Parsed Excel Rows
  const handleImportExcelResults = async () => {
    if (!excelRows || excelRows.length === 0) {
      showToast('Please select a valid Excel file containing result rows.', 'error');
      return;
    }

    setIsUploadingExcel(true);
    try {
      const selectedTour = tournaments.find(t => t.id === selectedDefaultTournamentId) || tournaments[0];
      const res = await api.bulkCreateResults({
        results: excelRows,
        tournamentId: selectedTour?.id,
        tournamentName: selectedTour?.name || selectedTour?.title
      });

      if (res.success) {
        showToast(res.message || `Successfully imported ${excelRows.length} results! Rankings updated.`, 'success');
        setIsExcelModalOpen(false);
        setExcelFile(null);
        setExcelFileName('');
        setExcelRows([]);
        if (excelFileInputRef.current) {
          excelFileInputRef.current.value = '';
        }
        await loadAllData();
        setActiveMainTab('results');
      } else {
        showToast(res.message || 'Failed to import results from Excel', 'error');
      }
    } catch (err: any) {
      console.error('Bulk upload error:', err);
      showToast('Error uploading results: ' + (err.message || 'Server error'), 'error');
    } finally {
      setIsUploadingExcel(false);
    }
  };

  // Open Create Result Modal
  const handleOpenAddResult = () => {
    setEditingResult(null);
    const defTour = tournaments[0];
    setResultForm({
      tournamentId: defTour?.id || 'tour-2026-01',
      tournamentName: defTour?.name || '36th UP State Roller Skating Championship 2026',
      discipline: 'Speed Skating (Inline)',
      ageCategory: 'Sub-Junior (12 to 15)',
      gender: 'Male',
      eventName: '500m+D Sprint Rink Race',
      round: 'Final',
      position: 1,
      medal: 'Gold',
      skaterName: '',
      skaterRegNo: '',
      district: 'Lucknow',
      club: 'Lucknow Roller Skating Academy',
      bibNumber: '',
      timeTaken: '00:44.82',
      points: 5,
      skaterPhotoUrl: '',
      notes: ''
    });
    setIsResultModalOpen(true);
  };

  // Open Edit Result Modal
  const handleOpenEditResult = (resItem: TournamentResult) => {
    setEditingResult(resItem);
    setResultForm({
      id: resItem.id || '',
      tournamentId: resItem.tournamentId || tournaments[0]?.id || '',
      tournamentName: resItem.tournamentName || tournaments[0]?.name || '',
      discipline: resItem.discipline || 'Speed Skating (Inline)',
      ageCategory: resItem.ageCategory || 'Sub-Junior (12 to 15)',
      gender: resItem.gender || 'Male',
      eventName: resItem.eventName || '',
      round: resItem.round || 'Final',
      position: resItem.position ?? 1,
      medal: resItem.medal || 'Gold',
      skaterName: resItem.skaterName || '',
      skaterRegNo: resItem.skaterRegNo || '',
      district: resItem.district || 'Lucknow',
      club: resItem.club || '',
      bibNumber: resItem.bibNumber || '',
      timeTaken: resItem.timeTaken || '',
      points: resItem.points ?? 0,
      skaterPhotoUrl: resItem.skaterPhotoUrl || '',
      notes: resItem.notes || ''
    });
    setIsResultModalOpen(true);
  };

  // Save Result (Create or Update)
  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.skaterName || !resultForm.eventName) {
      showToast('Athlete Name and Event Name are mandatory', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      if (editingResult && editingResult.id) {
        const updateRes = await api.updateResult(editingResult.id, resultForm);
        if (updateRes.success) {
          showToast('Tournament result record updated successfully!', 'success');
          setIsResultModalOpen(false);
          loadAllData();
        } else {
          showToast(updateRes.message || 'Failed to update result', 'error');
        }
      } else {
        const createRes = await api.createResult(resultForm);
        if (createRes.success) {
          showToast('New tournament result added successfully!', 'success');
          setIsResultModalOpen(false);
          loadAllData();
        } else {
          showToast(createRes.message || 'Failed to create result', 'error');
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Network error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Result
  const handleDeleteResult = async (id: string) => {
    setIsProcessing(true);
    try {
      const res = await api.deleteResult(id);
      if (res.success) {
        showToast('Tournament result permanently deleted', 'success');
        setDeleteResultConfirm(null);
        loadAllData();
      } else {
        showToast(res.message || 'Failed to delete result', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting result', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Add Ranking Modal
  const handleOpenAddRanking = (type: 'individual' | 'district' | 'club') => {
    setEditingRanking(null);
    setRankingForm({
      type,
      name: '',
      rank: type === 'individual' ? individualRankings.length + 1 : type === 'district' ? districtRankings.length + 1 : clubRankings.length + 1,
      district: 'Lucknow',
      club: type === 'club' ? '' : 'Unattached',
      discipline: 'Speed Skating (Inline)',
      ageCategory: 'Senior (17 & Above)',
      gender: 'Male',
      registrationNumber: type === 'individual' ? 'UPRSA/2026/' + Math.floor(1000 + Math.random() * 9000) : '',
      goldCount: 1,
      silverCount: 0,
      bronzeCount: 0,
      totalPoints: 5,
      photoUrl: '',
      eventsCount: 1,
      athletesCount: 1
    });
    setIsRankingModalOpen(true);
  };

  // Open Edit Ranking Modal
  const handleOpenEditRanking = (item: any, type: 'individual' | 'district' | 'club') => {
    setEditingRanking({ ...item, type });
    setRankingForm({
      id: item.id || item.skaterId,
      type,
      name: item.skaterName || item.district || item.club || item.name || '',
      rank: item.rank || 1,
      district: item.district || 'Lucknow',
      club: item.club || '',
      discipline: item.discipline || 'Speed Skating (Inline)',
      ageCategory: item.ageCategory || 'Senior (17 & Above)',
      gender: item.gender || 'Male',
      registrationNumber: item.registrationNumber || '',
      goldCount: item.gold !== undefined ? item.gold : (item.goldCount || 0),
      silverCount: item.silver !== undefined ? item.silver : (item.silverCount || 0),
      bronzeCount: item.bronze !== undefined ? item.bronze : (item.bronzeCount || 0),
      totalPoints: item.totalPoints || 0,
      photoUrl: item.photoUrl || item.logoUrl || '',
      eventsCount: item.eventsCount || 1,
      athletesCount: item.athletesCount || 1
    });
    setIsRankingModalOpen(true);
  };

  // Save Ranking (Create or Edit)
  const handleSaveRanking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rankingForm.name) {
      showToast('Name is mandatory', 'error');
      return;
    }

    // Auto-calculate points if not manually set
    const calcPoints = rankingForm.totalPoints || (rankingForm.goldCount * 5 + rankingForm.silverCount * 3 + rankingForm.bronzeCount * 1);
    const payload: Partial<CustomRankingRecord> = {
      ...rankingForm,
      totalPoints: calcPoints,
      gold: rankingForm.goldCount,
      silver: rankingForm.silverCount,
      bronze: rankingForm.bronzeCount
    };

    setIsProcessing(true);
    try {
      if (editingRanking && (editingRanking.id || editingRanking.skaterId)) {
        const targetId = editingRanking.id || editingRanking.skaterId;
        const res = await api.updateRanking(targetId, payload);
        if (res.success) {
          showToast('Ranking entry updated successfully!', 'success');
          setIsRankingModalOpen(false);
          loadAllData();
        } else {
          showToast(res.message || 'Failed to update ranking', 'error');
        }
      } else {
        const res = await api.createRanking(payload);
        if (res.success) {
          showToast('New ranking record created successfully!', 'success');
          setIsRankingModalOpen(false);
          loadAllData();
        } else {
          showToast(res.message || 'Failed to create ranking', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving ranking', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Ranking
  const handleDeleteRanking = async (item: any) => {
    const targetId = item.id || item.skaterId;
    setIsProcessing(true);
    try {
      const res = await api.deleteRanking(targetId);
      if (res.success) {
        showToast('Ranking record removed', 'success');
        setDeleteRankingConfirm(null);
        loadAllData();
      } else {
        showToast(res.message || 'Failed to delete ranking', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting ranking', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Recompute rankings
  const handleRecompute = async (resetOverrides = false) => {
    if (resetOverrides && !window.confirm('Are you sure you want to reset all manual overrides and recalculate strictly from verified results?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const res = await api.recomputeRankings(resetOverrides);
      if (res.success) {
        showToast('Rankings recalculated from verified results using 5-3-1 points rule!', 'success');
        loadAllData();
      } else {
        showToast(res.message || 'Failed to recompute rankings', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error recomputing rankings', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered Results
  const filteredResults = results.filter(r => {
    const matchesSearch = 
      (r.skaterName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.eventName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.club || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.skaterRegNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.bibNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTour = filterTournament === 'ALL' || r.tournamentId === filterTournament;
    const matchesDisc = filterDiscipline === 'ALL' || r.discipline === filterDiscipline;
    const matchesMedal = filterMedal === 'ALL' || r.medal === filterMedal;

    return matchesSearch && matchesTour && matchesDisc && matchesMedal;
  });

  // Filtered Rankings
  const filteredIndividualRankings = individualRankings.filter(r => {
    const matchesSearch = 
      (r.skaterName || '').toLowerCase().includes(rankingSearch.toLowerCase()) ||
      (r.district || '').toLowerCase().includes(rankingSearch.toLowerCase()) ||
      (r.club || '').toLowerCase().includes(rankingSearch.toLowerCase()) ||
      (r.registrationNumber || '').toLowerCase().includes(rankingSearch.toLowerCase());
    const matchesDist = rankingDistrictFilter === 'ALL' || r.district === rankingDistrictFilter;
    return matchesSearch && matchesDist;
  });

  const filteredDistrictRankings = districtRankings.filter(r => {
    return (r.district || '').toLowerCase().includes(rankingSearch.toLowerCase()) ||
           (r.mandal || '').toLowerCase().includes(rankingSearch.toLowerCase());
  });

  const filteredClubRankings = clubRankings.filter(r => {
    const matchesSearch = 
      (r.club || '').toLowerCase().includes(rankingSearch.toLowerCase()) ||
      (r.district || '').toLowerCase().includes(rankingSearch.toLowerCase());
    const matchesDist = rankingDistrictFilter === 'ALL' || r.district === rankingDistrictFilter;
    return matchesSearch && matchesDist;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold border flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-red-950 border-red-500 text-red-300'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              STATE COMPETITIVE DATA HUB
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Results & Rankings Control Center
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Full administrative authority to Create, Edit, Delete tournament race results and state standing rankings. Official 5-3-1 points calculation matrix with comprehensive JPG/JPEG photo uploads.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenExcelModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            title="Upload tournament results sheet from Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Upload Excel Results (एक्सेल से रिजल्ट अपलोड)</span>
          </button>

          <button
            onClick={handleDownloadSampleTemplate}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            title="Download blank sample Excel template with official columns"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample Excel</span>
          </button>

          <button
            onClick={() => handleRecompute(false)}
            disabled={isProcessing}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-amber-500/30 transition-all shadow-sm"
            title="Recalculate 5-3-1 points from official results"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Recalculate Points</span>
          </button>

          {activeMainTab === 'results' ? (
            <button
              onClick={handleOpenAddResult}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Tournament Result</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenAddRanking(rankingCategory)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add {rankingCategory === 'individual' ? 'Athlete' : rankingCategory === 'district' ? 'District' : 'Club'} Rank</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('results')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeMainTab === 'results'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tournament Results ({results.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('rankings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeMainTab === 'rankings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Medal className="w-4 h-4" />
            <span>State Rankings & Standings</span>
          </button>
        </div>

        {/* Recompute with reset button */}
        {activeMainTab === 'rankings' && (
          <button
            onClick={() => handleRecompute(true)}
            className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg"
            title="Purge manual overrides and sync purely from verified results"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Overrides</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TOURNAMENT RESULTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeMainTab === 'results' && (
        <div className="space-y-4">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Total Results</span>
                <span className="text-xl font-black text-white font-mono">{results.length}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Trophy className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-semibold block">Gold Medals (5 Pts)</span>
                <span className="text-xl font-black text-amber-300 font-mono">
                  {results.filter(r => r.medal === 'Gold' || r.position === 1).length}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                🥇
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-300 font-semibold block">Silver Medals (3 Pts)</span>
                <span className="text-xl font-black text-slate-200 font-mono">
                  {results.filter(r => r.medal === 'Silver' || r.position === 2).length}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-700/30 border border-slate-600/30 flex items-center justify-center text-slate-300">
                🥈
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-600 font-semibold block">Bronze Medals (1 Pt)</span>
                <span className="text-xl font-black text-amber-500 font-mono">
                  {results.filter(r => r.medal === 'Bronze' || r.position === 3).length}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-700/20 border border-amber-700/30 flex items-center justify-center text-amber-600">
                🥉
              </div>
            </div>
          </div>

          {/* Excel Quick Upload Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-white">Excel Results Bulk Import (एक्सेल से रिजल्ट अपलोड)</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">Fast & Automated</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  टूर्नामेंट का नाम, बच्चों (स्केटर्स) के नाम, स्पर्धा, मेडल और टाइमिंग एक्सेल शीट से लोड करें — स्टेट रैंकिंग और फिल्टर स्वतः तैयार हो जाएंगे।
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDownloadSampleTemplate}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>नमूना एक्सेल डाउनलोड</span>
              </button>
              <button
                onClick={handleOpenExcelModal}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>एक्सेल अपलोड करें</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by athlete name, bib, reg number, district or event..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterTournament}
                onChange={(e) => setFilterTournament(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none"
              >
                <option value="ALL">All Tournaments</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                value={filterDiscipline}
                onChange={(e) => setFilterDiscipline(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none"
              >
                <option value="ALL">All Disciplines</option>
                <option value="Speed Skating (Inline)">Speed Skating (Inline)</option>
                <option value="Speed Skating (Quad)">Speed Skating (Quad)</option>
                <option value="Inline Freestyle">Inline Freestyle</option>
                <option value="Artistic Skating">Artistic Skating</option>
                <option value="Roller Hockey">Roller Hockey</option>
                <option value="Inline Hockey">Inline Hockey</option>
                <option value="Skateboarding">Skateboarding</option>
              </select>

              <select
                value={filterMedal}
                onChange={(e) => setFilterMedal(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none"
              >
                <option value="ALL">All Medals</option>
                <option value="Gold">Gold Medalist</option>
                <option value="Silver">Silver Medalist</option>
                <option value="Bronze">Bronze Medalist</option>
                <option value="None">Participant / Other</option>
              </select>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Pos / Medal</th>
                    <th className="py-3.5 px-4">Skater / Photo</th>
                    <th className="py-3.5 px-4">Event & Category</th>
                    <th className="py-3.5 px-4">District & Club</th>
                    <th className="py-3.5 px-4">Bib / Time</th>
                    <th className="py-3.5 px-4">Points</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        Loading tournament results...
                      </td>
                    </tr>
                  ) : filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                        <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="font-semibold text-slate-400">No tournament results match current criteria.</p>
                        <button
                          onClick={handleOpenAddResult}
                          className="text-xs text-amber-400 underline font-bold"
                        >
                          + Add the first result
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((r) => {
                      const isGold = r.medal === 'Gold' || r.position === 1;
                      const isSilver = r.medal === 'Silver' || r.position === 2;
                      const isBronze = r.medal === 'Bronze' || r.position === 3;

                      return (
                        <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                isGold ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono' :
                                isSilver ? 'bg-slate-300 text-slate-950 font-mono' :
                                isBronze ? 'bg-amber-700 text-white font-mono' :
                                'bg-slate-800 text-slate-400 font-mono'
                              }`}>
                                {r.position || '-'}
                              </span>
                              {isGold && <span className="text-[10px] font-bold text-amber-400 uppercase">Gold</span>}
                              {isSilver && <span className="text-[10px] font-bold text-slate-300 uppercase">Silver</span>}
                              {isBronze && <span className="text-[10px] font-bold text-amber-600 uppercase">Bronze</span>}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                                {r.skaterPhotoUrl ? (
                                  <img 
                                    src={r.skaterPhotoUrl} 
                                    alt={r.skaterName} 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                    {r.skaterName.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">{r.skaterName}</div>
                                <div className="text-[10px] font-mono text-slate-400">{r.skaterRegNo || 'Reg: Pending'}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{r.eventName}</div>
                            <div className="text-[10px] text-slate-400">{r.discipline} • {r.ageCategory} ({r.gender})</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-semibold text-slate-300">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>{r.district}</span>
                            </div>
                            {r.club && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={r.club}>
                                {r.club}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 font-mono">
                            {r.bibNumber && (
                              <div className="text-amber-300 font-bold">Bib #{r.bibNumber}</div>
                            )}
                            <div className="text-slate-400 text-[11px]">{r.timeTaken || '-'}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20">
                              +{r.points || (isGold ? 5 : isSilver ? 3 : isBronze ? 1 : 0)} Pts
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditResult(r)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors border border-slate-700"
                                title="Edit result & photo"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDeleteResultConfirm(r)}
                                className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-red-400 rounded-lg transition-colors border border-slate-700"
                                title="Delete result"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: STATE RANKINGS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeMainTab === 'rankings' && (
        <div className="space-y-4">
          {/* Sub-category selector */}
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRankingCategory('individual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rankingCategory === 'individual'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Individual Skater Rankings ({individualRankings.length})</span>
              </button>

              <button
                onClick={() => setRankingCategory('district')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rankingCategory === 'district'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>District Medal Standings ({districtRankings.length})</span>
              </button>

              <button
                onClick={() => setRankingCategory('club')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rankingCategory === 'club'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Club & Academy Standings ({clubRankings.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pr-2">
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                Formula: Gold=5, Silver=3, Bronze=1
              </span>
            </div>
          </div>

          {/* Search bar for rankings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rankingSearch}
                onChange={(e) => setRankingSearch(e.target.value)}
                placeholder={`Search ${rankingCategory === 'individual' ? 'athlete name, reg number, district...' : rankingCategory === 'district' ? 'district name, mandal...' : 'club name, district...'}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {rankingCategory !== 'district' && (
              <select
                value={rankingDistrictFilter}
                onChange={(e) => setRankingDistrictFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 outline-none w-full sm:w-auto"
              >
                <option value="ALL">All Districts</option>
                {districts.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Rankings Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3.5 px-4">State Rank</th>
                    <th className="py-3.5 px-4">{rankingCategory === 'individual' ? 'Athlete / Photo' : rankingCategory === 'district' ? 'District Association' : 'Affiliated Club'}</th>
                    <th className="py-3.5 px-4">Category / Jurisdiction</th>
                    <th className="py-3.5 px-4 text-center">🥇 Gold</th>
                    <th className="py-3.5 px-4 text-center">🥈 Silver</th>
                    <th className="py-3.5 px-4 text-center">🥉 Bronze</th>
                    <th className="py-3.5 px-4 text-center font-bold text-white">Total Points</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {/* Category: Individual */}
                  {rankingCategory === 'individual' && filteredIndividualRankings.map((item, idx) => (
                    <tr key={item.id || item.skaterId || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                            item.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' :
                            item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                            item.rank === 3 ? 'bg-amber-700 text-white' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            #{item.rank || idx + 1}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold">
                              CUSTOM
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                            {item.photoUrl ? (
                              <img 
                                src={item.photoUrl} 
                                alt={item.skaterName} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                {item.skaterName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{item.skaterName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{item.registrationNumber}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{item.district}</div>
                        <div className="text-[10px] text-slate-400">{item.discipline} • {item.ageCategory}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                        {item.gold || item.goldCount || 0}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                        {item.silver || item.silverCount || 0}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600">
                        {item.bronze || item.bronzeCount || 0}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-black font-mono text-white bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30 text-amber-300">
                          {item.totalPoints} PTS
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditRanking(item, 'individual')}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors border border-slate-700"
                            title="Edit ranking entry or photo"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {item.isCustom && (
                            <button
                              onClick={() => setDeleteRankingConfirm(item)}
                              className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition-colors border border-slate-700"
                              title="Delete custom ranking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Category: District */}
                  {rankingCategory === 'district' && filteredDistrictRankings.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                            item.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md font-mono' :
                            item.rank === 2 ? 'bg-slate-300 text-slate-950 font-mono' :
                            item.rank === 3 ? 'bg-amber-700 text-white font-mono' :
                            'bg-slate-800 text-slate-300 font-mono'
                          }`}>
                            #{item.rank || idx + 1}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold">
                              CUSTOM
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                            {item.logoUrl ? (
                              <img src={item.logoUrl} alt={item.district} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-amber-400 font-black text-xs">
                                UP
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{item.district}</div>
                            <div className="text-[10px] text-slate-400">Zone / Mandal: {item.mandal || 'Uttar Pradesh'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-semibold">{item.athletesCount || 5} Registered Athletes</span>
                        <div className="text-[10px] text-slate-400">{item.eventsCount || 1} Participated Events</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">{item.gold || item.goldCount || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">{item.silver || item.silverCount || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600">{item.bronze || item.bronzeCount || 0}</td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-black font-mono text-white bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30 text-amber-300">
                          {item.totalPoints} PTS
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditRanking(item, 'district')}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors border border-slate-700"
                            title="Edit district standing"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Category: Club */}
                  {rankingCategory === 'club' && filteredClubRankings.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                            item.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md font-mono' :
                            item.rank === 2 ? 'bg-slate-300 text-slate-950 font-mono' :
                            item.rank === 3 ? 'bg-amber-700 text-white font-mono' :
                            'bg-slate-800 text-slate-300 font-mono'
                          }`}>
                            #{item.rank || idx + 1}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold">
                              CUSTOM
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                            {item.logoUrl ? (
                              <img src={item.logoUrl} alt={item.club} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                                ⛸️
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{item.club}</div>
                            <div className="text-[10px] text-slate-400">{item.district} District</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-semibold">{item.athletesCount || 4} Skaters</span>
                        <div className="text-[10px] text-slate-400">{item.eventsCount || 1} Participated Events</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">{item.gold || item.goldCount || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">{item.silver || item.silverCount || 0}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600">{item.bronze || item.bronzeCount || 0}</td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-black font-mono text-white bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30 text-amber-300">
                          {item.totalPoints} PTS
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditRanking(item, 'club')}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors border border-slate-700"
                            title="Edit club standing"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT RESULT */}
      {/* ========================================================================= */}
      {isResultModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingResult ? 'Edit Tournament Result' : 'Add Tournament Result'}
                  </h3>
                  <span className="text-[11px] text-slate-400">Official State Championship Result Entry</span>
                </div>
              </div>
              <button
                onClick={() => setIsResultModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Championship Selection */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Championship / Tournament *</label>
                <select
                  value={resultForm.tournamentId}
                  onChange={(e) => {
                    const sel = tournaments.find(t => t.id === e.target.value);
                    setResultForm(prev => ({
                      ...prev,
                      tournamentId: e.target.value,
                      tournamentName: sel?.name || prev.tournamentName
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                  required
                >
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Event Name & Round */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={resultForm.eventName || ''}
                    onChange={(e) => setResultForm({ ...resultForm, eventName: e.target.value })}
                    placeholder="e.g. 500m+D Sprint Rink Race"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Round</label>
                  <select
                    value={resultForm.round || 'Final'}
                    onChange={(e) => setResultForm({ ...resultForm, round: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Final">Final Round (Medal Race)</option>
                    <option value="Semi-Final">Semi-Final</option>
                    <option value="Quarter-Final">Quarter-Final</option>
                    <option value="Heats">Preliminary Heats</option>
                  </select>
                </div>
              </div>

              {/* Discipline, Age Category, Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Discipline</label>
                  <select
                    value={resultForm.discipline || 'Speed Skating (Inline)'}
                    onChange={(e) => setResultForm({ ...resultForm, discipline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Speed Skating (Inline)">Speed Skating (Inline)</option>
                    <option value="Speed Skating (Quad)">Speed Skating (Quad)</option>
                    <option value="Inline Freestyle">Inline Freestyle</option>
                    <option value="Artistic Skating">Artistic Skating</option>
                    <option value="Roller Hockey">Roller Hockey</option>
                    <option value="Inline Hockey">Inline Hockey</option>
                    <option value="Skateboarding">Skateboarding</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Age Category</label>
                  <select
                    value={resultForm.ageCategory || 'Sub-Junior (12 to 15)'}
                    onChange={(e) => setResultForm({ ...resultForm, ageCategory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Under 5 (Sub-Cadet)">Under 5 (Sub-Cadet)</option>
                    <option value="5 to 7 (Cadet)">5 to 7 (Cadet)</option>
                    <option value="7 to 9 (Cadet)">7 to 9 (Cadet)</option>
                    <option value="9 to 11 (Sub-Junior)">9 to 11 (Sub-Junior)</option>
                    <option value="Sub-Junior (12 to 15)">Sub-Junior (12 to 15)</option>
                    <option value="Junior (15 to 17)">Junior (15 to 17)</option>
                    <option value="Senior (17 & Above)">Senior (17 & Above)</option>
                    <option value="Masters (30 & Above)">Masters (30 & Above)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Gender</label>
                  <select
                    value={resultForm.gender || 'Male'}
                    onChange={(e) => setResultForm({ ...resultForm, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>

              {/* Athlete Details */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white uppercase text-[11px]">Skater Athlete Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Athlete Full Name *</label>
                    <input
                      type="text"
                      required
                      value={resultForm.skaterName || ''}
                      onChange={(e) => setResultForm({ ...resultForm, skaterName: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={resultForm.skaterRegNo || ''}
                      onChange={(e) => setResultForm({ ...resultForm, skaterRegNo: e.target.value })}
                      placeholder="UPRSA/2026/0101"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">District *</label>
                    <select
                      value={resultForm.district || 'Lucknow'}
                      onChange={(e) => setResultForm({ ...resultForm, district: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                    >
                      {districts.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Club / Academy</label>
                    <input
                      type="text"
                      value={resultForm.club || ''}
                      onChange={(e) => setResultForm({ ...resultForm, club: e.target.value })}
                      placeholder="e.g. Lucknow Roller Club"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Bib Number</label>
                    <input
                      type="text"
                      value={resultForm.bibNumber || ''}
                      onChange={(e) => setResultForm({ ...resultForm, bibNumber: e.target.value })}
                      placeholder="e.g. LKO-101"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Athlete Photo Upload - with explicit JPG/JPEG option */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-300">Athlete Podium / Profile Photo</label>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      JPG / JPEG Supported • Max 8MB
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {resultForm.skaterPhotoUrl ? (
                        <img 
                          src={resultForm.skaterPhotoUrl} 
                          alt="Athlete Preview" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Camera className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={resultForm.skaterPhotoUrl || ''}
                        onChange={(e) => setResultForm({ ...resultForm, skaterPhotoUrl: e.target.value })}
                        placeholder="https://... or upload JPG below"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => resultPhotoInputRef.current?.click()}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload JPG</span>
                      </button>

                      {/* Hidden File Input for JPG/JPEG photo upload */}
                      <input
                        ref={resultPhotoInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'result')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Position, Medal & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Medal Standing</label>
                  <select
                    value={resultForm.medal || 'Gold'}
                    onChange={(e) => handleMedalChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none font-bold"
                  >
                    <option value="Gold">🥇 Gold (1st)</option>
                    <option value="Silver">🥈 Silver (2nd)</option>
                    <option value="Bronze">🥉 Bronze (3rd)</option>
                    <option value="None">None / Participant</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Finish Position</label>
                  <input
                    type="number"
                    min="1"
                    value={resultForm.position || 1}
                    onChange={(e) => setResultForm({ ...resultForm, position: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Race Timing</label>
                  <input
                    type="text"
                    value={resultForm.timeTaken || ''}
                    onChange={(e) => setResultForm({ ...resultForm, timeTaken: e.target.value })}
                    placeholder="00:44.82"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Points (5-3-1)</label>
                  <input
                    type="number"
                    value={resultForm.points || 0}
                    onChange={(e) => setResultForm({ ...resultForm, points: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-mono font-black focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official Referee Notes & Remarks</label>
                <textarea
                  rows={2}
                  value={resultForm.notes || ''}
                  onChange={(e) => setResultForm({ ...resultForm, notes: e.target.value })}
                  placeholder="Record broken, photofinish verified, or technical official remarks..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 bg-slate-800 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingResult ? 'Update Result Record' : 'Save & Publish Result'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT RANKING */}
      {/* ========================================================================= */}
      {isRankingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Medal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingRanking ? 'Edit Ranking Record' : `Add Custom ${rankingForm.type.toUpperCase()} Ranking`}
                  </h3>
                  <span className="text-[11px] text-slate-400">State Federation Ranking Standings</span>
                </div>
              </div>
              <button
                onClick={() => setIsRankingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRanking} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Ranking Category</label>
                  <select
                    value={rankingForm.type}
                    onChange={(e) => setRankingForm({ ...rankingForm, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none font-bold"
                  >
                    <option value="individual">Individual Athlete</option>
                    <option value="district">District Unit</option>
                    <option value="club">Club / Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">State Rank Position *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={rankingForm.rank ?? 1}
                    onChange={(e) => setRankingForm({ ...rankingForm, rank: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {rankingForm.type === 'individual' ? 'Athlete Full Name *' : rankingForm.type === 'district' ? 'District Association Name *' : 'Club / Academy Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={rankingForm.name || ''}
                  onChange={(e) => setRankingForm({ ...rankingForm, name: e.target.value })}
                  placeholder={rankingForm.type === 'individual' ? 'e.g. Aarav Sharma' : rankingForm.type === 'district' ? 'e.g. Lucknow' : 'e.g. Green Park Club'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 outline-none font-semibold"
                />
              </div>

              {rankingForm.type === 'individual' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={rankingForm.registrationNumber || ''}
                      onChange={(e) => setRankingForm({ ...rankingForm, registrationNumber: e.target.value })}
                      placeholder="UPRSA/2026/XXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Home District</label>
                    <select
                      value={rankingForm.district || 'Lucknow'}
                      onChange={(e) => setRankingForm({ ...rankingForm, district: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                    >
                      {districts.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Photo / Logo Upload with explicit JPG/JPEG Support */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-300">
                    {rankingForm.type === 'individual' ? 'Skater Profile Photo' : 'Emblem / Logo Image'}
                  </label>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    JPG / JPEG Preferred • Max 8MB
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {rankingForm.photoUrl ? (
                      <img src={rankingForm.photoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={rankingForm.photoUrl || ''}
                      onChange={(e) => setRankingForm({ ...rankingForm, photoUrl: e.target.value })}
                      placeholder="Image URL or upload JPG..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => rankingPhotoInputRef.current?.click()}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload JPG</span>
                    </button>

                    <input
                      ref={rankingPhotoInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, 'ranking')}
                    />
                  </div>
                </div>
              </div>

              {/* Medals and Points Matrix */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold text-amber-400 mb-1">🥇 Gold (5 Pts)</label>
                  <input
                    type="number"
                    min="0"
                    value={rankingForm.goldCount ?? 0}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      const pts = g * 5 + (rankingForm.silverCount || 0) * 3 + (rankingForm.bronzeCount || 0) * 1;
                      setRankingForm({ ...rankingForm, goldCount: g, totalPoints: pts });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">🥈 Silver (3 Pts)</label>
                  <input
                    type="number"
                    min="0"
                    value={rankingForm.silverCount ?? 0}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      const pts = (rankingForm.goldCount || 0) * 5 + s * 3 + (rankingForm.bronzeCount || 0) * 1;
                      setRankingForm({ ...rankingForm, silverCount: s, totalPoints: pts });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono font-bold focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-600 mb-1">🥉 Bronze (1 Pt)</label>
                  <input
                    type="number"
                    min="0"
                    value={rankingForm.bronzeCount ?? 0}
                    onChange={(e) => {
                      const b = Number(e.target.value);
                      const pts = (rankingForm.goldCount || 0) * 5 + (rankingForm.silverCount || 0) * 3 + b * 1;
                      setRankingForm({ ...rankingForm, bronzeCount: b, totalPoints: pts });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-600 font-mono font-bold focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Total Points</label>
                  <input
                    type="number"
                    value={rankingForm.totalPoints ?? 0}
                    onChange={(e) => setRankingForm({ ...rankingForm, totalPoints: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-black focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRankingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 bg-slate-800 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingRanking ? 'Save Ranking Changes' : 'Confirm & Add Rank'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE RESULT CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteResultConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Tournament Result</h3>
                <span className="text-[11px] text-slate-400">Irreversible Competitive Audit Action</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete the result record for athlete <strong>{deleteResultConfirm.skaterName}</strong> in <strong>{deleteResultConfirm.eventName}</strong>?
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <div>Medal: {deleteResultConfirm.medal || 'Participant'}</div>
              <div>District: {deleteResultConfirm.district}</div>
              <div>Bib: #{deleteResultConfirm.bibNumber || 'N/A'}</div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteResultConfirm(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteResult(deleteResultConfirm.id)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE RANKING CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteRankingConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Ranking Record</h3>
                <span className="text-[11px] text-slate-400">Custom Standing Override</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to remove the custom ranking record for <strong>{deleteRankingConfirm.skaterName || deleteRankingConfirm.name || deleteRankingConfirm.district || deleteRankingConfirm.club}</strong>?
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteRankingConfirm(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRanking(deleteRankingConfirm)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Ranking</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EXCEL RESULTS BULK UPLOAD MODAL */}
      {/* ========================================================================= */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      EXCEL BULK IMPORTER
                    </span>
                    <span className="text-slate-400 text-xs font-mono">• .xlsx / .xls / .csv</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    Upload Results from Excel (एक्सेल से रिजल्ट अपलोड करें)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    टूर्नामेंट का नाम, बच्चों का नाम, इवेंट, मेडल व समय एक्सेल शीट से लोड करके रिजल्ट बनाएं और रैंकिंग फिल्टर स्वतः तैयार करें।
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsExcelModalOpen(false);
                  setExcelRows([]);
                  setExcelFile(null);
                  setExcelFileName('');
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Actions & Defaults Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default Tournament Selector */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Default Tournament (डिफ़ॉल्ट टूर्नामेंट)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    यदि एक्सेल में टूर्नामेंट का नाम खाली हो, तो सभी रिकॉर्ड इस टूर्नामेंट में शामिल होंगे:
                  </p>
                  <select
                    value={selectedDefaultTournamentId}
                    onChange={(e) => setSelectedDefaultTournamentId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>{t.name || t.title}</option>
                    ))}
                  </select>
                </div>

                {/* Sample Template Download Card */}
                <div className="bg-slate-950 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Ready-Made Sample Excel (नमूना एक्सेल फ़ाइल)</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      कॉलम हेडर (टूर्नामेंट, बच्चे का नाम, इवेंट, मेडल, समय, अंक) के साथ पहले से तैयार एक्सेल फ़ाइल डाउनलोड करें।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadSampleTemplate}
                    className="w-full py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .XLSX Sample Template (नमूना डाउनलोड करें)</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div 
                onClick={() => excelFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  excelFile 
                    ? 'border-emerald-500 bg-emerald-950/20' 
                    : 'border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 hover:bg-slate-950'
                }`}
              >
                <input
                  ref={excelFileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelFileChange}
                  className="hidden"
                />
                
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                  <FileUp className="w-7 h-7" />
                </div>

                {excelFile ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-emerald-400 font-bold text-sm">{excelFileName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        {(excelFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      फ़ाइल सफलतापूर्वक पढ़ी गई। नीचे परिणाम एवं रैंकिंग पूर्वावलोकन देखें। (Click to choose another file)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">
                      Click to Select or Drag & Drop Excel File here (एक्सेल फ़ाइल चुनें)
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports <strong>.xlsx</strong>, <strong>.xls</strong>, and <strong>.csv</strong> spreadsheets
                    </p>
                  </div>
                )}
              </div>

              {/* Parsed Stats & Summary */}
              {excelRows.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-black uppercase text-slate-200 tracking-wider">
                        Parsed Sheet Summary ({excelStats.total} Records Found)
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-bold">
                      Points Matrix: Gold = 5 pts | Silver = 3 pts | Bronze = 1 pt
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 font-bold block">Total Races/Kids</span>
                      <span className="text-lg font-black text-white font-mono">{excelStats.total}</span>
                    </div>
                    <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-amber-400 font-bold block">🥇 Gold Medals</span>
                      <span className="text-lg font-black text-amber-300 font-mono">{excelStats.golds}</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-600/30 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-300 font-bold block">🥈 Silver Medals</span>
                      <span className="text-lg font-black text-slate-200 font-mono">{excelStats.silvers}</span>
                    </div>
                    <div className="bg-slate-950 border border-amber-700/30 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-amber-600 font-bold block">🥉 Bronze Medals</span>
                      <span className="text-lg font-black text-amber-500 font-mono">{excelStats.bronzes}</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 font-bold block">Tournaments</span>
                      <span className="text-sm font-black text-emerald-400 font-mono truncate block" title={excelStats.tournamentsDetected.join(', ')}>
                        {excelStats.tournamentsDetected.length > 0 ? `${excelStats.tournamentsDetected.length} Found` : 'Default'}
                      </span>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-slate-300">Data Preview (Showing First {Math.min(50, excelRows.length)} of {excelRows.length} rows):</span>
                      <span>Columns auto-mapped from sheet headers</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 font-mono">
                          <tr>
                            <th className="p-2.5">#</th>
                            <th className="p-2.5">Tournament</th>
                            <th className="p-2.5">Event</th>
                            <th className="p-2.5">Athlete / Kid Name</th>
                            <th className="p-2.5">Reg No</th>
                            <th className="p-2.5">District</th>
                            <th className="p-2.5">Club</th>
                            <th className="p-2.5">Pos / Medal</th>
                            <th className="p-2.5">Time</th>
                            <th className="p-2.5">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                          {excelRows.slice(0, 50).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/50">
                              <td className="p-2.5 text-slate-500">{idx + 1}</td>
                              <td className="p-2.5 max-w-[140px] truncate font-sans text-white font-medium" title={row.tournamentName}>
                                {row.tournamentName || 'Default'}
                              </td>
                              <td className="p-2.5 max-w-[130px] truncate font-sans" title={row.eventName}>
                                {row.eventName}
                              </td>
                              <td className="p-2.5 font-sans font-bold text-amber-300">
                                {row.skaterName}
                              </td>
                              <td className="p-2.5 text-slate-400">{row.skaterRegNo || 'Auto'}</td>
                              <td className="p-2.5 font-sans">{row.district}</td>
                              <td className="p-2.5 font-sans max-w-[120px] truncate text-slate-400" title={row.club}>
                                {row.club || '—'}
                              </td>
                              <td className="p-2.5">
                                {row.medal === 'Gold' ? (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px]">🥇 Gold</span>
                                ) : row.medal === 'Silver' ? (
                                  <span className="px-2 py-0.5 rounded-md bg-slate-600/30 text-slate-200 font-bold text-[10px]">🥈 Silver</span>
                                ) : row.medal === 'Bronze' ? (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-700/20 text-amber-600 font-bold text-[10px]">🥉 Bronze</span>
                                ) : (
                                  <span className="text-slate-500">Pos {row.position}</span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-300">{row.timeTaken || '—'}</td>
                              <td className="p-2.5 font-black text-amber-400">{row.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Automatic Rankings Notice */}
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      परिणाम सबमिट करते ही UPRSA राज्य रैंकिंग (एथलीट, जिला व क्लब स्टैंडिंग्स) 5-3-1 पॉइंट प्रणाली के तहत स्वतः अपडेट हो जाएंगी।
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {excelRows.length > 0 ? (
                  <span>Ready to import <strong className="text-white">{excelRows.length}</strong> result records into official records.</span>
                ) : (
                  <span>Please select or upload a valid spreadsheet file to continue.</span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsExcelModalOpen(false);
                    setExcelRows([]);
                    setExcelFile(null);
                    setExcelFileName('');
                  }}
                  className="px-4 py-2.5 rounded-xl text-slate-400 bg-slate-800 hover:bg-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={excelRows.length === 0 || isUploadingExcel}
                  onClick={handleImportExcelResults}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all ${
                    excelRows.length > 0 && !isUploadingExcel
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isUploadingExcel ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Importing & Computing Rankings...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Import {excelRows.length} Results & Generate Rankings (परिणाम सेव व रैंकिंग तैयार)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
