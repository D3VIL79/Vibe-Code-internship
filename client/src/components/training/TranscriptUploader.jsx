import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const TranscriptUploader = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/training/transcript', { title, content });
      setSuccess('Transcript saved successfully to database.');
      setTitle('');
      setContent('');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transcript.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Source Title *</label>
          <button
            type="button"
            onClick={() => {
              setTitle('Enterprise SaaS Call: Pricing Resistance & Onboarding Timeline');
              setContent(`Buyer: "We really like the tool and demo, but honestly the annual ₹12,00,000 price tag is double what we budgeted for this quarter. Plus my engineers are bogged down with our ERP rollout."

Rep: "I hear you, Sarah. When leadership is looking at numbers, budget compliance is non-negotiable. But let me ask: how many deals stalled last quarter because your reps took 4 days to draft custom proposals? If we can guarantee positive ROI in 45 days and our team handles all migration, would you be open to a pilot?"`);
            }}
            className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold"
          >
            + Fill Sample Transcript
          </button>
        </div>
        <input 
          type="text" 
          className="input-field text-sm" 
          placeholder="e.g. Discovery Call with Acme Corp"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Transcript Content *</label>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-1 transition-colors ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <textarea 
            className="w-full h-56 p-3 bg-transparent resize-none focus:outline-none text-slate-700 text-sm" 
            placeholder="Paste your transcript text here, or drag & drop a .txt file..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          
          {content.length === 0 && !isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
              <UploadCloud className="w-10 h-10 mb-2 opacity-50 text-slate-400" />
              <p className="text-xs font-semibold">Drag and drop .txt file or paste content</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
          <span>Supported: .txt, transcripts, meeting notes</span>
          <span>{content.length.toLocaleString()} characters</span>
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit"
          className="btn-primary w-full sm:w-auto text-xs font-bold py-2.5 px-5 flex items-center justify-center gap-2"
          disabled={!title || !content || loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" label="" />
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Save & Ingest to Database</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TranscriptUploader;
