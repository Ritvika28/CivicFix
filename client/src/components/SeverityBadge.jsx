import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  LOW: { label: 'Low', color: 'bg-slate-50 text-slate-600 border-slate-200 font-bold uppercase tracking-widest', icon: Info },
  MEDIUM: { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200 font-bold uppercase tracking-widest', icon: AlertCircle },
  HIGH: { label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-200 font-bold uppercase tracking-widest', icon: AlertTriangle },
  CRITICAL: { label: 'CRITICAL', color: 'bg-red-100 text-red-900 border-red-300 font-extrabold uppercase tracking-widest animate-pulse shadow-sm', icon: ShieldAlert }
};

export default function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] border ${config.color}`}>
      <Icon className="w-3 h-3 shrink-0" />
      {config.label}
    </span>
  );
}
