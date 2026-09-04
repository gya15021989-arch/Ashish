import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Search, 
  X, 
  Send, 
  Inbox, 
  Plus, 
  Edit3, 
  Building2, 
  AlertTriangle, 
  Check, 
  Sparkles,
  Save,
  Image as ImageIcon,
  Upload,
  RefreshCw
} from 'lucide-react';
import { ContactMessage, SiteSettings } from '../../types';
import { api } from '../../services/api';
import { UP_DISTRICTS_DATA } from '../../data/uprsaKnowledge';

export const ContactInquiriesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'secretariat_info'>('inquiries');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [replyModalMessage, setReplyModalMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form state for Create/Edit
  const initialFormState: Partial<ContactMessage> = {
    name: '',
    email: '',
    phone: '',
    district: 'Lucknow',
    subject: '',
    message: '',
    category: 'General Inquiry',
    priority: 'normal',
    status: 'new',
    adminReply: '',
    notes: ''
  };
  const [formData, setFormData] = useState<Partial<ContactMessage>>(initialFormState);

  // Official Secretariat Info state
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    contactEmail: 'uprsa.official@gmail.com',
    contactPhone: '+91 522 2439812, +91 94150 21989',
    officialAddress: 'UP Roller Sports Arena, Sector-G, LDA Colony, Kanpur Road, Lucknow, Uttar Pradesh - 226012',
    officeHours: 'Monday - Saturday: 10:00 AM - 06:00 PM (IST)',
    grievanceOfficer: 'Shri Rajesh Kumar Singh (General Secretary)',
    grievanceEmail: 'grievance.uprsa@gmail.com',
    helplinePhone: '+91 94152 77665 (State Helpdesk)'
  });

  useEffect(() => {
    loadMessages();
    loadSiteSettings();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getContactMessages();
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load contact inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSiteSettings = async () => {
    try {
      const res = await api.getSiteSettings();
      if (res.success && res.data) {
        setSiteSettings(res.data);
        setContactSettings({
          contactEmail: res.data.contactEmail || 'uprsa.official@gmail.com',
          contactPhone: res.data.contactPhone || '+91 522 2439812, +91 94150 21989',
          officialAddress: res.data.officialAddress || 'UP Roller Sports Arena, Sector-G, LDA Colony, Kanpur Road, Lucknow, Uttar Pradesh - 226012',
          officeHours: (res.data as any).officeHours || 'Monday - Saturday: 10:00 AM - 06:00 PM (IST)',
          grievanceOfficer: (res.data as any).grievanceOfficer || 'Shri Rajesh Kumar Singh (General Secretary)',
          grievanceEmail: (res.data as any).grievanceEmail || 'grievance.uprsa@gmail.com',
          helplinePhone: (res.data as any).helplinePhone || '+91 94152 77665 (State Helpdesk)'
        });
      }
    } catch (err) {
      console.error('Failed to load site settings for contact info', err);
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.updateSiteSettings({
        contactEmail: contactSettings.contactEmail,
        contactPhone: contactSettings.contactPhone,
        officialAddress: contactSettings.officialAddress,
        ...contactSettings
      } as any);

      if (res.success) {
        showToast('Official Secretariat Contact Information updated successfully!');
      } else {
        showToast('Failed to update contact settings', 'error');
      }
    } catch (err) {
      showToast('Error saving contact settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      ...initialFormState,
      created_at: new Date().toISOString()
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (msg: ContactMessage) => {
    setEditingMessage(msg);
    setFormData({
      ...msg,
      notes: (msg as any).notes || '',
      category: (msg as any).category || 'General Inquiry',
      priority: (msg as any).priority || 'normal'
    });
  };

  // Submit Create or Edit
  const handleSubmitMessageForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.subject?.trim() || !formData.message?.trim()) {
      showToast('Please fill all mandatory fields (Name, Subject, Message)', 'error');
      return;
    }

    try {
      if (editingMessage) {
        // Update existing
        const res = await api.updateContactMessage(editingMessage.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        if (res.success) {
          showToast('Inquiry record updated successfully!');
          setEditingMessage(null);
          loadMessages();
        } else {
          showToast(res.message || 'Failed to update inquiry', 'error');
        }
      } else {
        // Create new
        const res = await api.createContactMessage({
          ...formData,
          created_at: new Date().toISOString()
        });
        if (res.success) {
          showToast('New inquiry recorded successfully!');
          setIsCreateModalOpen(false);
          loadMessages();
        } else {
          showToast(res.message || 'Failed to create inquiry', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while saving inquiry', 'error');
    }
  };

  // Delete message
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry message?')) return;
    try {
      const res = await api.deleteContactMessage(id);
      if (res.success) {
        showToast('Inquiry message deleted');
        loadMessages();
      } else {
        showToast(res.message || 'Failed to delete message', 'error');
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  // Quick Status change
  const handleStatusChange = async (msg: ContactMessage, status: 'new' | 'in_progress' | 'resolved' | 'archived') => {
    try {
      const res = await api.updateContactMessage(msg.id, { status, updatedAt: new Date().toISOString() });
      if (res.success) {
        showToast(`Inquiry marked as ${status.replace('_', ' ')}`);
        loadMessages();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Reply submission
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalMessage || !replyText.trim()) return;

    try {
      const res = await api.updateContactMessage(replyModalMessage.id, {
        status: 'resolved',
        adminReply: replyText.trim(),
        repliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (res.success) {
        showToast('Official reply saved and inquiry marked as resolved');
        loadMessages();
        setReplyModalMessage(null);
        setReplyText('');
      } else {
        showToast(res.message || 'Failed to record reply', 'error');
      }
    } catch (err) {
      showToast('Failed to save reply', 'error');
    }
  };

  // Filters
  const filtered = messages.filter(m => {
    const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
    const matchPriority = selectedPriority === 'ALL' || (m as any).priority === selectedPriority;
    const matchCategory = selectedCategory === 'ALL' || (m as any).category === selectedCategory;
    const matchSearch = 
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.district || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchCategory && matchSearch;
  });

  const unreadCount = messages.filter(m => m.status === 'new').length;
  const inProgressCount = messages.filter(m => m.status === 'in_progress').length;
  const resolvedCount = messages.filter(m => m.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold border animate-in fade-in slide-in-from-bottom-2 ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-red-950 border-red-500 text-red-300'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-xl font-black text-white">Public Inquiries & Contact Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Full control to create, edit, reply, update status, and delete incoming athlete inquiries, and configure official Secretariat contact details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadMessages}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log New Inquiry / Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Inquiries vs Secretariat Contact Info */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'inquiries'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inquiries & Grievances (पूछताछ व शिकायतें)</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              {unreadCount} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('secretariat_info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'secretariat_info'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Official Secretariat Contact Details (मुख्यालय संपर्क विवरण)</span>
        </button>
      </div>

      {/* TAB 1: Inquiries List */}
      {activeTab === 'inquiries' && (
        <div className="space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">{messages.length}</span>
            </div>
            <div className="bg-slate-900/90 border border-cyan-500/30 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">New / Unread</span>
              <span className="text-xl font-black text-cyan-300 font-mono mt-0.5 block">{unreadCount}</span>
            </div>
            <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">In Progress</span>
              <span className="text-xl font-black text-amber-300 font-mono mt-0.5 block">{inProgressCount}</span>
            </div>
            <div className="bg-slate-900/90 border border-emerald-500/30 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Resolved</span>
              <span className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">{resolvedCount}</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search athlete, phone, email, district, subject or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-white placeholder:text-slate-500 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="new">New (Unread)</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>

              {/* Priority filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              {/* Category filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Skater Registration">Skater Registration</option>
                <option value="District / Club Affiliation">District / Club Affiliation</option>
                <option value="Tournament Grievance">Tournament Grievance</option>
                <option value="Certificate Verification">Certificate Verification</option>
              </select>
            </div>
          </div>

          {/* Messages list */}
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Loading inquiries...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No contact inquiries found matching criteria.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl"
              >
                + Create New Inquiry Record
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((msg) => {
                const priority = (msg as any).priority || 'normal';
                const category = (msg as any).category || 'General Inquiry';
                const notes = (msg as any).notes;

                return (
                  <div
                    key={msg.id}
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-4 transition-all ${
                      msg.status === 'new'
                        ? 'border-cyan-500/50 bg-slate-900/95 ring-1 ring-cyan-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-sm shrink-0">
                          {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">{msg.name}</h4>
                            {priority === 'urgent' && (
                              <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                URGENT
                              </span>
                            )}
                            {priority === 'high' && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black px-2 py-0.5 rounded-full">
                                HIGH
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            {msg.email && <span className="font-mono text-cyan-400">{msg.email}</span>}
                            {msg.phone && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-300">{msg.phone}</span>
                              </>
                            )}
                            {msg.district && (
                              <>
                                <span>•</span>
                                <span className="text-slate-300 font-medium">{msg.district}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        {/* Category badge */}
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                          {category}
                        </span>

                        {/* Status pill */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                          msg.status === 'new' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          msg.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          msg.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {msg.status.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] text-slate-500 font-mono">
                          {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Subject & Query body */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Subject: {msg.subject}</span>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                        {msg.message}
                      </div>
                    </div>

                    {/* Official Secretariat Reply if present */}
                    {msg.adminReply && (
                      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Official Secretariat Resolution / Reply:
                          </span>
                          {msg.repliedAt && (
                            <span className="text-[10px] text-emerald-500 font-mono">
                              Replied on {new Date(msg.repliedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-200 leading-relaxed">{msg.adminReply}</p>
                      </div>
                    )}

                    {/* Internal Notes if present */}
                    {notes && (
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1">
                        <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                          Internal Office Notes:
                        </span>
                        <p className="text-slate-400 text-[11px] italic">{notes}</p>
                      </div>
                    )}

                    {/* Actions toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                      {/* Status quick buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">Status:</span>
                        <button
                          onClick={() => handleStatusChange(msg, 'new')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            msg.status === 'new' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          New
                        </button>
                        <button
                          onClick={() => handleStatusChange(msg, 'in_progress')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            msg.status === 'in_progress' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleStatusChange(msg, 'resolved')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            msg.status === 'resolved' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Resolved
                        </button>
                        <button
                          onClick={() => handleStatusChange(msg, 'archived')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            msg.status === 'archived' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Archive
                        </button>
                      </div>

                      {/* Main action buttons: Edit, Reply, Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(msg)}
                          className="px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-400 hover:text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-800/40"
                          title="Full Edit Inquiry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            setReplyModalMessage(msg);
                            setReplyText(msg.adminReply || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>

                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-red-400 hover:text-red-300 font-bold text-xs flex items-center gap-1 transition-colors border border-slate-700"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Official Secretariat Contact Details CMS */}
      {activeTab === 'secretariat_info' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-black text-white">UPRSA Official Secretariat Contact Information</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Edit the federation head office postal address, hotline numbers, official contact email, and grievance officer details displayed on the public Contact page.
            </p>
          </div>

          <form onSubmit={handleSaveContactSettings} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Primary Contact Email (आधिकारिक ईमेल) *
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus-within:border-cyan-500">
                  <Mail className="w-4 h-4 text-cyan-400 mr-2.5 shrink-0" />
                  <input
                    type="email"
                    required
                    value={contactSettings.contactEmail}
                    onChange={(e) => setContactSettings({ ...contactSettings, contactEmail: e.target.value })}
                    className="bg-transparent outline-none w-full font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Secretariat Hotline & Phone Numbers (फ़ोन नंबर) *
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus-within:border-cyan-500">
                  <Phone className="w-4 h-4 text-cyan-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={contactSettings.contactPhone}
                    onChange={(e) => setContactSettings({ ...contactSettings, contactPhone: e.target.value })}
                    placeholder="+91 522 2439812, +91 94150 21989"
                    className="bg-transparent outline-none w-full font-mono text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Federation Head Office Postal Address (मुख्यालय का डाक पता) *
                </label>
                <div className="flex items-start bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus-within:border-cyan-500">
                  <MapPin className="w-4 h-4 text-cyan-400 mr-2.5 mt-0.5 shrink-0" />
                  <textarea
                    rows={2}
                    required
                    value={contactSettings.officialAddress}
                    onChange={(e) => setContactSettings({ ...contactSettings, officialAddress: e.target.value })}
                    className="bg-transparent outline-none w-full text-white resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Office Working Hours (कार्यालय समय)
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus-within:border-cyan-500">
                  <Clock className="w-4 h-4 text-cyan-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={contactSettings.officeHours}
                    onChange={(e) => setContactSettings({ ...contactSettings, officeHours: e.target.value })}
                    placeholder="Monday - Saturday: 10:00 AM - 06:00 PM"
                    className="bg-transparent outline-none w-full text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  State Helpdesk Direct Mobile / WhatsApp (हेल्पलाइन मोबाइल)
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus-within:border-cyan-500">
                  <Phone className="w-4 h-4 text-emerald-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={contactSettings.helplinePhone}
                    onChange={(e) => setContactSettings({ ...contactSettings, helplinePhone: e.target.value })}
                    placeholder="+91 94152 77665 (Helpdesk)"
                    className="bg-transparent outline-none w-full font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Athlete Grievance Officer (खिलाड़ी शिकायत निवारण अधिकारी)
                </label>
                <input
                  type="text"
                  value={contactSettings.grievanceOfficer}
                  onChange={(e) => setContactSettings({ ...contactSettings, grievanceOfficer: e.target.value })}
                  placeholder="Shri Rajesh Kumar Singh (General Secretary)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Grievance Direct Email (शिकायत निवारण ईमेल)
                </label>
                <input
                  type="email"
                  value={contactSettings.grievanceEmail}
                  onChange={(e) => setContactSettings({ ...contactSettings, grievanceEmail: e.target.value })}
                  placeholder="grievance.uprsa@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-cyan-600/30 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Save Secretariat Contact Info'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreateModalOpen || editingMessage) && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingMessage ? 'Edit Contact Inquiry & Details' : 'Log New Public Inquiry / Ticket'}
                </h3>
                <span className="text-xs text-slate-400">
                  {editingMessage ? `Editing Ticket ID: ${editingMessage.id}` : 'Record a new public or athlete inquiry directly into the portal'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingMessage(null);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitMessageForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Athlete / Sender Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="athlete@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">District (जिला)</label>
                  <select
                    value={formData.district || 'Lucknow'}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                  >
                    {UP_DISTRICTS_DATA.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} ({d.zone} Zone)</option>
                    ))}
                    <option value="Other / Outside UP">Other / Outside UP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Inquiry Category</label>
                  <select
                    value={formData.category || 'General Inquiry'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Skater Registration">Skater Registration</option>
                    <option value="District / Club Affiliation">District / Club Affiliation</option>
                    <option value="Tournament Grievance">Tournament Grievance</option>
                    <option value="Certificate Verification">Certificate Verification</option>
                    <option value="Anti-Doping & Medical">Anti-Doping & Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority || 'normal'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none font-bold"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject / Header *</label>
                <input
                  type="text"
                  required
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Clarification on Inline Speed Age Cut-off"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Inquiry / Message Body *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write the complete query, grievance, or message details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ticket Status</label>
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none font-bold"
                  >
                    <option value="new">New (Unread)</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Internal Office Notes</label>
                  <input
                    type="text"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Verified with Meerut district secretary"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Resolution / Admin Reply</label>
                <textarea
                  rows={3}
                  value={formData.adminReply || ''}
                  onChange={(e) => setFormData({ ...formData, adminReply: e.target.value })}
                  placeholder="State the resolution provided to the athlete or parent..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingMessage(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMessage ? 'Save Changes' : 'Create Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK REPLY MODAL */}
      {replyModalMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Record Official Resolution</h3>
                <span className="text-xs text-slate-400">Replying to {replyModalMessage.name} ({replyModalMessage.phone})</span>
              </div>
              <button onClick={() => setReplyModalMessage(null)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendReply} className="p-6 space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-cyan-400 block">Subject: {replyModalMessage.subject}</span>
                <span className="text-slate-300">{replyModalMessage.message}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Response / Resolution *</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="State the resolution, instructions, or official clearance provided to the athlete..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setReplyModalMessage(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-lg shadow-cyan-600/30">
                  <Send className="w-4 h-4" />
                  <span>Save & Mark Resolved</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
