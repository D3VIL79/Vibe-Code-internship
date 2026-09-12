import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState({
    plan: 'free',
    planName: 'Always Free',
    tokensUsed: 0,
    tokensLimit: 10000,
    reportsGenerated: 0
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      setSubscription({
        plan: 'free',
        planName: 'Always Free',
        tokensUsed: 0,
        tokensLimit: 10000,
        reportsGenerated: 0
      });
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.get('/subscriptions/status');
      if (res.data && res.data.plan_id) {
        setSubscription({
          plan: res.data.plan_id,
          planName: res.data.plan_name || res.data.plan_id,
          tokensUsed: res.data.tokens_used || 0,
          tokensLimit: res.data.tokens_limit || 10000,
          reportsGenerated: res.data.reports_generated || 0,
          features: res.data.features || {}
        });
      } else {
        setSubscription({
          plan: 'free',
          planName: 'Always Free',
          tokensUsed: 0,
          tokensLimit: 10000,
          reportsGenerated: 0
        });
      }
    } catch (error) {
      setSubscription({
        plan: 'free',
        planName: 'Always Free',
        tokensUsed: 0,
        tokensLimit: 10000,
        reportsGenerated: 0
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await api.get('/subscriptions/plans');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price_inr === 0 ? '$0' : `₹${p.price_inr}`,
          billing: p.billing_cycle === 'lifetime' ? 'one-time' : 'monthly',
          features: [
            `${(p.token_limit || 10000).toLocaleString()} Tokens`,
            p.report_limit === -1 ? 'Unlimited Reports' : `${p.report_limit} Reports`,
            p.features?.pdf_export ? 'Export PDF / Word' : 'Standard Export',
            p.features?.share_reports ? 'Shareable Reports' : 'Community Support',
          ],
          highlighted: p.id === 'monthly' || p.id === 'trial'
        }));
        setPlans(formatted);
      } else {
        setPlans([
          { id: 'free', name: 'Free', price: '$0', billing: 'monthly', features: ['10,000 Tokens', '3 Reports', 'Community Support'], highlighted: false },
          { id: 'trial', name: 'Free Trial', price: '$0', billing: 'monthly', features: ['100,000 Tokens', '50 Reports', 'Training Data Uploads'], highlighted: true },
          { id: 'monthly', name: 'Monthly Pro', price: '₹999', billing: 'monthly', features: ['500,000 Tokens', 'Unlimited Reports', 'Custom Training Data', 'Priority Support'], highlighted: false },
          { id: 'lifetime', name: 'Lifetime Pass', price: '₹9999', billing: 'one-time', features: ['500,000 Tokens', 'Unlimited Reports', 'All Future Updates', 'VIP Access'], highlighted: false },
        ]);
      }
    } catch (error) {
      setPlans([
        { id: 'free', name: 'Free', price: '$0', billing: 'monthly', features: ['10,000 Tokens', '3 Reports', 'Community Support'], highlighted: false },
        { id: 'trial', name: 'Free Trial', price: '$0', billing: 'monthly', features: ['100,000 Tokens', '50 Reports', 'Training Data Uploads'], highlighted: true },
        { id: 'monthly', name: 'Monthly Pro', price: '₹999', billing: 'monthly', features: ['500,000 Tokens', 'Unlimited Reports', 'Custom Training Data', 'Priority Support'], highlighted: false },
        { id: 'lifetime', name: 'Lifetime Pass', price: '₹9999', billing: 'one-time', features: ['500,000 Tokens', 'Unlimited Reports', 'All Future Updates', 'VIP Access'], highlighted: false },
      ]);
    }
  }, []);

  useEffect(() => {
    refreshSubscription();
    fetchPlans();
  }, [refreshSubscription, fetchPlans]);

  const isFeatureAllowed = (feature) => {
    if (!subscription) return false;
    if (subscription.plan === 'lifetime' || subscription.plan === 'monthly' || subscription.plan === 'trial') return true;
    if (feature === 'basic_reports') return true;
    return false;
  };

  const tokenPercentUsed = subscription && subscription.tokensLimit > 0
    ? Math.min(100, Math.round((subscription.tokensUsed / subscription.tokensLimit) * 100))
    : 0;

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      plans,
      loading,
      refreshSubscription,
      isFeatureAllowed,
      tokenPercentUsed
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
