import PricingSection from '../components/pricing/PricingSection';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const faqs = [
    { q: "What are tokens?", a: "Tokens represent AI processing power. Generally, 1,000 tokens equals about 750 words of input/output. A standard report costs roughly 1,500-2,500 tokens." },
    { q: "Can I cancel anytime?", a: "Yes, monthly subscriptions can be cancelled at any time from your dashboard." },
    { q: "Is the Lifetime deal really unlimited?", a: "Yes, it includes unlimited usage subject to fair use policies to prevent abuse/automation. Perfect for heavy daily sales users." },
    { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee on all paid plans if you're not satisfied with the quality of the reports." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl font-display font-extrabold text-slate-900 sm:text-5xl"
          >
            Invest in Closing <span className="text-brand-500">More Deals</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="mt-4 text-xl text-slate-600"
          >
            Stop losing commissions to simple objections. Equip yourself with AI-generated rebuttals tailored to your exact product.
          </motion.p>
        </div>

        <PricingSection />

        {/* FAQs */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
              >
                <h4 className="flex items-start text-lg font-bold text-slate-900 mb-3">
                  <HelpCircle className="h-6 w-6 text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-slate-600 pl-8">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
