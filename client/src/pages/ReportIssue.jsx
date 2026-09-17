import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Sparkles, AlertTriangle, Layers, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { DEMO_LOCATIONS, ISSUE_CATEGORIES } from '../data/demoData';
import { api } from '../services/api';

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
        const presignedRes = await api.createUploadUrl(imageFile.name, imageFile.type);
        if (presignedRes.uploadUrl) {
          await fetch(presignedRes.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': imageFile.type },
            body: imageFile
          });
          finalImageKey = presignedRes.imageKey;
        }
      }

      // Call API Gateway for AI analysis + duplicate detection + creation
      const res = await api.createIssue({
        description,
        category,
        latitude: lat,
        longitude: lng,
        locationLabel: label,
        imageKey: finalImageKey || imagePreview
      });

      setAnalysisResult(res);
      setCreatedIssue(res.issue);
      setStep('RESULT');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process report. Please try again.');
      setStep('FORM');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Report a Civic Issue
        </h1>
        <p className="text-sm text-slate-400">
          Upload a photo, pinpoint location, and let CivicFix AI analyze, group, and route your report.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* STEP 1: FORM */}
      {step === 'FORM' && (
        <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
          {/* Photo Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              1. Issue Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors relative overflow-hidden bg-slate-900/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Upload preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-slate-200">
                    Click to change photo
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">Click or drop a photo of the problem</p>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              2. Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedLocationId}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="" disabled>Select Demo Campus Spot</option>
                  {DEMO_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>📍 {loc.name}</option>
                  ))}
                  {customCoords && <option value="custom">📍 My GPS Coordinates</option>}
                </select>
              </div>

              <button
                type="button"
                onClick={handleUseMyLocation}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Use My GPS Location
              </button>
            </div>
          </div>

          {/* Category Dropdown (Optional Override) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              3. Category (Optional — AI can auto-detect)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Let AI Auto-Detect Category --</option>
              {Object.entries(ISSUE_CATEGORIES).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              4. Issue Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Streetlight near Gate 2 is not working and the area is completely dark at night..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Analyze & Submit Report
          </button>
        </form>
      )}

      {/* STEP 2: ANALYZING STATE */}
      {step === 'ANALYZING' && (
        <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Analyzing Your Report...</h2>
          <div className="space-y-1 text-xs text-slate-400 max-w-sm mx-auto font-mono">
            <p className="animate-pulse">✓ Structuring report context with AI</p>
            <p className="animate-pulse">✓ Checking deterministic safety rules</p>
            <p className="animate-pulse">✓ Calculating spatial Haversine duplicate distance</p>
          </div>
        </div>
      )}

      {/* STEP 3: ANALYSIS RESULT & CONFIRMATION */}
      {step === 'RESULT' && analysisResult && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Report Successfully Created!</h2>
                <p className="text-xs text-cyan-400 font-mono">Issue ID: {createdIssue.issueId}</p>
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-slate-900/80 p-5 rounded-xl border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Report Structuring
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Confidence: {Math.round(analysisResult.aiResult.confidence * 100)}%
                </span>
              </div>

              {analysisResult.aiResult.safetyOverrideTriggered && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">SAFETY OVERRIDE ENFORCED</span>
                    {analysisResult.aiResult.reasoning}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Category</span>
                  <span className="font-semibold text-slate-200">{analysisResult.aiResult.category}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Issue Type</span>
                  <span className="font-semibold text-slate-200">{analysisResult.aiResult.issueType}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Severity</span>
                  <span className={`font-bold ${analysisResult.aiResult.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {analysisResult.aiResult.severity}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Department</span>
                  <span className="font-semibold text-cyan-300">{analysisResult.aiResult.department}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                "{analysisResult.aiResult.summary}"
              </p>
            </div>

            {/* Duplicate Check Outcome Card */}
            <div className={`p-5 rounded-xl border space-y-3 ${
              analysisResult.dupResult?.isDuplicate
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 font-semibold text-xs">
                <Layers className="w-4 h-4 shrink-0" />
                {analysisResult.dupResult?.isDuplicate
                  ? 'Possible Duplicate Detected & Linked!'
                  : 'Unique Incident Created'}
              </div>

              {analysisResult.dupResult?.isDuplicate ? (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    Your report describes a problem similar to an existing report. CivicFix linked your report to Incident <span className="font-mono font-bold text-amber-400">#{createdIssue.incidentId}</span>.
                  </p>
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-500/20 space-y-1 text-[11px] text-slate-300 font-mono">
                    {analysisResult.dupResult.reasons.map((r, i) => (
                      <div key={i}>{r}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-300">
                  No duplicate reports found nearby. Created new Incident record <span className="font-mono font-bold text-emerald-400">#{createdIssue.incidentId}</span>.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/issues/${createdIssue.issueId}`)}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                View Issue Details <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/citizen')}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-colors"
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
