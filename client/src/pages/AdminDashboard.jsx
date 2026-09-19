import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, CheckCircle2, Clock, MapPin, Layers, Sparkles, Filter, RefreshCw, BarChart2, Building2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { mockApi } from '../services/mockApi';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState('ALL');

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
    <div className="bg-civic-cream min-h-screen py-6 pb-16">
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-5 lg:px-8 space-y-6" style={{ boxSizing: 'border-box' }}>
        
        {/* Header & Reset Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[19px] lg:text-[22px] font-bold text-civic-dark tracking-tight flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 lg:w-6 lg:h-6 text-civic-primary" />
                Authority Admin Operations
              </h1>
              <span className="px-3 py-1 rounded bg-slate-100 text-slate-700 text-[10px] uppercase font-bold tracking-widest border border-slate-200 hidden sm:inline-block">
                Campus Command Center
              </span>
            </div>
            <p className="text-[14px] text-slate-500 font-medium mt-1">
              Dispatch response teams, resolve incidents, and analyze campus hotspots (3 citizen reports → 1 physical work order).
            </p>
          </div>

          <button
            onClick={resetData}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-sm uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4 text-civic-primary" /> Reset Seed Data
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Citizen Reports</span>
            <span className="text-[28px] leading-none font-bold text-civic-dark">{totalReports}</span>
          </div>
          <div className="bg-civic-primary/5 p-5 rounded-2xl border border-civic-primary/20 space-y-2 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] text-civic-primary uppercase font-bold tracking-widest">Physical Incidents</span>
            <span className="text-[28px] leading-none font-bold text-civic-primary">{totalIncidents}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Open Issues</span>
            <span className="text-[28px] leading-none font-bold text-slate-600">{openCount}</span>
          </div>
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 space-y-2 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] text-red-600/70 uppercase font-bold tracking-widest">High / Critical</span>
            <span className="text-[28px] leading-none font-bold text-red-600">{criticalCount}</span>
          </div>
          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 space-y-2 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] text-orange-600/70 uppercase font-bold tracking-widest">In Progress</span>
            <span className="text-[28px] leading-none font-bold text-orange-600">{inProgressCount}</span>
          </div>
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100 space-y-2 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] text-green-700/70 uppercase font-bold tracking-widest">Resolved</span>
            <span className="text-[28px] leading-none font-bold text-green-700">{resolvedCount}</span>
          </div>
        </div>

        {/* MAP & HOTSPOT SECTION */}
        <div id="map" className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-5">
          <div className="min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-civic-dark flex items-center gap-2">
                <MapPin className="w-5 h-5 text-civic-primary" /> Real-Time GIS Incident Map
              </h2>
              <span className="text-[11px] text-slate-500 font-bold tracking-widest uppercase">OpenStreetMap Tile Layer</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <MapView issues={issues} height="400px" adminMode={true} />
            </div>
          </div>

          {/* Hotspot & Campus Analytics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[15px] font-bold text-civic-dark flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-civic-primary" /> Campus Hotspot Analytics
              </h3>
              <span className="text-[9px] px-2 py-1 rounded bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border border-slate-200">
                Live Clusters
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {[
                { location: 'Gate 2 Entrance', reports: 3, incidents: 1, hazard: 'Streetlight outage cluster (INC-1001)', incidentId: 'INC-1001', severity: 'MEDIUM' },
                { location: 'Boys Hostel 2', reports: 1, incidents: 1, hazard: 'Exposed live wire (INC-1002)', incidentId: 'INC-1002', severity: 'CRITICAL' },
                { location: 'Academic Block A', reports: 1, incidents: 1, hazard: 'Overflowing sanitation bin (INC-1003)', incidentId: 'INC-1003', severity: 'MEDIUM' },
                { location: 'Main Boulevard', reports: 1, incidents: 1, hazard: 'Deep road pothole (INC-1004)', incidentId: 'INC-1004', severity: 'HIGH' }
              ].map((spot, idx) => (
                <Link
                  key={idx}
                  to={`/admin/issues/${spot.incidentId}`}
                  className="block bg-slate-50/80 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-civic-primary/50 hover:shadow-md transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[13px] group-hover:text-civic-primary flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 group-hover:text-civic-primary/70" /> {spot.location}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-civic-primary bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{spot.reports} rep → {spot.incidents} inc</span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-600 flex items-center justify-between pl-5.5">
                    <span className="truncate mr-2">{spot.hazard}</span>
                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded shadow-sm border ${spot.severity === 'CRITICAL' ? 'text-red-700 bg-red-50 border-red-200 font-bold' : spot.severity === 'HIGH' ? 'text-orange-700 bg-orange-50 border-orange-200 font-bold' : 'text-slate-600 bg-white border-slate-200 font-bold'}`}>
                      {spot.severity}
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* INCIDENT MANAGEMENT TABLE */}
        <div id="work-orders" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-[20px] font-bold text-civic-dark flex items-center gap-2">
                <Layers className="w-5 h-5 text-civic-primary" />
                Physical Incident Work Orders
              </h2>
              <p className="text-[13px] font-medium text-slate-500 mt-1">
                Each Incident Work Order aggregates redundant citizen complaints into 1 unified field dispatch.
              </p>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-3 shrink-0">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-bold focus:outline-none focus:border-civic-primary focus:ring-1 focus:ring-civic-primary shadow-sm"
              >
                <option value="ALL">All Departments</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="SANITATION">SANITATION</option>
                <option value="PUBLIC_WORKS">PUBLIC_WORKS</option>
                <option value="WATER_SERVICES">WATER_SERVICES</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm w-full">
            <table className="w-full text-left text-sm text-slate-700 min-w-[900px]" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 tracking-widest">
                <tr>
                  <th className="p-4 w-[16%]">Incident ID</th>
                  <th className="p-4 w-[14%]">Report Cluster</th>
                  <th className="p-4 w-[14%]">Category</th>
                  <th className="p-4 w-[20%]">Location</th>
                  <th className="p-4 w-[12%]">Severity</th>
                  <th className="p-4 w-[12%]">Status</th>
                  <th className="p-4 w-[12%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] font-medium">
                {Object.entries(incidentMap)
                  .map(([incId, repList]) => {
                    const canonical = repList.find(r => !r.duplicateOf) || repList[0];
                    const highestSev = repList.some(r => r.severity === 'CRITICAL')
                      ? 'CRITICAL'
                      : repList.some(r => r.severity === 'HIGH')
                      ? 'HIGH'
                      : repList.some(r => r.severity === 'MEDIUM')
                      ? 'MEDIUM'
                      : 'LOW';
                    return { incId, repList, canonical, highestSev };
                  })
                  .filter(({ canonical }) => filterDepartment === 'ALL' || canonical.department === filterDepartment)
                  .map(({ incId, repList, canonical, highestSev }) => (
                    <tr key={incId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-civic-dark">
                        {incId}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-civic-50 border border-civic-100 text-civic-primary text-[10px] font-bold uppercase tracking-wider">
                          {repList.length} {repList.length === 1 ? 'Report' : 'Reports'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-700 truncate">{canonical.category}</td>
                      <td className="p-4 flex items-center gap-1.5 overflow-hidden"><MapPin className="w-4 h-4 text-slate-400 shrink-0"/> <span className="truncate">{canonical.locationLabel}</span></td>
                      <td className="p-4"><SeverityBadge severity={highestSev} /></td>
                      <td className="p-4"><StatusBadge status={canonical.status} /></td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/admin/issues/${incId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-civic-primary hover:bg-civic-secondary text-white font-bold text-xs transition-colors shadow-sm whitespace-nowrap"
                        >
                          Manage Incident <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
