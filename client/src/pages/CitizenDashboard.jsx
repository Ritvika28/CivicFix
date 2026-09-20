import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck, PlusCircle, MapPin, Calendar, Layers, ArrowRight,
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, FileText, Inbox
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getIssues();
    setIssues(data);
    setLoading(false);
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'OPEN') return issue.status === 'REPORTED' || issue.status === 'VERIFIED';
    if (filter === 'IN_PROGRESS') return issue.status === 'ASSIGNED' || issue.status === 'IN_PROGRESS';
    if (filter === 'RESOLVED') return issue.status === 'RESOLVED';
    return true;
  });

  const totalReports = issues.length;
  const inProgressReports = issues.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedReports = issues.filter(i => i.status === 'RESOLVED').length;

  const FILTER_TABS = [
    { id: 'ALL', label: 'All Reports' },
    { id: 'OPEN', label: 'Open' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16 bg-[#F6FAF5]" style={{ overflowX: 'hidden' }}>
      <style>{`
        .cr-card {
          transition: transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms cubic-bezier(0.22,1,0.36,1), border-color 380ms ease;
        }
        .cr-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(23, 74, 42, 0.10);
          border-color: #43A85F !important;
        }
        .cr-timeline-btn {
          transition: background 280ms ease, border-color 280ms ease, color 280ms ease;
        }
        .cr-timeline-btn:hover {
          background: #EEF6EE !important;
          border-color: #43A85F !important;
          color: #174A2A !important;
        }
        .cr-timeline-btn:hover .cr-arrow {
          transform: translateX(4px);
        }
        .cr-arrow {
          transition: transform 280ms ease;
        }
        .cr-filter-active {
          background: #EEF6EE !important;
          color: #1F5E35 !important;
          border-color: #43A85F !important;
          box-shadow: 0 2px 8px rgba(31, 94, 53, 0.12);
          font-weight: 800 !important;
        }
        .cr-filter-btn {
          background: #ffffff;
          color: #52635A;
          border-color: #D6E4D7;
          transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
        }
        .cr-filter-btn:hover {
          background: #F6FAF5;
          color: #1F5E35;
          border-color: #43A85F;
        }
        .cr-skeleton {
          animation: cr-pulse 1.6s ease-in-out infinite;
        }
        @keyframes cr-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8 space-y-6" style={{ boxSizing: 'border-box' }}>

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#174A2A] tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#EEF6EE] border border-[#D6E4D7]">
                <UserCheck className="w-5 h-5 text-[#2F7D46]" />
              </div>
              My Citizen Reports
            </h1>
            <p className="text-[14px] font-medium text-[#52635A] pl-[52px]">
              Track real-time resolution progress of issues reported by you and your community.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-extrabold text-[14px] transition-all hover:-translate-y-0.5 shrink-0 bg-[#2F7D46] hover:bg-[#1F5E35] shadow-md shadow-[#2F7D46]/20"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Report New Issue
          </Link>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FFFFFF] rounded-2xl p-5 shadow-civic flex items-center gap-4 border border-[#D6E4D7] border-t-4 border-t-[#2F7D46] civic-card-hover">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#EEF6EE] border border-[#D6E4D7]">
              <Layers className="w-6 h-6 text-[#2F7D46]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#52635A] mb-0.5">Total Submitted</div>
              <div className="text-[30px] leading-none font-extrabold text-[#174A2A]">{totalReports}</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl p-5 shadow-civic flex items-center gap-4 border border-[#D6E4D7] border-t-4 border-t-[#E8A52B] civic-card-hover">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#FFF4D6] border border-[#FFE082]">
              <Clock className="w-6 h-6 text-[#E8A52B]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A5A00] mb-0.5">In Progress</div>
              <div className="text-[30px] leading-none font-extrabold text-[#8A5A00]">{inProgressReports}</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl p-5 shadow-civic flex items-center gap-4 border border-[#D6E4D7] border-t-4 border-t-[#43A85F] civic-card-hover">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#EEF6EE] border border-[#D6E4D7]">
              <ShieldCheck className="w-6 h-6 text-[#43A85F]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#1F5E35] mb-0.5">Resolved &amp; Verified</div>
              <div className="text-[30px] leading-none font-extrabold text-[#174A2A]">{resolvedReports}</div>
            </div>
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2 rounded-full text-[13px] font-bold border whitespace-nowrap ${
                filter === tab.id ? 'cr-filter-active' : 'cr-filter-btn'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="cr-skeleton bg-[#FFFFFF] rounded-2xl p-5 space-y-4 border border-[#D6E4D7] shadow-civic">
                <div className="flex justify-between items-center pb-4 border-b border-[#EEF6EE]">
                  <div className="h-3.5 w-28 rounded-md bg-[#EEF6EE]" />
                  <div className="h-6 w-32 rounded-md bg-[#EEF6EE]" />
                </div>
                <div className="h-5 w-4/5 rounded-md bg-[#EEF6EE]" />
                <div className="h-4 w-3/5 rounded-md bg-[#EEF6EE]" />
                <div className="h-14 rounded-xl bg-[#EEF6EE]" />
                <div className="h-10 rounded-xl bg-[#EEF6EE]" />
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-2xl p-14 text-center border border-[#D6E4D7] shadow-civic">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[#EEF6EE] border border-[#D6E4D7]">
              <Inbox className="w-7 h-7 text-[#2F7D46]" />
            </div>
            <p className="font-extrabold text-[15px] mb-1 text-[#174A2A]">No reports found</p>
            <p className="text-[13px] mb-4 text-[#52635A]">No citizen issue reports match this filter.</p>
            <Link to="/report" className="text-[13px] font-extrabold hover:underline text-[#2F7D46]">
              Submit a new citizen report →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredIssues.map(issue => {
              const linkedCount = issues.filter(i => i.incidentId === issue.incidentId).length;

              return (
                <div
                  key={issue.issueId}
                  className="cr-card bg-[#FFFFFF] rounded-2xl flex flex-col border border-[#D6E4D7] shadow-civic"
                >
                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1">

                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#EEF6EE]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0 text-[#52635A]">Report</span>
                        <span className="text-[13px] font-extrabold truncate text-[#1F5E35]">#{issue.issueId}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
                        <StatusBadge status={issue.status} />
                        <SeverityBadge severity={issue.severity} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-extrabold leading-snug line-clamp-2 text-[15px] text-[#17312A]">
                      {issue.description}
                    </p>

                    {/* Location + Date */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium text-[#52635A]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2F7D46]" />
                        <span className="truncate max-w-[180px]">{issue.locationLabel}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-[#2F7D46]" />
                        {issue.reportedAt || issue.createdAt
                          ? new Date(issue.reportedAt || issue.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'Recent'}
                      </span>
                    </div>

                    {/* Incident Relationship Panel */}
                    <div
                      className="px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#F6FAF5] border border-[#D6E4D7]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Layers className="w-4 h-4 shrink-0 text-[#2F7D46]" />
                        <span className="text-[11px] font-bold uppercase tracking-wide truncate text-[#52635A]">
                          Incident{' '}
                          <span className="font-extrabold text-[#1F5E35]">{issue.incidentId}</span>
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border shrink-0 self-start sm:self-auto bg-[#EEF6EE] border-[#43A85F] text-[#1F5E35]"
                      >
                        {linkedCount} {linkedCount === 1 ? 'Report' : 'Reports'} → 1 Work Order
                      </span>
                    </div>
                  </div>

                  {/* Timeline Button */}
                  <div className="px-5 pb-5">
                    <Link
                      to={`/issues/${issue.issueId}`}
                      className="cr-timeline-btn w-full py-3 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 border bg-[#FFFFFF] border-[#D6E4D7] text-[#17312A]"
                    >
                      <FileText className="w-4 h-4 shrink-0 text-[#2F7D46]" />
                      View Full Timeline &amp; Details
                      <ArrowRight className="w-4 h-4 cr-arrow text-[#2F7D46]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}


