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
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D6E4D7] shadow-civic text-center space-y-2">
        <Activity className="w-8 h-8 text-[#43A85F] mx-auto" />
        <h3 className="text-[15px] font-bold text-[#174A2A]">{health.message}</h3>
        <p className="text-[12px] text-[#52635A] font-medium">Submit citizen reports to generate operational health analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#D6E4D7] overflow-hidden space-y-0 shadow-civic">
      {/* Header — Deep Forest Dark Green */}
      <div className="bg-[#174A2A] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F5E35] border border-[#2F7D46] flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-[#8BCF45]" />
          </div>
          <div>
            <h2 className="text-[18px] font-extrabold text-white tracking-tight">
              OPERATIONAL CIVIC HEALTH & PROGRESS
            </h2>
            <span className="text-[11px] font-medium text-[#DDEBDD] block -mt-0.5">
              Real-time condition indicators derived from active records
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F5E35] border border-[#2F7D46] text-[#8BCF45] text-[10px] font-extrabold uppercase tracking-wider self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#8BCF45]" /> Live Data Derived
        </span>
      </div>

      <div className="p-6 sm:p-7 space-y-6 bg-[#F6FAF5]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── CIVIC HEALTH SCORE & METRICS ── */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D6E4D7] shadow-sm space-y-4 civic-card-hover">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#174A2A] block">
                  Overall Civic Condition Index
                </span>
                <span className="text-[11px] font-bold text-[#52635A] block mt-0.5">
                  Operational index (Not an official government metric)
                </span>
              </div>
              <div className="text-right">
                <div className="text-[34px] font-extrabold text-[#174A2A] leading-none">
                  {health.score}
                  <span className="text-[14px] text-[#52635A] font-bold"> / 100</span>
                </div>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-3 bg-[#EEF6EE] rounded-full overflow-hidden border border-[#D6E4D7]">
              <div
                className="h-full bg-gradient-to-r from-[#2F7D46] via-[#43A85F] to-[#8BCF45] transition-all duration-500 rounded-full"
                style={{ width: `${health.score}%` }}
              />
            </div>

            {/* Core Indicator Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-[#EEF6EE] border border-[#D6E4D7] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52635A] block">Resolution Rate</span>
                <span className="text-[16px] font-extrabold text-[#174A2A]">{health.resolutionRatePct}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0369A1] block">Citizen Verified</span>
                <span className="text-[16px] font-extrabold text-[#0369A1]">{health.verificationRatePct}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FFF4D6] border border-[#FFE082] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A5A00] block">Open Incidents</span>
                <span className="text-[16px] font-extrabold text-[#8A5A00]">{health.openCount}</span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-2 pt-2 border-t border-[#EEF6EE]">
              <span className="text-[11px] font-extrabold text-[#174A2A] uppercase tracking-wider block">
                Category Domain Health:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {health.categoryHealth.map(cat => (
                  <div key={cat.category} className="p-2 rounded-lg bg-[#F6FAF5] border border-[#D6E4D7] flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#17312A]">{cat.category}</span>
                    <span className="font-extrabold text-[#1F5E35]">{cat.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── WHAT CHANGED? 7-DAY COMPARATIVE ANALYTICS ── */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#D6E4D7] shadow-sm space-y-4 flex flex-col justify-between civic-card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EEF6EE] pb-2.5">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-[#2F7D46]" />
                  <span className="text-[14px] font-extrabold text-[#174A2A] uppercase tracking-wide">
                    What Changed? ({whatChanged.timeWindowLabel})
                  </span>
                </div>
                {whatChanged.hasData && (
                  <span className="px-2.5 py-0.5 rounded bg-[#EEF6EE] text-[#1F5E35] border border-[#43A85F] text-[10px] font-extrabold uppercase flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-[#2F7D46]" />
                    {whatChanged.reductionPct}% Resolution
                  </span>
                )}
              </div>

              {whatChanged.hasData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F6FAF5] border border-[#D6E4D7] space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#52635A] block">
                        BEFORE (Start of Period)
                      </span>
                      <div className="text-[13px] font-bold text-[#17312A] space-y-0.5">
                        <p>• {whatChanged.before.openIncidents} total reports logged</p>
                        <p>• {whatChanged.before.highSeverity} high-priority issues</p>
                        <p>• {whatChanged.before.hotspots} active hotspot area(s)</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#EEF6EE] border border-[#D6E4D7] space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1F5E35] block">
                        NOW (Current Status)
                      </span>
                      <div className="text-[13px] font-bold text-[#174A2A] space-y-0.5">
                        <p>• {whatChanged.now.openIncidents} pending open issues</p>
                        <p>• {whatChanged.now.highSeverity} high-priority open</p>
                        <p>• {whatChanged.now.hotspots} active hotspot(s)</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#EEF6EE] border border-[#D6E4D7] text-[12px] font-bold text-[#1F5E35] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2F7D46] shrink-0" />
                      <span>{whatChanged.resolvedCount} Incidents Resolved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2F7D46] shrink-0" />
                      <span>{whatChanged.verifiedCount} Citizen Verified</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F6FAF5] border border-[#D6E4D7] text-[13px] text-[#52635A] font-medium text-center">
                  {whatChanged.message}
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#52635A] font-mono pt-2 border-t border-[#EEF6EE]">
              Calculated strictly from real stored incident logs • No fabricated metrics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
