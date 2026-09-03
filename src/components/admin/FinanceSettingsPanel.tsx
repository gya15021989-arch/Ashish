import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  Download, 
  Search, 
  Filter,
  Check,
  X
} from 'lucide-react';
import { PaymentSettings, PaymentRecord } from '../../types';
import { api } from '../../services/api';

export const FinanceSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSettings>({
    upiId: 'uprsa.state@sbi',
    upiPayeeName: 'Uttar Pradesh Roller Sports Association',
    bankAccountNo: '38294829104',
    bankIfsc: 'SBIN0001234',
    bankName: 'State Bank of India, Main Branch Lucknow',
    annualSkaterFee: 500,
    clubAffiliationFee: 5000,
    districtAffiliationFee: 10000,
    isGatewayActive: true
  });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadFinance();
  }, []);

  const loadFinance = async () => {
    try {
      const [sRes, pRes] = await Promise.all([
        api.getPaymentSettings(),
        api.getPayments()
      ]);
      if (sRes.success) setSettings(sRes.data);
      if (pRes.success) setPayments(pRes.data);
    } catch (e) {
      console.error('Failed to load finance data:', e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updatePaymentSettings(settings);
      if (res.success) {
        setSuccessMsg('Payment credentials & UPI configurations saved successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const totalCollected = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 font-medium">Total Fees Verified</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">From Skater & Tournament Registrations</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 font-medium">Annual Skater Affiliation</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{settings.annualSkaterFee}
          </div>
          <span className="text-[10px] text-slate-500">2026 Season Rate / Athlete</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 font-medium">State Gateway Status</span>
          <div className="text-lg font-black text-white mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>UPI Dynamic QR Active</span>
          </div>
          <span className="text-[10px] text-slate-500">Instant UTR Matching</span>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              UPI & State Bank Account Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Update official receiving UPI handle and banking coordinates for QR generation.
            </p>
          </div>
          {successMsg && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">
              Official UPI VPA Handle *
            </label>
            <input
              type="text"
              required
              value={settings.upiId}
              onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">
              UPI Display Payee Name *
            </label>
            <input
              type="text"
              required
              value={settings.upiPayeeName}
              onChange={(e) => setSettings({ ...settings, upiPayeeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">
              Bank Account Number *
            </label>
            <input
              type="text"
              required
              value={settings.bankAccountNo}
              onChange={(e) => setSettings({ ...settings, bankAccountNo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">
              Bank IFSC Code *
            </label>
            <input
              type="text"
              required
              value={settings.bankIfsc}
              onChange={(e) => setSettings({ ...settings, bankIfsc: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Payment Coordinates'}</span>
          </button>
        </div>
      </form>

      {/* Transaction Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Payment Audit Logs</h3>
            <span className="text-xs text-slate-400">All athlete affiliations and tournament fees</span>
          </div>

          <button
            onClick={() => {
              const csv = "ID,Skater,Amount,Purpose,UTR,Date,Status\n" + payments.map(p => `${p.id},${p.skaterName},${p.amount},"${p.purpose}",${p.utrNumber || ''},${p.date},${p.status}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `UPRSA_Finance_Audit_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Skater / Payee</th>
                <th className="py-3 px-3">Purpose</th>
                <th className="py-3 px-3">UTR Reference</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-850">
                  <td className="py-3 px-3 font-mono font-bold text-white">{p.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{p.skaterName}</td>
                  <td className="py-3 px-3 text-slate-400">{p.purpose}</td>
                  <td className="py-3 px-3 font-mono text-amber-400">{p.utrNumber || 'ONLINE'}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">₹{p.amount}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
