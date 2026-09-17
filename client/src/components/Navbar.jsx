import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, PlusCircle, LayoutDashboard, Home, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const { userRole, userName, selectRole } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Civic<span className="text-cyan-400">Fix</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono">Report ≠ Incident</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
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
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive('/admin') ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              Authority Admin
            </Link>
          </nav>

          {/* Role Switcher Pill (Hackathon Demo Mode) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-mono uppercase tracking-wider hidden sm:inline">Role:</span>
              <button
                onClick={() => selectRole('citizen', 'Alex (Citizen)')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'citizen'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => selectRole('admin', 'Officer Sharma (Authority)')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'admin'
                    ? 'bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Authority
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
