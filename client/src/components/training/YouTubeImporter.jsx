import { useState } from 'react';
import { Youtube, Search } from 'lucide-react';

const YouTubeImporter = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = (e) => {
    e.preventDefault();
    if (!url) return;
    setIsValidating(true);
    // Mock validation
    setTimeout(() => {
      setIsValidating(false);
      setTitle('Extracted: Advanced Objection Handling Techniques');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 text-sm">
        <p className="font-medium flex items-center mb-1">
          <Youtube className="w-4 h-4 mr-2" /> YouTube Import Beta
        </p>
        <p>Paste a public YouTube video URL. We will extract the auto-generated captions to train your AI profile.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL *</label>
        <div className="flex space-x-2">
          <input 
            type="url" 
            className="input-field flex-1" 
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleValidate}
            disabled={!url || isValidating}
            className="btn-secondary whitespace-nowrap"
          >
            {isValidating ? 'Checking...' : 'Fetch Video'}
          </button>
        </div>
      </div>

      {title && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start">
          <div className="w-32 h-20 bg-slate-200 rounded mr-4 flex items-center justify-center flex-shrink-0">
            <Youtube className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
            <p className="text-xs text-slate-500 mt-1">Duration: 12:45 • Captions found</p>
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Save As Title</label>
              <input type="text" className="input-field py-1 text-sm" defaultValue={title.replace('Extracted: ', '')} />
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          className="btn-primary w-full sm:w-auto"
          disabled={!title}
        >
          Import & Train AI
        </button>
      </div>
    </div>
  );
};

export default YouTubeImporter;
