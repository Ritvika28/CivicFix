import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  LOW: { label: 'Low', color: 'bg-[#EEF6EE] text-[#1F5E35] border-[#D6E4D7] font-bold uppercase tracking-widest', icon: Info },
  MEDIUM: { label: 'Medium', color: 'bg-[#FFF4D6] text-[#8A5A00] border-[#FFE082] font-bold uppercase tracking-widest', icon: AlertCircle },
  HIGH: { label: 'High Priority', color: 'bg-[#FFF3E0] text-[#E65100] border-[#FFCC80] font-bold uppercase tracking-widest', icon: AlertTriangle },
  CRITICAL: { label: 'CRITICAL', color: 'bg-[#FDECEC] text-[#A83232] border-[#F5C6CB] font-extrabold uppercase tracking-widest shadow-sm', icon: ShieldAlert }
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
