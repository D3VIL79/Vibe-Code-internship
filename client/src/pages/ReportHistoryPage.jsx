import { useState, useEffect } from 'react';
import { Search, Filter, FileText, ChevronRight, Zap, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReportHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/reports');
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Could not load report history from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const [deleteMessage, setDeleteMessage] = useState('');

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r.id !== id));
      setDeleteMessage('Report removed from database.');
      setTimeout(() => setDeleteMessage(''), 2500);
    } catch (err) {
      console.error('Failed to delete report:', err);
      setDeleteMessage('Failed to delete report.');
      setTimeout(() => setDeleteMessage(''), 3000);
    }
  };

  const handleOpenReport = (id) => {
    navigate(`/generate?id=${id}`);
  };

  const filtered = reports.filter(r => 
    (r.product || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.industry || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Report History</h1>
          <p className="text-slate-500 mt-1">Access and manage your persistent 6KLH intelligence reports stored in database.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by product or industry..." 
              className="pl-10 input-field w-full sm:w-72 text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/generate')} 
            className="btn-primary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {deleteMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between text-xs font-semibold">
          <span>{deleteMessage}</span>
          <button onClick={() => setDeleteMessage('')} className="text-amber-600 hover:text-amber-900">×</button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" label="Loading persistent reports..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product / Playbook</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Industry</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tokens Used</th>
                  <th scope="col" className="relative px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map((report) => {
                  const dateStr = report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Recently';

                  return (
                    <tr 
                      key={report.id} 
                      onClick={() => handleOpenReport(report.id)}
                      className="hover:bg-brand-50/40 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                              {report.product}
                            </div>
                            <div className="text-[11px] text-slate-400">ID: {String(report.id).slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {report.industry}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-500">{dateStr}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end text-xs font-semibold text-slate-700">
                          <Zap className="w-3.5 h-3.5 text-amber-500 mr-1 fill-amber-400" /> 
                          {(report.tokens_used || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReport(report.id);
                            }}
                            className="text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 p-2 rounded-lg transition-colors text-xs font-bold inline-flex items-center gap-1"
                            title="Open Playbook"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => handleDelete(e, report.id)}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filtered.length === 0 && (
          <div className="p-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No reports found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              {searchTerm ? 'No results matched your search term.' : 'Generate your first 6KLH objection handling playbook to see it here.'}
            </p>
            <button
              onClick={() => navigate('/generate')}
              className="mt-4 btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Generate First Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHistoryPage;
