import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Map,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Factory,
  Search,
  BarChart3,
  TrendingUp,
  Grid3X3,
  Zap,
} from 'lucide-react';
import { ISSUE_CATEGORIES } from '../data/demoData';
import { AnimatedNumber } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HERO_IMAGE = '/images/hero_hq.jpg';

const CATEGORY_UI = {
  STREETLIGHT: {
    img: 'https://images.pexels.com/photos/7874499/pexels-photo-7874499.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'ST',
    color: 'bg-amber-700',
  },
  ELECTRICAL: {
    img: 'https://images.pexels.com/photos/34054464/pexels-photo-34054464.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'EL',
    color: 'bg-orange-700',
  },
  WASTE: {
    img: 'https://images.pexels.com/photos/13682408/pexels-photo-13682408.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'WA',
    color: 'bg-emerald-700',
  },
  ROAD: {
    img: 'https://images.pexels.com/photos/6018642/pexels-photo-6018642.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'RO',
    color: 'bg-red-700',
  },
  WATER: {
    img: 'https://images.pexels.com/photos/29274530/pexels-photo-29274530.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'WS',
    color: 'bg-sky-700',
  },
  DRAINAGE: {
    img: 'https://images.pexels.com/photos/32257223/pexels-photo-32257223.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'DR',
    color: 'bg-indigo-700',
  },
  OTHER: {
    img: 'https://images.pexels.com/photos/7486749/pexels-photo-7486749.jpeg?auto=compress&cs=tinysrgb&w=800',
    abv: 'OT',
    color: 'bg-slate-600',
  },
};

const WORKFLOW_STEPS = [
  { num: 1, title: 'REPORT', desc: 'Citizen submits issue with photo and location', icon: Map, iconColor: '#43A85F', bgColor: '#EEF6EE' },
  { num: 2, title: 'AI STRUCTURE', desc: 'AI categorizes and structures the report', icon: Search, iconColor: '#8B5CF6', bgColor: '#F1EAFF' },
  { num: 3, title: 'CLUSTER', desc: 'Similar issues are grouped together', icon: Layers, iconColor: '#3B82F6', bgColor: '#EBF5FC' },
  { num: 4, title: 'DISPATCH', desc: 'Assigned to the proper department', icon: Factory, iconColor: '#F59E0B', bgColor: '#FFF3D6' },
  { num: 5, title: 'RESOLVE', desc: 'Authorities fix the issue on the ground', icon: CheckCircle2, iconColor: '#22C55E', bgColor: '#E8F5E9' },
  { num: 6, title: 'VERIFY', desc: 'Citizen verifies completion', icon: ShieldCheck, iconColor: '#14B8A6', bgColor: '#E2F8F2' },
];

export default function Home() {
  const catSectionRef = useScrollReveal();
  const workflowSectionRef = useScrollReveal();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCategoryModalOpen(false);
    };
    if (isCategoryModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCategoryModalOpen]);

  return (
    <div className="bg-[#F6FAF5] min-h-screen pb-12" style={{ overflowX: 'hidden', width: '100%' }}>
      <style>{`
        .home-container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
          box-sizing: border-box;
        }
        @media (min-width: 640px) {
          .home-container { padding-left: 1.25rem; padding-right: 1.25rem; }
        }
        @media (min-width: 1024px) {
          .home-container { padding-left: 2rem; padding-right: 2rem; }
        }
        .category-card:hover .category-img {
          transform: scale(1.02);
        }
        .category-card:hover .category-arrow {
          transform: translateX(3px);
        }
        .category-card:hover .category-overlay {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.00) 0%,
            rgba(255, 255, 255, 0.02) 30%,
            rgba(23, 74, 42, 0.35) 60%,
            rgba(23, 74, 42, 0.90) 100%
          ) !important;
        }
        .workflow-card {
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease, border-color 300ms ease;
        }
        .workflow-card:hover {
          transform: translateY(-3px);
          border-color: #43A85F;
          box-shadow: 0 8px 24px rgba(23, 74, 42, 0.10);
        }
        @media (max-width: 1280px) {
          .hero-heading { font-size: clamp(2rem, 4vw, 3.25rem); }
        }
        .modal-category-item {
          transition:
            background-color 250ms ease,
            color 250ms ease,
            border-color 250ms ease,
            transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 250ms ease;
        }
        .modal-category-item:hover,
        .modal-category-item:focus-visible {
          background: #3F7D4A;
          color: #FFFFFF;
          border-color: #285D36;
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 20px rgba(63, 125, 74, 0.12);
          outline: none;
        }
        .modal-category-dot {
          color: #3F7D4A;
          opacity: 0;
          transition: opacity 250ms ease, color 250ms ease;
        }
        .modal-category-item:hover .modal-category-dot,
        .modal-category-item:focus-visible .modal-category-dot {
          opacity: 1;
          color: #FFFFFF;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative bg-[#FFFFFF] overflow-hidden border-b border-[#D6E4D7]">
        {/* Subtle decorative background glows */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#EEF6EE]/70 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-[#DDEBDD]/40 blur-3xl pointer-events-none" />

        {/* Desktop hero image — contained within overflow-hidden section */}
        <div className="hidden lg:block absolute top-0 right-0 w-[52%] h-full z-0" style={{ maxWidth: '820px' }}>
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.92) 10%, rgba(255,255,255,0.40) 25%, rgba(255,255,255,0) 42%)',
            }}
          />
        </div>

        <div className="home-container relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 py-10 lg:py-14" style={{ minHeight: 'min(calc(100vh - 5rem), 720px)' }}>
            {/* Left: text + CTAs + stats */}
            <div className="w-full lg:w-[46%] shrink-0 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF6EE] border border-[#D6E4D7] w-fit">
                <span className="w-2 h-2 rounded-full bg-[#43A85F] animate-pulse" />
                <span className="text-[11px] font-extrabold tracking-[0.15em] text-[#1F5E35] uppercase">
                  CITIZEN FIRST • SMARTER CITIES
                </span>
              </div>

              <h1 className="hero-heading font-extrabold tracking-tight text-[#174A2A] leading-[1.08]" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.375rem)' }}>
                From citizen report to{' '}
                <span className="text-[#2F7D46]">resolved incident.</span>
              </h1>

              <p className="text-[15px] sm:text-[16px] text-[#52635A] font-medium leading-relaxed max-w-[560px]">
                CivicFix connects citizens, municipal authorities and AI to ensure faster resolution of civic issues.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/report"
                  className="inline-flex items-center justify-center gap-2 h-[50px] px-7 rounded-[11px] bg-[#2F7D46] hover:bg-[#1F5E35] text-white font-extrabold text-[15px] transition-all hover:-translate-y-0.5 shadow-md shadow-[#2F7D46]/20"
                >
                  Report an Issue <ArrowRight className="w-4.5 h-4.5 text-white" />
                </Link>
                <Link
                  to="/citizen"
                  className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-[11px] bg-[#FFFFFF] hover:bg-[#EEF6EE] text-[#1F5E35] border border-[#D6E4D7] font-bold text-[15px] transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  Track Your Report
                </Link>
              </div>

              {/* Stats with Animated Count-Up */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-[500px]">
                {[
                  { rawVal: '10000', suffix: '+', label: 'Issues Reported', icon: BarChart3, accent: 'text-[#2F7D46]' },
                  { rawVal: '85', suffix: '%', label: 'Resolution Rate', icon: TrendingUp, accent: 'text-[#43A85F]' },
                  { rawVal: '25', suffix: '+', label: 'Municipal Categories', icon: Grid3X3, accent: 'text-[#2D8CCF]' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#FFFFFF] px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl border border-[#D6E4D7] shadow-civic civic-card-hover"
                  >
                    <stat.icon className={`w-4.5 h-4.5 ${stat.accent} mb-1.5`} />
                    <div className="text-[20px] sm:text-[22px] font-extrabold text-[#174A2A] leading-none">
                      <AnimatedNumber value={stat.rawVal} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#52635A] font-bold leading-tight mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right spacer on desktop (image is absolute); mobile/tablet inline image */}
            <div className="w-full lg:w-[54%] shrink-0 lg:invisible">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden lg:hidden border border-[#D6E4D7] shadow-civic">
                <img
                  src={HERO_IMAGE}
                  alt="Civic campus infrastructure"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (STAGGERED SCROLL REVEAL) ── */}
      <section ref={catSectionRef} className="bg-[#F6FAF5] py-12 lg:py-14 border-b border-[#D6E4D7] civic-reveal">
        <div className="home-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[26px] sm:text-[28px] font-extrabold text-[#174A2A] tracking-tight">
                Supported Municipal Categories
              </h2>
              <p className="text-[#52635A] text-[14px] sm:text-[15px] mt-1.5 font-medium max-w-xl">
                Report issues across various municipal services. Together we build better cities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-[13px] font-extrabold text-[#2F7D46] hover:text-[#1F5E35] flex items-center gap-1 uppercase tracking-wider transition-colors shrink-0"
            >
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(ISSUE_CATEGORIES).slice(0, 7).map(([key, cat], idx) => {
              const ui = CATEGORY_UI[key] || CATEGORY_UI.OTHER;
              return (
                <Link
                  to="/report"
                  key={key}
                  className={`block category-card relative aspect-[16/9] max-h-[185px] rounded-[16px] overflow-hidden group border border-[#D6E4D7] shadow-civic cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#43A85F] hover:shadow-civic-hover civic-stagger-${(idx % 6) + 1}`}
                >
                  <img
                    src={ui.img}
                    alt={cat.label}
                    className="category-img absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
                  />
                  <div
                    className="category-overlay absolute inset-0 transition-all duration-300"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.02) 35%, rgba(23,74,42,0.25) 65%, rgba(23,74,42,0.82) 100%)',
                    }}
                  />

                  <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                    <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm border border-[#D6E4D7] flex items-center justify-center text-[#174A2A] text-[10px] font-extrabold shadow-sm">
                      {ui.abv}
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 bg-[#EEF6EE]/95 backdrop-blur-sm text-[#1F5E35] border border-[#D6E4D7] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest rounded shadow-sm">
                          {cat.department.replace('_', ' ')}
                        </span>
                        <h3 className="text-[15px] sm:text-[16px] font-extrabold text-white leading-tight truncate drop-shadow-md">
                          {cat.label}
                        </h3>
                      </div>
                      <div className="category-arrow w-8 h-8 rounded-full bg-[#43A85F] border border-[#43A85F] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-[#8BCF45]">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW (PROGRESSIVE REVEAL) ── */}
      <section ref={workflowSectionRef} className="py-12 lg:py-14 bg-[#FFFFFF] civic-reveal">
        <div className="home-container">
          <div className="bg-[#EEF6EE] rounded-[24px] p-6 sm:p-8 lg:p-10 border border-[#D6E4D7] shadow-civic">
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h2 className="text-[26px] sm:text-[28px] font-extrabold text-[#174A2A] tracking-tight">
                End-to-End Resolution Workflow
              </h2>
              <p className="text-[#52635A] text-[14px] sm:text-[15px] mt-1.5 font-medium">
                From your report to a cleaner, safer city — powered by AI and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative min-w-0 flex flex-col items-center">
                    <div className={`workflow-card w-full bg-[#FFFFFF] p-5 rounded-[18px] border border-[#D6E4D7] shadow-sm flex flex-col items-center justify-center text-center min-h-[170px] h-full transition-all duration-300 hover:-translate-y-1 hover:border-[#43A85F] civic-stagger-${idx + 1}`}>
                      {/* Centered Step Circle & Icon */}
                      <div className="relative mb-3 flex items-center justify-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-black/5"
                          style={{ backgroundColor: step.bgColor }}
                        >
                          <Icon className="w-5 h-5" style={{ color: step.iconColor }} />
                        </div>
                        <span className="absolute -top-1 -right-1.5 w-5 h-5 rounded-full bg-[#174A2A] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-sm">
                          {step.num}
                        </span>
                      </div>

                      <h3 className="text-[13px] font-extrabold text-[#174A2A] tracking-wider uppercase mb-1.5 text-center">
                        {step.title}
                      </h3>
                      <p className="text-[12px] text-[#52635A] font-medium leading-relaxed text-center">
                        {step.desc}
                      </p>
                    </div>

                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <div
                        className="hidden xl:block absolute top-1/2 -right-2.5 w-5 h-[2px] bg-gradient-to-r from-[#DDEBDD] to-[#43A85F] z-10 transform -translate-y-1/2"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* ── CATEGORY MODAL ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#14231B]/40 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}>
          <div 
            className="bg-[#FFFFFF] w-full max-w-4xl rounded-[20px] shadow-2xl border border-[#DDE4DA] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#EEF4EA]">
              <h3 className="text-xl font-extrabold text-[#285D36]">More Municipal Categories</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EEF4EA] hover:bg-[#DDEEDB] text-[#14231B] transition-colors"
                aria-label="Close categories"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:px-8 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(ISSUE_CATEGORIES).slice(7).map(([key, cat]) => (
                  <Link
                    to="/report"
                    key={key}
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="modal-category-item block p-4 rounded-xl border border-[#DDE4DA] bg-[#FFFFFF] text-[#14231B] text-[14px] font-bold"
                  >
                    <span className="modal-category-dot mr-2">•</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
