import React from 'react';

const STATUS_CONFIG = {
  REPORTED: { label: 'Reported', color: 'bg-slate-100 text-slate-600 border-slate-200 font-bold uppercase tracking-widest' },
  VERIFIED: { label: 'Verified', color: 'bg-blue-50 text-blue-700 border-blue-200 font-bold uppercase tracking-widest' },
  ASSIGNED: { label: 'Assigned', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold uppercase tracking-widest' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-orange-50 text-orange-700 border-orange-200 font-bold uppercase tracking-widest' },
  RESOLVED: { label: 'Resolved', color: 'bg-civic-100 text-civic-900 border-civic-300 font-extrabold uppercase tracking-widest shadow-sm' },
  NEEDS_VERIFICATION: { label: 'Needs Verification', color: 'bg-amber-50 text-amber-800 border-amber-200 font-bold uppercase tracking-widest' },
  REOPENED: { label: 'Reopened (Verification Failed)', color: 'bg-red-100 text-red-800 border-red-300 font-bold uppercase tracking-widest' },
  VERIFIED_RESOLVED: { label: 'Verified Resolved', color: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold uppercase tracking-widest shadow-sm' }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
}
