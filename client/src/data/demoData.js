// Demo Locations (IIIT Lucknow Campus Coordinates)
export const DEMO_LOCATIONS = [
  { id: 'gate2', name: 'Gate 2', latitude: 26.7998, longitude: 81.0267 },
  { id: 'academic_block', name: 'Academic Block', latitude: 26.8005, longitude: 81.0275 },
  { id: 'hostel_area', name: 'Hostel Area', latitude: 26.7990, longitude: 81.0255 },
  { id: 'main_road', name: 'Main Road', latitude: 26.8012, longitude: 81.0280 },
  { id: 'cafeteria', name: 'Campus Cafeteria', latitude: 26.8000, longitude: 81.0260 }
];

// Issue Categories & Issue Types
export const ISSUE_CATEGORIES = {
  WASTE: {
    label: 'Waste Management',
    department: 'SANITATION',
    types: ['OVERFLOWING_GARBAGE', 'MISSED_COLLECTION', 'ILLEGAL_DUMPING']
  },
  ROAD: {
    label: 'Roads & Sidewalks',
    department: 'PUBLIC_WORKS',
    types: ['POTHOLE', 'ROAD_DAMAGE', 'SIDEWALK_DAMAGE']
  },
  STREETLIGHT: {
    label: 'Streetlighting',
    department: 'ELECTRICAL',
    types: ['BROKEN_LIGHT', 'LIGHT_OUTAGE', 'FLICKERING_LIGHT']
  },
  WATER: {
    label: 'Water Supply',
    department: 'WATER_SERVICES',
    types: ['WATER_LEAK', 'WATER_SUPPLY', 'PIPE_BURST']
  },
  DRAINAGE: {
    label: 'Drainage & Sewage',
    department: 'DRAINAGE',
    types: ['BLOCKED_DRAIN', 'FLOODING', 'SEWAGE_OVERFLOW']
  },
  PUBLIC_PROPERTY: {
    label: 'Public Infrastructure',
    department: 'PUBLIC_WORKS',
    types: ['DAMAGED_BENCH', 'DAMAGED_SIGN', 'DAMAGED_INFRASTRUCTURE']
  },
  ELECTRICAL: {
    label: 'Electrical Safety',
    department: 'ELECTRICAL',
    types: ['EXPOSED_WIRE', 'ELECTRICAL_DAMAGE', 'TRANSFORMER_ISSUE']
  },
  OTHER: {
    label: 'Other Civic Issue',
    department: 'GENERAL_SERVICES',
    types: ['GENERAL_CIVIC']
  }
};

// Seed Issues demonstrating "3 Citizen Reports -> 1 Underlying Incident"
export const INITIAL_ISSUES = [
  {
    issueId: "CF-1001",
    incidentId: "INC-1001",
    category: "STREETLIGHT",
    issueType: "BROKEN_LIGHT",
    description: "Streetlight near Gate 2 is broken and dark.",
    summary: "Streetlight near Gate 2 appears non-functional creating dark spot.",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    department: "ELECTRICAL",
    assignedTo: "Electrical Response Team A",
    latitude: 26.7998,
    longitude: 81.0267,
    locationLabel: "Gate 2",
    imageKey: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80",
    reportedBy: "citizen_alex",
    reportedAt: "2026-09-17T18:15:00Z",
    duplicateOf: null,
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  },
  {
    issueId: "CF-1002",
    incidentId: "INC-1001",
    category: "STREETLIGHT",
    issueType: "LIGHT_OUTAGE",
    description: "Lamp near Gate 2 is not working at night.",
    summary: "Reported outage of street light near Gate 2 entrance.",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    department: "ELECTRICAL",
    assignedTo: "Electrical Response Team A",
    latitude: 26.7999,
    longitude: 81.0268,
    locationLabel: "Gate 2",
    imageKey: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    reportedBy: "citizen_priya",
    reportedAt: "2026-09-17T18:45:00Z",
    duplicateOf: "CF-1001",
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  },
  {
    issueId: "CF-1003",
    incidentId: "INC-1001",
    category: "STREETLIGHT",
    issueType: "BROKEN_LIGHT",
    description: "Gate 2 area is completely dark because streetlight is broken.",
    summary: "Darkness near Gate 2 due to faulty light fixture.",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    department: "ELECTRICAL",
    assignedTo: "Electrical Response Team A",
    latitude: 26.7997,
    longitude: 81.0266,
    locationLabel: "Gate 2",
    imageKey: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    reportedBy: "citizen_rahul",
    reportedAt: "2026-09-17T19:10:00Z",
    duplicateOf: "CF-1001",
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  },
  {
    issueId: "CF-1004",
    incidentId: "INC-1002",
    category: "WASTE",
    issueType: "OVERFLOWING_GARBAGE",
    description: "Garbage bin near Academic Block is overflowing onto path.",
    summary: "Overflowing waste bin near Academic Block entrance.",
    severity: "MEDIUM",
    status: "REPORTED",
    department: "SANITATION",
    assignedTo: null,
    latitude: 26.8005,
    longitude: 81.0275,
    locationLabel: "Academic Block",
    imageKey: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    reportedBy: "citizen_sara",
    reportedAt: "2026-09-17T19:30:00Z",
    duplicateOf: null,
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  },
  {
    issueId: "CF-1005",
    incidentId: "INC-1003",
    category: "ELECTRICAL",
    issueType: "EXPOSED_WIRE",
    description: "Exposed live wire hanging near Hostel Area main junction point.",
    summary: "Hazardous exposed electrical wire reported near Hostel Area.",
    severity: "CRITICAL",
    status: "VERIFIED",
    department: "ELECTRICAL",
    assignedTo: "Emergency Crew B",
    latitude: 26.7990,
    longitude: 81.0255,
    locationLabel: "Hostel Area",
    imageKey: "https://images.unsplash.com/photo-1544724796-0f04c6e94917?auto=format&fit=crop&w=800&q=80",
    reportedBy: "citizen_vikram",
    reportedAt: "2026-09-17T20:00:00Z",
    duplicateOf: null,
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  }
];
