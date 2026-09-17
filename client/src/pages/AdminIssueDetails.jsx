import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Upload, CheckCircle2, AlertTriangle, Layers, UserCheck, Sparkles, Building2 } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';

export default function AdminIssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Controls
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [afterImagePreview, setAfterImagePreview] = useState(null);
  const [afterImageFile, setAfterImageFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getIssueById(id);
      setData(res);
      setStatus(res.issue.status);
      setDepartment(res.issue.department);
      setAssignedTo(res.issue.assignedTo || '');
      setResolutionNote(res.issue.resolutionNote || '');
      setAfterImagePreview(res.issue.resolutionImageKey || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAfterImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAfterImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateIncident = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    try {
      let finalAfterImageKey = afterImagePreview;

      // Presigned S3 upload if new resolution photo selected
      if (afterImageFile) {
        try {
          const presignedRes = await api.createUploadUrl(afterImageFile.name, afterImageFile.type, 'resolutions');
          if (presignedRes.uploadUrl) {
            await fetch(presignedRes.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': afterImageFile.type },
              body: afterImageFile
            });
            finalAfterImageKey = presignedRes.imageKey;
          }
        } catch (uploadErr) {
          console.warn('Presigned upload fallback to preview data URL:', uploadErr);
        }
      }

      const updates = {
        status,
        department,
        assignedTo,
        resolutionNote,
        resolutionImageKey: finalAfterImageKey,
        propagateToIncident: true // Propagates resolution across all linked citizen reports
      };

      await api.updateIssue(id, updates);
      setSuccessMsg(`Incident #${data.issue.incidentId} updated successfully! Propagated to all ${data.incidentReportCount} linked citizen reports.`);
      loadDetails();
    } catch (err) {
      setError('Failed to update incident details.');
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-xs text-slate-400 font-mono">Loading incident management panel...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 glass-card rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Incident Not Found</h2>
        <Link to="/admin" className="inline-block py-2.5 px-4 rounded-xl bg-slate-800 text-xs text-slate-200">
          Back to Admin Command Center
        </Link>
      </div>
    );
  }

  const { issue, incidentReports, incidentReportCount } = data;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Admin Command Center
        </Link>
        <span className="font-mono text-xs text-indigo-400 font-bold">Work Order Incident #{issue.incidentId}</span>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report & Incident Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">Report #{issue.issueId}</span>
                <h1 className="text-xl font-bold text-white mt-0.5">{issue.description}</h1>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={issue.status} />
                <SeverityBadge severity={issue.severity} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Location</span>
                <span className="font-semibold text-slate-200">📍 {issue.locationLabel}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Submitted By</span>
                <span className="font-semibold text-slate-200">{issue.reportedBy}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">Citizen Submitted Photo</span>
              <img src={issue.imageKey} alt="Citizen report photo" className="w-full h-56 object-cover rounded-xl border border-slate-800" />
            </div>

            {/* Linked Reports under same incident */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Incident #{issue.incidentId} Report Cluster
                </span>
                <span className="font-mono text-slate-300">
                  {incidentReportCount} citizen reports → 1 physical work order
                </span>
              </div>
              <div className="space-y-2">
                {incidentReports.map(rep => (
                  <div key={rep.issueId} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono text-cyan-400 font-semibold">{rep.issueId}</span>: {rep.description}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{rep.reportedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authority Management Form */}
        <div className="space-y-6">
          <form onSubmit={handleUpdateIncident} className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-indigo-400" /> Dispatch & Status Control
            </h2>

            {/* Status Workflow Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">Status Workflow</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="REPORTED">REPORTED</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            {/* Department Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">Assigned Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="SANITATION">SANITATION</option>
                <option value="PUBLIC_WORKS">PUBLIC_WORKS</option>
                <option value="WATER_SERVICES">WATER_SERVICES</option>
                <option value="DRAINAGE">DRAINAGE</option>
              </select>
            </div>

            {/* Assigned Team Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">Field Response Crew</label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Electrical Crew Alpha"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Resolution After Photo Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">Resolution "After" Photo Proof</label>
              <div className="border border-dashed border-slate-800 rounded-xl p-3 text-center cursor-pointer bg-slate-900/60 relative">
                <input type="file" accept="image/*" onChange={handleAfterImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                {afterImagePreview ? (
                  <img src={afterImagePreview} alt="After proof" className="max-h-32 mx-auto rounded-lg object-cover" />
                ) : (
                  <div className="py-2 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <Upload className="w-4 h-4 text-indigo-400" /> Upload After Photo
                  </div>
                )}
              </div>
            </div>

            {/* Resolution Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase">Resolution Notes</label>
              <textarea
                rows={2}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe resolution work performed..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
              Update & Propagate to {incidentReportCount} Reports
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
