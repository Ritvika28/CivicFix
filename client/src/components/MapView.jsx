import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import { Layers } from 'lucide-react';
import { detectHotspots } from '../utils/intelligenceEngine';

// Create SVG custom map icons based on severity
function createCustomIcon(severity) {
  let color = '#22c55e'; // LOW (Green)
  if (severity === 'MEDIUM') color = '#f59e0b'; // Amber
  if (severity === 'HIGH') color = '#f97316'; // Orange
  if (severity === 'CRITICAL') color = '#ef4444'; // Red

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

export default function MapView({ issues = [], center = [26.7998, 81.0267], zoom = 16, height = "400px", adminMode = false }) {
  const hotspots = detectHotspots(issues);

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-[#D6E4D7] shadow-civic relative group">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hotspot Radial Circles */}
        {hotspots.map(spot => (
          <Circle
            key={spot.id}
            center={[spot.latitude, spot.longitude]}
            radius={spot.radiusMeters || 80}
            pathOptions={{
              color: spot.severity === 'CRITICAL' ? '#D9534F' : spot.severity === 'HIGH' ? '#E8A52B' : '#2F7D46',
              fillColor: spot.severity === 'CRITICAL' ? '#D9534F' : spot.severity === 'HIGH' ? '#E8A52B' : '#43A85F',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '4, 4'
            }}
          />
        ))}
        {issues.map(issue => {
          const reportCount = issues.filter(i => i.incidentId === issue.incidentId).length;
          return (
            <Marker
              key={issue.issueId}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(issue.severity)}
            >
              <Popup>
                <div className="p-1 min-w-[210px] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#2F7D46] font-bold">{issue.issueId}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#EEF6EE] text-[#1F5E35] font-mono flex items-center gap-1 border border-[#D6E4D7]">
                      <Layers className="w-3 h-3 text-[#2F7D46]" />
                      {reportCount} {reportCount === 1 ? 'report' : 'reports'} → 1 incident
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-[#17312A] line-clamp-2">{issue.description}</h4>
                  <p className="text-[11px] text-[#52635A]">📍 {issue.locationLabel || 'Campus Location'}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <Link
                    to={adminMode ? `/admin/issues/${issue.incidentId || issue.issueId}` : `/issues/${issue.issueId}`}
                    className={`block text-center w-full mt-2 py-1.5 px-2 rounded-lg text-xs font-bold transition-all shadow-sm border ${
                      adminMode
                        ? 'bg-[#174A2A] hover:bg-[#123D23] text-white border-[#174A2A]'
                        : 'bg-[#2F7D46] hover:bg-[#1F5E35] text-white border-[#2F7D46]'
                    }`}
                  >
                    {adminMode ? 'Manage Work Order' : 'View Incident Details'}
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Severity & Legend Overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-[#FFFFFF]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#D6E4D7] text-[11px] text-[#17312A] font-medium space-y-1 shadow-civic pointer-events-none sm:pointer-events-auto">
        <div className="text-[10px] text-[#174A2A] uppercase font-extrabold tracking-wider mb-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#2F7D46]" /> Severity Legend
        </div>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]"></span> Critical</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E8A52B]"></span> High</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2D8CCF]"></span> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2E9B57]"></span> Low</span>
        </div>
      </div>
    </div>
  );
}
