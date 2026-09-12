import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex-shrink-0 flex items-center mb-4">
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Sales<span className="text-brand-500">IQ</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6 text-sm">
              AI-Powered Sales Intelligence built on Manuj Bajaj's Stab & Twist methodology. Close more deals by handling objections like a pro.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className="text-slate-400 hover:text-brand-400 transition">Features</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-brand-400 transition">Pricing</Link></li>
              <li><Link to="/methodology" className="text-slate-400 hover:text-brand-400 transition">6KLH Methodology</Link></li>
              <li><Link to="/changelog" className="text-slate-400 hover:text-brand-400 transition">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-brand-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-brand-400 transition">Contact</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-brand-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-brand-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SalesIQ. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm mt-4 md:mt-0 flex items-center">
            Powered by Manuj Bajaj Sales Coach Systems
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
