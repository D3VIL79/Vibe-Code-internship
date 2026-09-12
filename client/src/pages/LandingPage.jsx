import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import PricingSection from '../components/pricing/PricingSection';

const LandingPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-400 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
              Powered by Manuj Bajaj's Stab & Twist Methodology
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
              AI-Powered Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-400">Objection Killer</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Generate elite-level sales rebuttals tailored to your product. Stop losing deals to "it's too expensive" or "let me think about it."
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-brand-500/20 shadow-lg group">
                Start Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="btn-secondary bg-slate-800 border-slate-700 text-white hover:bg-slate-700 text-lg px-8 py-4 w-full sm:w-auto">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 sm:text-4xl">Smarter Sales Intelligence</h2>
            <p className="mt-4 text-xl text-slate-600">Everything you need to close more high-ticket deals.</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item} className="card p-8 bg-white border-slate-200">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-6 text-brand-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Objection Defense</h3>
              <p className="text-slate-600">Generate powerful "Stab & Twist" responses based on proven 6KLH principles tailored to any buyer persona.</p>
            </motion.div>

            <motion.div variants={item} className="card p-8 bg-white border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Training Data</h3>
              <p className="text-slate-600">Upload your own sales calls, YouTube videos, or text transcripts to make the AI sound exactly like you.</p>
            </motion.div>

            <motion.div variants={item} className="card p-8 bg-white border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Token-Based Usage</h3>
              <p className="text-slate-600">Pay only for what you use. Flexible pricing tiers from Free to Pro, with an exclusive Lifetime deal.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900">How It Works</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
            
            {[
              { num: 1, title: 'Describe Your Offer', desc: 'Enter product details & target buyer' },
              { num: 2, title: 'AI Generates Defenses', desc: 'Gets 6KLH objections & scripts' },
              { num: 3, title: 'Close More Deals', desc: 'Use the playbook in real calls' }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center bg-white p-4">
                <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-brand-500/30">
                  {step.num}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-500 text-center text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Choose the perfect plan for your sales team.</p>
          </div>
          <PricingSection />
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
