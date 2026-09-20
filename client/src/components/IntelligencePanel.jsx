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

  // SVG Circular Progress calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (impact.score / 100) * circumference;

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#D6E4D7] overflow-hidden space-y-0 shadow-civic">
      {/* Panel Header — Deep Forest Dark Green */}
      <div className="bg-[#174A2A] text-white p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F5E35] border border-[#2F7D46] flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-[#8BCF45]" />
          </div>
          <div>
            <h2 className="text-[17px] sm:text-[19px] font-extrabold text-white tracking-tight flex items-center gap-2">
              INCIDENT INTELLIGENCE
            </h2>
            <span className="text-[11px] font-medium text-[#DDEBDD] block -mt-0.5">
              Explainable prioritization, root cause analysis & advisory workflows
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F5E35] border border-[#2F7D46] text-[#8BCF45] text-[10px] font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#8BCF45]" /> AI Prioritized
        </span>
      </div>

      <div className="p-6 sm:p-7 space-y-6 bg-[#F6FAF5]">
        {/* Grid of Intelligence Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── CARD 1: INCIDENT IMPACT SCORE ── */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D6E4D7] shadow-sm space-y-4 flex flex-col justify-between civic-card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#52635A] block">
                    Incident Impact Score
                  </span>
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${impact.badgeColor}`}>
                    {impact.label}
                  </span>
                </div>

                {/* Circular Impact Ring Visual */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="#DDEBDD"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="#43A85F"
                      strokeWidth="7"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[20px] font-extrabold text-[#174A2A] leading-none">
                      {impact.score}
                    </span>
                    <span className="text-[9px] text-[#52635A] font-bold uppercase tracking-tighter">
                      /100
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Breakdown Reasons */}
              <div className="space-y-2 pt-2 border-t border-[#EEF6EE]">
                <span className="text-[11px] font-extrabold text-[#174A2A] uppercase tracking-wider block">
                  Scoring Factors:
                </span>
                <ul className="space-y-1.5 text-[12px] text-[#52635A] font-medium">
                  {impact.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#43A85F] mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-[10px] text-[#52635A] font-mono pt-2 border-t border-[#EEF6EE] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#43A85F] shrink-0" />
              Operational priority index • Field verification required
            </div>
          </div>

          {/* ── CARD 2: POSSIBLE ROOT CAUSE ANALYSIS ── */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D6E4D7] shadow-sm space-y-4 flex flex-col justify-between civic-card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#174A2A]">
                  POSSIBLE ROOT CAUSE
                </span>
                {rootCause.hasRootCause && (
                  <span className="px-2.5 py-0.5 rounded bg-[#EEF6EE] text-[#1F5E35] border border-[#43A85F] text-[10px] font-extrabold uppercase">
                    {rootCause.confidence} Confidence
                  </span>
                )}
              </div>

              {rootCause.hasRootCause ? (
                <div className="space-y-3 p-3.5 rounded-xl bg-[#F6FAF5] border border-[#D6E4D7]">
                  <h3 className="text-[15px] font-extrabold text-[#174A2A] leading-snug flex items-start gap-2">
                    <Flame className="w-4.5 h-4.5 text-[#E8A52B] shrink-0 mt-0.5" />
                    {rootCause.possibleCause}
                  </h3>
                  <div className="space-y-1.5 text-[12px] text-[#52635A] font-medium">
                    <span className="text-[11px] font-extrabold text-[#174A2A] uppercase tracking-wider block">
                      Signals Detected:
                    </span>
                    {rootCause.signals.map((sig, idx) => (
                      <div key={idx} className="flex items-start gap-2 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#43A85F] shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F6FAF5] border border-[#D6E4D7] text-[13px] text-[#52635A] font-medium text-center space-y-1">
                  <Search className="w-6 h-6 text-[#43A85F] mx-auto" />
                  <p className="font-bold text-[#174A2A]">{rootCause.message}</p>
                  <p className="text-[11px] text-[#52635A]">Collect more site reports to enable cross-signal analysis.</p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#8A5A00] bg-[#FFF4D6] p-2.5 rounded-lg border border-[#FFE082] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E8A52B] shrink-0" />
              <span>{rootCause.disclaimer}</span>
            </div>
          </div>
        </div>

        {/* ── CARD 3: AUTHORITY NEXT BEST ACTION ── */}
        <div className="bg-[#EEF6EE] p-5 rounded-xl border border-[#D6E4D7] border-l-4 border-l-[#43A85F] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D6E4D7] pb-3">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#1F5E35]" />
              <span className="text-[14px] font-extrabold text-[#174A2A] uppercase tracking-wide">
                NEXT BEST ACTION
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#2F7D46] text-white text-[10px] font-extrabold uppercase">
                {nextAction.priorityTag}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#FFFFFF] text-[#1F5E35] border border-[#D6E4D7] text-[10px] font-bold uppercase">
                Recommended Department: <strong className="text-[#174A2A]">{nextAction.recommendedDepartment}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nextAction.steps.map((stepText, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D6E4D7] space-y-1.5 flex flex-col justify-between civic-card-hover">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2F7D46] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#1F5E35] uppercase tracking-widest">
                    Step {idx + 1}
                  </span>
                </div>
                <p className="text-[12px] text-[#17312A] font-medium leading-snug">
                  {stepText}
                </p>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-[#52635A] font-medium italic">
            * {nextAction.disclaimer}
          </div>
        </div>

        {/* ── CARD 4: INCIDENT EVOLUTION TIMELINE ── */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D6E4D7] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEF6EE] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2F7D46]" />
              <span className="text-[14px] font-extrabold text-[#174A2A] uppercase tracking-wide">
                Incident Evolution Timeline
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#52635A]">
              Real Stored Timestamps
            </span>
          </div>

          <div className="space-y-3">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-[13px]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                  item.status === 'completed'
                    ? 'bg-[#EEF6EE] text-[#1F5E35] border border-[#43A85F]'
                    : item.status === 'active'
                    ? 'bg-[#FFF3E0] text-[#E65100] border border-[#FFCC80]'
                    : 'bg-[#F6FAF5] text-[#52635A] border border-[#D6E4D7]'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0 border-b border-[#EEF6EE] pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[#174A2A] text-[13px] uppercase tracking-wide">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-semibold text-[#52635A] shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#52635A] font-medium mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
