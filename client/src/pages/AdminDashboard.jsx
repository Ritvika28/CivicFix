import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, CheckCircle2, Clock, MapPin, Layers, Sparkles, Filter, RefreshCw, BarChart2 } from 'lucide-react';
import { api } from '../services/api';
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

  // Metrics
  const totalCount = issues.length;
  const openCount = issues.filter(i => i.status === 'REPORTED' || i.status === 'VERIFIED').length;
  const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;

  const filteredIssues = issues.filter(i => {
    if (filterDepartment !== 'ALL') return i.department === filterDepartment;
    return true;
  });

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header & Reset Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-indigo-400" />
              Authority Admin Operations
            </h1>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30">
              Campus Command Center
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch teams, resolve incidents, and analyze campus hotspots (3 reports → 1 incident grouping).
          </p>
        </div>

        <button
          onClick={resetData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Reset Demo Seed Data
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Reports</span>
          <span className="text-2xl font-bold text-white">{totalCount}</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 uppercase font-mono block">Open Issues</span>
          <span className="text-2xl font-bold text-amber-400">{openCount}</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-1">
          <span className="text-[10px] text-rose-300 uppercase font-mono block font-bold">CRITICAL HAZARDS</span>
          <span className="text-2xl font-bold text-rose-400 animate-pulse">{criticalCount}</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-cyan-400 uppercase font-mono block">In Progress</span>
          <span className="text-2xl font-bold text-cyan-400">{inProgressCount}</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase font-mono block font-bold">Resolved</span>
          <span className="text-2xl font-bold text-emerald-400">{resolvedCount}</span>
        </div>
      </div>

      {/* MAP & HOTSPOT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> Real-Time Incident Map
            </h2>
            <span className="text-xs text-slate-500 font-mono">OpenStreetMap Tile Layer</span>
          </div>
          <MapView issues={issues} height="360px" />
        </div>

        {/* Hotspot & Campus Analytics */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Hotspot Analytics
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              Simulated pilot dataset
            </span>
          </div>

          <div className="space-y-3">
            {[
              { location: 'Gate 2 Area', count: 3, incidents: 1, hazard: 'Streetlight outage cluster' },
              { location: 'Academic Block', count: 1, incidents: 1, hazard: 'Sanitation overflowing' },
              { location: 'Hostel Area', count: 1, incidents: 1, hazard: 'CRITICAL electrical wire' }
            ].map((spot, idx) => (
              <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">📍 {spot.location}</span>
                  <span className="font-mono text-cyan-400 font-bold">{spot.count} reports → {spot.incidents} incident</span>
                </div>
                <p className="text-[11px] text-slate-400">{spot.hazard}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INCIDENT MANAGEMENT TABLE */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Actionable Incident Management</h2>
            <p className="text-xs text-slate-400">Click any incident to update department dispatch or upload resolution proof.</p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Departments</option>
              <option value="ELECTRICAL">ELECTRICAL</option>
              <option value="SANITATION">SANITATION</option>
              <option value="PUBLIC_WORKS">PUBLIC_WORKS</option>
              <option value="WATER_SERVICES">WATER_SERVICES</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Issue ID</th>
                <th className="p-3">Incident ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIssues.map(item => (
                <tr key={item.issueId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-cyan-400">{item.issueId}</td>
                  <td className="p-3 font-mono text-slate-400">{item.incidentId}</td>
                  <td className="p-3 font-semibold text-slate-200">{item.category}</td>
                  <td className="p-3">📍 {item.locationLabel}</td>
                  <td className="p-3"><SeverityBadge severity={item.severity} /></td>
                  <td className="p-3"><span className="font-mono text-cyan-300">{item.department}</span></td>
                  <td className="p-3"><StatusBadge status={item.status} /></td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/issues/${item.issueId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
                    >
                      Manage & Resolve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
