import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Sparkles, AlertTriangle, Layers, CheckCircle2, Loader2, ArrowRight, Info, Check, Image as ImageIcon, Leaf } from 'lucide-react';
import { DEMO_LOCATIONS, ISSUE_CATEGORIES } from '../data/demoData';
import { api } from '../services/api';
import { analyzeIssue } from '../services/mockAiService';

export default function ReportIssue() {
  const navigate = useNavigate();

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('gate2');
  const [customCoords, setCustomCoords] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Workflow Modal States
  const [step, setStep] = useState('FORM'); // FORM -> ANALYZING -> RESULT
  const [analysisResult, setAnalysisResult] = useState(null);
  const [createdIssue, setCreatedIssue] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Location Selection
  const handleLocationChange = (locId) => {
    setSelectedLocationId(locId);
    setCustomCoords(null);
  };

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            label: 'Current GPS Location'
          });
          setSelectedLocationId('custom');
        },
        (err) => {
          setErrorMsg('Location access denied. Using campus demo location.');
        }
      );
    } else {
      setErrorMsg('Geolocation not supported by browser. Using demo campus location.');
    }
  };

  // Handle Image Upload
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe the issue before submitting.');
      return;
    }
    setErrorMsg('');
    setStep('ANALYZING');

    try {
      // Determine active coordinates
      let lat, lng, label;
      if (customCoords) {
        lat = customCoords.latitude;
        lng = customCoords.longitude;
        label = customCoords.label;
      } else {
        const demoLoc = DEMO_LOCATIONS.find(l => l.id === selectedLocationId) || DEMO_LOCATIONS[0];
        lat = demoLoc.latitude;
        lng = demoLoc.longitude;
        label = demoLoc.name;
      }

      // S3 Presigned URL Upload Flow if image file selected
      let finalImageKey = null;
      if (imageFile) {
        try {
          const fileType = imageFile.type || 'image/jpeg';
          const presignedRes = await api.createUploadUrl(imageFile.name, fileType, 'reports');
          if (presignedRes && presignedRes.uploadUrl) {
            const uploadRes = await fetch(presignedRes.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': fileType },
              body: imageFile
            });
            if (!uploadRes.ok) {
              throw new Error(`S3 PUT failed with HTTP status ${uploadRes.status}`);
            }
            finalImageKey = presignedRes.imageKey;
          }
        } catch (uploadErr) {
          console.warn('Presigned S3 upload fallback to preview data URL:', uploadErr);
          finalImageKey = imagePreview;
        }
      }

      // 1. Run AI Classification Analysis
      const aiData = await analyzeIssue({
        description,
        category,
        latitude: lat,
        longitude: lng,
        locationLabel: label
      });

      // 2. Call API for issue creation & duplicate detection
      const res = await api.createIssue({
        description,
        category: aiData.category,
        issueType: aiData.issueType,
        severity: aiData.severity,
        department: aiData.department,
        summary: aiData.summary,
        latitude: lat,
        longitude: lng,
        locationLabel: label,
        imageKey: finalImageKey || imagePreview || null,
        reportedBy: "citizen-user"
      });

      const issueObj = res.issue || res;
      const isDup = Boolean(res.isDuplicate || (res.dupResult && res.dupResult.isDuplicate));

      setAnalysisResult({
        issue: issueObj,
        aiResult: aiData,
        dupResult: {
          isDuplicate: isDup,
          canonicalIncidentId: res.linkedIncidentId || issueObj.incidentId,
          reasons: isDup
            ? ['Spatial Proximity Match (≤100m)', `Text Similarity Index Score: ${res.duplicateScore || 0.75}`]
            : ['No duplicate reports found nearby']
        }
      });
      setCreatedIssue(issueObj);
      setStep('RESULT');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process report. Please try again.');
      setStep('FORM');
    }
  };

  return (
    <div className="w-full max-w-[1380px] mx-auto py-6 px-4 sm:px-5 lg:px-8 space-y-6 min-h-screen bg-civic-cream" style={{ boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold text-civic-dark tracking-tight flex items-center gap-3">
          <Layers className="w-7 h-7 text-civic-primary" />
          Report a Civic Issue
        </h1>
        <p className="text-[14px] text-slate-600 font-medium">
          Upload a photo, select location, and let CivicFix AI analyze, group, and route your report.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 shadow-sm font-medium">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* STEP 1: FORM WITH TWO-COLUMN LAYOUT */}
      {step === 'FORM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Report Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              
              {/* Photo Upload Area */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  1. Issue Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-civic-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors relative overflow-hidden bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="Upload preview" className="max-h-48 mx-auto rounded-lg object-cover shadow-sm" />
                      <div className="absolute inset-0 bg-civic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold text-white rounded-lg">
                        Click to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 space-y-3">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
                        <ImageIcon className="w-6 h-6 text-civic-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-700 font-bold">Click or drop a photo of the problem</p>
                        <p className="text-xs text-slate-500 font-medium">Supports JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  2. Location Coordinates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      value={selectedLocationId}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-civic-primary/20 focus:border-civic-primary shadow-sm font-medium appearance-none"
                    >
                      <option value="" disabled>Select Demo Campus Spot</option>
                      {DEMO_LOCATIONS.map(loc => (
                         <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                      {customCoords && <option value="custom">My Current GPS Location</option>}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="w-full py-3 px-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-sm font-bold text-green-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    Use My Live GPS
                  </button>
                </div>
              </div>

              {/* Category Dropdown (Optional Override) */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                  <span>3. Category</span>
                  <span className="text-civic-primary">(Optional — AI can auto-detect)</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-civic-primary/20 focus:border-civic-primary shadow-sm font-medium appearance-none"
                >
                  <option value="">-- Let AI Auto-Detect Category --</option>
                  {Object.entries(ISSUE_CATEGORIES).map(([key, item]) => (
                    <option key={key} value={key}>{item.label}</option>
                  ))}
                </select>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  4. Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Streetlight near Gate 2 is not working and the area is completely dark at night..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-primary/20 focus:border-civic-primary shadow-sm font-medium resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-4 rounded-xl bg-civic-primary hover:bg-civic-secondary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-civic-primary/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Analyze & Submit Report
              </button>
            </form>
          </div>

          {/* Right Column: Tips */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-5 sticky top-24">
              <div className="flex items-center gap-2 text-civic-dark font-bold text-[14px]">
                <Info className="w-5 h-5 text-civic-primary" />
                Tips for a better report
              </div>
              
              <ul className="space-y-4 text-[13px] text-slate-600 font-medium">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
                  <span>Include a clear photo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
                  <span>Use accurate location</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
                  <span>Add a short description</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
                  <span>AI will detect category</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
                  <span>Similar reports are grouped</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 space-y-2 text-center">
               <Leaf className="w-8 h-8 text-green-600 mx-auto" />
               <h3 className="font-bold text-green-900 text-sm">Together for Better Campus</h3>
               <p className="text-[12px] text-green-800/80 font-medium leading-relaxed">
                 Your report helps build a safer, cleaner and smarter environment.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ANALYZING STATE */}
      {step === 'ANALYZING' && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6 max-w-2xl mx-auto mt-8">
          <Loader2 className="w-12 h-12 text-civic-primary animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-civic-dark">Structuring & Analyzing Report...</h2>
          <div className="space-y-3 text-[13px] text-slate-600 font-medium max-w-sm mx-auto text-left bg-slate-50 p-5 rounded-xl border border-slate-200">
            <p className="animate-pulse flex gap-2 items-center"><Check className="w-4 h-4 text-civic-primary"/> Structuring report context with AI</p>
            <p className="animate-pulse flex gap-2 items-center"><Check className="w-4 h-4 text-civic-primary"/> Checking deterministic safety rules</p>
            <p className="animate-pulse flex gap-2 items-center"><Check className="w-4 h-4 text-civic-primary"/> Calculating spatial Haversine duplicate distance (≤100m)</p>
            <p className="animate-pulse flex gap-2 items-center"><Check className="w-4 h-4 text-civic-primary"/> Evaluating text similarity index (≥0.70)</p>
          </div>
        </div>
      )}

      {/* STEP 3: ANALYSIS RESULT & CONFIRMATION */}
      {step === 'RESULT' && createdIssue && (
        <div className="space-y-6 max-w-3xl mx-auto mt-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-civic-dark tracking-tight">Citizen Report Submitted!</h2>
                <p className="text-[13px] text-slate-500 font-medium mt-1">Report Ticket ID: <span className="font-bold text-civic-primary">{createdIssue.issueId}</span></p>
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-[#f8faf9] p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-civic-dark tracking-wide uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-civic-primary" /> AI Report Classification
                </span>
                <span className="text-[11px] text-civic-primary font-bold bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
                  Confidence: {Math.round((analysisResult?.aiResult?.confidence || 0.92) * 100)}%
                </span>
              </div>

              {analysisResult?.aiResult?.safetyOverrideTriggered && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-3 shadow-sm font-medium">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1 text-[13px]">SAFETY OVERRIDE ENFORCED</span>
                    {analysisResult?.aiResult?.reasoning}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Category</span>
                  <span className="font-bold text-civic-dark">{analysisResult?.aiResult?.category || createdIssue.category}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Issue Type</span>
                  <span className="font-bold text-civic-dark">{analysisResult?.aiResult?.issueType || createdIssue.issueType}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Severity</span>
                  <span className={`font-bold ${(analysisResult?.aiResult?.severity || createdIssue.severity) === 'CRITICAL' ? 'text-red-600' : (analysisResult?.aiResult?.severity || createdIssue.severity) === 'HIGH' ? 'text-orange-600' : 'text-amber-600'}`}>
                    {analysisResult?.aiResult?.severity || createdIssue.severity}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Department</span>
                  <span className="font-bold text-civic-primary">{analysisResult?.aiResult?.department || createdIssue.department}</span>
                </div>
              </div>

              <div className="text-[13px] text-slate-600 font-medium italic bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                AI Summary: "{analysisResult?.aiResult?.summary || createdIssue.summary || createdIssue.description}"
              </div>
            </div>

            {/* Duplicate Check Outcome Card (REPORT != INCIDENT) */}
            <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
              analysisResult?.dupResult?.isDuplicate
                ? 'bg-orange-50 border-orange-200 text-orange-900'
                : 'bg-green-50 border-green-200 text-green-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-[15px]">
                <Layers className="w-5 h-5 shrink-0" />
                {analysisResult?.dupResult?.isDuplicate
                  ? 'Duplicate Report Detected & Clustered!'
                  : 'New Physical Incident Created'}
              </div>

              {analysisResult?.dupResult?.isDuplicate ? (
                <div className="space-y-4 text-[13px] font-medium">
                  <p className="leading-relaxed">
                    Your report describes a problem similar to an existing report. CivicFix grouped your report under Incident <span className="font-bold text-orange-800">#{createdIssue.incidentId}</span>. Your report remains active as individual ticket <span className="font-bold text-civic-primary">#{createdIssue.issueId}</span>.
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-orange-200 space-y-2 text-xs text-orange-800 font-bold shadow-sm">
                    {(analysisResult?.dupResult?.reasons || []).map((r, i) => (
                      <div key={i} className="flex gap-2"><Check className="w-4 h-4"/> {r}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] font-medium">
                  No duplicate reports found nearby. Created new Incident record <span className="font-bold text-green-700">#{createdIssue.incidentId}</span>.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/issues/${createdIssue.issueId}`)}
                className="flex-1 py-3.5 px-4 rounded-xl bg-civic-primary hover:bg-civic-secondary text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                View Issue Details <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/citizen')}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-civic-dark border border-slate-200 font-bold text-sm transition-colors shadow-sm"
              >
                My Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
