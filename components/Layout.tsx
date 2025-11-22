
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Map, Database, Info, Home, Zap, BrainCircuit } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return 'bg-orange-500 text-white';
    if (path !== '/' && location.pathname.startsWith(path)) return 'bg-orange-500 text-white';
    return 'text-slate-400 hover:text-white hover:bg-slate-800';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold tracking-tight">PowerPulse<span className="text-orange-500">India</span></span>
              </Link>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>
                  <div className="flex items-center gap-2"><Home size={16} /> Overview</div>
                </Link>
                <Link to="/states" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/states')}`}>
                  <div className="flex items-center gap-2"><Map size={16} /> States</div>
                </Link>
                <Link to="/districts" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/districts')}`}>
                  <div className="flex items-center gap-2"><BarChart3 size={16} /> Districts</div>
                </Link>
                <Link to="/predictor" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/predictor')}`}>
                  <div className="flex items-center gap-2"><BrainCircuit size={16} /> Predictor</div>
                </Link>
                <Link to="/dataset" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dataset')}`}>
                  <div className="flex items-center gap-2"><Database size={16} /> Dataset</div>
                </Link>
                <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about')}`}>
                  <div className="flex items-center gap-2"><Info size={16} /> About</div>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm">
            © 2025 PowerPulse India. Dataset taken from the official website. Note: Future predictions are based on synthetic modeling.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-slate-500 text-xs">Powered by powerpulseindia</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
