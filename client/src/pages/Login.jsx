import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, UserCheck, LayoutDashboard, ArrowRight, Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'citizen';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [activeRole, setActiveRole] = useState(initialRole);
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { loginCitizen, signupCitizen, loginAuthority } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset form fields when switching role or mode
    setError('');
    if (activeRole === 'admin') {
      setEmail('officer.sharma@civicfix.gov');
      setPassword('admin123');
    } else {
      if (authMode === 'login') {
        setEmail('alex@civicfix.org');
        setPassword('password123');
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    }
  }, [activeRole, authMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (activeRole === 'citizen') {
        if (authMode === 'signup') {
          if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
          }
          signupCitizen(name, email, password);
        } else {
          loginCitizen(email, password);
        }
        navigate('/citizen');
      } else {
        // Authority login
        loginAuthority(email, password);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white">CivicFix Authentication Gate</h1>
        <p className="text-sm text-slate-400">
          Sign in or register to access the Citizen Reporting Portal or Authority Command Center.
        </p>
      </div>

      {/* Role Selector Tabs (Preserved role choices) */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveRole('citizen');
            setAuthMode('login');
          }}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeRole === 'citizen'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Citizen Portal
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveRole('admin');
            setAuthMode('login');
          }}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeRole === 'admin'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Authority Command
        </button>
      </div>

      {/* Authentication Card */}
      <div className={`p-8 rounded-3xl border glass-panel space-y-6 ${
        activeRole === 'admin' ? 'border-indigo-500/30 shadow-indigo-500/5' : 'border-cyan-500/30 shadow-cyan-500/5'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {activeRole === 'citizen' ? (
                <>
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  {authMode === 'login' ? 'Citizen Sign In' : 'Create Citizen Account'}
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                  Authority Officer Login
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {activeRole === 'citizen'
                ? (authMode === 'login' ? 'Access your reports and track active campus resolutions.' : 'Register a new citizen reporting account.')
                : 'Authorized municipal response & field dispatch login.'}
            </p>
          </div>

          {/* Toggle Login/Signup for Citizen */}
          {activeRole === 'citizen' && (
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  authMode === 'signup' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Citizen Signup only) */}
          {activeRole === 'citizen' && authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder={activeRole === 'admin' ? 'officer.sharma@civicfix.gov' : 'alex@civicfix.org'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none ${
                  activeRole === 'admin' ? 'focus:border-indigo-500/50' : 'focus:border-cyan-500/50'
                }`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none ${
                  activeRole === 'admin' ? 'focus:border-indigo-500/50' : 'focus:border-cyan-500/50'
                }`}
              />
            </div>
          </div>

          {/* Confirm Password Field (Citizen Signup only) */}
          {activeRole === 'citizen' && authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              activeRole === 'admin'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            {activeRole === 'citizen' ? (
              authMode === 'login' ? 'Sign In to Citizen Portal' : 'Create Citizen Account'
            ) : (
              'Login to Authority Command'
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Helper Badge */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
          {activeRole === 'citizen' ? (
            authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-cyan-400 font-semibold underline hover:text-cyan-300 ml-1"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-cyan-400 font-semibold underline hover:text-cyan-300 ml-1"
                >
                  Sign In
                </button>
              </p>
            )
          ) : (
            <p className="text-slate-400 font-mono text-[11px]">
              Protected Authority Login • Public signups restricted
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
