import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck, LayoutDashboard, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { userRole, selectRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role, name) => {
    selectRole(role, name);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white">Hackathon Demo Authentication</h1>
        <p className="text-sm text-slate-400">
          Select a role below to explore CivicFix from either the citizen reporting view or the municipal authority management dashboard.
        </p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-300">
        <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Demo Mode Notice</span>
          No real passwords or AWS Cognito credentials required. Role selection is preserved in your local session.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Citizen Role Option */}
        <button
          onClick={() => handleRoleSelect('citizen', 'Alex (Citizen)')}
          className={`p-6 rounded-2xl border text-left transition-all space-y-4 group ${
            userRole === 'citizen'
              ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center justify-between">
              Citizen View
              <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Report civic problems, upload photos, track report status, and verify resolutions.
            </p>
          </div>
        </button>

        {/* Authority / Admin Role Option */}
        <button
          onClick={() => handleRoleSelect('admin', 'Officer Sharma (Authority)')}
          className={`p-6 rounded-2xl border text-left transition-all space-y-4 group ${
            userRole === 'admin'
              ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center justify-between">
              Authority Admin
              <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Manage incidents, assign departments, upload after photos, and analyze campus hotspots.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
