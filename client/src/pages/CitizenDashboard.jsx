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
    <div className="min-h-screen pt-6 pb-16" style={{ background: '#F7F8F3', overflowX: 'hidden' }}>
      <style>{`
        .cr-card {
          transition: transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms cubic-bezier(0.22,1,0.36,1), border-color 380ms ease;
        }
        .cr-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(30,60,35,0.09);
          border-color: #A3C4AA !important;
        }
        .cr-timeline-btn {
          transition: background 280ms ease, border-color 280ms ease, color 280ms ease;
        }
        .cr-timeline-btn:hover {
          background: #EEF4EA !important;
          border-color: #3F7D4A !important;
          color: #285D36 !important;
        }
        .cr-timeline-btn:hover .cr-arrow {
          transform: translateX(4px);
        }
        .cr-arrow {
          transition: transform 280ms ease;
        }
        .cr-filter-active {
          background: #3F7D4A !important;
          color: #ffffff !important;
          border-color: #3F7D4A !important;
          box-shadow: 0 2px 8px rgba(63,125,74,0.20);
        }
        .cr-filter-btn {
          background: #ffffff;
          color: #65716A;
          border-color: #DDE4DA;
          transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
        }
        .cr-filter-btn:hover {
          background: #EEF4EA;
          color: #3F7D4A;
          border-color: #A3C4AA;
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
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm"
          style={{ border: '1px solid #DDE4DA' }}
        >
          <div className="space-y-1.5">
            <h1 className="text-[24px] sm:text-[26px] font-extrabold tracking-tight flex items-center gap-3" style={{ color: '#14231B' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF4EA' }}>
                <UserCheck className="w-5 h-5" style={{ color: '#3F7D4A' }} />
              </div>
              My Citizen Reports
            </h1>
            <p className="text-[14px] font-medium pl-[52px]" style={{ color: '#65716A' }}>
              Track real-time resolution progress of issues reported by you and your community.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-[14px] transition-all hover:-translate-y-0.5 shrink-0"
            style={{ background: '#3F7D4A', boxShadow: '0 4px 14px rgba(63,125,74,0.22)' }}
          >
            <PlusCircle className="w-4 h-4" />
            Report New Issue
          </Link>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4" style={{ border: '1px solid #DDE4DA', borderTop: '3px solid #B3C9B6' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF4EA', border: '1px solid #C8DECA' }}>
              <Layers className="w-6 h-6" style={{ color: '#3F7D4A' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#65716A' }}>Total Submitted</div>
              <div className="text-[30px] leading-none font-extrabold" style={{ color: '#14231B' }}>{totalReports}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4" style={{ border: '1px solid #DDE4DA', borderTop: '3px solid #D59A32' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F7EEDB', border: '1px solid #E8D4A0' }}>
              <Clock className="w-6 h-6" style={{ color: '#D59A32' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#C07B1A' }}>In Progress</div>
              <div className="text-[30px] leading-none font-extrabold" style={{ color: '#A8660E' }}>{inProgressReports}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4" style={{ border: '1px solid #DDE4DA', borderTop: '3px solid #4F8F58' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E5F1E5', border: '1px solid #B3D4B7' }}>
              <ShieldCheck className="w-6 h-6" style={{ color: '#4F8F58' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#3F7D4A' }}>Resolved &amp; Verified</div>
              <div className="text-[30px] leading-none font-extrabold" style={{ color: '#285D36' }}>{resolvedReports}</div>
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
              <div key={n} className="cr-skeleton bg-white rounded-2xl p-5 space-y-4 shadow-sm" style={{ border: '1px solid #DDE4DA' }}>
                <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid #EEF1EB' }}>
                  <div className="h-3.5 w-28 rounded-md" style={{ background: '#EEF1EB' }} />
                  <div className="h-6 w-32 rounded-md" style={{ background: '#EEF1EB' }} />
                </div>
                <div className="h-5 w-4/5 rounded-md" style={{ background: '#EEF1EB' }} />
                <div className="h-4 w-3/5 rounded-md" style={{ background: '#EEF1EB' }} />
                <div className="h-14 rounded-xl" style={{ background: '#EEF1EB' }} />
                <div className="h-10 rounded-xl" style={{ background: '#EEF1EB' }} />
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-white rounded-2xl p-14 text-center shadow-sm" style={{ border: '1px solid #DDE4DA' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#EEF4EA' }}>
              <Inbox className="w-7 h-7" style={{ color: '#3F7D4A' }} />
            </div>
            <p className="font-bold text-[15px] mb-1" style={{ color: '#14231B' }}>No reports found</p>
            <p className="text-[13px] mb-4" style={{ color: '#65716A' }}>No citizen issue reports match this filter.</p>
            <Link to="/report" className="text-[13px] font-bold hover:underline" style={{ color: '#3F7D4A' }}>
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
                  className="cr-card bg-white rounded-2xl flex flex-col shadow-sm"
                  style={{ border: '1px solid #DDE4DA' }}
                >
                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1">

                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 pb-4" style={{ borderBottom: '1px solid #EEF1EB' }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0" style={{ color: '#65716A' }}>Report</span>
                        <span className="text-[13px] font-extrabold truncate" style={{ color: '#285D36' }}>#{issue.issueId}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
                        <StatusBadge status={issue.status} />
                        <SeverityBadge severity={issue.severity} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-semibold leading-snug line-clamp-2 text-[15px]" style={{ color: '#14231B' }}>
                      {issue.description}
                    </p>

                    {/* Location + Date */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium" style={{ color: '#65716A' }}>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#3F7D4A' }} />
                        <span className="truncate max-w-[180px]">{issue.locationLabel}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: '#3F7D4A' }} />
                        {issue.reportedAt || issue.createdAt
                          ? new Date(issue.reportedAt || issue.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'Recent'}
                      </span>
                    </div>

                    {/* Incident Relationship Panel */}
                    <div
                      className="px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      style={{ background: '#F2F6F0', border: '1px solid #C8DECA' }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Layers className="w-4 h-4 shrink-0" style={{ color: '#3F7D4A' }} />
                        <span className="text-[11px] font-bold uppercase tracking-wide truncate" style={{ color: '#65716A' }}>
                          Incident{' '}
                          <span className="font-extrabold" style={{ color: '#285D36' }}>{issue.incidentId}</span>
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border shrink-0 self-start sm:self-auto"
                        style={{ background: '#EEF4EA', borderColor: '#B3D4B7', color: '#3F7D4A' }}
                      >
                        {linkedCount} {linkedCount === 1 ? 'Report' : 'Reports'} → 1 Work Order
                      </span>
                    </div>
                  </div>

                  {/* Timeline Button */}
                  <div className="px-5 pb-5">
                    <Link
                      to={`/issues/${issue.issueId}`}
                      className="cr-timeline-btn w-full py-3 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 border"
                      style={{ background: '#ffffff', borderColor: '#DDE4DA', color: '#14231B' }}
                    >
                      <FileText className="w-4 h-4 shrink-0" style={{ color: '#3F7D4A' }} />
                      View Full Timeline &amp; Details
                      <ArrowRight className="w-4 h-4 cr-arrow" style={{ color: '#3F7D4A' }} />
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


