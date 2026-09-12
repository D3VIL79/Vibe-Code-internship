import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SubscriptionBadge from '../dashboard/SubscriptionBadge';
import DemoSubscriberSwitcher from '../common/DemoSubscriberSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Sales<span className="text-brand-500">IQ</span>
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link to="/" className="text-slate-500 hover:text-slate-900 inline-flex items-center px-1 pt-1 font-medium text-sm">Home</Link>
              <Link to="/pricing" className="text-slate-500 hover:text-slate-900 inline-flex items-center px-1 pt-1 font-medium text-sm">Pricing</Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 inline-flex items-center px-1 pt-1 font-medium text-sm">Dashboard</Link>
                  <Link to="/generate" className="text-slate-500 hover:text-slate-900 inline-flex items-center px-1 pt-1 font-medium text-sm">Generate</Link>
                  <Link to="/reports" className="text-slate-500 hover:text-slate-900 inline-flex items-center px-1 pt-1 font-medium text-sm">Reports</Link>
                  <Link to="/training" className="text-slate-500 hover:text-slate-900 inline-flex items-center px-1 pt-1 font-medium text-sm">Training</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Demo Subscriber Profile Switcher */}
            <DemoSubscriberSwitcher />

            {user ? (
              <div className="flex items-center space-x-3">
                <SubscriptionBadge />
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition border border-slate-200">
                    <img 
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'} 
                      alt={user.name || 'User'} 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate pr-1">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg py-1 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <Link to="/generate" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                      <Zap className="w-4 h-4 mr-2" /> New Report
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-md text-sm">Log in</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50">Home</Link>
            <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50">Pricing</Link>
            {user && (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/generate" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Generate Playbook</Link>
                <Link to="/reports" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Saved Reports</Link>
                <Link to="/training" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Training Data</Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200">
            <div className="px-4 mb-3">
              <DemoSubscriberSwitcher />
            </div>
            {user ? (
              <div className="px-2 space-y-1">
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center">
                  <LogOut className="w-5 h-5 mr-2" /> Sign out
                </button>
              </div>
            ) : (
              <div className="px-4 flex flex-col space-y-2">
                <Link to="/login" className="btn-secondary w-full justify-center">Log in</Link>
                <Link to="/register" className="btn-primary w-full justify-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
