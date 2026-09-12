import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PlusCircle, Upload, FileText, Zap, ChevronRight, Crown } from 'lucide-react';
import TokenMeter from '../components/dashboard/TokenMeter';
import SubscriptionBadge from '../components/dashboard/SubscriptionBadge';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user } = useAuth();
  const { subscription, loading } = useSubscription();

  const recentReports = [
    { id: 1, product: 'SaaS Platform CRM', industry: 'B2B Software', date: 'Oct 24, 2023', tokens: 450 },
    { id: 2, product: 'Premium Coaching', industry: 'Consulting', date: 'Oct 22, 2023', tokens: 620 },
    { id: 3, product: 'Real Estate Masterclass', industry: 'Education', date: 'Oct 19, 2023', tokens: 510 },
  ];

  if (loading || !subscription) return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your intelligence tools today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-600">Current Plan:</span>
          <SubscriptionBadge />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Token Usage Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap className="w-24 h-24" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-6 w-full">Token Usage</h3>
          <TokenMeter used={subscription.tokensUsed} limit={subscription.tokensLimit} />
          
          <div className="w-full mt-6 bg-slate-50 rounded-lg p-3 border border-slate-100 flex justify-between items-center">
            <span className="text-sm text-slate-500">Tokens refresh in 12 days</span>
            {subscription.plan !== 'lifetime' && (
              <Link to="/pricing" className="text-sm font-medium text-brand-600 hover:text-brand-700">Upgrade</Link>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/generate" className="group flex flex-col items-center p-6 bg-brand-50 rounded-xl border border-brand-100 hover:bg-brand-100 hover:border-brand-200 transition-all text-center">
                <div className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="font-semibold text-brand-900">New Report</span>
                <span className="text-xs text-brand-600 mt-1">Generate sales intelligence</span>
              </Link>
              
              <Link to="/training" className="group flex flex-col items-center p-6 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-semibold text-blue-900">Train AI</span>
                <span className="text-xs text-blue-600 mt-1">Upload transcripts & video</span>
              </Link>
              
              <Link to="/reports" className="group flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all text-center">
                <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-900">View History</span>
                <span className="text-xs text-slate-500 mt-1">Access past reports</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Reports</h3>
            <Link to="/reports" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentReports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mr-4 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{report.product}</h4>
                    <p className="text-xs text-slate-500">{report.industry} • {report.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700 flex items-center justify-end">
                    <Zap className="w-3 h-3 text-amber-500 mr-1" /> {report.tokens}
                  </div>
                  <button className="text-xs text-brand-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upgrade Prompt if not lifetime */}
        {subscription.plan !== 'lifetime' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500 rounded-full opacity-20 blur-2xl"></div>
            <Crown className="w-10 h-10 text-brand-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Upgrade to Lifetime</h3>
            <p className="text-slate-400 text-sm mb-6">
              Never pay monthly fees again. Get unlimited tokens and exclusive access to new features.
            </p>
            <Link to="/pricing" className="btn-primary w-full shadow-lg shadow-brand-500/20 text-center">
              View Lifetime Deal
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
