import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    
    try {
      // Mock API call since actual endpoints might not exist yet
      // const res = await api.get('/subscriptions/current');
      // setSubscription(res.data);
      
      // Temporary mock data for development
      setSubscription({
        plan: 'pro',
        tokensUsed: 12500,
        tokensLimit: 50000,
        reportsGenerated: 42
      });
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPlans = useCallback(async () => {
    try {
      // Mock data for plans
      setPlans([
        { id: 'free', name: 'Free', price: '$0', billing: 'monthly', features: ['1,000 Tokens/mo', 'Basic Reports', 'Standard Support'], highlighted: false },
        { id: 'pro', name: 'Pro', price: '$49', billing: 'monthly', features: ['50,000 Tokens/mo', 'Advanced Reports', 'Custom Training', 'Priority Support'], highlighted: true },
        { id: 'lifetime', name: 'Lifetime', price: '$999', billing: 'one-time', features: ['Unlimited Tokens', 'All Features', 'Early Access', 'White-glove Onboarding'], highlighted: false },
      ]);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  }, []);

  useEffect(() => {
    refreshSubscription();
    fetchPlans();
  }, [refreshSubscription, fetchPlans]);

  const isFeatureAllowed = (feature) => {
    if (!subscription) return false;
    // Basic mock logic
    if (subscription.plan === 'lifetime' || subscription.plan === 'pro') return true;
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
