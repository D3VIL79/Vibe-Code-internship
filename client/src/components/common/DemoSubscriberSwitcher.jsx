import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Sparkles, Users, Check, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoSubscriberSwitcher = () => {
  const { user, loginWithDemo, demoProfiles } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = async (key) => {
    try {
      setSwitching(true);
      await loginWithDemo(key);
      await refreshSubscription();
      setIsOpen(false);
      navigate('/dashboard');
    } catch (e) {
      console.error('Failed to switch subscriber:', e);
    } finally {
      setSwitching(false);
    }
  };

  const getPlanBadge = (planId) => {
    switch (planId) {
      case 'lifetime':
        return { text: 'VIP Lifetime', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'monthly':
        return { text: 'Monthly Pro', color: 'bg-teal-100 text-teal-800 border-teal-300' };
      case 'trial':
        return { text: 'Free Trial', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { text: 'Always Free', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        id="demo-subscriber-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors border border-slate-700 shadow-sm"
        title="Switch between mock subscriber profiles"
      >
        <Users className="w-3.5 h-3.5 text-brand-400" />
        <span className="hidden sm:inline">Mock Persona:</span>
        <span className="text-brand-300 font-bold truncate max-w-[110px]">
          {user ? user.name.split(' ')[0] : 'Select Profile'}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subscriber Profiles</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-medium">1-Click Switch</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Toggle tier to test limits, tokens, and reports</p>
            </div>

            <div className="p-1 space-y-1 max-h-[360px] overflow-y-auto">
              {demoProfiles.map((profile) => {
                const isCurrent = user?.email?.toLowerCase() === profile.email.toLowerCase();
                const badge = getPlanBadge(profile.plan_id);

                return (
                  <button
                    key={profile.key}
                    type="button"
                    disabled={switching}
                    onClick={() => handleSwitch(profile.key)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start space-x-3 ${
                      isCurrent 
                        ? 'bg-brand-50/80 border border-brand-200' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{profile.name}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{profile.role}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                        <span>⚡ {(profile.tokens_limit || 0).toLocaleString()} tokens</span>
                        <span>•</span>
                        <span>{profile.reports_generated} reports</span>
                      </div>
                    </div>
                    {isCurrent && (
                      <Check className="w-4 h-4 text-brand-600 mt-1 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-xl text-center">
              <span className="text-[11px] text-slate-500">
                All profiles pre-loaded with persistent test data
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DemoSubscriberSwitcher;
