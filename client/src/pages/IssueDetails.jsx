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
        verificationStatus: 'CONFIRMED'
      });
      setUserFeedbackMsg('Thank you for confirming resolution! Your feedback is registered.');
    } else {
      await api.updateIssue(data.issue.issueId, {
        status: 'NEEDS_VERIFICATION',
        verificationStatus: 'REJECTED',
        propagateToIncident: true
      });
      setUserFeedbackMsg('Issue flagged for urgent re-inspection by municipal authority.');
    }
    loadIssueDetails();
  };

  if (loading) {
    return <div className="text-center py-20 text-sm text-slate-500 font-bold bg-civic-cream min-h-screen">Loading issue timeline...</div>;
  }

  if (error || !data) {
    return (
      <div className="bg-civic-cream min-h-screen py-12">
        <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 shadow-sm rounded-2xl text-center space-y-5">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-civic-dark">Issue Not Found</h2>
          <p className="text-[14px] text-slate-600 font-medium">{error || 'Could not locate issue details.'}</p>
          <Link to="/citizen" className="inline-block py-3 px-6 rounded-xl bg-white border border-slate-200 shadow-sm text-[13px] font-bold text-civic-dark hover:bg-slate-50 transition-colors">
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
    <div className="bg-civic-cream min-h-screen py-8 pb-16">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8 space-y-6" style={{ boxSizing: 'border-box' }}>
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <Link to="/citizen" className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-civic-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Reports
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Ticket #{issue.issueId}</span>
            <span className="text-slate-200">|</span>
            <span className="text-[11px] text-civic-primary font-bold uppercase tracking-widest">Incident #{issue.incidentId}</span>
          </div>
        </div>

        {userFeedbackMsg && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-[13px] font-bold flex items-center gap-3 shadow-sm">
            <Sparkles className="w-5 h-5 text-green-600 shrink-0" />
            {userFeedbackMsg}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <StatusBadge status={issue.status} />
                <SeverityBadge severity={issue.severity} />
              </div>
              <h1 className="text-[24px] font-bold text-civic-dark leading-tight">{issue.description}</h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[13px] text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  {issue.locationLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  Reported {issue.reportedAt || issue.createdAt ? new Date(issue.reportedAt || issue.createdAt).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 text-right space-y-1.5 shadow-sm shrink-0 min-w-[200px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Incident Clustering</span>
              <span className="text-[13px] font-bold text-civic-dark flex items-center gap-2 justify-end">
                <Layers className="w-4 h-4 text-civic-primary" />
                {incidentReportCount} {incidentReportCount === 1 ? 'Report' : 'Reports'}
              </span>
              <span className="text-[11px] text-civic-primary font-bold block pt-1">
                → 1 Work Order
              </span>
            </div>
          </div>

          {/* TIMELINE VISUALIZATION */}
          <div className="bg-[#fcfdfd] p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm overflow-x-auto">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-widest block text-center mb-2">Resolution Progress Timeline</span>
            <div className="grid grid-cols-5 gap-1 sm:gap-2 relative max-w-2xl mx-auto" style={{ minWidth: '280px' }}>
              {/* Connecting Line background */}
              <div className="absolute top-4 left-[10%] right-[10%] h-[3px] bg-slate-100 z-0 rounded-full"></div>
              
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="text-center space-y-3 relative z-10">
                    <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-[13px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-civic-primary text-white shadow-md shadow-civic-primary/30 ring-4 ring-civic-primary/10'
                        : isPassed
                        ? 'bg-white text-civic-primary border-2 border-civic-primary shadow-sm'
                        : 'bg-white text-slate-300 border-2 border-slate-200'
                    }`}>
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] block font-bold uppercase tracking-widest ${isPassed ? 'text-civic-dark' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BEFORE & AFTER RESOLUTION PHOTO DISPLAY */}
          {issue.status === 'RESOLVED' && (
            <div className="bg-[#f0f8f3] border border-[#d3ebd9] p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#d3ebd9] pb-4">
                <span className="text-[14px] font-bold text-green-800 uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" /> Resolution Proof Complete
                </span>
                <span className="text-[11px] text-green-700/70 font-bold uppercase tracking-widest">Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">BEFORE (Citizen Report Photo)</span>
                  <S3Image src={issue.imageKey} alt="Before report photo" className="w-full h-56 object-cover rounded-lg border border-slate-100" />
                </div>
                <div className="space-y-2.5 bg-white p-4 rounded-xl border border-[#d3ebd9] shadow-sm">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest block">AFTER (Authority Proof Photo)</span>
                  <S3Image
                    src={issue.resolutionImageKey}
                    alt="After resolution photo"
                    className="w-full h-56 object-cover rounded-lg border border-slate-100"
                  />
                </div>
              </div>

              {issue.resolutionNote && (
                <div className="bg-white p-5 rounded-xl border border-[#d3ebd9] shadow-sm flex gap-3 items-start">
                  <FileText className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block mb-1">Authority Resolution Note</span>
                    <p className="text-[14px] text-slate-700 font-medium italic">
                      "{issue.resolutionNote}"
                    </p>
                  </div>
                </div>
              )}

              {/* CITIZEN VERIFICATION PROMPT */}
              {!issue.verificationStatus ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5 shadow-sm mt-4">
                  <span className="text-[15px] font-bold text-civic-dark block text-center">Citizen Verification Check: Is this issue actually fixed?</span>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => handleCitizenVerification(true)}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-civic-primary hover:bg-civic-secondary text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> YES, IT'S RESOLVED
                    </button>
                    <button
                      onClick={() => handleCitizenVerification(false)}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-[13px] flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <XCircle className="w-4 h-4" /> NO, STILL UNRESOLVED
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-white rounded-xl text-[13px] text-civic-dark flex items-center gap-3 border border-slate-200 shadow-sm mt-4 font-medium">
                  <UserCheck className="w-5 h-5 text-civic-primary shrink-0" />
                  <span>Citizen Verification Feedback: <strong className="font-bold uppercase tracking-wider text-civic-primary ml-1">{issue.verificationStatus}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* AI Structuring & Incident Cluster Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm">
              <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3">
                <Sparkles className="w-4 h-4 text-civic-primary" /> AI Routing & Dispatch Meta
              </span>
              <p className="text-[14px] text-slate-700 font-medium leading-relaxed">{issue.summary}</p>
              <div className="pt-2 flex flex-col gap-2.5">
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Department</span>
                  <strong className="text-[13px] text-civic-dark font-bold">{issue.department}</strong>
                </div>
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Assigned Team</span>
                  <strong className="text-[13px] text-slate-800 font-bold">{issue.assignedTo || 'Unassigned'}</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col">
              <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" /> Linked Citizen Reports
                </span>
                <span className="bg-white text-civic-primary px-2.5 py-1 rounded shadow-sm border border-slate-200">Incident #{issue.incidentId}</span>
              </span>
              <div className="space-y-3 flex-grow overflow-y-auto max-h-56 pr-2 custom-scrollbar">
                {incidentReports.map(rep => (
                  <div key={rep.issueId} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-1.5 text-slate-700 shadow-sm">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[12px] text-civic-dark font-bold uppercase tracking-widest">{rep.issueId}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">{rep.reportedBy}</span>
                    </div>
                    <span className="truncate w-full text-[13px] font-medium text-slate-500">{rep.description}</span>
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
