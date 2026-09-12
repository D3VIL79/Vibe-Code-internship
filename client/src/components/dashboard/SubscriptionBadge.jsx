import { Sparkles } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SubscriptionBadge = () => {
  const { subscription, loading } = useSubscription();

  if (loading || !subscription) return null;

  const plan = (subscription?.plan || 'free').toLowerCase();
  
  const styles = {
    free: "bg-slate-100 text-slate-600 border-slate-200",
    trial: "bg-blue-50 text-blue-700 border-blue-200",
    pro: "bg-brand-50 text-brand-700 border-brand-200",
    monthly: "bg-brand-50 text-brand-700 border-brand-200",
    lifetime: "bg-amber-50 text-amber-700 border-amber-200"
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[plan] || styles.free}`}>
      {plan !== 'free' && <Sparkles className="w-3 h-3 mr-1" />}
      {plan.toUpperCase()}
    </div>
  );
};

export default SubscriptionBadge;
