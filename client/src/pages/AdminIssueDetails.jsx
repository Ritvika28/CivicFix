import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Upload, CheckCircle2, AlertTriangle, Layers, UserCheck, Sparkles, Building2, MapPin } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import S3Image from '../components/S3Image';
import IntelligencePanel from '../components/IntelligencePanel';

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
          const fileType = afterImageFile.type || 'image/jpeg';
          const presignedRes = await api.createUploadUrl(afterImageFile.name, fileType, 'resolutions');
          if (presignedRes && presignedRes.uploadUrl) {
            const uploadRes = await fetch(presignedRes.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': fileType },
              body: afterImageFile
            });
            if (!uploadRes.ok) {
              throw new Error(`S3 resolution PUT failed with HTTP status ${uploadRes.status}`);
            }
            finalAfterImageKey = presignedRes.imageKey;
          }
        } catch (uploadErr) {
          console.warn('Presigned resolution upload fallback to preview data URL:', uploadErr);
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

      await api.updateIssue(data.issue.issueId, updates);
      setSuccessMsg(`Incident #${data.issue.incidentId} updated successfully! Propagated to all ${data.incidentReportCount} linked citizen reports.`);
      loadDetails();
    } catch (err) {
      setError('Failed to update incident details.');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-sm text-slate-500 font-bold bg-civic-cream min-h-screen">Loading incident management panel...</div>;
  }

  if (error || !data) {
    return (
      <div className="bg-civic-cream min-h-screen py-12">
        <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 shadow-sm rounded-2xl text-center space-y-5">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-civic-dark">Incident Not Found</h2>
          <Link to="/admin" className="inline-block py-3 px-6 rounded-xl bg-white border border-slate-200 shadow-sm text-[13px] font-bold text-civic-dark hover:bg-slate-50 transition-colors">
            Back to Admin Command Center
          </Link>
        </div>
      </div>
    );
  }

  const { issue, incidentReports, incidentReportCount } = data;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start bg-civic-cream py-8 pb-16 px-4 sm:px-5 lg:px-8" style={{ boxSizing: 'border-box' }}>
      <div className="w-full max-w-[1380px] space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <Link to="/admin" className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-civic-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Command Center
          </Link>
          <span className="text-[12px] text-civic-dark font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded border border-slate-100">
            Work Order Incident #{issue.incidentId}
          </span>
        </div>

        {issue.status === 'REOPENED' && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2 shadow-sm">
            <div className="flex items-center gap-2.5 font-bold text-sm text-red-700">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>INCIDENT REOPENED — CITIZEN VERIFICATION FAILED</span>
            </div>
            <p className="text-xs text-red-800 font-medium leading-relaxed pl-7">
              Reason: {issue.reopenReason || 'Citizen inspected physical site and reported that the issue remains unresolved after authority resolution update.'}
            </p>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-[13px] font-bold flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* ── INCIDENT INTELLIGENCE PANEL ── */}
        <IntelligencePanel
          mainIssue={issue}
          incidentReports={incidentReports}
          allIssues={[]}
          onNavigateToMap={() => navigate('/admin#map')}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Report & Incident Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-4">
                  <span className="text-[10px] text-civic-primary font-bold uppercase tracking-widest bg-civic-50 px-2.5 py-1 rounded border border-civic-100">
                    Canonical Report #{issue.issueId}
                  </span>
                  <h1 className="text-[24px] font-bold text-civic-dark leading-tight">{issue.description}</h1>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                  <StatusBadge status={issue.status} />
                  <SeverityBadge severity={issue.severity} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Location</span>
                  <span className="font-bold text-civic-dark text-[14px] flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> {issue.locationLabel}</span>
                </div>
                <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Submitted By</span>
                  <span className="font-bold text-civic-dark text-[14px] flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-slate-400"/> {issue.reportedBy}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest block">Citizen Submitted Photo</span>
                <S3Image src={issue.imageKey} alt="Citizen report photo" className="w-full h-72 object-cover rounded-xl border border-slate-200 shadow-sm" />
              </div>

              {/* Linked Reports under same incident */}
              <div className="bg-[#f8faf9] p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="text-[13px] font-bold text-civic-dark flex items-center gap-2 uppercase tracking-wide">
                    <Layers className="w-5 h-5 text-civic-primary" /> Incident #{issue.incidentId} Cluster
                  </span>
                  <span className="text-[10px] font-bold text-civic-primary bg-white px-2.5 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-widest">
                    {incidentReportCount} citizen reports → 1 physical work order
                  </span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {incidentReports.map(rep => (
                    <div key={rep.issueId} className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex flex-col gap-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-civic-dark font-bold uppercase tracking-wider">{rep.issueId}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{rep.reportedBy}</span>
                      </div>
                      <span className="text-[13px] text-slate-600 font-medium leading-relaxed">{rep.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authority Management Form */}
          <div className="space-y-6">
            <form onSubmit={handleUpdateIncident} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-7 sticky top-6">
              <h2 className="text-[16px] font-bold text-civic-dark flex items-center gap-2 border-b border-slate-100 pb-4">
                <Building2 className="w-5 h-5 text-civic-primary" /> Dispatch & Status Control
              </h2>

              {/* Quick Status Workflow Action Buttons */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workflow Quick Actions</label>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setStatus('VERIFIED')}
                    className={`py-3 px-3 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm ${
                      status === 'VERIFIED' ? 'bg-civic-200 text-civic-950 border-civic-500 font-extrabold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>1. Verify</span>
                    {status === 'VERIFIED' && <CheckCircle2 className="w-4 h-4 text-civic-800"/>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('ASSIGNED')}
                    className={`py-3 px-3 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm ${
                      status === 'ASSIGNED' ? 'bg-civic-200 text-civic-950 border-civic-500 font-extrabold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>2. Assign</span>
                    {status === 'ASSIGNED' && <CheckCircle2 className="w-4 h-4 text-civic-800"/>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('IN_PROGRESS')}
                    className={`py-3 px-3 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm ${
                      status === 'IN_PROGRESS' ? 'bg-civic-200 text-civic-950 border-civic-500 font-extrabold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>3. In Progress</span>
                    {status === 'IN_PROGRESS' && <CheckCircle2 className="w-4 h-4 text-civic-800"/>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('RESOLVED')}
                    className={`py-3 px-3 rounded-xl border text-left flex items-center justify-between transition-colors shadow-sm ${
                      status === 'RESOLVED' ? 'bg-emerald-200 text-emerald-950 border-emerald-500 font-extrabold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>4. Resolve</span>
                    {status === 'RESOLVED' && <CheckCircle2 className="w-4 h-4 text-emerald-800"/>}
                  </button>
                </div>
              </div>

              {/* Status Workflow Selector */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status State Override</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-bold text-civic-dark focus:outline-none focus:border-civic-primary focus:ring-1 focus:ring-civic-primary shadow-sm appearance-none"
                >
                  <option value="REPORTED">REPORTED</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              {/* Department Selector */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Assigned Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-bold text-civic-dark focus:outline-none focus:border-civic-primary focus:ring-1 focus:ring-civic-primary shadow-sm appearance-none"
                >
                  <option value="ELECTRICAL">ELECTRICAL</option>
                  <option value="SANITATION">SANITATION</option>
                  <option value="PUBLIC_WORKS">PUBLIC_WORKS</option>
                  <option value="WATER_SERVICES">WATER_SERVICES</option>
                  <option value="DRAINAGE">DRAINAGE</option>
                </select>
              </div>

              {/* Assigned Team Input */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Field Response Crew</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Electrical Crew Alpha"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-bold text-civic-dark focus:outline-none focus:border-civic-primary focus:ring-1 focus:ring-civic-primary shadow-sm placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>

              {/* Resolution After Photo Upload */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resolution "After" Photo Proof</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:border-civic-primary/40 hover:bg-slate-50 transition-colors relative">
                  <input type="file" accept="image/*" onChange={handleAfterImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {afterImagePreview ? (
                    <img src={afterImagePreview} alt="After proof" className="max-h-36 mx-auto rounded-lg object-cover shadow-sm border border-slate-200" />
                  ) : (
                    <div className="py-4 text-[13px] font-bold text-slate-500 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-civic-primary" />
                      </div>
                      <span>Click to upload after photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Notes */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resolution Notes</label>
                <textarea
                  rows={4}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Describe resolution work performed..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-[13px] font-medium text-civic-dark focus:outline-none focus:border-civic-primary focus:ring-1 focus:ring-civic-primary shadow-sm placeholder:text-slate-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-4 rounded-xl bg-civic-200 hover:bg-civic-300 text-civic-950 border border-civic-400 font-extrabold text-[13px] shadow-sm transition-colors flex justify-center items-center gap-2 uppercase tracking-wide mt-2"
              >
                <CheckCircle2 className="w-5 h-5 text-civic-950" />
                Update & Propagate
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
