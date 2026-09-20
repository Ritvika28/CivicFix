import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Layers, Sparkles, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, UserCheck, Clock, FileText } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import S3Image from '../components/S3Image';

export default function IssueDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userFeedbackMsg, setUserFeedbackMsg] = useState('');

  useEffect(() => {
    loadIssueDetails();
  }, [id]);

  const loadIssueDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getIssueById(id);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCitizenVerification = async (isFixed) => {
    if (!data || !data.issue) return;

    if (isFixed) {
      await api.updateIssue(data.issue.issueId, {
        status: 'RESOLVED',
        verificationStatus: 'CONFIRMED',
        propagateToIncident: true
      });
      setUserFeedbackMsg('Thank you for verifying! Resolution confirmed fixed.');
    } else {
      await api.updateIssue(data.issue.issueId, {
        status: 'REOPENED',
        verificationStatus: 'FAILED',
        reopenReason: 'Citizen reported that the issue remains unresolved after site inspection.',
        propagateToIncident: true
      });
      setUserFeedbackMsg('Issue has been REOPENED and returned to Authority Command Center for field re-dispatch.');
    }
    loadIssueDetails();
  };

  if (loading) {
    return <div className="text-center py-20 text-sm text-[#52635A] font-bold bg-[#F6FAF5] min-h-screen">Loading issue timeline...</div>;
  }

  if (error || !data) {
    return (
      <div className="bg-[#F6FAF5] min-h-screen py-12">
        <div className="max-w-md mx-auto p-8 bg-[#FFFFFF] border border-[#D6E4D7] shadow-civic rounded-2xl text-center space-y-5">
          <AlertTriangle className="w-12 h-12 text-[#D9534F] mx-auto" />
          <h2 className="text-xl font-extrabold text-[#174A2A]">Issue Not Found</h2>
          <p className="text-[14px] text-[#52635A] font-medium">{error || 'Could not locate issue details.'}</p>
          <Link to="/citizen" className="inline-block py-3 px-6 rounded-xl bg-[#FFFFFF] border border-[#D6E4D7] shadow-sm text-[13px] font-bold text-[#174A2A] hover:bg-[#EEF6EE] transition-all">
            Back to My Reports
          </Link>
        </div>
      </div>
    );
  }

  const { issue, incidentReports, incidentReportCount } = data;

  const TIMELINE_STEPS = [
    { key: 'REPORTED', label: 'Reported' },
    { key: 'VERIFIED', label: 'Verified' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' }
  ];

  const getStepIndex = (status) => {
    if (status === 'NEEDS_VERIFICATION') return 3;
    return TIMELINE_STEPS.findIndex(s => s.key === status);
  };

  const currentStepIdx = getStepIndex(issue.status);

  return (
    <div className="bg-[#F6FAF5] min-h-screen py-8 pb-16">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8 space-y-6" style={{ boxSizing: 'border-box' }}>
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-xl shadow-civic border border-[#D6E4D7]">
          <Link to="/citizen" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#52635A] hover:text-[#2F7D46] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Reports
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#52635A] font-bold uppercase tracking-widest">Ticket #{issue.issueId}</span>
            <span className="text-[#D6E4D7]">|</span>
            <span className="text-[11px] text-[#2F7D46] font-bold uppercase tracking-widest">Incident #{issue.incidentId}</span>
          </div>
        </div>

        {userFeedbackMsg && (
          <div className="p-4 rounded-xl bg-[#EEF6EE] border border-[#43A85F] text-[#1F5E35] text-[13px] font-bold flex items-center gap-3 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#2F7D46] shrink-0" />
            {userFeedbackMsg}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#D6E4D7] shadow-civic space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#EEF6EE] pb-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <StatusBadge status={issue.status} />
                <SeverityBadge severity={issue.severity} />
              </div>
              <h1 className="text-[24px] font-extrabold text-[#174A2A] leading-tight">{issue.description}</h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[13px] text-[#52635A] font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2F7D46] shrink-0" />
                  {issue.locationLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2F7D46] shrink-0" />
                  Reported {issue.reportedAt || issue.createdAt ? new Date(issue.reportedAt || issue.createdAt).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            <div className="bg-[#F6FAF5] p-5 rounded-2xl border border-[#D6E4D7] text-right space-y-1.5 shadow-sm shrink-0 min-w-[200px]">
              <span className="text-[10px] text-[#52635A] uppercase font-bold tracking-widest block">Incident Clustering</span>
              <span className="text-[13px] font-bold text-[#174A2A] flex items-center gap-2 justify-end">
                <Layers className="w-4 h-4 text-[#2F7D46]" />
                {incidentReportCount} {incidentReportCount === 1 ? 'Report' : 'Reports'}
              </span>
              <span className="text-[11px] text-[#2F7D46] font-bold block pt-1">
                → 1 Work Order
              </span>
            </div>
          </div>

          {/* TIMELINE VISUALIZATION */}
          <div className="bg-[#F6FAF5] p-5 sm:p-8 rounded-2xl border border-[#D6E4D7] space-y-6 shadow-sm overflow-x-auto">
            <span className="text-[11px] text-[#52635A] uppercase font-extrabold tracking-widest block text-center mb-2">Resolution Progress Timeline</span>
            <div className="grid grid-cols-5 gap-1 sm:gap-2 relative max-w-2xl mx-auto" style={{ minWidth: '280px' }}>
              {/* Connecting Line background */}
              <div className="absolute top-4 left-[10%] right-[10%] h-[3px] bg-[#D6E4D7] z-0 rounded-full"></div>
              
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="text-center space-y-3 relative z-10">
                    <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-[13px] font-extrabold transition-all ${
                      isCurrent
                        ? 'bg-[#EEF6EE] text-[#1F5E35] border-2 border-[#43A85F] shadow-md ring-4 ring-[#43A85F]/20'
                        : isPassed
                        ? 'bg-[#EEF6EE] text-[#1F5E35] border-2 border-[#43A85F] shadow-sm'
                        : 'bg-[#FFFFFF] text-[#52635A] border-2 border-[#D6E4D7]'
                    }`}>
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5 text-[#2F7D46]" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] block font-bold uppercase tracking-widest ${isPassed ? 'text-[#174A2A]' : 'text-[#52635A]'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BEFORE & AFTER RESOLUTION PHOTO & CITIZEN VERIFICATION */}
          {(issue.status === 'RESOLVED' || issue.status === 'REOPENED' || issue.resolutionImageKey) && (
            <div className={`p-8 rounded-2xl space-y-6 shadow-sm border ${issue.status === 'REOPENED' ? 'bg-[#FDECEC] border-[#F5C6CB]' : 'bg-[#EEF6EE] border-[#D6E4D7]'}`}>
              <div className="flex items-center justify-between border-b pb-4 border-[#D6E4D7]">
                <span className="text-[14px] font-bold uppercase tracking-tight flex items-center gap-2 text-[#174A2A]">
                  <ShieldCheck className={`w-5 h-5 ${issue.status === 'REOPENED' ? 'text-[#D9534F]' : 'text-[#2F7D46]'}`} />
                  {issue.status === 'REOPENED' ? 'Incident Reopened — Verification Failed' : 'Resolution Proof Complete'}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#52635A]">
                  {issue.resolvedAt ? `Resolved: ${new Date(issue.resolvedAt).toLocaleDateString()}` : 'Field Work Submitted'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5 bg-[#FFFFFF] p-4 rounded-xl border border-[#D6E4D7] shadow-sm">
                  <span className="text-[10px] font-bold text-[#52635A] uppercase tracking-widest block">BEFORE (Citizen Report Photo)</span>
                  <S3Image src={issue.imageKey} alt="Before report photo" className="w-full h-56 object-cover rounded-lg border border-[#D6E4D7]" />
                </div>
                <div className="space-y-2.5 bg-[#FFFFFF] p-4 rounded-xl border border-[#D6E4D7] shadow-sm">
                  <span className="text-[10px] font-bold text-[#2F7D46] uppercase tracking-widest block">AFTER (Authority Proof Photo)</span>
                  <S3Image
                    src={issue.resolutionImageKey}
                    alt="After resolution photo"
                    className="w-full h-56 object-cover rounded-lg border border-[#D6E4D7]"
                  />
                </div>
              </div>

              {issue.resolutionNote && (
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D6E4D7] shadow-sm flex gap-3 items-start">
                  <FileText className="w-5 h-5 text-[#2F7D46] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-[#52635A] uppercase tracking-widest block mb-1">Authority Resolution Note</span>
                    <p className="text-[14px] text-[#17312A] font-medium italic">
                      "{issue.resolutionNote}"
                    </p>
                  </div>
                </div>
              )}

              {/* CITIZEN VERIFICATION PROMPT */}
              {(!issue.verificationStatus || issue.verificationStatus === 'PENDING') && issue.status === 'RESOLVED' ? (
                <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D6E4D7] space-y-4 shadow-sm mt-4 text-center">
                  <span className="text-[15px] font-extrabold text-[#174A2A] block">Citizen Verification: Was this issue actually fixed?</span>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
                    <button
                      onClick={() => handleCitizenVerification(true)}
                      className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-[#2F7D46] hover:bg-[#1F5E35] text-white font-extrabold text-[13px] flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 text-white" /> ✓ Looks Fixed
                    </button>
                    <button
                      onClick={() => handleCitizenVerification(false)}
                      className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-[#FFFFFF] hover:bg-[#FDECEC] text-[#D9534F] border border-[#F5C6CB] font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm hover:-translate-y-0.5"
                    >
                      <XCircle className="w-4.5 h-4.5 text-[#D9534F]" /> ! Still a Problem
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-[#FFFFFF] rounded-xl text-[13px] text-[#17312A] flex items-center justify-between border border-[#D6E4D7] shadow-sm mt-4 font-medium">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#2F7D46] shrink-0" />
                    <span>Citizen Verification Status:</span>
                  </div>
                  <span className={`font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider ${
                    issue.verificationStatus === 'CONFIRMED' || issue.status === 'RESOLVED' || issue.status === 'VERIFIED_RESOLVED'
                      ? 'bg-[#EEF6EE] text-[#1F5E35] border border-[#43A85F]'
                      : 'bg-[#FDECEC] text-[#A83232] border border-[#F5C6CB]'
                  }`}>
                    {issue.verificationStatus === 'CONFIRMED' ? '✓ Verified Fixed' : issue.status === 'REOPENED' ? '⚠️ Reopened by Citizen' : issue.verificationStatus || 'Pending'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* AI Structuring & Incident Cluster Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            <div className="bg-[#F6FAF5] p-6 rounded-2xl border border-[#D6E4D7] space-y-5 shadow-sm">
              <span className="text-[11px] text-[#174A2A] uppercase font-extrabold tracking-widest flex items-center gap-2 border-b border-[#D6E4D7] pb-3">
                <Sparkles className="w-4 h-4 text-[#2F7D46]" /> AI Routing & Dispatch Meta
              </span>
              <p className="text-[14px] text-[#52635A] font-medium leading-relaxed">{issue.summary}</p>
              <div className="pt-2 flex flex-col gap-2.5">
                <div className="flex items-center justify-between bg-[#FFFFFF] px-4 py-3 rounded-xl border border-[#D6E4D7] shadow-sm">
                  <span className="text-[12px] text-[#52635A] font-bold uppercase tracking-wider">Department</span>
                  <strong className="text-[13px] text-[#174A2A] font-bold">{issue.department}</strong>
                </div>
                <div className="flex items-center justify-between bg-[#FFFFFF] px-4 py-3 rounded-xl border border-[#D6E4D7] shadow-sm">
                  <span className="text-[12px] text-[#52635A] font-bold uppercase tracking-wider">Assigned Team</span>
                  <strong className="text-[13px] text-[#17312A] font-bold">{issue.assignedTo || 'Unassigned'}</strong>
                </div>
              </div>
            </div>

            <div className="bg-[#F6FAF5] p-6 rounded-2xl border border-[#D6E4D7] space-y-4 shadow-sm flex flex-col">
              <span className="text-[11px] text-[#174A2A] uppercase font-extrabold tracking-widest flex items-center justify-between border-b border-[#D6E4D7] pb-3">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2F7D46]" /> Linked Citizen Reports
                </span>
                <span className="bg-[#FFFFFF] text-[#2F7D46] px-2.5 py-1 rounded shadow-sm border border-[#D6E4D7]">Incident #{issue.incidentId}</span>
              </span>
              <div className="space-y-3 flex-grow overflow-y-auto max-h-56 pr-2 custom-scrollbar">
                {incidentReports.map(rep => (
                  <div key={rep.issueId} className="bg-[#FFFFFF] p-4 rounded-xl border border-[#D6E4D7] flex flex-col gap-1.5 text-[#17312A] shadow-sm">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[12px] text-[#174A2A] font-bold uppercase tracking-widest">{rep.issueId}</span>
                      <span className="text-[10px] text-[#52635A] font-bold tracking-wider">{rep.reportedBy}</span>
                    </div>
                    <span className="truncate w-full text-[13px] font-medium text-[#52635A]">{rep.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
