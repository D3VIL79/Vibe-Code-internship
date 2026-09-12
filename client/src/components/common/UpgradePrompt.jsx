import { Link } from 'react-router-dom';
import { AlertTriangle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const UpgradePrompt = ({ feature = "this feature", limitReached = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 sm:p-8 max-w-lg mx-auto text-center relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-brand-500"></div>
      
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
        {limitReached ? <AlertTriangle className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        {limitReached ? "Token Limit Reached" : "Upgrade Required"}
      </h3>
      
      <p className="text-slate-600 mb-6">
        {limitReached 
          ? "You have used all your available tokens for this billing period. Upgrade your plan to continue generating powerful sales intelligence."
          : `Your current plan doesn't include access to ${feature}. Upgrade to unlock this and other premium capabilities.`
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/pricing" className="btn-primary py-3 px-6 shadow-md shadow-brand-500/20">
          View Upgrade Options
        </Link>
        <button className="btn-secondary py-3 px-6">
          Dismiss
        </button>
      </div>
    </motion.div>
  );
};

export default UpgradePrompt;
