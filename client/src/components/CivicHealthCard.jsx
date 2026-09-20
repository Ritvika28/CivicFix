import React from 'react';
import {
  Activity,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  ShieldCheck,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { calculateCivicHealth, calculateWhatChanged } from '../utils/intelligenceEngine';

export default function CivicHealthCard({ allIssues = [] }) {
  const health = calculateCivicHealth(allIssues);
  const whatChanged = calculateWhatChanged(allIssues, 7);

  if (!health.hasData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#DEE4DA] shadow-sm text-center space-y-2">
        <Activity className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-[15px] font-bold text-civic-dark">{health.message}</h3>
        <p className="text-[12px] text-slate-500 font-medium">Submit citizen reports to generate operational health analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCF8] rounded-2xl border border-[#DEE4DA] p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DEE4DA] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-civic-100 border border-civic-300 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-civic-800" />
          </div>
          <div>
            <h2 className="text-[18px] font-extrabold text-civic-dark tracking-tight">
              Operational Civic Health & Progress
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 block -mt-0.5">
              Real-time condition indicators derived from active records
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-civic-100 border border-civic-300 text-civic-900 text-[10px] font-extrabold uppercase tracking-wider self-start sm:self-auto">
          <Sparkles className="w-3 h-3 text-civic-700" /> Live Data Derived
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── CIVIC HEALTH SCORE & METRICS ── */}
        <div className="bg-white p-5 rounded-xl border border-[#DEE4DA] shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                Overall Civic Condition Index
              </span>
              <span className="text-[11px] font-bold text-slate-500 block mt-0.5">
                Operational index (Not an official government metric)
              </span>
            </div>
            <div className="text-right">
              <div className="text-[34px] font-extrabold text-civic-dark leading-none">
                {health.score}
                <span className="text-[14px] text-slate-400 font-bold"> / 100</span>
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-civic-500 to-sky-600 transition-all duration-500 rounded-full"
              style={{ width: `${health.score}%` }}
            />
          </div>

          {/* Core Indicator Stats */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-civic-50 border border-civic-200 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Resolution Rate</span>
              <span className="text-[16px] font-extrabold text-civic-900">{health.resolutionRatePct}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Citizen Verified</span>
              <span className="text-[16px] font-extrabold text-sky-900">{health.verificationRatePct}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Open Incidents</span>
              <span className="text-[16px] font-extrabold text-amber-900">{health.openCount}</span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Category Domain Health:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {health.categoryHealth.map(cat => (
                <div key={cat.category} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">{cat.category}</span>
                  <span className="font-extrabold text-civic-800">{cat.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WHAT CHANGED? 7-DAY COMPARATIVE ANALYTICS ── */}
        <div className="bg-white p-5 rounded-xl border border-[#DEE4DA] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-civic-700" />
                <span className="text-[14px] font-extrabold text-civic-dark uppercase tracking-wide">
                  What Changed? ({whatChanged.timeWindowLabel})
                </span>
              </div>
              {whatChanged.hasData && (
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-800" />
                  {whatChanged.reductionPct}% Resolution
                </span>
              )}
            </div>

            {whatChanged.hasData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                      BEFORE (Start of Period)
                    </span>
                    <div className="text-[13px] font-bold text-slate-700 space-y-0.5">
                      <p>• {whatChanged.before.openIncidents} total reports logged</p>
                      <p>• {whatChanged.before.highSeverity} high-priority issues</p>
                      <p>• {whatChanged.before.hotspots} active hotspot area(s)</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-civic-50 border border-civic-200 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-civic-800 block">
                      NOW (Current Status)
                    </span>
                    <div className="text-[13px] font-bold text-civic-dark space-y-0.5">
                      <p>• {whatChanged.now.openIncidents} pending open issues</p>
                      <p>• {whatChanged.now.highSeverity} high-priority open</p>
                      <p>• {whatChanged.now.hotspots} active hotspot(s)</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[12px] font-bold text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{whatChanged.resolvedCount} Incidents Resolved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{whatChanged.verifiedCount} Citizen Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-600 font-medium text-center">
                {whatChanged.message}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
            Calculated strictly from real stored incident logs • No fabricated metrics
          </div>
        </div>
      </div>
    </div>
  );
}
