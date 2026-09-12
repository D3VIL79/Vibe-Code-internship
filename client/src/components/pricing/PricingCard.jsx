import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingCard = ({ plan }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`relative flex flex-col p-8 bg-white rounded-2xl border ${
        plan.highlighted 
          ? 'border-brand-500 shadow-xl shadow-brand-500/10' 
          : 'border-slate-200 shadow-sm'
      }`}
    >
      {plan.highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-brand-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
        <div className="mt-4 flex items-baseline text-5xl font-extrabold text-slate-900">
          {plan.price}
          <span className="ml-1 text-xl font-medium text-slate-500">
            /{plan.billing === 'monthly' ? 'mo' : plan.billing === 'one-time' ? 'lifetime' : 'yr'}
          </span>
        </div>
      </div>
      
      <ul className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-brand-500" />
            </div>
            <p className="ml-3 text-base text-slate-700">{feature}</p>
          </li>
        ))}
      </ul>
      
      <Link 
        to="/register" 
        className={`w-full py-3 px-6 text-center rounded-lg font-medium transition-colors ${
          plan.highlighted
            ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-lg'
            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
        }`}
      >
        {plan.price === '$0' ? 'Start for Free' : plan.billing === 'one-time' ? 'Get Lifetime Access' : 'Subscribe Now'}
      </Link>
    </motion.div>
  );
};

export default PricingCard;
