import { useState } from 'react';
import { Database, Plus, Trash2, FileText, Youtube } from 'lucide-react';
import TranscriptUploader from '../components/training/TranscriptUploader';
import YouTubeImporter from '../components/training/YouTubeImporter';

const TrainingPage = () => {
  const [activeTab, setActiveTab] = useState('transcript');
  
  const [dataList] = useState([
    { id: 1, title: 'Q3 Sales Call - Enterprise Client', type: 'transcript', date: 'Oct 20, 2023', words: 4500 },
    { id: 2, title: 'Objection Handling Masterclass', type: 'youtube', date: 'Oct 15, 2023', words: 8200 },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Train Your AI Assistant</h1>
        <p className="text-slate-500 mt-1">Upload transcripts or videos so the AI learns your specific selling style.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors flex justify-center items-center ${activeTab === 'transcript' ? 'border-brand-500 text-brand-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                <FileText className="w-4 h-4 mr-2" /> Paste Transcript
              </button>
              <button 
                onClick={() => setActiveTab('youtube')}
                className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors flex justify-center items-center ${activeTab === 'youtube' ? 'border-brand-500 text-brand-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                <Youtube className="w-4 h-4 mr-2" /> YouTube URL
              </button>
            </div>
            
            <div className="p-6 bg-white min-h-[400px]">
              {activeTab === 'transcript' ? <TranscriptUploader /> : <YouTubeImporter />}
            </div>
          </div>
        </div>

        {/* Sidebar Info & List */}
        <div className="space-y-6">
          <div className="card p-6 bg-brand-50 border-brand-200">
            <h3 className="font-bold text-brand-900 mb-2 flex items-center">
              <Database className="w-5 h-5 mr-2 text-brand-500" />
              How Training Works
            </h3>
            <p className="text-sm text-brand-800 leading-relaxed">
              When you upload your own successful sales calls or coaching videos, the AI analyzes your specific phrasing, tone, and winning arguments. Future generated reports will sound exactly like you, but optimized with the 6KLH framework.
            </p>
          </div>

          <div className="card p-0">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Your Data Sources</h3>
              <span className="text-xs bg-slate-200 text-slate-600 py-1 px-2 rounded-full font-medium">{dataList.length} files</span>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {dataList.length > 0 ? (
                dataList.map(item => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {item.type === 'youtube' ? (
                          <Youtube className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                          <div className="text-xs text-slate-500 mt-1 flex items-center">
                            {item.date} • {item.words.toLocaleString()} words
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No training data uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
