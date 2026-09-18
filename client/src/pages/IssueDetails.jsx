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
    return <div className="text-center py-16 text-xs text-slate-400 font-mono">Loading issue timeline...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 glass-card rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Issue Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Could not locate issue details.'}</p>
        <Link to="/citizen" className="inline-block py-2.5 px-4 rounded-xl bg-slate-800 text-xs text-slate-200">
          Back to My Reports
        </Link>
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
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link to="/citizen" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Reports
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-cyan-400 font-bold">Ticket #{issue.issueId}</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-xs text-indigo-300 font-semibold">Incident #{issue.incidentId}</span>
        </div>
      </div>

      {userFeedbackMsg && (
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          {userFeedbackMsg}
        </div>
      )}

      {/* Main Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={issue.status} />
              <SeverityBadge severity={issue.severity} />
            </div>
            <h1 className="text-2xl font-bold text-white">{issue.description}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>📍 {issue.locationLabel}</span>
              <span>•</span>
              <span>Reported {issue.reportedAt || issue.createdAt ? new Date(issue.reportedAt || issue.createdAt).toLocaleString() : 'Just now'}</span>
            </p>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/30 text-right space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Incident Clustering</span>
            <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1 justify-end">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              {incidentReportCount} {incidentReportCount === 1 ? 'Report' : 'Reports'} → 1 Incident Work Order
            </span>
          </div>
        </div>

        {/* TIMELINE VISUALIZATION */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">Resolution Progress Timeline</span>
          <div className="grid grid-cols-5 gap-2 relative">
            {TIMELINE_STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} className="text-center space-y-2">
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30'
                      : isPassed
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-950 text-slate-600 border border-slate-800'
                  }`}>
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[11px] block font-medium ${isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BEFORE & AFTER RESOLUTION PHOTO DISPLAY */}
        {issue.status === 'RESOLVED' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Resolution Proof Complete
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Resolved at: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 block font-mono">BEFORE (Citizen Report Photo)</span>
                <S3Image src={issue.imageKey} alt="Before report photo" className="w-full h-48 object-cover rounded-xl border border-slate-800" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-emerald-400 block font-mono">AFTER (Authority Proof Photo)</span>
                <S3Image
                  src={issue.resolutionImageKey}
                  alt="After resolution photo"
                  className="w-full h-48 object-cover rounded-xl border border-emerald-500/30"
                />
              </div>
            </div>

            {issue.resolutionNote && (
              <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 italic">
                Authority Resolution Note: "{issue.resolutionNote}"
              </p>
            )}

            {/* CITIZEN VERIFICATION PROMPT */}
            {!issue.verificationStatus ? (
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-200 block">Citizen Verification Check: Is this issue actually fixed?</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCitizenVerification(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> YES, IT'S RESOLVED
                  </button>
                  <button
                    onClick={() => handleCitizenVerification(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> NO, STILL UNRESOLVED
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 border border-cyan-500/20">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Citizen Verification Feedback: <span className="font-bold text-white uppercase">{issue.verificationStatus}</span>
              </div>
            )}
          </div>
        )}

        {/* AI Structuring & Incident Cluster Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Routing & Dispatch Meta
            </span>
            <p className="text-xs text-slate-300">{issue.summary}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Department: <strong className="text-cyan-400">{issue.department}</strong>
              </span>
              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Assigned Team: <strong className="text-slate-200">{issue.assignedTo || 'Unassigned'}</strong>
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Linked Citizen Reports ({incidentReportCount})
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Incident #{issue.incidentId}</span>
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {incidentReports.map(rep => (
                <div key={rep.issueId} className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-slate-300">
                  <span className="font-mono text-cyan-400 font-semibold">{rep.issueId}</span>
                  <span className="truncate max-w-[180px]">{rep.description}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{rep.reportedBy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
