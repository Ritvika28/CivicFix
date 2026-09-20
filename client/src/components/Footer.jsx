import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#D6E4D7] bg-[#FFFFFF] py-12 mt-16 text-[#52635A] text-xs">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#EEF6EE] border border-[#D6E4D7]">
              <Leaf className="w-4 h-4 text-[#2F7D46]" />
            </div>
            <span className="font-bold text-base text-[#174A2A]">CivicFix</span>
            <span className="text-[#52635A] text-sm hidden sm:inline ml-2 border-l border-[#D6E4D7] pl-4">Cleaner Cities. Stronger Communities.</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-[#52635A]">
            <a href="#" className="hover:text-[#2F7D46] transition-colors">About</a>
            <a href="#" className="hover:text-[#2F7D46] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#2F7D46] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#2F7D46] transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#EEF6EE] gap-4">
          <p className="font-medium text-[#52635A]">&copy; {new Date().getFullYear()} CivicFix Municipal Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6FAF5] border border-[#D6E4D7] text-[11px] text-[#1F5E35] font-mono font-bold">
              ⚡ AWS Serverless Architecture
            </span>
            <span className="text-[#52635A] font-mono text-[11px]">Region: ap-south-1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
