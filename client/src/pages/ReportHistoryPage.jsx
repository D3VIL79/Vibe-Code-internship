import { useState } from 'react';
import { Search, Filter, FileText, ChevronRight, Zap, Trash2 } from 'lucide-react';

const ReportHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [reports] = useState([
    { id: 1, product: 'SaaS Platform CRM', industry: 'B2B Software', date: 'Oct 24, 2023', tokens: 450, status: 'completed' },
    { id: 2, product: 'Premium Coaching', industry: 'Consulting', date: 'Oct 22, 2023', tokens: 620, status: 'completed' },
    { id: 3, product: 'Real Estate Masterclass', industry: 'Education', date: 'Oct 19, 2023', tokens: 510, status: 'completed' },
    { id: 4, product: 'Fitness Franchise App', industry: 'Health & Fitness', date: 'Oct 10, 2023', tokens: 890, status: 'completed' },
    { id: 5, product: 'Digital Marketing Retainer', industry: 'Agency', date: 'Oct 05, 2023', tokens: 320, status: 'completed' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Report History</h1>
          <p className="text-slate-500 mt-1">Access and manage your previously generated intelligence reports.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="pl-10 input-field w-full sm:w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 bg-white shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product / Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Industry</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cost</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reports.filter(r => r.product.toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{report.product}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">{report.industry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-500">{report.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end text-sm font-medium text-slate-700">
                      <Zap className="w-4 h-4 text-amber-500 mr-1" /> {report.tokens}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-brand-600 hover:text-brand-900 bg-brand-50 p-2 rounded-md">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reports.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No reports found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by generating your first intelligence report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHistoryPage;
