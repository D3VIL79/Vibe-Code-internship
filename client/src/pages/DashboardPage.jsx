import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PlusCircle, Upload, FileText, Zap, ChevronRight, Crown, Users, CheckCircle2, ArrowUpRight } from 'lucide-react';
import TokenMeter from '../components/dashboard/TokenMeter';
import SubscriptionBadge from '../components/dashboard/SubscriptionBadge';
import { motion } from 'framer-motion';
import api from '../services/api';

const DashboardPage = () => {
  const { user, loginWithDemo, demoProfiles } = useAuth();
  const { subscription, loading: subLoading, refreshSubscription } = useSubscription();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [switchingPersona, setSwitchingPersona] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchRecentReports = async () => {
      try {
        setLoadingReports(true);
        const res = await api.get('/reports');
        if (isMounted) {
          setReports(res.data || []);
        }
      } catch (e) {
        console.warn('Could not fetch user reports:', e.message);
      } finally {
        if (isMounted) setLoadingReports(false);
      }
    };

    fetchRecentReports();
    return () => { isMounted = false; };
  }, [user]);

  const handleSwitchSubscriber = async (key) => {
    try {
      setSwitchingPersona(key);
      await loginWithDemo(key);
      await refreshSubscription();
    } catch (e) {
      console.error('Error switching subscriber persona:', e);
    } finally {
      setSwitchingPersona('');
    }
  };

  if (subLoading || !subscription) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Syncing subscriber metrics...</p>
      </div>
    );
  }

  const fallbackSampleReports = [
    { id: 'sample-1', product: 'SaaS Platform CRM (6KLH)', industry: 'B2B Software', created_at: new Date().toISOString(), tokens_used: 1250 },
    { id: 'sample-2', product: 'High-Ticket Agency Retainer', industry: 'Consulting', created_at: new Date(Date.now() - 86400000).toISOString(), tokens_used: 1820 },
  ];

  const displayReports = reports.length > 0 ? reports.slice(0, 5) : fallbackSampleReports;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner: Quick Subscriber Persona Switcher */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/10 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">Subscriber Persona Sandbox</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/30 text-brand-300 border border-brand-500/40">
                  Live DB
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Switch profiles in 1 click to test how the UI adapts to each subscription tier:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { key: 'free', label: 'Free Rep', plan: 'Alex', badge: '10k' },
              { key: 'trial', label: 'Trial AE', plan: 'Sarah', badge: '100k' },
              { key: 'monthly', label: 'Pro VP', plan: 'Marcus', badge: '500k' },
              { key: 'lifetime', label: 'VIP Pass', plan: 'Elena', badge: 'Unlimited' },
              { key: 'admin', label: 'Admin', plan: 'Jordan', badge: 'Superuser' }
            ].map(item => {
              const isSelected = user?.email?.startsWith(item.key) || 
                                 (item.key === 'monthly' && user?.email === 'pro@salesiq.ai') ||
                                 (item.key === 'admin' && user?.email === 'admin@salesiq.ai');
              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={Boolean(switchingPersona)}
                  onClick={() => handleSwitchSubscriber(item.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                    isSelected 
                      ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/20 ring-2 ring-brand-300/40' 
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-[10px] font-normal opacity-80">{item.badge}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
            alt={user?.name || 'User'} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Welcome back, {user?.name || 'Sales Leader'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Signed in as <strong className="text-slate-700">{user?.email}</strong> • Real-time 6KLH Sales Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2.5 px-4 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tier:</span>
          <SubscriptionBadge />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Token Usage Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 flex flex-col items-center justify-between relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Zap className="w-28 h-28 text-brand-600" />
          </div>
          
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Token Allocation</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {subscription.plan === 'lifetime' ? 'Lifetime Pool' : 'Monthly Pool'}
            </span>
          </div>

          <TokenMeter used={subscription.tokensUsed} limit={subscription.tokensLimit} />
          
          <div className="w-full mt-6 bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">
              {subscription.plan === 'lifetime' ? 'Unlimited access guaranteed' : 'Tokens refresh on the 1st'}
            </span>
            {subscription.plan !== 'lifetime' && (
              <Link to="/pricing" className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
                Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 lg:col-span-2 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900">Intelligence Workflows</h3>
              <span className="text-xs text-slate-400 font-medium">6KLH Framework & Objection Coach</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/generate" className="group flex flex-col items-center p-5 bg-brand-50/70 rounded-2xl border border-brand-100/80 hover:bg-brand-100/90 hover:border-brand-200 transition-all text-center">
                <div className="w-12 h-12 bg-brand-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-brand-950">New 6KLH Playbook</span>
                <span className="text-[11px] text-brand-700 mt-1">Stab & twist objection scripts</span>
              </Link>
              
              <Link to="/training" className="group flex flex-col items-center p-5 bg-blue-50/70 rounded-2xl border border-blue-100/80 hover:bg-blue-100/90 hover:border-blue-200 transition-all text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-blue-950">Train Custom AI</span>
                <span className="text-[11px] text-blue-700 mt-1">Upload call recordings & notes</span>
              </Link>
              
              <Link to="/reports" className="group flex flex-col items-center p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all text-center">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center mb-3 shadow-md shadow-slate-700/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-slate-900">Database History</span>
                <span className="text-[11px] text-slate-500 mt-1">Access saved reports</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Database records safely stored in JSON/PostgreSQL backend
            </span>
            <Link to="/pricing" className="text-brand-600 hover:underline font-semibold">
              View Tier Specifications →
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports List */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 lg:col-span-2 bg-white">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Playbooks & Reports</h3>
              <p className="text-xs text-slate-500">Generated using your current subscriber intelligence quota</p>
            </div>
            <Link to="/reports" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all ({reports.length}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {displayReports.map((report) => {
              const dateStr = report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              }) : 'Recent';

              return (
                <div 
                  key={report.id} 
                  onClick={() => navigate(`/generate?id=${report.id}`)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center min-w-0 pr-3">
                    <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                        {report.product}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {report.industry} • {dateStr}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-end">
                      <Zap className="w-3.5 h-3.5 text-amber-500 mr-1 fill-amber-400" /> {report.tokens_used || report.tokens || 1000}
                    </div>
                    <span className="text-[11px] text-brand-600 font-semibold group-hover:underline">
                      Open Playbook →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upgrade Prompt or VIP Status */}
        {subscription.plan !== 'lifetime' ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden border border-slate-800 flex flex-col justify-between">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500 rounded-full opacity-20 blur-2xl"></div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-4 text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Special Opportunity</span>
              <h3 className="text-xl font-bold mt-1 mb-2 text-white">Upgrade to Lifetime VIP</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Never pay monthly subscription invoices again. Get permanent 500,000 monthly token allowances and unlimited 6KLH objection reports.
              </p>
            </div>
            <Link to="/pricing" className="btn-primary w-full py-3 shadow-lg shadow-brand-500/20 text-center text-xs font-bold">
              Explore Lifetime Deal (₹9,999)
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 text-white relative overflow-hidden border border-amber-500/30 flex flex-col justify-between">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500 rounded-full opacity-10 blur-2xl"></div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4 text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Lifetime Pass Activated</span>
              <h3 className="text-xl font-bold mt-1 mb-2 text-white">VIP Founding Member</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                You have unrestricted access to all 6KLH sales generation tools, unlimited custom AI transcript learning, and priority processing.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 text-center font-semibold">
              ⭐ VIP Status Active • Zero Recurring Fees
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
