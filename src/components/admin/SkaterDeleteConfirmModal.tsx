import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  ShieldAlert, 
  X, 
  RefreshCw, 
  Archive, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { Skater } from '../../types';
import { api } from '../../services/api';

interface SkaterDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  skater: Skater;
  onDeleted: (skaterId: string, isPermanent: boolean) => void;
  adminUser?: string;
}

export const SkaterDeleteConfirmModal: React.FC<SkaterDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  skater,
  onDeleted,
  adminUser
}) => {
  const [deleteMode, setDeleteMode] = useState<'soft' | 'permanent'>('soft');
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!hasConfirmed) {
      setError('Please acknowledge and confirm the deletion statement before proceeding.');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const isPermanent = deleteMode === 'permanent';
      const res = await api.deleteSkater(skater.id, isPermanent, adminUser);
      if (res.success) {
        onDeleted(skater.id, isPermanent);
        onClose();
      } else {
        setError(res.message || 'Failed to delete skater.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-red-500/50 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-400">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 uppercase">
                RESTRICTED ACTION • ADMIN ONLY
              </span>
              <h2 className="text-base font-black text-white mt-0.5">
                Delete Skater Application
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300">
              {error}
            </div>
          )}

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="text-[11px] text-slate-400">Selected Skater Record:</div>
            <div className="font-bold text-white text-sm">
              {skater.firstName} {skater.lastName}
            </div>
            <div className="font-mono text-amber-400 text-xs">
              Registration No: {skater.registrationNumber}
            </div>
            <div className="text-slate-400 text-[11px]">
              {skater.district} • {skater.discipline} • {skater.ageCategory}
            </div>
          </div>

          {/* Delete Mode Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 block">
              Choose Deletion Mechanism:
            </label>

            <div 
              onClick={() => setDeleteMode('soft')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                deleteMode === 'soft'
                  ? 'bg-amber-500/10 border-amber-500/50 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Archive className={`w-5 h-5 mt-0.5 shrink-0 ${deleteMode === 'soft' ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-2">
                  Safe Delete / Move to Trash (Recommended)
                  {deleteMode === 'soft' && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">SELECTED</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  Removes the athlete from active listings and public lookups. The record is safely archived in the system trash and can be restored at any time by authorized Super Admins.
                </div>
              </div>
            </div>

            <div 
              onClick={() => setDeleteMode('permanent')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                deleteMode === 'permanent'
                  ? 'bg-red-500/10 border-red-500/50 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Trash2 className={`w-5 h-5 mt-0.5 shrink-0 ${deleteMode === 'permanent' ? 'text-red-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-2">
                  Permanent Purge (Irreversible)
                  {deleteMode === 'permanent' && <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded font-mono">HIGH RISK</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  Completely and irreversibly removes this athlete, registration docket reference, and associated files from the database.
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Confirmation Checkbox */}
          <div 
            onClick={() => setHasConfirmed(!hasConfirmed)}
            className="flex items-start gap-2.5 p-3.5 bg-red-950/40 border border-red-500/50 rounded-xl cursor-pointer hover:bg-red-950/60 transition-colors"
          >
            <div className="mt-0.5">
              {hasConfirmed ? (
                <CheckSquare className="w-4 h-4 text-red-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div className="text-[11px] text-red-200 leading-snug">
              <span className="font-black text-red-300 block mb-0.5">WARNING:</span>
              <span>This will permanently remove this skater application and associated data. This action cannot be undone.</span>
              <span className="block mt-1 text-[10px] text-slate-400">I confirm that I am an authorized Administrator and wish to execute this action.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={!hasConfirmed || isDeleting}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              hasConfirmed && !isDeleting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isDeleting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Deletion...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteMode === 'permanent' ? 'Permanently Purge Record' : 'Move to Trash'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
