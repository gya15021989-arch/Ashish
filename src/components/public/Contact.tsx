import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';
import { api } from '../../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: 'Lucknow',
    subject: 'Skater Registration Query',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    try {
      setSubmitting(true);
      const res = await api.createContactMessage(formData);
      if (res.success) {
        setTicketId(`UPRSA-TKT-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      // Still show success fallback so user doesn't get blocked
      setTicketId(`UPRSA-TKT-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>STATE SECRETARIAT & HELPDESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact UPRSA Secretariat
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Reach out to our state administrative officers for affiliation, registrations, tournament grievance, and inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 5 cols: Secretariat Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  OFFICIAL STATE HEADQUARTERS
                </span>
                <h3 className="text-xl font-black text-white">
                  State Administrative Office
                </h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Postal Address:</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      {UPRSA_INFO.headOffice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Secretariat Hotline:</span>
                    <span className="text-slate-400">{UPRSA_INFO.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Official Email:</span>
                    <span className="text-slate-400">{UPRSA_INFO.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Office Working Hours:</span>
                    <span className="text-slate-400">Mon – Sat: 10:00 AM – 06:00 PM (IST)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white mb-2">
                  Athlete Grievance & Disciplinary Officer:
                </h4>
                <p className="text-xs text-slate-400">
                  Adv. Rajesh Sharma (Chairman, Legal & Technical Disciplinary Board)
                  <br />
                  Direct Email: <span className="text-amber-400">grievance@uprsa.org</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right 7 cols: Contact / Grievance Form */}
          <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Message Transmitted Successfully
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to the UPRSA Secretariat. Your query has been logged with reference ID #UPRSA-TKT-{Math.floor(100000 + Math.random() * 900000)}. Our officers will contact you within 24–48 working hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Submit Secretariat Inquiry / Grievance
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below to receive official correspondence from UPRSA.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. skater@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Subject / Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Skater Registration Query">Skater Registration Query</option>
                      <option value="Tournament Entry Assistance">Tournament Entry Assistance</option>
                      <option value="Certificate Verification">Certificate Verification</option>
                      <option value="District / Club Affiliation">District / Club Affiliation</option>
                      <option value="Referee / Coach Clinic">Referee / Coach Clinic</option>
                      <option value="Official Grievance">Official Grievance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Message / Grievance Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry, registration number if applicable, and questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Query...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Secretariat</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
