import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, AlertCircle, Copy, CheckCircle2, Download, Share2 } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReportPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('objections');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    product: '',
    industry: '',
    businessModel: '',
    dealSize: '',
    buyerProfile: '',
    additionalContext: ''
  });

  const businessModels = ['B2B', 'B2C', 'D2C', 'SaaS', 'Franchise', 'Agency', 'Consulting'];
  const dealSizes = ['<1L', '1-5L', '5-25L', '25L-1Cr', '1Cr+'];
  const buyerProfiles = ['Business Owner', 'CXO', 'Purchase Manager', 'Startup Founder', 'Solopreneur'];

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.industry) {
      setError('Product and Industry are required.');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await api.post('/reports/generate', {
        product: formData.product,
        industry: formData.industry,
        businessModels: formData.businessModel ? [formData.businessModel] : [],
        dealSize: formData.dealSize || '',
        buyerProfiles: formData.buyerProfile ? [formData.buyerProfile] : [],
        additionalContext: formData.additionalContext || ''
      });
      setResult(res.data.report?.report_data || res.data.report);
      setIsGenerating(false);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate report. Please try again.';
      setError(msg);
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Generate Intelligence Report</h1>
        <p className="text-slate-500 mt-1">Fill in the details to get a customized 6KLH sales playbook.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="card p-6 space-y-6 sticky top-24">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product/Service Name *</label>
              <input type="text" className="input-field" value={formData.product} onChange={e => handleSelect('product', e.target.value)} placeholder="e.g. Sales Coaching Program" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
              <input type="text" className="input-field" value={formData.industry} onChange={e => handleSelect('industry', e.target.value)} placeholder="e.g. B2B Services" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Business Model</label>
              <div className="flex flex-wrap gap-2">
                {businessModels.map(model => (
                  <button key={model} type="button" onClick={() => handleSelect('businessModel', model)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${formData.businessModel === model ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {model}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Deal Size (INR)</label>
              <div className="flex flex-wrap gap-2">
                {dealSizes.map(size => (
                  <button key={size} type="button" onClick={() => handleSelect('dealSize', size)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${formData.dealSize === size ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Buyer Profile</label>
              <div className="flex flex-wrap gap-2">
                {buyerProfiles.map(profile => (
                  <button key={profile} type="button" onClick={() => handleSelect('buyerProfile', profile)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${formData.buyerProfile === profile ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {profile}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Context (Optional)</label>
              <textarea className="input-field h-24 resize-none" value={formData.additionalContext} onChange={e => handleSelect('additionalContext', e.target.value)} placeholder="Any specific objections you keep facing?"></textarea>
            </div>

            <button type="submit" disabled={isGenerating} className="w-full btn-primary py-4 text-lg font-bold shadow-brand-500/30">
              {isGenerating ? 'Analyzing...' : (
                <>Generate Playbook <Send className="w-5 h-5 ml-2" /></>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {isGenerating ? (
            <div className="card h-full min-h-[600px] flex flex-col items-center justify-center p-10 bg-slate-50">
              <LoadingSpinner size="lg" label="" />
              <h3 className="mt-6 text-xl font-display font-bold text-slate-900 animate-pulse">Running 6KLH Algorithm</h3>
              <p className="mt-2 text-slate-500 text-center max-w-sm">
                "An objection is just a request for more information masked as a rejection." - Manuj Bajaj
              </p>
            </div>
          ) : result ? (
            <div className="card h-full border-brand-200 shadow-md">
              <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-slate-50">
                <div className="flex space-x-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                  <button onClick={() => setActiveTab('objections')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'objections' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}>Objections & 6KLH</button>
                  <button onClick={() => setActiveTab('questions')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'questions' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}>Client Questions</button>
                  <button onClick={() => setActiveTab('inaction')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === 'inaction' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}>Inaction Cost</button>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button onClick={copyToClipboard} className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm tooltip" title="Copy to clipboard">
                    {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-white min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'objections' && (
                      <div className="space-y-6">
                        {result.objections.map((obj, i) => (
                          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{obj.category}</span>
                            </div>
                            <div className="p-5">
                              <h4 className="text-xl font-bold text-slate-900 mb-4">"{obj.text}"</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                  <span className="text-xs font-bold text-red-600 uppercase mb-1 block">The Stab</span>
                                  <p className="text-slate-800 italic">{obj.stab}</p>
                                </div>
                                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                  <span className="text-xs font-bold text-green-700 uppercase mb-1 block">The Twist</span>
                                  <p className="text-slate-800 italic">{obj.twist}</p>
                                </div>
                              </div>
                              
                              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
                                <span className="text-xs font-bold text-amber-700 uppercase mb-1 block">6KLH Breakdown</span>
                                <p className="text-slate-800 text-sm">{obj.sixKLH}</p>
                              </div>
                              
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <span className="text-xs font-bold text-blue-700 uppercase mb-1 block">Closing Pitch</span>
                                <p className="text-slate-800">{obj.pitch}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab !== 'objections' && (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p>Detailed analysis available in full generation.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="card h-full min-h-[600px] flex flex-col items-center justify-center p-10 bg-slate-50 border-dashed border-2 border-slate-200">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-display font-bold text-slate-700">Ready to Generate</h3>
              <p className="text-slate-500 text-center max-w-sm mt-2">
                Fill out the form on the left to generate your personalized sales intelligence playbook.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
