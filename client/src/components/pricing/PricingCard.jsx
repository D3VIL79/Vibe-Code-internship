import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const PricingCard = ({ plan }) => {
  const { user } = useAuth();
  const { subscription, refreshSubscription } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const isCurrentPlan = user && subscription?.plan === plan.id;

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setUpgrading(true);
      setFeedback('');
      await api.post('/subscriptions/upgrade', { planId: plan.id });
      await refreshSubscription();
      setFeedback(`Upgraded to ${plan.name}!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      console.error('Upgrade error:', err);
      setFeedback(err.response?.data?.error || 'Upgrade failed. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className={`relative flex flex-col p-7 bg-white rounded-2xl border transition-all h-full justify-between ${
        plan.highlighted 
          ? 'border-brand-500 shadow-xl shadow-brand-500/10 ring-2 ring-brand-500/20' 
          : 'border-slate-200 shadow-sm'
      }`}
    >
      {plan.highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-brand-500 text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md">
            Most Popular
          </span>
        </div>
      )}
      
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
            {isCurrentPlan && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Current
              </span>
            )}
          </div>
          <div className="mt-3 flex items-baseline text-4xl font-extrabold text-slate-900">
            {plan.price}
            <span className="ml-1 text-sm font-medium text-slate-500">
              /{plan.billing === 'monthly' ? 'mo' : plan.billing === 'one-time' ? 'lifetime' : 'yr'}
            </span>
          </div>
          {plan.description && (
            <p className="text-xs text-slate-500 mt-2">{plan.description}</p>
          )}
        </div>
        
        <ul className="space-y-3 mb-8 text-xs">
          {plan.features?.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4 text-brand-500 font-bold" />
              </div>
              <p className="ml-2.5 text-slate-700 leading-tight">{feature}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {feedback && (
          <div className="mb-3 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-1.5 px-2">
            {feedback}
          </div>
        )}

        {isCurrentPlan ? (
          <button 
            disabled
            className="w-full py-3 px-4 text-center rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active Subscription</span>
          </button>
        ) : user ? (
          <button 
            type="button"
            disabled={upgrading}
            onClick={handleUpgrade}
            className={`w-full py-3 px-4 text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              plan.highlighted
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-brand-500/20'
                : 'bg-slate-900 text-white hover:bg-brand-600'
            }`}
          >
            {upgrading ? (
              <LoadingSpinner size="sm" label="" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Switch to {plan.name}</span>
              </>
            )}
          </button>
        ) : (
          <Link 
            to={`/login?plan=${plan.id}`} 
            className={`w-full py-3 px-4 text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              plan.highlighted
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <span>{plan.price === '$0' ? 'Start for Free' : plan.billing === 'one-time' ? 'Get Lifetime Access' : 'Subscribe Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default PricingCard;
