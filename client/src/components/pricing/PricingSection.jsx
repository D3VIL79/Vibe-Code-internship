import { useState, useEffect } from 'react';
import PricingCard from './PricingCard';
import { useSubscription } from '../../contexts/SubscriptionContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { motion } from 'framer-motion';

const PricingSection = () => {
  const { plans, loading } = useSubscription();
  const [localPlans, setLocalPlans] = useState([]);

  useEffect(() => {
    if (plans && plans.length > 0) {
      setLocalPlans(plans);
    } else {
      // Fallback if context doesn't provide them
      setLocalPlans([
        { id: 'free', name: 'Free Tier', price: '$0', billing: 'monthly', features: ['5,000 Tokens/mo', 'Basic Reports', 'Community Support'], highlighted: false },
        { id: 'pro', name: 'Professional', price: '$49', billing: 'monthly', features: ['100,000 Tokens/mo', 'Advanced 6KLH Reports', 'Custom Training Data', 'Priority Support', 'Export to PDF/Word'], highlighted: true },
        { id: 'team', name: 'Team', price: '$149', billing: 'monthly', features: ['500,000 Tokens/mo', 'Everything in Pro', 'Up to 5 Users', 'Team Analytics', 'API Access'], highlighted: false },
        { id: 'lifetime', name: 'Lifetime Deal', price: '$999', billing: 'one-time', features: ['Unlimited Tokens*', 'All Future Updates', 'Direct Feedback Loop', 'White-glove Onboarding', 'Private Slack Channel'], highlighted: false },
      ]);
    }
  }, [plans]);

  if (loading && localPlans.length === 0) return <LoadingSpinner label="Loading plans..." />;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {localPlans.map(plan => (
        <motion.div variants={item} key={plan.id} className="h-full">
          <PricingCard plan={plan} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PricingSection;
