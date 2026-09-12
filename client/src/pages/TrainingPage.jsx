import { useState, useEffect, useCallback } from 'react';
import { Database, Plus, Trash2, FileText, Youtube, CheckCircle2, AlertCircle } from 'lucide-react';
import TranscriptUploader from '../components/training/TranscriptUploader';
import YouTubeImporter from '../components/training/YouTubeImporter';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TrainingPage = () => {
  const [activeTab, setActiveTab] = useState('transcript');
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainingData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/training');
      setDataList(res.data || []);
    } catch (err) {
      console.warn('Failed to load training data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainingData();
  }, [fetchTrainingData]);

  const [deleteStatus, setDeleteStatus] = useState('');

  const handleDelete = async (id) => {
    try {
      await api.delete(`/training/${id}`);
      setDataList(prev => prev.filter(item => item.id !== id));
      setDeleteStatus('Source removed.');
      setTimeout(() => setDeleteStatus(''), 2500);
    } catch (err) {
      console.error('Failed to delete training item:', err);
      setDeleteStatus('Failed to delete training item.');
      setTimeout(() => setDeleteStatus(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Train Your AI Sales Coach</h1>
        <p className="text-slate-500 mt-1">
          Upload transcripts or video URLs so the AI learns your industry's specific objection handling phrasing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden bg-white shadow-sm border border-slate-200">
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-4 px-6 text-xs font-bold text-center border-b-2 transition-colors flex justify-center items-center gap-2 ${
                  activeTab === 'transcript' 
                    ? 'border-brand-500 text-brand-600 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" /> 
                <span>Paste Transcript (.txt / Notes)</span>
              </button>
              <button 
                onClick={() => setActiveTab('youtube')}
                className={`flex-1 py-4 px-6 text-xs font-bold text-center border-b-2 transition-colors flex justify-center items-center gap-2 ${
                  activeTab === 'youtube' 
                    ? 'border-brand-500 text-brand-600 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Youtube className="w-4 h-4 text-red-500" /> 
                <span>YouTube Sales Call URL</span>
              </button>
            </div>
            
            <div className="p-6 bg-white min-h-[400px]">
              {activeTab === 'transcript' ? (
                <TranscriptUploader onUploadSuccess={fetchTrainingData} />
              ) : (
                <YouTubeImporter onUploadSuccess={fetchTrainingData} />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Persistent List */}
        <div className="space-y-6">
          <div className="card p-5 bg-brand-50 border border-brand-200 rounded-2xl">
            <h3 className="font-bold text-sm text-brand-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-600" />
              How 6KLH Training Works
            </h3>
            <p className="text-xs text-brand-800 leading-relaxed">
              When you upload high-performing call recordings or objection breakdowns, Gemini analyzes your cadence, buyer objections, and value framing. Generated playbooks automatically incorporate these proven arguments into the 6KLH formula.
            </p>
          </div>

          <div className="card p-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800">Your Indexed Data Sources</h3>
              <span className="text-[11px] bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full font-bold">
                {dataList.length} sources
              </span>
            </div>

            {deleteStatus && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-amber-800 text-xs font-semibold">
                {deleteStatus}
              </div>
            )}
            
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <LoadingSpinner size="sm" label="Fetching sources..." />
                </div>
              ) : dataList.length > 0 ? (
                dataList.map(item => {
                  const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  }) : 'Recently';

                  return (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          {item.source_type === 'youtube' ? (
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Youtube className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <span>{dateStr}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-semibold">Indexed</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-80 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                          title="Delete source"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No training documents uploaded yet.
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
