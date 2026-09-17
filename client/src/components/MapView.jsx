import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';

// Create SVG custom map icons based on severity
function createCustomIcon(severity) {
  let color = '#3b82f6'; // LOW (Blue)
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

export default function MapView({ issues = [], center = [26.7998, 81.0267], zoom = 16, height = "400px" }) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map(issue => {
          const reportCount = issues.filter(i => i.incidentId === issue.incidentId).length;
          return (
            <Marker
              key={issue.issueId}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(issue.severity)}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{issue.issueId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {reportCount} {reportCount === 1 ? 'report' : 'reports'} → 1 incident
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100 mb-1 line-clamp-1">{issue.description}</h4>
                  <p className="text-xs text-slate-400 mb-2">📍 {issue.locationLabel || 'Campus'}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <Link
                    to={`/issues/${issue.issueId}`}
                    className="block text-center w-full mt-2 py-1 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
                  >
                    View Issue & Incident Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
