import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, PlusCircle, LayoutDashboard, Home, UserCheck, MapPin, Layers, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, userName, isAuthenticated, logout, selectRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleRoleChange = (newRole) => {
    if (isAuthenticated && userRole === newRole) {
      if (newRole === 'admin') navigate('/admin');
      else navigate('/citizen');
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?role=${newRole}`);
      return;
    }

    // Switch role if authenticated
    const name = newRole === 'admin' ? 'Officer Sharma (Authority)' : 'Alex (Citizen)';
    selectRole(newRole, name);
    if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={userRole === 'admin' ? '/admin' : '/'} className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 rounded-xl p-0.5 shadow-lg group-hover:scale-105 transition-transform ${
              userRole === 'admin'
                ? 'bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-indigo-500/20'
                : 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-cyan-500/20'
            }`}>
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className={`w-5 h-5 ${userRole === 'admin' ? 'text-indigo-400' : 'text-cyan-400'}`} />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Civic<span className={userRole === 'admin' ? 'text-indigo-400' : 'text-cyan-400'}>Fix</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
                {userRole === 'admin' ? 'Authority Command Center' : 'Citizen Reporting Portal'}
              </span>
            </div>
          </Link>

          {/* Navigation Links — Role Specific */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {userRole === 'admin' ? (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/admin') ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                  Command Dashboard
                </Link>
                <a
                  href="/admin#work-orders"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Incident Work Orders
                </a>
                <a
                  href="/admin#map"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  GIS Map & Hotspots
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/') ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
                <Link
                  to="/report"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/report') ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Report Issue
                </Link>
                <Link
                  to="/citizen"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/citizen') ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  My Reports
                </Link>
              </>
            )}
          </nav>

          {/* Role Switcher Pill & Auth Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-mono uppercase tracking-wider hidden sm:inline">Role:</span>
              <button
                onClick={() => handleRoleChange('citizen')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'citizen'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                👤 Citizen
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'admin'
                    ? 'bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🛡️ Authority
              </button>
            </div>

            {/* Logout / Login Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title={`Signed in as ${userName}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline font-mono text-[11px] text-slate-400 truncate max-w-[100px]">
                  {userName}
                </span>
                <span className="text-xs text-slate-300 font-semibold">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
