import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, UserCheck, Shield, Sparkles, ArrowRight, Layers, CheckCircle2, Zap, MapPin } from 'lucide-react';
import { ISSUE_CATEGORIES } from '../data/demoData';

export default function Home() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Hackathon Edition — IIIT Lucknow Pilot
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            From citizen report to <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">resolved incident.</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed">
            CivicFix is a smart civic issue reporting platform. It structures raw reports, automatically detects duplicates, associates multiple complaints with a single physical incident, and guides municipal authorities through resolution.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
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
          </div>
        </div>
      </section>

      {/* CORE CONCEPT HIGHLIGHT: REPORT != INCIDENT */}
      <section className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">Core Product Innovation</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Understanding <span className="text-cyan-400">REPORT ≠ INCIDENT</span></h2>
          <p className="text-sm text-slate-400">
            One physical problem (e.g. a broken light near Gate 2) often triggers multiple citizen complaints. CivicFix clusters redundant reports into 1 underlying incident.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase">Step 1 — Fragmented Inputs</div>
            <div className="space-y-2">
              <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Citizen A: "Streetlight near Gate 2 is broken"
              </div>
              <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Citizen B: "Lamp near Gate 2 is not working"
              </div>
              <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono">
                Citizen C: "Gate 2 dark due to broken light"
              </div>
            </div>
            <p className="text-xs text-amber-400/90 font-medium pt-1">Result: 3 Independent Reports</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-cyan-500/30 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyan-500/20 text-[10px] text-cyan-300 font-mono">CivicFix Engine</div>
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-white text-sm">Duplicate Detection & Clustering</h3>
            <p className="text-xs text-slate-400">
              Haversine distance (within 100m) + Jaccard text similarity automatically link similar reports.
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/30 space-y-3">
            <div className="text-xs font-mono text-emerald-400 uppercase">Step 3 — Actionable Dispatch</div>
            <div className="bg-slate-950 p-4 rounded-lg border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">INCIDENT #INC-1001</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">1 Work Order</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200">Gate 2 Streetlight Failure</h4>
              <p className="text-[11px] text-slate-400">Assigned to: Electrical Response Team</p>
            </div>
            <p className="text-xs text-emerald-400 font-medium pt-1">Result: 3 Reports → 1 Incident Resolution</p>
          </div>
        </div>
      </section>

      {/* RESOLUTION FLOW STEPS */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white text-center">How CivicFix Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { step: '1', title: 'REPORT', desc: 'Citizen submits photo & location' },
            { step: '2', title: 'AI STRUCTURE', desc: 'Auto category & severity check' },
            { step: '3', title: 'INCIDENT', desc: 'Duplicate check & grouping' },
            { step: '4', title: 'ASSIGN', desc: 'Department dispatch' },
            { step: '5', title: 'RESOLVE', desc: 'Authority uploads after photo' },
            { step: '6', title: 'VERIFY', desc: 'Citizen confirms fix' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center space-y-1.5 relative">
              <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold mx-auto">
                {item.step}
              </span>
              <h3 className="text-xs font-bold text-slate-200 tracking-wider">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXAMPLE CATEGORIES */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white text-center">Supported Issue Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(ISSUE_CATEGORIES).map(([key, cat]) => (
            <div key={key} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                {key.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-200">{cat.label}</h3>
                <span className="text-[10px] text-slate-500 uppercase font-mono">{cat.department}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
