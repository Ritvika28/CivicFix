import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, CheckCircle2, Clock, MapPin, Layers, Sparkles, Filter, RefreshCw, BarChart2, Building2, AlertTriangle, ArrowRight, Zap, Target } from 'lucide-react';
import { api } from '../services/api';
import { mockApi } from '../services/mockApi';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import CivicHealthCard from '../components/CivicHealthCard';
import { detectHotspots, calculateImpactScore, getAiRecommendedAction } from '../utils/intelligenceEngine';
import { AnimatedNumber } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  const headerRef = useScrollReveal();
  const metricsRef = useScrollReveal();
  const mapSectionRef = useScrollReveal();
  const workOrdersRef = useScrollReveal();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const data = await api.getIssues();
    setIssues(data);
    setLoading(false);
  };

  const resetData = () => {
    mockApi.resetDemoData();
    loadAdminData();
  };

  // Group issues into unique physical incidents
  const incidentMap = {};
  issues.forEach(issue => {
    if (!incidentMap[issue.incidentId]) {
      incidentMap[issue.incidentId] = [];
    }
    incidentMap[issue.incidentId].push(issue);
  });

  const totalIncidents = Object.keys(incidentMap).length;
  const totalReports = issues.length;
  const openCount = issues.filter(i => i.status === 'REPORTED' || i.status === 'VERIFIED').length;
  const criticalCount = issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
  const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;

  const filteredIssues = issues.filter(i => {
    if (filterDepartment !== 'ALL') return i.department === filterDepartment;
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start bg-[#F6FAF5] py-8 pb-16 px-4 sm:px-5 lg:px-8" style={{ boxSizing: 'border-box' }}>
      <div className="w-full max-w-[1380px] space-y-6">
        
        {/* Header & Reset Button */}
        <div ref={headerRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-2xl shadow-civic border border-[#D6E4D7] civic-reveal">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[19px] lg:text-[22px] font-extrabold text-[#174A2A] tracking-tight flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 lg:w-6 lg:h-6 text-[#2F7D46]" />
                Authority Admin Operations
              </h1>
              <span className="px-3 py-1 rounded bg-[#EEF6EE] text-[#1F5E35] text-[10px] uppercase font-bold tracking-widest border border-[#D6E4D7] hidden sm:inline-block">
                Campus Command Center
              </span>
            </div>
            <p className="text-[14px] text-[#52635A] font-medium mt-1">
              Dispatch response teams, resolve incidents, and analyze campus hotspots (3 citizen reports → 1 physical work order).
            </p>
          </div>

          <button
            onClick={resetData}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#EEF6EE] text-[#1F5E35] text-xs font-bold border border-[#D6E4D7] transition-all shadow-sm uppercase tracking-wider hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4 text-[#2F7D46]" /> Reset Seed Data
          </button>
        </div>

        {/* Metrics Row with Count-Up Animations */}
        <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 civic-reveal">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#D6E4D7] space-y-1.5 shadow-civic flex flex-col items-center text-center civic-card-hover civic-stagger-1">
            <span className="text-[10px] text-[#52635A] uppercase font-bold tracking-widest">Citizen Reports</span>
            <span className="text-[28px] leading-none font-extrabold text-[#174A2A]"><AnimatedNumber value={totalReports} /></span>
          </div>
          <div className="bg-[#EEF6EE] p-5 rounded-2xl border border-[#43A85F] space-y-1.5 shadow-civic flex flex-col items-center text-center civic-card-hover civic-stagger-2">
            <span className="text-[10px] text-[#1F5E35] uppercase font-bold tracking-widest">Physical Incidents</span>
            <span className="text-[28px] leading-none font-extrabold text-[#174A2A]"><AnimatedNumber value={totalIncidents} /></span>
          </div>
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#D6E4D7] space-y-1.5 shadow-civic flex flex-col items-center text-center civic-card-hover civic-stagger-3">
            <span className="text-[10px] text-[#52635A] uppercase font-bold tracking-widest">Open Issues</span>
            <span className="text-[28px] leading-none font-extrabold text-[#17312A]"><AnimatedNumber value={openCount} /></span>
          </div>
          <div className="bg-[#FDECEC] p-5 rounded-2xl border border-[#F5C6CB] space-y-1.5 shadow-civic flex flex-col items-center text-center civic-card-hover civic-stagger-4">
            <span className="text-[10px] text-[#A83232] uppercase font-bold tracking-widest">High / Critical</span>
            <span className="text-[28px] leading-none font-extrabold text-[#D9534F]"><AnimatedNumber value={criticalCount} /></span>
          </div>
          <div className="bg-[#FFF3E0] p-5 rounded-2xl border border-[#FFCC80] space-y-1.5 shadow-civic flex flex-col items-center text-center civic-card-hover civic-stagger-5">
            <span className="text-[10px] text-[#E65100] uppercase font-bold tracking-widest">In Progress</span>
            <span className="text-[28px] leading-none font-extrabold text-[#E65100]"><AnimatedNumber value={inProgressCount} /></span>
          </div>
          <div className="bg-[#EEF6EE] p-5 rounded-2xl border border-[#43A85F] space-y-1.5 shadow-civic flex flex-col items-center text-center civic-card-hover civic-stagger-6">
            <span className="text-[10px] text-[#1F5E35] uppercase font-bold tracking-widest">Resolved</span>
            <span className="text-[28px] leading-none font-extrabold text-[#2F7D46]"><AnimatedNumber value={resolvedCount} /></span>
          </div>
        </div>

        {/* ── CIVIC HEALTH & WHAT CHANGED ANALYTICS ── */}
        <CivicHealthCard allIssues={issues} />

        {/* MAP & HOTSPOT SECTION */}
        <div id="map" className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-5">
          <div className="min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-extrabold text-[#174A2A] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2F7D46]" /> Real-Time GIS Incident Map
              </h2>
              <span className="text-[11px] text-[#52635A] font-bold tracking-widest uppercase">OpenStreetMap Tile Layer</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#D6E4D7] shadow-civic">
              <MapView issues={issues} height="400px" adminMode={true} />
            </div>
          </div>

          {/* Hotspot & Campus Analytics */}
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D6E4D7] shadow-civic flex flex-col space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF6EE] pb-3">
              <h3 className="text-[15px] font-extrabold text-[#174A2A] flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#2F7D46]" /> Campus Hotspot Analytics
              </h3>
              <span className="text-[9px] px-2 py-1 rounded bg-[#EEF6EE] text-[#1F5E35] font-extrabold uppercase tracking-wider border border-[#D6E4D7]">
                Live Clusters
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {detectHotspots(issues).length === 0 ? (
                <div className="p-8 text-center text-[#52635A] font-medium text-xs bg-[#F6FAF5] rounded-xl border border-[#D6E4D7]">
                  No emerging hotspots detected
                </div>
              ) : (
                detectHotspots(issues).map((spot) => (
                  <Link
                    key={spot.id}
                    to={`/admin/issues/${spot.incidentId}`}
                    className="block bg-[#F6FAF5] hover:bg-[#FFFFFF] p-4 rounded-xl border border-[#D6E4D7] hover:border-[#43A85F] hover:shadow-civic transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#17312A] text-[13px] group-hover:text-[#2F7D46] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#52635A] group-hover:text-[#2F7D46]" /> {spot.location}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#1F5E35] bg-[#EEF6EE] px-2 py-1 rounded border border-[#D6E4D7] shadow-sm">{spot.reportCount} rep → {spot.incidentCount} inc</span>
                    </div>
                    <p className="text-[12px] font-medium text-[#52635A] flex items-center justify-between pl-5.5">
                      <span className="truncate mr-2">{spot.hazardSummary}</span>
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded shadow-sm border ${spot.severity === 'CRITICAL' ? 'text-[#A83232] bg-[#FDECEC] border-[#F5C6CB] font-bold' : spot.severity === 'HIGH' ? 'text-[#E65100] bg-[#FFF3E0] border-[#FFCC80] font-bold' : 'text-[#17312A] bg-[#FFFFFF] border-[#D6E4D7] font-bold'}`}>
                        {spot.severity}
                      </span>
                    </p>
                    <div className="text-[10px] text-[#52635A] font-mono font-medium pl-5.5">
                      ⚡ {spot.activityText}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* INCIDENT MANAGEMENT TABLE */}
        <div id="work-orders" className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D6E4D7] shadow-civic space-y-6 w-full" style={{ boxSizing: 'border-box' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF6EE] pb-5">
            <div>
              <h2 className="text-[20px] font-extrabold text-[#174A2A] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2F7D46]" />
                Physical Incident Work Orders
              </h2>
              <p className="text-[13px] font-medium text-[#52635A] mt-1">
                Each Incident Work Order aggregates redundant citizen complaints into 1 unified field dispatch.
              </p>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-3 shrink-0">
              <Filter className="w-4 h-4 text-[#52635A]" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="bg-[#F6FAF5] border border-[#D6E4D7] rounded-xl px-4 py-2.5 text-sm text-[#17312A] font-bold focus:outline-none focus:border-[#43A85F] focus:ring-2 focus:ring-[#43A85F]/20 shadow-sm"
              >
                <option value="ALL">All Departments</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="SANITATION">SANITATION</option>
                <option value="PUBLIC_WORKS">PUBLIC_WORKS</option>
                <option value="WATER_SERVICES">WATER_SERVICES</option>
              </select>
            </div>
          </div>

          {/* Incident Data Preparation */}
          {(() => {
            const incidentItems = Object.entries(incidentMap)
              .map(([incId, repList]) => {
                const canonical = repList.find(r => !r.duplicateOf) || repList[0];
                const highestSev = repList.some(r => r.severity === 'CRITICAL')
                  ? 'CRITICAL'
                  : repList.some(r => r.severity === 'HIGH')
                  ? 'HIGH'
                  : repList.some(r => r.severity === 'MEDIUM')
                  ? 'MEDIUM'
                  : 'LOW';
                const impact = calculateImpactScore(repList, canonical);
                const aiAction = getAiRecommendedAction(repList, canonical);
                return { incId, repList, canonical, highestSev, impact, aiAction };
              })
              .filter(({ canonical }) => filterDepartment === 'ALL' || canonical.department === filterDepartment);

            if (incidentItems.length === 0) {
              return (
                <div className="p-8 text-center text-[#52635A] font-medium text-xs bg-[#F6FAF5] rounded-xl border border-[#D6E4D7]">
                  No incident work orders found matching selected department.
                </div>
              );
            }

            return (
              <>
                {/* Desktop View: Responsive 100% Width Table (No horizontal scrollbar) */}
                <div className="hidden lg:block rounded-xl border border-[#D6E4D7] shadow-sm w-full overflow-hidden">
                  <table className="w-full text-left text-sm text-[#17312A] table-fixed">
                    <thead className="bg-[#F6FAF5] text-[#52635A] uppercase text-[10px] font-extrabold border-b border-[#D6E4D7] tracking-widest">
                      <tr>
                        <th className="p-3.5 w-[14%]">Incident ID</th>
                        <th className="p-3.5 w-[12%]">Impact Score</th>
                        <th className="p-3.5 w-[12%]">Report Cluster</th>
                        <th className="p-3.5 w-[12%]">Category</th>
                        <th className="p-3.5 w-[18%]">Location</th>
                        <th className="p-3.5 w-[11%]">Severity</th>
                        <th className="p-3.5 w-[11%]">Status</th>
                        <th className="p-3.5 w-[10%] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF6EE] text-[13px] font-medium">
                      {incidentItems.map(({ incId, repList, canonical, highestSev, impact }) => (
                        <tr key={incId} className={`hover:bg-[#F6FAF5] transition-colors ${canonical.status === 'REOPENED' ? 'bg-[#FDECEC]/40' : ''}`}>
                          <td className="p-3.5 font-bold text-[#174A2A]">
                            <div className="truncate">{incId}</div>
                            {canonical.status === 'REOPENED' && (
                              <span className="inline-block text-[9px] font-bold text-[#A83232] bg-[#FDECEC] px-1.5 py-0.5 rounded border border-[#F5C6CB] mt-0.5">⚠️ Reopened</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F6FAF5] border border-[#D6E4D7] font-extrabold text-xs">
                              <Zap className={`w-3.5 h-3.5 ${impact.score >= 75 ? 'text-[#D9534F]' : impact.score >= 50 ? 'text-[#E8A52B]' : 'text-[#2F7D46]'}`} />
                              <span className={impact.score >= 75 ? 'text-[#A83232]' : impact.score >= 50 ? 'text-[#8A5A00]' : 'text-[#174A2A]'}>
                                {impact.score} <span className="text-[10px] text-[#52635A] font-medium">/ 100</span>
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-1 rounded bg-[#EEF6EE] border border-[#D6E4D7] text-[#1F5E35] text-[10px] font-bold uppercase tracking-wider inline-block truncate">
                              {repList.length} {repList.length === 1 ? 'Report' : 'Reports'}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-[#17312A] truncate">{canonical.category}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1 overflow-hidden">
                              <MapPin className="w-3.5 h-3.5 text-[#52635A] shrink-0" />
                              <span className="truncate text-xs">{canonical.locationLabel}</span>
                            </div>
                          </td>
                          <td className="p-3.5"><SeverityBadge severity={highestSev} /></td>
                          <td className="p-3.5"><StatusBadge status={canonical.status} /></td>
                          <td className="p-3.5 text-right">
                            <Link
                              to={`/admin/issues/${incId}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2F7D46] hover:bg-[#1F5E35] text-white font-extrabold text-xs transition-all shadow-sm hover:-translate-y-0.5"
                            >
                              Manage <ArrowRight className="w-3.5 h-3.5 text-white" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / Tablet View: Responsive Card Grid (Fits 100% inside container) */}
                <div className="block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {incidentItems.map(({ incId, repList, canonical, highestSev, impact }) => (
                    <div key={incId} className={`p-4 rounded-xl border border-[#D6E4D7] shadow-sm space-y-3 bg-[#FFFFFF] ${canonical.status === 'REOPENED' ? 'bg-[#FDECEC]/40 border-[#F5C6CB]' : ''}`}>
                      <div className="flex items-center justify-between gap-2 border-b border-[#EEF6EE] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#174A2A] text-sm">{incId}</span>
                          {canonical.status === 'REOPENED' && (
                            <span className="inline-block text-[9px] font-bold text-[#A83232] bg-[#FDECEC] px-1.5 py-0.5 rounded border border-[#F5C6CB]">⚠️ Reopened</span>
                          )}
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F6FAF5] border border-[#D6E4D7] font-extrabold text-[11px]">
                          <Zap className={`w-3 h-3 ${impact.score >= 75 ? 'text-[#D9534F]' : impact.score >= 50 ? 'text-[#E8A52B]' : 'text-[#2F7D46]'}`} />
                          <span className={impact.score >= 75 ? 'text-[#A83232]' : impact.score >= 50 ? 'text-[#8A5A00]' : 'text-[#174A2A]'}>
                            {impact.score}/100
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[9px] text-[#52635A] uppercase font-bold tracking-widest block">Cluster</span>
                          <span className="font-bold text-[#1F5E35]">{repList.length} {repList.length === 1 ? 'Report' : 'Reports'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#52635A] uppercase font-bold tracking-widest block">Category</span>
                          <span className="font-bold text-[#17312A]">{canonical.category}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] text-[#52635A] uppercase font-bold tracking-widest block mb-0.5">Location</span>
                        <span className="font-medium text-[#17312A] text-xs flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#52635A] shrink-0" /> {canonical.locationLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EEF6EE]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <SeverityBadge severity={highestSev} />
                          <StatusBadge status={canonical.status} />
                        </div>
                        <Link
                          to={`/admin/issues/${incId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2F7D46] hover:bg-[#1F5E35] text-white font-extrabold text-xs transition-all shadow-sm shrink-0"
                        >
                          Manage <ArrowRight className="w-3 h-3 text-white" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
