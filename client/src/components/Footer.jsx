import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">CivicFix</span>
          <span className="text-slate-500">— "From citizen report to resolved incident."</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-mono">
            ⚡ AWS Serverless Architecture
          </span>
          <span className="text-slate-500">Region: ap-south-1</span>
        </div>
      </div>
    </footer>
  );
}
