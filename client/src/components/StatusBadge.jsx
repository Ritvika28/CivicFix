import React from 'react';

const STATUS_CONFIG = {
  REPORTED: { label: 'Reported', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  VERIFIED: { label: 'Verified', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  ASSIGNED: { label: 'Assigned', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-medium animate-pulse' },
  RESOLVED: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold' },
  NEEDS_VERIFICATION: { label: 'Needs Verification', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-700 text-slate-300 border-slate-600' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
}
