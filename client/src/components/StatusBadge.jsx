import React from 'react';

const STATUS_CONFIG = {
  REPORTED: { label: 'Reported', color: 'bg-[#EEF6EE] text-[#1F5E35] border-[#D6E4D7] font-bold uppercase tracking-widest' },
  VERIFIED: { label: 'Verified', color: 'bg-[#E8F5E9] text-[#1F5E35] border-[#A5D6A7] font-bold uppercase tracking-widest' },
  ASSIGNED: { label: 'Assigned', color: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] font-bold uppercase tracking-widest' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-[#E8F8EE] text-[#1E7E34] border-[#81C784] font-bold uppercase tracking-widest shadow-sm' },
  RESOLVED: { label: 'Resolved', color: 'bg-[#E6F4EA] text-[#137333] border-[#80E2A3] font-extrabold uppercase tracking-widest shadow-sm' },
  NEEDS_VERIFICATION: { label: 'Needs Verification', color: 'bg-[#FFF8E1] text-[#B78103] border-[#FFE082] font-bold uppercase tracking-widest' },
  REOPENED: { label: 'Reopened (Verification Failed)', color: 'bg-[#FFF3E0] text-[#E65100] border-[#FFCC80] font-bold uppercase tracking-widest' },
  VERIFIED_RESOLVED: { label: 'Verified Resolved', color: 'bg-[#E6F4EA] text-[#137333] border-[#80E2A3] font-extrabold uppercase tracking-widest shadow-sm' },
  CLOSED: { label: 'Closed & Verified', color: 'bg-[#E6F4EA] text-[#137333] border-[#80E2A3] font-extrabold uppercase tracking-widest shadow-sm' }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-[#EEF6EE] text-[#17312A] border-[#D6E4D7]' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
}
