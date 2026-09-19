import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 mt-16 text-slate-500 text-xs">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-civic-600" />
            <span className="font-bold text-base text-civic-900">CivicFix</span>
            <span className="text-slate-500 text-sm hidden sm:inline ml-2 border-l border-slate-300 pl-4">Cleaner Cities. Stronger Communities.</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-civic-600 transition-colors">About</a>
            <a href="#" className="hover:text-civic-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-civic-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-civic-600 transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
          <p>&copy; {new Date().getFullYear()} CivicFix Municipal Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-civic-600 font-mono font-medium">
              ⚡ AWS Serverless Architecture
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Region: ap-south-1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
