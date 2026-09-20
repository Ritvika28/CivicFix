import React from 'react';
import {
  Brain,
  Zap,
  Flame,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  ListOrdered,
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  calculateImpactScore,
  analyzeRootCause,
  recommendNextBestAction,
  buildIncidentTimeline
} from '../utils/intelligenceEngine';

export default function IntelligencePanel({ mainIssue = {}, incidentReports = [], allIssues = [], onNavigateToMap }) {
  const reports = incidentReports.length > 0 ? incidentReports : [mainIssue];

  // 1. Calculate Impact Score
  const impact = calculateImpactScore(reports, mainIssue);

  // 2. Analyze Root Cause
  const rootCause = analyzeRootCause(reports, mainIssue, allIssues);

  // 3. Recommend Next Best Action
  const nextAction = recommendNextBestAction(reports, mainIssue);

  // 4. Build Incident Evolution Timeline
  const timeline = buildIncidentTimeline(mainIssue, reports);

  return (
    <div className="bg-[#FDFCF8] rounded-2xl border border-[#DEE4DA] p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#DEE4DA] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-civic-100 border border-civic-300 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-civic-800" />
          </div>
          <div>
            <h2 className="text-[17px] sm:text-[18px] font-extrabold text-civic-dark tracking-tight">
              Incident Intelligence Analysis
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 block -mt-0.5">
              Explainable prioritization & advisory recommendations
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-civic-100 border border-civic-300 text-civic-900 text-[10px] font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-civic-700" /> AI Prioritized
        </span>
      </div>

      {/* Grid of Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── CARD 1: INCIDENT IMPACT SCORE ── */}
        <div className="bg-white p-5 rounded-xl border border-[#DEE4DA] shadow-sm space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  Incident Impact Score
                </span>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${impact.badgeColor}`}>
                  {impact.label}
                </span>
              </div>
              <div className="text-right">
                <div className="text-[32px] font-extrabold text-civic-dark leading-none">
                  {impact.score}
                  <span className="text-[14px] text-slate-400 font-bold"> / 100</span>
                </div>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-civic-400 via-amber-500 to-red-600 transition-all duration-500 rounded-full"
                style={{ width: `${impact.score}%` }}
              />
            </div>

            {/* Transparent Breakdown Reasons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                Why this score:
              </span>
              <ul className="space-y-1 text-[12px] text-slate-600 font-medium">
                {impact.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-civic-700 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" /> Operational priority index • Non-government indicator
          </div>
        </div>

        {/* ── CARD 2: POSSIBLE ROOT CAUSE ANALYSIS ── */}
        <div className="bg-white p-5 rounded-xl border border-[#DEE4DA] shadow-sm space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Possible Root Cause
              </span>
              {rootCause.hasRootCause && (
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-extrabold uppercase">
                  Confidence: {rootCause.confidence}
                </span>
              )}
            </div>

            {rootCause.hasRootCause ? (
              <div className="space-y-2">
                <h3 className="text-[15px] font-extrabold text-civic-dark leading-snug flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  {rootCause.possibleCause}
                </h3>
                <div className="space-y-1 text-[12px] text-slate-600 font-medium">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                    Signals Suggesting Cause:
                  </span>
                  {rootCause.signals.map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-civic-600 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-600 font-medium text-center space-y-1">
                <Search className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-bold">{rootCause.message}</p>
                <p className="text-[11px] text-slate-400">Collect more site reports to enable cross-signal analysis.</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200 font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{rootCause.disclaimer}</span>
          </div>
        </div>
      </div>

      {/* ── CARD 3: AUTHORITY NEXT BEST ACTION ── */}
      <div className="bg-white p-5 rounded-xl border border-[#DEE4DA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-civic-700" />
            <span className="text-[14px] font-extrabold text-civic-dark uppercase tracking-wide">
              Advisory Next Best Action
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-civic-100 text-civic-900 border border-civic-300 text-[10px] font-extrabold uppercase">
              {nextAction.priorityTag}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold uppercase">
              Dept: {nextAction.recommendedDepartment}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {nextAction.steps.map((stepText, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-civic-50/60 border border-civic-200 space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-civic-200 text-civic-950 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-extrabold text-civic-800 uppercase tracking-widest">
                  Step {idx + 1}
                </span>
              </div>
              <p className="text-[12px] text-civic-dark font-medium leading-snug">
                {stepText}
              </p>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-500 font-medium italic">
          * {nextAction.disclaimer}
        </div>
      </div>

      {/* ── CARD 4: INCIDENT EVOLUTION TIMELINE ── */}
      <div className="bg-white p-5 rounded-xl border border-[#DEE4DA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-civic-700" />
            <span className="text-[14px] font-extrabold text-civic-dark uppercase tracking-wide">
              Incident Evolution Timeline
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            Real Stored Timestamps
          </span>
        </div>

        <div className="space-y-3">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 text-[13px]">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                item.status === 'completed'
                  ? 'bg-civic-200 text-civic-950 border border-civic-400'
                  : item.status === 'active'
                  ? 'bg-red-100 text-red-900 border border-red-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-300'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0 border-b border-slate-100 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-civic-dark text-[13px] uppercase tracking-wide">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[12px] text-slate-600 font-medium mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
