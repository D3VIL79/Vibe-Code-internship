import { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

const TranscriptUploader = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here (e.g., read text file)
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Source Title *</label>
        <input 
          type="text" 
          className="input-field" 
          placeholder="e.g. Discovery Call with Acme Corp"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Transcript Content *</label>
        <div 
          className={`relative border-2 border-dashed rounded-lg p-1 transition-colors ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <textarea 
            className="w-full h-64 p-3 bg-transparent resize-none focus:outline-none text-slate-700" 
            placeholder="Paste your transcript text here, or drag & drop a .txt file..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          
          {content.length === 0 && !isDragging && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
              <UploadCloud className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-medium">Drag and drop file</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
          <span>Supported: .txt, .csv</span>
          <span>{content.length} characters</span>
        </div>
      </div>

      <div className="pt-4">
        <button 
          className="btn-primary w-full sm:w-auto"
          disabled={!title || !content}
        >
          <FileText className="w-4 h-4 mr-2" /> Save Transcript
        </button>
      </div>
    </div>
  );
};

export default TranscriptUploader;
