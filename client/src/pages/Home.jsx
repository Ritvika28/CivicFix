import React from 'react';
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
} from 'lucide-react';
import { ISSUE_CATEGORIES } from '../data/demoData';

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
  { num: 1, title: 'REPORT', desc: 'Citizen submits issue with photo and location', icon: Map, color: 'text-emerald-700 bg-emerald-50' },
  { num: 2, title: 'AI STRUCTURE', desc: 'AI categorizes and structures the report', icon: Search, color: 'text-teal-700 bg-teal-50' },
  { num: 3, title: 'CLUSTER', desc: 'Similar issues are grouped together', icon: Layers, color: 'text-violet-700 bg-violet-50' },
  { num: 4, title: 'DISPATCH', desc: 'Assigned to the proper department', icon: Factory, color: 'text-amber-700 bg-amber-50' },
  { num: 5, title: 'RESOLVE', desc: 'Authorities fix the issue on the ground', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
  { num: 6, title: 'VERIFY', desc: 'Citizen verifies completion', icon: ShieldCheck, color: 'text-sky-700 bg-sky-50' },
];

export default function Home() {
  return (
    <div className="bg-[#F7F6F1] min-h-screen pb-12" style={{ overflowX: 'hidden', width: '100%' }}>
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
          transform: scale(1.04);
        }
        .category-card:hover .category-arrow {
          transform: translateX(3px);
        }
        .workflow-card {
          transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease;
        }
        .workflow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(30, 45, 35, 0.08);
        }
        @media (max-width: 1280px) {
          .hero-heading { font-size: clamp(2rem, 4vw, 3.25rem); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative bg-[#FDFCF8] overflow-hidden">
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
                'linear-gradient(90deg, #FDFCF8 0%, rgba(253,252,248,0.88) 8%, rgba(253,252,248,0.35) 22%, rgba(253,252,248,0) 38%)',
            }}
          />
        </div>

        <div className="home-container relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 py-8 lg:py-10" style={{ minHeight: 'min(calc(100vh - 5rem), 720px)' }}>
            {/* Left: text + CTAs + stats */}
            <div className="w-full lg:w-[44%] shrink-0 flex flex-col justify-center space-y-6">
              <div className="text-[11px] font-bold tracking-[0.2em] text-civic-600 uppercase">
                CITIZEN FIRST • SMARTER CITIES
              </div>

              <h1 className="hero-heading font-extrabold tracking-tight text-civic-dark leading-[1.08]" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.375rem)' }}>
                From citizen report to{' '}
                <span className="text-civic-primary">resolved incident.</span>
              </h1>

              <p className="text-[15px] sm:text-[16px] text-slate-600 font-medium leading-relaxed max-w-[560px]">
                CivicFix connects citizens, municipal authorities and AI to ensure faster resolution of civic issues.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/report"
                  className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-[11px] bg-civic-200 hover:bg-civic-300 text-civic-950 border border-civic-400 font-extrabold text-[15px] transition-all hover:-translate-y-0.5 shadow-md shadow-civic-700/10"
                >
                  Report an Issue <ArrowRight className="w-4 h-4 text-civic-950" />
                </Link>
                <Link
                  to="/citizen"
                  className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-[11px] bg-white hover:bg-[#FDFCF8] text-civic-dark border border-[#DEE4DA] font-bold text-[15px] transition-all hover:-translate-y-0.5"
                >
                  Track Your Report
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-[480px]">
                {[
                  { value: '10K+', label: 'Issues Reported', icon: BarChart3, accent: 'text-civic-primary' },
                  { value: '85%', label: 'Resolution Rate', icon: TrendingUp, accent: 'text-emerald-600' },
                  { value: '25+', label: 'Municipal Categories', icon: Grid3X3, accent: 'text-sky-700' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white px-3 py-3 sm:px-4 sm:py-3.5 rounded-2xl border border-[#DEE4DA] shadow-[0_5px_20px_rgba(30,45,35,0.05)]"
                  >
                    <stat.icon className={`w-4 h-4 ${stat.accent} mb-1.5`} />
                    <div className="text-[20px] sm:text-[22px] font-extrabold text-civic-dark leading-none">{stat.value}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-tight mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right spacer on desktop (image is absolute); mobile/tablet inline image */}
            <div className="w-full lg:w-[56%] shrink-0 lg:invisible">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden lg:hidden">
                <img
                  src={HERO_IMAGE}
                  alt="Civic campus infrastructure"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(253,252,248,0.25) 0%, rgba(253,252,248,0) 18%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-white py-10 lg:py-12">
        <div className="home-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[26px] sm:text-[28px] font-bold text-civic-dark tracking-tight">
                Supported Municipal Categories
              </h2>
              <p className="text-slate-500 text-[14px] sm:text-[15px] mt-2 font-medium max-w-xl">
                Report issues across various municipal services. Together we build better cities.
              </p>
            </div>
            <button
              type="button"
              className="text-[13px] font-bold text-civic-primary hover:text-civic-secondary flex items-center gap-1 uppercase tracking-wider transition-colors shrink-0"
            >
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(ISSUE_CATEGORIES).map(([key, cat]) => {
              const ui = CATEGORY_UI[key] || CATEGORY_UI.OTHER;
              return (
                <div
                  key={key}
                  className="category-card relative aspect-[16/9] max-h-[180px] rounded-[16px] overflow-hidden group border border-[#DEE4DA] shadow-[0_5px_20px_rgba(30,45,35,0.06)] cursor-pointer transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(30,45,35,0.10)]"
                >
                  <img
                    src={ui.img}
                    alt={cat.label}
                    className="category-img absolute inset-0 w-full h-full object-cover transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF8]/95 via-[#FDFCF8]/65 to-transparent group-hover:from-[#FDFCF8] transition-colors duration-300" />

                  <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                    <div className="w-8 h-8 rounded-lg bg-white/95 border border-[#DEE4DA] flex items-center justify-center text-civic-dark text-[10px] font-extrabold shadow-sm">
                      {ui.abv}
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 bg-civic-100 text-civic-800 border border-civic-200 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded">
                          {cat.department.replace('_', ' ')}
                        </span>
                        <h3 className="text-[15px] sm:text-[16px] font-extrabold text-civic-dark leading-tight truncate">
                          {cat.label}
                        </h3>
                      </div>
                      <div className="category-arrow w-8 h-8 rounded-full bg-civic-200 border border-civic-300 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300">
                        <ArrowRight className="w-4 h-4 text-civic-950" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="py-10 lg:py-12">
        <div className="home-container">
          <div className="bg-[#EEF1EB] rounded-[20px] p-6 sm:p-8 lg:p-10 border border-[#DEE4DA] shadow-[0_5px_20px_rgba(30,45,35,0.05)]">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-[26px] sm:text-[28px] font-bold text-civic-dark tracking-tight">
                End-to-End Resolution Workflow
              </h2>
              <p className="text-slate-500 text-[14px] sm:text-[15px] mt-2 font-medium">
                From your report to a cleaner, safer city — powered by AI and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative min-w-0">
                    <div className="workflow-card bg-white p-4 rounded-[16px] border border-[#DEE4DA] shadow-[0_5px_20px_rgba(30,45,35,0.04)] flex flex-col gap-2.5 min-h-[130px] h-full">
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${step.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                          {step.num}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-civic-dark tracking-wide uppercase mb-0.5">
                          {step.title}
                        </h3>
                        <p className="text-[12px] text-slate-500 font-medium leading-snug line-clamp-3">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <div
                        className="hidden xl:block absolute top-1/2 -right-2 w-4 h-px bg-[#C5CDC3] z-0"
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
    </div>
  );
}
