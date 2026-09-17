import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  LOW: { label: 'Low', color: 'bg-slate-800 text-slate-300 border-slate-700', icon: Info },
  MEDIUM: { label: 'Medium', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30', icon: AlertCircle },
  HIGH: { label: 'High', color: 'bg-orange-500/10 text-orange-300 border-orange-500/30', icon: AlertTriangle },
  CRITICAL: { label: 'CRITICAL HAZARD', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold tracking-wide animate-pulse', icon: ShieldAlert }
};

export default function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${config.color}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </span>
  );
}
