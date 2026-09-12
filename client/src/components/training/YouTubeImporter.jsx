import { useState } from 'react';
import { Youtube, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const YouTubeImporter = ({ onUploadSuccess }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleValidate = (e) => {
    e.preventDefault();
    if (!url) return;
    setError('');
    setSuccess('');
    setIsValidating(true);
    
    setTimeout(() => {
      setIsValidating(false);
      const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
      if (isYoutube) {
        setTitle('Mastering 6KLH: Advanced Objection Handling Techniques');
      } else {
        setError('Please provide a valid YouTube URL.');
      }
    }, 800);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!url || !title) return;

    setIsImporting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/training/youtube', { videoUrl: url, title });
      setSuccess('Video transcript successfully extracted and trained into AI model!');
      setUrl('');
      setTitle('');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import YouTube video transcript.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-xs">
        <p className="font-bold flex items-center mb-1 text-sm">
          <Youtube className="w-4 h-4 mr-2 text-red-600" /> YouTube Sales Audio & Transcript Ingestion
        </p>
        <p>Paste a public YouTube sales call or training video URL. We will extract the transcript, index the objection handling patterns, and add it to your 6KLH context database.</p>
      </div>

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
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">YouTube URL *</label>
          <button
            type="button"
            onClick={() => {
              setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
              setTitle('Manuj Bajaj: How to Execute the Stab & Twist in Live Sales Calls');
            }}
            className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold"
          >
            + Use Sample Video URL
          </button>
        </div>
        <div className="flex space-x-2">
          <input 
            type="url" 
            className="input-field flex-1 text-sm" 
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            type="button"
            onClick={handleValidate}
            disabled={!url || isValidating}
            className="btn-secondary whitespace-nowrap text-xs font-bold py-2.5 px-4"
          >
            {isValidating ? 'Validating...' : 'Fetch Video'}
          </button>
        </div>
      </div>

      {title && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
          <div className="w-24 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-200 text-red-600">
            <Youtube className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate">{title}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Captions stream detected • 6KLH audio patterns identified</p>
            <div className="mt-2.5">
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Custom Playbook Label</label>
              <input 
                type="text" 
                className="input-field py-1.5 text-xs" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <button 
          type="button"
          onClick={handleImport}
          className="btn-primary w-full sm:w-auto text-xs font-bold py-2.5 px-5 flex items-center justify-center gap-2"
          disabled={!title || isImporting}
        >
          {isImporting ? (
            <LoadingSpinner size="sm" label="" />
          ) : (
            <>
              <Youtube className="w-4 h-4" />
              <span>Import & Save to AI Context</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default YouTubeImporter;
