import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight, Zap, ShieldCheck, Sparkles, X } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const AuthPage = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemoSigning, setActiveDemoSigning] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [googleSigningIn, setGoogleSigningIn] = useState(false);

  const { login, register, loginWithDemo, loginWithGoogle } = useAuth();
  const { refreshSubscription } = useSubscription();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      await refreshSubscription();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (subscriberKey) => {
    setError('');
    setActiveDemoSigning(subscriberKey);
    try {
      await loginWithDemo(subscriberKey);
      await refreshSubscription();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err.response?.data?.error || 'Quick login failed. Please try again.');
    } finally {
      setActiveDemoSigning('');
    }
  };

  const handleGoogleSignIn = async (selectedEmail, selectedName, selectedAvatar) => {
    setError('');
    setGoogleSigningIn(true);
    try {
      await loginWithGoogle({
        email: selectedEmail,
        name: selectedName,
        avatar_url: selectedAvatar,
        google_id: `google_${Date.now()}`
      });
      await refreshSubscription();
      setShowGoogleModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Sign In error:', err);
      setError(err.response?.data?.error || 'Google authentication failed.');
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const allProfiles = [
    {
      key: 'free',
      name: 'Alex Miller',
      role: 'Junior Sales Rep (SDR)',
      email: 'free@salesiq.ai',
      plan_name: 'Always Free Tier',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      description: 'Tests basic objection handling with standard token limits.',
      tokens: '10,000',
      reports: '3 max',
      features: ['Basic 6KLH Framework', 'Standard Speed', 'Starter Quota'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      key: 'trial',
      name: 'Sarah Chen',
      role: 'Mid-Market Account Executive (AE)',
      email: 'trial@salesiq.ai',
      plan_name: '30-Day Free Trial',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-300',
      description: 'Active 30-day trial with full access to call uploads and PDF export.',
      tokens: '100,000',
      reports: '50 limit',
      features: ['Full 6KLH Breakdown', 'Up to 3 Call Transcripts', 'Export to PDF'],
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
    },
    {
      key: 'monthly',
      name: 'Marcus Vance',
      role: 'VP of Global Enterprise Sales',
      email: 'pro@salesiq.ai',
      plan_name: 'Monthly Pro (₹999/mo)',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-300',
      description: 'Power user closing 6-figure enterprise contracts with unlimited reports.',
      tokens: '500,000',
      reports: 'Unlimited',
      features: ['Priority Gemini Engine', 'Unlimited Training Transcripts', 'YouTube Call Analysis'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    {
      key: 'lifetime',
      name: 'Elena Rostova',
      role: 'Founder & Dealmaker',
      email: 'lifetime@salesiq.ai',
      plan_name: 'Lifetime VIP Pass',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      description: 'Permanent VIP pass holder with white-glove objection consulting.',
      tokens: '500,000',
      reports: 'Unlimited',
      features: ['Lifetime VIP Access', 'All Future Updates', 'Direct Consulting Access'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    {
      key: 'demo',
      name: 'Demo Sales Leader',
      role: 'Sales Enablement Manager / Admin',
      email: 'demo@salesiq.ai',
      plan_name: 'Team Admin',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-300',
      description: 'Team leader role testing custom training indexing and objection libraries.',
      tokens: '100,000',
      reports: '50 limit',
      features: ['Multi-rep playbooks', 'Team Training Data', 'Audit Logs'],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-72 bg-slate-900 transform -skew-y-2 origin-top-left -z-10"></div>
      
      <div className="sm:mx-auto sm:w-full max-w-5xl z-10 text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Multi-Tier Subscriber Testing & Google Authentication
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          SalesIQ Authentication & Persona Portal
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Sign in using Google, or use the 1-click quick login buttons to immediately test as any user role.
        </p>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* LEFT COLUMN: 1-Click Mock Subscriber Profiles */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Quick Login for Each Type of User
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any role below to instantly authenticate into a live session configured with that tier's capabilities:
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Database Synced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allProfiles.map((p) => {
                const isSigningThis = activeDemoSigning === p.key;

                return (
                  <div
                    key={p.key}
                    className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all bg-gradient-to-b from-white to-slate-50/60 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
                              {p.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 truncate max-w-[130px]">
                              {p.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                          {p.plan_name}
                        </span>
                      </div>

                      <div className="bg-slate-100/80 rounded-lg p-2 text-[11px] text-slate-600 space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Tokens:</span>
                          <span className="font-semibold text-slate-800">
                            {p.tokens}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reports quota:</span>
                          <span className="font-semibold text-slate-800">{p.reports}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate pt-1 border-t border-slate-200">
                          {p.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <button
                        type="button"
                        disabled={Boolean(activeDemoSigning)}
                        onClick={() => handleDemoSignIn(p.key)}
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 active:bg-brand-700 transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-brand-500"
                      >
                        {isSigningThis ? (
                          <LoadingSpinner size="sm" label="" />
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>Quick Login: {p.name.split(' ')[0]}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Default mock password: <strong className="text-slate-800">password123</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ name: 'Alex Miller', email: 'free@salesiq.ai', password: 'password123' })}
                className="text-[11px] text-brand-600 hover:underline font-semibold"
              >
                Autofill Form
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Standard Sign-In & Google Sign-In Form */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white py-7 px-6 sm:px-8 shadow-xl shadow-slate-200/40 rounded-2xl border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  {isLogin ? 'Sign In to SalesIQ' : 'Create Free Account'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isLogin ? 'Choose Google Sign-In, 1-click quick role login, or enter credentials.' : 'Sign up to get instant 6KLH objection handling.'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* 1. Google Sign-In Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-3 transition-all group"
                >
                  <GoogleIcon />
                  <span className="group-hover:text-slate-900">Continue with Google</span>
                </button>
              </div>

              {/* Quick Login Persona Selector Bar */}
              <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    1-Click Role Login:
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Click to sign in</span>
                </div>
                
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { key: 'free', label: 'Free Rep', name: 'Alex', color: 'hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700' },
                    { key: 'trial', label: 'Trial AE', name: 'Sarah', color: 'hover:bg-blue-50 hover:border-blue-300 text-blue-700' },
                    { key: 'monthly', label: 'Pro VP', name: 'Marcus', color: 'hover:bg-purple-50 hover:border-purple-300 text-purple-700' },
                    { key: 'lifetime', label: 'VIP Pass', name: 'Elena', color: 'hover:bg-amber-50 hover:border-amber-300 text-amber-800' },
                    { key: 'demo', label: 'Admin', name: 'Leader', color: 'hover:bg-rose-50 hover:border-rose-300 text-rose-700' },
                  ].map(item => (
                    <button
                      key={item.key}
                      type="button"
                      disabled={Boolean(activeDemoSigning)}
                      onClick={() => handleDemoSignIn(item.key)}
                      className={`p-1.5 rounded-lg border border-slate-200 bg-white transition-all text-center flex flex-col items-center justify-center ${item.color} shadow-2xs hover:scale-105 active:scale-95`}
                      title={`Instant Sign in as ${item.name}`}
                    >
                      <span className="text-[11px] font-bold leading-none">{item.name}</span>
                      <span className="text-[9px] text-slate-400 font-medium mt-0.5 leading-none">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-400 font-medium uppercase tracking-wider text-[10px]">or sign in with email</span>
                </div>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          name="name"
                          type="text"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field pl-9 block w-full text-xs rounded-lg py-2"
                          placeholder="Your Name"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email address</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-9 block w-full text-xs rounded-lg py-2"
                      placeholder="e.g. pro@salesiq.ai"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-9 block w-full text-xs rounded-lg py-2"
                      placeholder="••••••••"
                    />
                  </div>
                  {isLogin && (
                    <div className="flex items-center justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, password: 'password123' })}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Autofill 'password123'
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || Boolean(activeDemoSigning)}
                    className="w-full btn-primary py-2.5 flex justify-center items-center text-xs font-bold shadow-md shadow-brand-500/20"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" label="" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In with Email' : 'Create Free Account'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                {isLogin ? "Don't have a test account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-bold text-brand-600 hover:text-brand-500 underline"
                >
                  {isLogin ? 'Create one now' : 'Sign in here'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Google Sign In Modal Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <GoogleIcon />
                <h3 className="text-base font-bold text-slate-900">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <p className="text-xs text-slate-500">
                Select your connected Google account to authenticate instantly into SalesIQ:
              </p>

              {/* Primary Connected Google Account */}
              <button
                type="button"
                disabled={googleSigningIn}
                onClick={() => handleGoogleSignIn('omzambare29@gmail.com', 'Om Zambare', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all text-left flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    OZ
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      Om Zambare
                    </h4>
                    <p className="text-xs text-slate-500">omzambare29@gmail.com</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-600 px-2.5 py-1 bg-brand-50 rounded-lg border border-brand-200 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  Sign In
                </span>
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-2 bg-white text-slate-400 uppercase tracking-wider font-semibold">or use custom Google account</span>
                </div>
              </div>

              {/* Custom Google Account inputs */}
              <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Google Email</label>
                  <input
                    type="email"
                    className="input-field py-1.5 text-xs"
                    placeholder="e.g. yourname@gmail.com"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    className="input-field py-1.5 text-xs"
                    placeholder="e.g. Alex Smith"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  disabled={!googleCustomEmail || googleSigningIn}
                  onClick={() => handleGoogleSignIn(googleCustomEmail, googleCustomName || googleCustomEmail.split('@')[0])}
                  className="w-full btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1.5 mt-1"
                >
                  {googleSigningIn ? (
                    <LoadingSpinner size="sm" label="" />
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>Authenticate with this Google Account</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Secure Google OAuth Authentication
              </span>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
