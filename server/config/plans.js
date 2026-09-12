/**
 * Application Subscription Plans Definition
 */
export const PLANS = {
  free: {
    id: 'free',
    name: 'Always Free',
    price_inr: 0,
    billing_cycle: 'monthly',
    token_limit: 10000,
    report_limit: 3,
    features: {
      pdf_export: false,
      training_uploads: 0,
      share_reports: false
    },
    is_active: true
  },
  trial: {
    id: 'trial',
    name: 'Free Trial 1 Month',
    price_inr: 0,
    billing_cycle: 'monthly',
    token_limit: 100000,
    report_limit: 50,
    features: {
      pdf_export: true,
      training_uploads: 3,
      share_reports: true
    },
    is_active: true
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly ₹999',
    price_inr: 999,
    billing_cycle: 'monthly',
    token_limit: 500000,
    report_limit: -1, // -1 implies unlimited
    features: {
      pdf_export: true,
      training_uploads: -1,
      share_reports: true
    },
    is_active: true
  },
  lifetime: {
    id: 'lifetime',
    name: 'One-Time ₹9999',
    price_inr: 9999,
    billing_cycle: 'lifetime',
    token_limit: 500000,
    report_limit: -1,
    features: {
      pdf_export: true,
      training_uploads: -1,
      share_reports: true
    },
    is_active: true
  }
};

export default PLANS;
