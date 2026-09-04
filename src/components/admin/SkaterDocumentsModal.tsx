import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Upload, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Clock, 
  HardDrive, 
  FileCode, 
  ShieldCheck,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { Skater } from '../../types';
import { api } from '../../services/api';

interface SkaterDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skater: Skater;
  onSkaterUpdated: (updated: Skater) => void;
  adminUser?: string;
}

interface DocItem {
  key: string;
  title: string;
  category: string;
  url?: string;
  isPrivate: boolean;
  required: boolean;
  suggestedName: string;
  defaultSize: string;
  defaultType: string;
}

export const SkaterDocumentsModal: React.FC<SkaterDocumentsModalProps> = ({
  isOpen,
  onClose,
  skater,
  onSkaterUpdated,
  adminUser
}) => {
  const [activePreview, setActivePreview] = useState<{ title: string; url: string; type: string } | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocItem | null>(null);
  const [uploadingDocKey, setUploadingDocKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetDocKey, setTargetDocKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Derive document list from skater properties and documents array
  const docDefinitions: DocItem[] = [
    {
      key: 'photo',
      title: 'Passport Size Headshot Photo',
      category: 'Identity & Accreditation',
      url: skater.photoUrl,
      isPrivate: false,
      required: true,
      suggestedName: `${skater.registrationNumber}_Photo.jpg`,
      defaultSize: '280 KB',
      defaultType: 'image/jpeg'
    },
    {
      key: 'dob_proof',
      title: 'Birth Certificate / Municipal DOB Proof',
      category: 'Age Verification',
      url: skater.dobProofUrl,
      isPrivate: true,
      required: true,
      suggestedName: `${skater.registrationNumber}_DOB_Certificate.pdf`,
      defaultSize: '1.2 MB',
      defaultType: 'application/pdf'
    },
    {
      key: 'aadhaar',
      title: 'Aadhaar Card / Government Identity Proof',
      category: 'KYC & Residency',
      url: skater.aadhaarDocUrl,
      isPrivate: true,
      required: true,
      suggestedName: `${skater.registrationNumber}_Aadhaar_Proof.pdf`,
      defaultSize: '950 KB',
      defaultType: 'application/pdf'
    },
    {
      key: 'medical',
      title: 'Medical Fitness Certificate (MBBS / Sports Physician)',
      category: 'Health & Safety',
      url: skater.medicalCertUrl,
      isPrivate: true,
      required: true,
      suggestedName: `${skater.registrationNumber}_Medical_Clearance.pdf`,
      defaultSize: '650 KB',
      defaultType: 'application/pdf'
    },
    {
      key: 'school_id',
      title: 'School / Institution Bonafide / Address Proof',
      category: 'Affiliation & Domicile',
      url: skater.schoolIdDocUrl,
      isPrivate: true,
      required: false,
      suggestedName: `${skater.registrationNumber}_School_Bonafide.pdf`,
      defaultSize: '820 KB',
      defaultType: 'application/pdf'
    },
    {
      key: 'other',
      title: 'Additional Supporting Document / RSFI Card',
      category: 'Supplementary Record',
      url: skater.otherDocUrl,
      isPrivate: true,
      required: false,
      suggestedName: `${skater.registrationNumber}_Other_Doc.pdf`,
      defaultSize: '510 KB',
      defaultType: 'application/pdf'
    }
  ];

  // Match with skater.documents array if present
  const getDocDetails = (item: DocItem) => {
    const fromArray = (skater.documents || []).find(
      (d: any) => d.type === item.key || (item.key === 'dob_proof' && d.type === 'birth_certificate')
    );

    const hasFile = Boolean(item.url && item.url.trim().length > 0);
    const fileName = fromArray?.name || (hasFile ? item.suggestedName : 'Not uploaded');
    const uploadDate = fromArray?.uploadedAt ? new Date(fromArray.uploadedAt).toLocaleString('en-IN') : (skater.created_at ? new Date(skater.created_at).toLocaleDateString('en-IN') : '2026-02-01');
    const fileSize = fromArray?.fileSize || (hasFile ? item.defaultSize : '—');
    const fileType = fromArray?.fileType || (item.url?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : item.defaultType);
    const status = fromArray?.status || (hasFile ? 'VERIFIED' : 'EMPTY');

    return {
      hasFile,
      fileName,
      uploadDate,
      fileSize,
      fileType,
      status,
      remarks: fromArray?.remarks
    };
  };

  const handleDownload = (item: DocItem) => {
    if (!item.url) return;
    const details = getDocDetails(item);
    const link = document.createElement('a');
    link.href = item.url;
    link.download = details.fileName || item.suggestedName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileSelect = (key: string) => {
    setTargetDocKey(key);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetDocKey) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'File size exceeds maximum permitted 10 MB limit.' });
      return;
    }

    setUploadingDocKey(targetDocKey);
    setIsProcessing(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const sizeFormatted = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;

        const res = await api.replaceDocument(
          skater.id,
          {
            docType: targetDocKey,
            fileName: file.name,
            fileData: base64,
            fileSize: sizeFormatted,
            fileType: file.type || 'application/octet-stream',
            remarks: `Uploaded by admin ${adminUser || 'portal'}`
          },
          adminUser
        );

        if (res.success && res.data) {
          onSkaterUpdated(res.data);
          setFeedback({ type: 'success', message: `Document "${file.name}" replaced successfully!` });
        } else {
          setFeedback({ type: 'error', message: res.message || 'Failed to replace document.' });
        }
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'Error occurred while saving document.' });
      } finally {
        setIsProcessing(false);
        setUploadingDocKey(null);
        setTargetDocKey(null);
      }
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setUploadingDocKey(null);
      setFeedback({ type: 'error', message: 'Failed to read local file.' });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDocument = async (item: DocItem) => {
    setIsProcessing(true);
    setFeedback(null);
    try {
      const res = await api.deleteDocument(skater.id, item.key, adminUser);
      if (res.success && res.data) {
        onSkaterUpdated(res.data);
        setDeleteConfirmDoc(null);
        setFeedback({ type: 'success', message: `Document "${item.title}" permanently removed from athlete records.` });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to delete document.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete document.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Hidden File Input with explicit JPG/JPEG support */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/jpg,image/png,image/*,application/pdf"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  DOCUMENT MANAGEMENT & KYC DOSSIER
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {skater.registrationNumber}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                {skater.firstName} {skater.lastName} • Athlete Verification Records
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

        {/* Security & Access Banner */}
        <div className="bg-slate-950/80 border-b border-slate-800/80 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Private KYC Vault:</strong> Identity proofs and medical records are encrypted and protected behind authorized administrative access.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Admin Session: {adminUser || 'admin@uprsa.org'}
          </span>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' 
              : 'bg-red-950/40 text-red-300 border-red-500/30'
          }`}>
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
          </div>
        )}

        {/* Document Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docDefinitions.map((item) => {
              const details = getDocDetails(item);
              const isUploading = uploadingDocKey === item.key;

              return (
                <div 
                  key={item.key}
                  className={`bg-slate-950 rounded-2xl p-4 border transition-all ${
                    details.hasFile 
                      ? 'border-slate-800 hover:border-slate-700' 
                      : 'border-dashed border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {item.category}
                        </span>
                        {item.required && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                            REQUIRED
                          </span>
                        )}
                        {item.isPrivate && (
                          <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                            PROTECTED KYC
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm mt-0.5">
                        {item.title}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      details.hasFile
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {details.hasFile ? 'AVAILABLE' : 'PENDING'}
                    </span>
                  </div>

                  {/* Metadata Box */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 space-y-1 text-[11px] mb-3">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">File Name:</span>
                      <span className="font-mono text-slate-200 truncate max-w-[200px]" title={details.fileName}>
                        {details.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Type / Size:</span>
                      <span className="text-slate-300 font-mono">
                        {details.fileType.includes('pdf') ? 'PDF Document' : 'Image'} • {details.fileSize}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Recorded:</span>
                      <span className="text-slate-300">
                        {details.uploadDate}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      {details.hasFile ? (
                        <>
                          <button
                            onClick={() => setActivePreview({
                              title: item.title,
                              url: item.url!,
                              type: details.fileType
                            })}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 border border-slate-700 hover:text-white transition-colors"
                            title="Preview within modal"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Preview</span>
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 border border-slate-700 hover:text-white transition-colors"
                            title="Open in new window"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                            <span>Open</span>
                          </a>

                          <button
                            onClick={() => handleDownload(item)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 border border-slate-700 hover:text-white transition-colors"
                            title="Download document file"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Download</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">
                          No document uploaded yet
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerFileSelect(item.key)}
                        disabled={isProcessing}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                        title="Upload replacement document"
                      >
                        {isUploading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{details.hasFile ? 'Replace' : 'Upload'}</span>
                      </button>

                      {details.hasFile && (
                        <button
                          onClick={() => setDeleteConfirmDoc(item)}
                          disabled={isProcessing}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-1.5 rounded-lg transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {skater.firstName} {skater.lastName} • {skater.district} • {skater.discipline}
          </span>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
          >
            Close Dossier
          </button>
        </div>
      </div>

      {/* Embedded Document Preview / Lightbox Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">{activePreview.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePreview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Open full size"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950/60 min-h-[400px]">
              {activePreview.url.toLowerCase().endsWith('.pdf') || activePreview.type.includes('pdf') ? (
                <iframe
                  src={activePreview.url}
                  title={activePreview.title}
                  className="w-full h-[550px] rounded-xl border border-slate-800"
                />
              ) : (
                <img
                  src={activePreview.url}
                  alt={activePreview.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[550px] max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
                />
              )}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePreview(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Confirmation Modal */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Document</h3>
                <p className="text-xs text-red-300">Irreversible administrative action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deleteConfirmDoc.title}</strong> for skater <strong>{skater.firstName} {skater.lastName}</strong> ({skater.registrationNumber})?
            </p>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400">
              This will remove the file from UPRSA server storage and wipe the athlete KYC reference. An official audit log entry will be recorded with your admin ID.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmDoc(null)}
                disabled={isProcessing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDocument(deleteConfirmDoc)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Confirm Permanent Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
