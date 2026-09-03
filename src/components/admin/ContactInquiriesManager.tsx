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
  Archive 
} from 'lucide-react';
import { ContactMessage } from '../../types';
import { api } from '../../services/api';

export const ContactInquiriesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [replyModalMessage, setReplyModalMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadMessages();
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

  const handleStatusChange = async (msg: ContactMessage, status: 'new' | 'in_progress' | 'resolved' | 'archived') => {
    try {
      const res = await api.updateContactMessage(msg.id, { status });
      if (res.success) {
        showToast(`Inquiry marked as ${status.replace('_', ' ')}`);
        loadMessages();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await api.deleteContactMessage(id);
      if (res.success) {
        showToast('Message deleted');
        loadMessages();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalMessage || !replyText) return;

    try {
      const res = await api.updateContactMessage(replyModalMessage.id, {
        status: 'resolved',
        adminReply: replyText,
        repliedAt: new Date().toISOString()
      });

      if (res.success) {
        showToast(`Reply logged and inquiry marked resolved`);
        loadMessages();
        setReplyModalMessage(null);
        setReplyText('');
      }
    } catch (err) {
      showToast('Failed to save reply', 'error');
    }
  };

  const filtered = messages.filter(m => {
    const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold border ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-red-950 border-red-500 text-red-300'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h2 className="text-xl font-black text-white">Public Inquiries & Helpdesk Messages</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming inquiries submitted through the official website contact form, address issues, and resolve tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
            {messages.filter(m => m.status === 'new').length} Unresolved Queries
          </span>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inquiries, athlete names, emails, subjects..."
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Inquiries' },
            { id: 'new', label: 'New Unread' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === st.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Loading contact messages...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs">No contact inquiries matching criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-4 transition-all ${
                msg.status === 'new' ? 'border-cyan-500/40 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-mono">{msg.email}</span>
                      <span>•</span>
                      <span className="font-mono">{msg.phone}</span>
                      {msg.district && (
                        <>
                          <span>•</span>
                          <span>{msg.district}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    msg.status === 'new' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    msg.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {msg.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-400">Subject: {msg.subject}</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {msg.message}
                </p>
              </div>

              {msg.adminReply && (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Official Secretariat Reply
                  </span>
                  <p className="text-slate-300">{msg.adminReply}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(msg, 'in_progress')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px]"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(msg, 'resolved')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-[11px]"
                  >
                    Mark Resolved
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReplyModalMessage(msg);
                      setReplyText(msg.adminReply || '');
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Record Reply</span>
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyModalMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Record Official Reply</h3>
                <span className="text-xs text-slate-400">Replying to {replyModalMessage.name} ({replyModalMessage.email})</span>
              </div>
              <button onClick={() => setReplyModalMessage(null)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendReply} className="p-6 space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-slate-400">Query: </span>
                <span className="text-slate-200">{replyModalMessage.message}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Response *</label>
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
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5">
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
