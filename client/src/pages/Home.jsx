import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, UserCheck, Shield, Sparkles, ArrowRight, Layers, CheckCircle2, Zap, MapPin, BarChart3, AlertOctagon } from 'lucide-react';
import { ISSUE_CATEGORIES } from '../data/demoData';

export default function Home() {
  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            IIIT Lucknow Smart Campus Pilot — Hackathon Edition
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            From citizen report to <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">resolved incident.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            CivicFix is a serverless civic intelligence platform. It structures unstructured complaint reports, measures spatial & text similarity to detect duplicates, groups multiple citizen reports into 1 physical work order incident, and tracks verified resolution.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" />
              Report an Issue
            </Link>

            <Link
              to="/citizen"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <UserCheck className="w-5 h-5 text-cyan-400" />
              View My Reports
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 font-semibold text-sm transition-all"
            >
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Authority Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* HERO FEATURE: REPORT != INCIDENT */}
      <section className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" /> Core Product Innovation
          </span>
          <h2 className="text-3xl font-extrabold text-white">Understanding <span className="text-cyan-400">REPORT ≠ INCIDENT</span></h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Municipal authorities are overwhelmed by repetitive complaints. When a streetlight breaks near Gate 2, dozens of citizens submit reports. CivicFix clusters redundant citizen submissions into 1 canonical Physical Incident Work Order while preserving every citizen's individual ticket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Box 1 */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">Step 1 — Fragmented Inputs</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">3 Citizen Reports</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono">
                <span className="text-cyan-400 font-bold block text-[11px]">Report #CF-1001</span>
                "Streetlight near Gate 2 is broken and dark"
              </div>
              <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono">
                <span className="text-cyan-400 font-bold block text-[11px]">Report #CF-1002</span>
                "Lamp near Gate 2 is not working at night"
              </div>
              <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono">
                <span className="text-cyan-400 font-bold block text-[11px]">Report #CF-1003</span>
                "Gate 2 entrance dark due to broken light"
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              Without CivicFix, authorities waste time assigning 3 separate field crews for 1 broken light fixture.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/40 flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-[10px] text-cyan-300 font-mono font-bold">Spatial AI Engine</div>
            <div className="space-y-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-white text-base">Duplicate Clustering Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates spatial distance ($\le 100\text{m}$) using Haversine formula and text similarity ($\ge 0.70$) using Jaccard coefficient.
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs font-mono text-cyan-300">
              Spatial Proximity: 15m ≤ 100m<br/>
              Text Match Score: 0.79 ≥ 0.70<br/>
              <span className="text-emerald-400 font-bold">Match Confidence: HIGH</span>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-emerald-500/40 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Step 3 — 1 Unified Dispatch</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">1 Work Order</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold text-sm">INCIDENT #INC-1001</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">3 Reports Linked</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100">Gate 2 Streetlight Outage</h4>
              <p className="text-[11px] text-slate-400">Assigned: Electrical Response Team Alpha</p>
              <p className="text-[11px] text-emerald-300 font-mono">Status: IN_PROGRESS (Propagated to all 3 tickets)</p>
            </div>
            <p className="text-xs text-emerald-400 font-semibold leading-snug">
              Result: 3 Citizens informed, 1 Field Team dispatched, 0 duplication of effort!
            </p>
          </div>
        </div>
      </section>

      {/* RESOLUTION FLOW STEPS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">End-to-End Resolution Workflow</h2>
          <p className="text-xs text-slate-400">Six simple steps connecting citizen report to verified resolution.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { step: '1', title: 'REPORT', desc: 'Citizen submits photo & GPS location' },
            { step: '2', title: 'AI STRUCTURE', desc: 'Auto categorizes issue & severity' },
            { step: '3', title: 'CLUSTER', desc: 'Groups reports into 1 Incident' },
            { step: '4', title: 'DISPATCH', desc: 'Authority assigns department crew' },
            { step: '5', title: 'RESOLVE', desc: 'Authority uploads After photo proof' },
            { step: '6', title: 'VERIFY', desc: 'Citizen confirms fix in dashboard' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold mx-auto">
                {item.step}
              </span>
              <h3 className="text-xs font-bold text-slate-100 tracking-wider font-mono">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ISSUE CATEGORIES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Supported Municipal Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(ISSUE_CATEGORIES).map(([key, cat]) => (
            <div key={key} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 hover:border-slate-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold shrink-0">
                {key.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-200">{cat.label}</h3>
                <span className="text-[10px] text-cyan-400/90 font-mono">{cat.department}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
