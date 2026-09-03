import { 
  Skater, 
  Tournament, 
  TournamentRegistration, 
  Race, 
  TournamentResult, 
  SkaterRanking, 
  DistrictRanking, 
  ClubRanking, 
  Certificate, 
  CertificateTemplateSettings, 
  PaymentRecord, 
  PaymentSettings, 
  District, 
  Club, 
  HeroSlide, 
  Announcement, 
  GalleryItem, 
  ChatMessage, 
  User,
  TickerItem,
  SiteSettings,
  LiveSession
} from '../types';

const API_BASE = '/api';

export const api = {
  // Authentication
  async login(credentials: { email?: string; password?: string; registrationNumber?: string }): Promise<{ success: boolean; token?: string; user?: User; skater?: Skater; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async activateAccount(payload: { registrationNumber: string; dateOfBirth: string; password?: string }): Promise<{ success: boolean; message?: string; user?: User; skater?: Skater }> {
    const res = await fetch(`${API_BASE}/auth/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Skaters
  async getSkaters(params?: { district?: string; discipline?: string; ageCategory?: string; status?: string; search?: string }): Promise<{ success: boolean; data: Skater[]; total: number }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/skaters?${query}`);
    return res.json();
  },

  async getSkater(id: string): Promise<{ success: boolean; data?: Skater; message?: string }> {
    const res = await fetch(`${API_BASE}/skaters/${id}`);
    return res.json();
  },

  async registerSkater(skater: Partial<Skater>): Promise<{ success: boolean; data?: Skater; message?: string }> {
    const res = await fetch(`${API_BASE}/skaters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skater)
    });
    return res.json();
  },

  async updateSkater(id: string, updates: Partial<Skater>): Promise<{ success: boolean; data?: Skater; message?: string }> {
    const res = await fetch(`${API_BASE}/skaters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async updateSkaterStatus(id: string, status: string, rejectionReason?: string): Promise<{ success: boolean; data?: Skater; message?: string }> {
    const res = await fetch(`${API_BASE}/skaters/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason })
    });
    return res.json();
  },

  async verifySkater(id: string, status: string, reason?: string): Promise<{ success: boolean; data?: Skater; message?: string }> {
    return this.updateSkaterStatus(id, status, reason);
  },

  async verifySkaterPublic(id: string): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/skaters/verify/${encodeURIComponent(id.trim())}`);
    return res.json();
  },

  async updateDocumentStatus(skaterId: string, docType: string, status: string, remarks?: string): Promise<{ success: boolean; data?: Skater; message?: string }> {
    const res = await fetch(`${API_BASE}/skaters/${encodeURIComponent(skaterId)}/documents/${encodeURIComponent(docType)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks })
    });
    return res.json();
  },

  // Tournaments
  async getTournaments(): Promise<{ success: boolean; data: Tournament[] }> {
    const res = await fetch(`${API_BASE}/tournaments`);
    return res.json();
  },

  async getTournament(id: string): Promise<{ success: boolean; data?: Tournament; message?: string }> {
    const res = await fetch(`${API_BASE}/tournaments/${id}`);
    return res.json();
  },

  async createTournament(tournament: Partial<Tournament>): Promise<{ success: boolean; data?: Tournament; message?: string }> {
    const res = await fetch(`${API_BASE}/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournament)
    });
    return res.json();
  },

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<{ success: boolean; data?: Tournament; message?: string }> {
    const res = await fetch(`${API_BASE}/tournaments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteTournament(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/tournaments/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Tournament Registrations
  async getRegistrations(params?: { tournamentId?: string; skaterId?: string; status?: string }): Promise<{ success: boolean; data: TournamentRegistration[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/registrations?${query}`);
    return res.json();
  },

  async submitRegistration(registration: Partial<TournamentRegistration>): Promise<{ success: boolean; data?: TournamentRegistration; message?: string }> {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration)
    });
    return res.json();
  },

  async updateRegistrationStatus(id: string, status: string, bibNumber?: string, remarks?: string): Promise<{ success: boolean; data?: TournamentRegistration; message?: string }> {
    const res = await fetch(`${API_BASE}/registrations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, bibNumber, remarks })
    });
    return res.json();
  },

  // Races & Live Scoring
  async getRaces(tournamentId?: string): Promise<{ success: boolean; data: Race[] }> {
    const query = tournamentId ? `?tournamentId=${tournamentId}` : '';
    const res = await fetch(`${API_BASE}/races${query}`);
    return res.json();
  },

  async createRace(race: Partial<Race>): Promise<{ success: boolean; data?: Race }> {
    const res = await fetch(`${API_BASE}/races`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(race)
    });
    return res.json();
  },

  async updateRace(id: string, updates: Partial<Race>): Promise<{ success: boolean; data?: Race }> {
    const res = await fetch(`${API_BASE}/races/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteRace(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/races/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getLiveSession(): Promise<{ success: boolean; data?: LiveSession }> {
    const res = await fetch(`${API_BASE}/live-session`);
    return res.json();
  },

  async updateLiveSession(updates: Partial<LiveSession>): Promise<{ success: boolean; data?: LiveSession; message?: string }> {
    const res = await fetch(`${API_BASE}/live-session`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Ticker / Breaking News CMS
  async getTickerItems(): Promise<{ success: boolean; data: TickerItem[] }> {
    const res = await fetch(`${API_BASE}/content/ticker`);
    return res.json();
  },

  async createTickerItem(item: Partial<TickerItem>): Promise<{ success: boolean; data?: TickerItem; message?: string }> {
    const res = await fetch(`${API_BASE}/content/ticker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async updateTickerItem(id: string, updates: Partial<TickerItem>): Promise<{ success: boolean; data?: TickerItem; message?: string }> {
    const res = await fetch(`${API_BASE}/content/ticker/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteTickerItem(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/content/ticker/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Site Settings CMS
  async getSiteSettings(): Promise<{ success: boolean; data: SiteSettings }> {
    const res = await fetch(`${API_BASE}/content/site-settings`);
    return res.json();
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; data?: SiteSettings; message?: string }> {
    const res = await fetch(`${API_BASE}/content/site-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Results & Rankings
  async getResults(params?: { tournamentId?: string; discipline?: string; ageCategory?: string; gender?: string }): Promise<{ success: boolean; data: TournamentResult[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/results?${query}`);
    return res.json();
  },

  async submitResult(result: Partial<TournamentResult>): Promise<{ success: boolean; data?: TournamentResult; message?: string }> {
    const res = await fetch(`${API_BASE}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    return res.json();
  },

  async getRankings(): Promise<{ success: boolean; data: { individualRankings: SkaterRanking[]; districtRankings: DistrictRanking[]; clubRankings: ClubRanking[] } }> {
    const res = await fetch(`${API_BASE}/rankings`);
    return res.json();
  },

  // Certificates
  async getCertificates(params?: { recipientRegNo?: string; type?: string; search?: string }): Promise<{ success: boolean; data: Certificate[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/certificates?${query}`);
    return res.json();
  },

  async verifyCertificate(code: string): Promise<{ success: boolean; data?: Certificate; message?: string; verificationStatus?: string }> {
    const res = await fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(code)}`);
    return res.json();
  },

  async createCertificate(cert: Partial<Certificate>): Promise<{ success: boolean; data?: Certificate; message?: string }> {
    const res = await fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cert)
    });
    return res.json();
  },

  async issueCertificate(cert: Partial<Certificate>): Promise<{ success: boolean; data?: Certificate; message?: string }> {
    return this.createCertificate(cert);
  },

  async getCertificateTemplateSettings(): Promise<{ success: boolean; data: CertificateTemplateSettings }> {
    const res = await fetch(`${API_BASE}/certificates/template-settings`);
    return res.json();
  },

  async updateCertificateTemplateSettings(settings: Partial<CertificateTemplateSettings>): Promise<{ success: boolean; data: CertificateTemplateSettings; message?: string }> {
    const res = await fetch(`${API_BASE}/certificates/template-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Payments
  async getPayments(): Promise<{ success: boolean; data: PaymentRecord[] }> {
    const res = await fetch(`${API_BASE}/payments`);
    return res.json();
  },

  async submitPayment(payment: Partial<PaymentRecord>): Promise<{ success: boolean; data?: PaymentRecord; message?: string }> {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment)
    });
    return res.json();
  },

  async verifyPayment(id: string, status: string, notes?: string): Promise<{ success: boolean; data?: PaymentRecord; message?: string }> {
    const res = await fetch(`${API_BASE}/payments/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  async getPaymentSettings(): Promise<{ success: boolean; data: PaymentSettings }> {
    const res = await fetch(`${API_BASE}/payments/settings`);
    return res.json();
  },

  async updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<{ success: boolean; data: PaymentSettings; message?: string }> {
    const res = await fetch(`${API_BASE}/payments/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Districts & Clubs
  async getDistricts(): Promise<{ success: boolean; data: District[] }> {
    const res = await fetch(`${API_BASE}/districts`);
    return res.json();
  },

  async createDistrict(district: Partial<District>): Promise<{ success: boolean; data?: District; message?: string }> {
    const res = await fetch(`${API_BASE}/districts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(district)
    });
    return res.json();
  },

  async updateDistrict(id: string, updates: Partial<District>): Promise<{ success: boolean; data?: District; message?: string }> {
    const res = await fetch(`${API_BASE}/districts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteDistrict(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/districts/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getClubs(district?: string): Promise<{ success: boolean; data: Club[] }> {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/clubs${q}`);
    return res.json();
  },

  async createClub(club: Partial<Club>): Promise<{ success: boolean; data?: Club; message?: string }> {
    const res = await fetch(`${API_BASE}/clubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(club)
    });
    return res.json();
  },

  async updateClub(id: string, updates: Partial<Club>): Promise<{ success: boolean; data?: Club; message?: string }> {
    const res = await fetch(`${API_BASE}/clubs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteClub(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/clubs/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Website Content CMS
  async getContentAll(): Promise<{ success: boolean; data: { heroSlides: HeroSlide[]; announcements: Announcement[]; gallery: GalleryItem[]; videos?: any[]; committee?: any[] } }> {
    const res = await fetch(`${API_BASE}/content/all`);
    return res.json();
  },

  // Hero Slides
  async getHeroSlides(): Promise<{ success: boolean; data: HeroSlide[] }> {
    const res = await fetch(`${API_BASE}/content/hero-slides`);
    return res.json();
  },

  async createHeroSlide(slide: Partial<HeroSlide>): Promise<{ success: boolean; data?: HeroSlide; message?: string }> {
    const res = await fetch(`${API_BASE}/content/hero-slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide)
    });
    return res.json();
  },

  async updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<{ success: boolean; data?: HeroSlide; message?: string }> {
    const res = await fetch(`${API_BASE}/content/hero-slides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteHeroSlide(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/content/hero-slides/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Announcements & Circulars
  async getAnnouncements(): Promise<{ success: boolean; data: Announcement[] }> {
    const res = await fetch(`${API_BASE}/content/announcements`);
    return res.json();
  },

  async createAnnouncement(announcement: Partial<Announcement>): Promise<{ success: boolean; data?: Announcement; message?: string }> {
    const res = await fetch(`${API_BASE}/content/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement)
    });
    return res.json();
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<{ success: boolean; data?: Announcement; message?: string }> {
    const res = await fetch(`${API_BASE}/content/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/content/announcements/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Photo Gallery
  async getGallery(): Promise<{ success: boolean; data: GalleryItem[] }> {
    const res = await fetch(`${API_BASE}/content/gallery`);
    return res.json();
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<{ success: boolean; data?: GalleryItem; message?: string }> {
    const res = await fetch(`${API_BASE}/content/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<{ success: boolean; data?: GalleryItem; message?: string }> {
    const res = await fetch(`${API_BASE}/content/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/content/gallery/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Videos
  async getVideos(): Promise<{ success: boolean; data: any[] }> {
    const res = await fetch(`${API_BASE}/content/videos`);
    return res.json();
  },

  async createVideo(video: Partial<any>): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/content/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video)
    });
    return res.json();
  },

  async updateVideo(id: string, updates: Partial<any>): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/content/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteVideo(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/content/videos/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Committee / Office Bearers
  async getCommittee(): Promise<{ success: boolean; data: any[] }> {
    const res = await fetch(`${API_BASE}/content/committee`);
    return res.json();
  },

  async createCommitteeMember(member: Partial<any>): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/content/committee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    return res.json();
  },

  async updateCommitteeMember(id: string, updates: Partial<any>): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/content/committee/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteCommitteeMember(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/content/committee/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Contact Messages & Helpdesk
  async getContactMessages(): Promise<{ success: boolean; data: any[] }> {
    const res = await fetch(`${API_BASE}/contact-messages`);
    return res.json();
  },

  async createContactMessage(msg: Partial<any>): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    return res.json();
  },

  async updateContactMessage(id: string, updates: Partial<any>): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/contact-messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteContactMessage(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/contact-messages/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Certificate Revocation & Deletion
  async revokeCertificate(id: string, reason?: string): Promise<{ success: boolean; data?: Certificate; message?: string }> {
    const res = await fetch(`${API_BASE}/certificates/${id}/revoke`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  async deleteCertificate(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/certificates/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(): Promise<{ success: boolean; data: any[] }> {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  // Metrics & Stats
  async getAdminMetrics(): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    return res.json();
  },

  // Chat Board
  async getChatMessages(): Promise<{ success: boolean; data: ChatMessage[] }> {
    const res = await fetch(`${API_BASE}/chat`);
    return res.json();
  },

  async sendChatMessage(msg: { senderName: string; senderRole: string; district?: string; message: string; isAnnouncement?: boolean }): Promise<{ success: boolean; data?: ChatMessage }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    return res.json();
  },

  async deleteChatMessage(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/chat/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // File Upload
  async uploadFile(fileName: string, base64Data: string, isPrivate = false): Promise<{ success: boolean; fileUrl?: string; fileName?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileData: base64Data, isPrivate })
    });
    return res.json();
  },

  // Gemini AI Assistant
  async askAI(message: string): Promise<{ success: boolean; reply: string; source?: string }> {
    const res = await fetch(`${API_BASE}/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return res.json();
  },

  // Database Tools
  async getDbStats(): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/db-tools/stats`);
    return res.json();
  },

  async getAdminStats(): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    return res.json();
  }
};
