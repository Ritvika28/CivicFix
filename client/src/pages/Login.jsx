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
    <div className="w-full min-h-screen bg-civic-cream py-8 px-4 sm:px-5 lg:px-8" style={{ boxSizing: 'border-box' }}>
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-civic-50 border border-civic-200 text-civic-600 flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold text-civic-900 tracking-tight">CivicFix Authentication Gate</h1>
        <p className="text-sm text-slate-600 font-medium">
          Sign in or register to access the Citizen Reporting Portal or Authority Command Center.
        </p>
      </div>

      {/* Role Selector Tabs (Preserved role choices) */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveRole('citizen');
            setAuthMode('login');
          }}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeRole === 'citizen'
              ? 'bg-white text-civic-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-civic-600 hover:bg-slate-100 border border-transparent'
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
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeRole === 'admin'
              ? 'bg-white text-civic-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-civic-600 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Authority Command
        </button>
      </div>

      {/* Authentication Card */}
      <div className="p-8 rounded-3xl border bg-white shadow-sm border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-civic-900 flex items-center gap-2">
              {activeRole === 'citizen' ? (
                <>
                  <UserCheck className="w-5 h-5 text-civic-600" />
                  {authMode === 'login' ? 'Citizen Sign In' : 'Create Citizen Account'}
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-5 h-5 text-civic-600" />
                  Authority Officer Login
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              {activeRole === 'citizen'
                ? (authMode === 'login' ? 'Access your reports and track active campus resolutions.' : 'Register a new citizen reporting account.')
                : 'Authorized municipal response & field dispatch login.'}
            </p>
          </div>

          {/* Toggle Login/Signup for Citizen */}
          {activeRole === 'citizen' && (
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-white text-civic-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-civic-600 border border-transparent'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  authMode === 'signup' ? 'bg-white text-civic-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-civic-600 border border-transparent'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field (Citizen Signup only) */}
          {activeRole === 'citizen' && authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-civic-500 focus:ring-1 focus:ring-civic-500 shadow-sm transition-shadow"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder={activeRole === 'admin' ? 'officer.sharma@civicfix.gov' : 'alex@civicfix.org'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-civic-500 focus:ring-1 focus:ring-civic-500 shadow-sm transition-shadow"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-civic-500 focus:ring-1 focus:ring-civic-500 shadow-sm transition-shadow"
              />
            </div>
          </div>

          {/* Confirm Password Field (Citizen Signup only) */}
          {activeRole === 'citizen' && authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-civic-500 focus:ring-1 focus:ring-civic-500 shadow-sm transition-shadow"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              activeRole === 'admin'
                ? 'bg-civic-700 hover:bg-civic-800 text-white'
                : 'bg-civic-600 hover:bg-civic-700 text-white'
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
        <div className="pt-5 text-center text-sm font-medium text-slate-500 border-t border-slate-200">
          {activeRole === 'citizen' ? (
            authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-civic-600 font-bold hover:underline ml-1"
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
                  className="text-civic-600 font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            )
          ) : (
            <p className="text-slate-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              Protected Authority Login • Public signups restricted
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
