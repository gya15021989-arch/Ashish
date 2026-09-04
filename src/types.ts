export type UserRole = 'admin' | 'skater' | 'district_admin' | 'club_admin' | 'scoring_operator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  skaterId?: string;
  district?: string;
  club?: string;
  created_at: string;
}

export type DisciplineType = 
  | 'Speed Skating (Quad)' 
  | 'Speed Skating (Inline)' 
  | 'Inline Freestyle' 
  | 'Roller Freestyle' 
  | 'Artistic Skating' 
  | 'Roller Hockey' 
  | 'Inline Hockey' 
  | 'Skateboarding' 
  | 'Roller Derby' 
  | 'Alpine / Downhill';

export type AgeCategory = 
  | 'Tots (Under 6)' 
  | 'Minis (6 to 8)' 
  | 'Cadet (8 to 10)' 
  | 'Cadet (10 to 12)' 
  | 'Sub-Junior (12 to 15)' 
  | 'Junior (15 to 18)' 
  | 'Senior (Above 18)' 
  | 'Masters (Above 35)'
  | 'Sub-Junior (12 to 14)' 
  | 'Junior (14 to 17)' 
  | 'Senior (Above 17)';

export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RegistrationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_REVIEW'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'under_scrutiny'
  | 'pending'
  | 'verified'
  | 'approved'
  | 'rejected'
  | 'active';

export interface DocumentAttachment {
  id?: string;
  name: string;
  url: string;
  type: 'aadhaar' | 'dob_proof' | 'medical' | 'school_id' | 'other' | 'photo';
  status: 'EMPTY' | 'UPLOADING' | 'UPLOADED' | 'VALIDATING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  remarks?: string;
  fileSize?: string;
  fileType?: string;
}

export interface SkaterDocument {
  id: string;
  name: string;
  type: 'photo' | 'medical' | 'dob_proof' | 'aadhaar' | 'school_id' | 'other';
  url: string;
  is_private: boolean;
  uploaded_at: string;
  status?: string;
  remarks?: string;
  fileSize?: string;
  fileType?: string;
}

export interface Skater {
  id: string;
  applicationNumber?: string;
  registrationNumber: string; // e.g. UPRSA-GBN-2026-00008 or UPRSA/2026/LKO/00142
  loginId?: string;
  licenseNumber?: string;
  approvalDate?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  age?: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  aadhaarNumberMasked: string; // e.g. ****-****-1234
  email: string;
  phone: string;
  emergencyPhone: string;
  address: string;
  district: string;
  mandal?: string;
  club: string;
  coachName: string;
  coachPhone?: string;
  discipline: DisciplineType;
  ageCategory: AgeCategory;
  skateModel?: string;
  wheelSize?: string;
  photoUrl: string;
  medicalCertUrl?: string;
  dobProofUrl?: string;
  aadhaarDocUrl?: string;
  schoolIdDocUrl?: string;
  otherDocUrl?: string;
  documents?: DocumentAttachment[];
  documentsMap?: Record<string, DocumentAttachment>;
  season?: string; // '2026-27'
  status: RegistrationStatus;
  rejectionReason?: string;
  adminRemarks?: string;
  paymentStatus?: 'pending' | 'submitted' | 'verified' | 'rejected';
  annualFeePaid: boolean;
  annualFeePaymentDate?: string;
  annualFeeUtr?: string;
  validUntil: string; // e.g. 2027-12-31
  verifiedAt?: string;
  verifiedBy?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  created_at: string;
  updated_at: string;
}

export type TournamentStatus = 'upcoming' | 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface TournamentEvent {
  id: string;
  tournamentId: string;
  discipline: DisciplineType;
  ageCategory: AgeCategory;
  gender: Gender;
  eventName: string; // e.g. "500m Rink Race", "1000m Rink Race", "One Lap Road", "10000m Elimination"
  distance?: string;
  entryFee: number;
  maxParticipants?: number;
}

export interface Tournament {
  id: string;
  title: string;
  hindiTitle?: string;
  edition: string; // e.g. "36th UP State Roller Skating Championship 2026"
  category?: string; // e.g. "UPRSA STATE CHAMPIONSHIP", "DISTRICT CHAMPIONSHIP", "SELECTION TRIAL"
  description: string;
  venue: string;
  district: string;
  state: string;
  level?: string;
  year?: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: TournamentStatus;
  bannerUrl?: string;
  prospectusUrl?: string;
  rulesPdfUrl?: string;
  organizer: string;
  contactPerson: string;
  contactPhone: string;
  entryFeeBase: number;
  isPublished: boolean;
  events?: TournamentEvent[];
  disciplinesList?: string[];
  ageGroups?: string[];
  resultsPublished?: boolean;
  totalAthletes?: number;
  created_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  skaterId: string;
  skaterName: string;
  skaterRegNo: string;
  district: string;
  club: string;
  ageCategory: AgeCategory;
  gender: Gender;
  discipline: DisciplineType;
  selectedEvents: string[]; // event IDs
  bibNumber?: string;
  totalFee: number;
  paymentStatus: 'pending' | 'submitted' | 'verified' | 'failed';
  paymentUtr?: string;
  paymentReceiptUrl?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'withdrawn';
  remarks?: string;
  registered_at: string;
}

export interface HeatParticipant {
  skaterId: string;
  skaterName: string;
  district: string;
  club?: string;
  bibNumber: string;
  lane: number;
  finishPosition?: number;
  timeTaken?: string;
  status?: 'OK' | 'DNF' | 'DNS' | 'DSQ';
  qualified?: boolean;
  penaltyRemarks?: string;
  laneNumber?: number;
  finishTime?: string;
  currentRank?: number;
  qualificationStatus?: string;
  remarks?: string;
}

export interface LiveAthlete {
  id: string;
  skaterId?: string;
  skaterName: string;
  district: string;
  club?: string;
  bibNumber: string;
  lane: number;
  position?: number;
  time?: string;
  status: 'RACING' | 'FINISHED' | 'DNF' | 'DNS' | 'DQ' | 'READY';
  remarks?: string;
}

export interface LiveSession {
  id: string;
  tournamentId?: string;
  tournamentName: string;
  venue: string;
  date: string;
  discipline: string;
  ageCategory: string;
  gender: string;
  eventName: string;
  roundName: string; // e.g. "Heat 3", "Final", "Semi-Final"
  status: 'LIVE' | 'PAUSED' | 'FINISHED' | 'NOT_STARTED' | 'IDLE';
  timerStartedAt?: number;
  timerBaseElapsed?: number;
  timerRunning?: boolean;
  currentLeader?: string;
  athletes: LiveAthlete[];
  updatedAt: string;
  isTestMode?: boolean;
}

export interface RaceHeat {
  id: string;
  heatId?: string;
  heatName?: string;
  raceId: string;
  heatNumber: number;
  roundName: 'Heats' | 'Quarter-Final' | 'Semi-Final' | 'Final';
  status: 'scheduled' | 'live' | 'finished' | 'upcoming' | 'in_progress' | 'completed';
  participants: HeatParticipant[];
  startedAt?: string;
  finishedAt?: string;
}

export type Heat = RaceHeat;

export interface Race {
  id: string;
  tournamentId: string;
  eventId: string;
  discipline: DisciplineType;
  ageCategory: AgeCategory;
  gender: Gender;
  eventName: string;
  distance?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'live';
  scheduledTime: string;
  heats: RaceHeat[];
}

export interface TournamentResult {
  id: string;
  tournamentId: string;
  tournamentName: string;
  eventId: string;
  eventName: string;
  discipline: DisciplineType;
  ageCategory: AgeCategory;
  gender: Gender;
  position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | number;
  medal?: 'Gold' | 'Silver' | 'Bronze' | null | string;
  points: number; // Gold=5, Silver=3, Bronze=1
  skaterId: string;
  skaterName: string;
  skaterRegNo: string;
  district: string;
  club: string;
  timeRecord?: string;
  timeTaken?: string;
  skaterPhotoUrl?: string; // JPG photo of skater/podium winner
  bibNumber?: string;
  round?: string;
  notes?: string;
  publishedAt: string;
}

export interface SkaterRanking {
  id?: string;
  rank: number;
  skaterId: string;
  skaterName: string;
  registrationNumber?: string;
  skaterRegNo?: string;
  district: string;
  mandal?: string;
  club: string;
  discipline: DisciplineType;
  ageCategory: AgeCategory;
  gender: Gender;
  eventsCount?: number;
  goldCount?: number;
  gold?: number;
  silverCount?: number;
  silver?: number;
  bronzeCount?: number;
  bronze?: number;
  totalMedals?: number;
  totalPoints: number;
  profileUrl?: string;
  photoUrl?: string; // JPG headshot/podium photo
  isCustom?: boolean;
}

export interface DistrictRanking {
  id?: string;
  rank: number;
  district: string;
  mandal?: string;
  athletesCount?: number;
  skaterCount?: number;
  eventsCount?: number;
  goldCount?: number;
  gold?: number;
  silverCount?: number;
  silver?: number;
  bronzeCount?: number;
  bronze?: number;
  totalMedals?: number;
  totalPoints: number;
  logoUrl?: string; // JPG emblem/crest
  photoUrl?: string;
  isCustom?: boolean;
}

export interface ClubRanking {
  id?: string;
  rank: number;
  club: string;
  district: string;
  mandal?: string;
  athletesCount?: number;
  skaterCount?: number;
  eventsCount?: number;
  goldCount?: number;
  gold?: number;
  silverCount?: number;
  silver?: number;
  bronzeCount?: number;
  bronze?: number;
  totalMedals?: number;
  totalPoints: number;
  logoUrl?: string; // JPG club crest
  photoUrl?: string;
  isCustom?: boolean;
}

export interface CustomRankingRecord {
  id: string;
  type: 'individual' | 'district' | 'club';
  rank: number;
  name: string;
  registrationNumber?: string;
  district?: string;
  mandal?: string;
  club?: string;
  discipline?: DisciplineType;
  ageCategory?: AgeCategory;
  gender?: Gender;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  totalMedals?: number;
  totalPoints: number;
  eventsCount?: number;
  athletesCount?: number;
  photoUrl?: string; // JPG photo/logo
  season?: string;
  notes?: string;
  isCustom?: boolean;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. UPRSA/CERT/2026/00482
  verificationCode: string; // secure hash code e.g. 7f89ac3e
  type: 'Merit' | 'Participation' | 'Official' | 'Coach' | 'AnnualRegistration';
  recipientName: string;
  recipientRegNo?: string;
  fatherName?: string;
  district: string;
  club?: string;
  tournamentName?: string;
  eventName?: string;
  discipline?: DisciplineType;
  ageCategory?: AgeCategory;
  gender?: Gender;
  position?: string; // "1st Place (Gold Medal)", "Participation", etc.
  issueDate: string;
  status: 'valid' | 'revoked';
  isRevoked?: boolean;
  qrVerificationUrl: string;
  pdfUrl?: string;
  signatoryPresident: string;
  signatorySecretary: string;
  created_at: string;
}

export interface CertificateTemplateSettings {
  federationName: string;
  stateBodyAffiliation: string;
  presidentName: string;
  presidentDesignation: string;
  presidentSignatureUrl: string;
  secretaryName: string;
  secretaryDesignation: string;
  secretarySignatureUrl: string;
  sealImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface PaymentRecord {
  id: string;
  paymentType: 'annual_registration' | 'tournament_entry' | 'club_affiliation';
  skaterId?: string;
  skaterName?: string;
  tournamentId?: string;
  tournamentTitle?: string;
  amount: number;
  utrNumber: string;
  payerName: string;
  payerPhone: string;
  payerEmail?: string;
  status: 'pending' | 'verified' | 'rejected';
  paymentDate: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface PaymentSettings {
  upiId: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  qrCodeUrl: string;
  annualFeeAmount: number;
  instructions: string;
}

export interface District {
  id: string;
  name: string;
  hindiName?: string;
  zone: 'Western' | 'Central' | 'Eastern' | 'Southern' | 'Bundelkhand' | 'Rohilkhand' | string;
  president?: string;
  presidentName?: string;
  presidentPhone?: string;
  presidentEmail?: string;
  presidentPhotoUrl?: string;
  secretary?: string;
  secretaryName?: string;
  secretaryPhone?: string;
  secretaryEmail?: string;
  secretaryPhotoUrl?: string;
  treasurer?: string;
  treasurerName?: string;
  treasurerPhone?: string;
  treasurerEmail?: string;
  treasurerPhotoUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  officeAddress?: string;
  stadiumVenue?: string;
  affiliatedYear?: number;
  clubsCount?: number;
  skatersCount?: number;
  logoUrl?: string;
  photoUrl?: string;
  status?: 'Active' | 'Pending' | 'Inactive' | string;
}

export interface Club {
  id: string;
  name: string;
  hindiName?: string;
  affiliationNumber?: string;
  district: string;
  city?: string;
  headCoach?: string;
  contactPerson?: string;
  coachDesignation?: string;
  coachPhotoUrl?: string;
  coachPhone?: string;
  coachEmail?: string;
  contactPhone?: string;
  contactEmail?: string;
  venue?: string;
  officialAddress?: string;
  facility?: string;
  websiteUrl?: string;
  photoUrl?: string;
  logoUrl?: string;
  disciplines?: DisciplineType[] | string[];
  establishedYear?: number;
  skatersCount?: number;
  status?: 'Active' | 'Pending' | 'Inactive' | string;
  isVerified?: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  actionText: string;
  actionLink: string;
  order: number;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  hindiTitle?: string;
  circularNumber?: string;
  date: string;
  category: 'Championship' | 'Circular' | 'Results' | 'General';
  isImportant: boolean;
  linkText?: string;
  linkUrl?: string;
  fileUrl?: string;
  imageUrl?: string; // JPG photo / circular scan banner
  signatory?: string;
  designation?: string;
  urgency?: 'NORMAL' | 'HIGH' | 'CRITICAL';
  content?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Tournaments' | 'Training' | 'Award Ceremony' | 'Speed' | 'Freestyle';
  imageUrl: string;
  date: string;
  tournamentName?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'admin' | 'skater' | 'public' | 'district_official';
  district?: string;
  message: string;
  timestamp: string;
  isAnnouncement?: boolean;
  isModerated?: boolean;
}

export interface VerificationLog {
  id: string;
  certificateId: string;
  certificateNumber: string;
  verifiedAt: string;
  ipAddress?: string;
  userAgent?: string;
  result: 'Valid' | 'Revoked' | 'NotFound';
}

export interface CommitteeMember {
  id: string;
  name: string;
  hindiName?: string;
  designation: string;
  hindiDesignation?: string;
  category: 'Executive Board' | 'Office Bearer' | 'Patron' | 'Technical Official' | 'Disciplinary Committee';
  district?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  bio?: string;
  order: number;
  status: 'Active' | 'Former';
  appointedYear?: number;
}

export interface VideoBroadcast {
  id: string;
  title: string;
  hindiTitle?: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  date: string;
  venue?: string;
  district?: string;
  views?: number;
  featured?: boolean;
  hd?: boolean;
  description?: string;
  broadcaster?: string;
  chapters?: { time: string; title: string }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  district?: string;
  subject: string;
  message: string;
  category?: string; // 'Skater Query' | 'Affiliation' | 'Tournament' | 'Grievance' | 'General'
  priority?: 'normal' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  adminReply?: string;
  repliedAt?: string;
  notes?: string;
  updatedAt?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AdminDashboardStats {
  totalSkaters: number;
  pendingSkaters: number;
  approvedSkaters: number;
  rejectedSkaters: number;
  totalClubs: number;
  totalDistricts: number;
  totalTournaments: number;
  activeTournaments: number;
  totalTournamentEntries: number;
  issuedCertificates: number;
  totalRevenue: number;
  pendingPayments: number;
  publishedNews: number;
  galleryItems: number;
  videoCount: number;
  contactMessagesCount: number;
  unreadMessagesCount: number;
}

export interface TickerItem {
  id: string;
  title: string;
  tag: string; // e.g. 'LIVE', 'RESULTS', 'NOTICE', 'BREAKING'
  link?: string; // target page id: 'live_score' | 'results' | 'tournaments' | 'register' | 'news_gallery'
  isActive: boolean;
  priority?: number;
  created_at?: string;
}

export interface SiteSettings {
  organizationName: string;
  shortName: string;
  tagline: string;
  affiliationNotice: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  officialAddress: string;
  registrationOpen: boolean;
  liveStreamingActive: boolean;
  headerNotice?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  stats: {
    registeredSkaters: number;
    affiliatedDistricts: number;
    stateChampionships: number;
    recognizedClubs: number;
  };
}

export interface AboutInfo {
  establishedText: string;
  title: string;
  tagline: string;
  headOfficeAddress: string;
  phone: string;
  email: string;
  constitutionTitle: string;
  statRegisteredAthletesText?: string;
  statAffiliatedUnitsText?: string;
}

export interface AboutSection {
  id: string;
  title: string;
  badge: string;
  badgeColor?: 'amber' | 'indigo' | 'emerald' | 'blue' | 'purple' | 'rose';
  description: string;
  footerTag: string;
  imageUrl: string;
  order: number;
  status: 'Active' | 'Inactive';
}

export interface AboutPolicy {
  id: string;
  title: string;
  description?: string;
  linkUrl?: string;
  order: number;
}

export interface AboutContent {
  info: AboutInfo;
  sections: AboutSection[];
  policies: AboutPolicy[];
}

export interface DisciplineRules {
  governingBody: string;
  ageCategories: string;
  safetyGear: string;
  scoringFormat: string;
  wheelLimit: string;
}

export interface DisciplineItem {
  id: string;
  number: number;
  name: string;
  hindiName: string;
  recognitionBadge: string;
  imageUrl: string;
  description: string;
  hindiDescription: string;
  equipmentSpecs: string;
  rinkStandard: string;
  events: string[];
  rules: DisciplineRules;
  status?: 'Active' | 'Inactive';
}

