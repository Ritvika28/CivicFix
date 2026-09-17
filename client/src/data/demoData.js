// Demo Locations (IIIT Lucknow Campus Coordinates)
export const DEMO_LOCATIONS = [
  { id: 'gate2', name: 'Gate 2 Entrance', latitude: 26.7998, longitude: 81.0267 },
  { id: 'academic_block', name: 'Academic Block A', latitude: 26.8005, longitude: 81.0275 },
  { id: 'hostel_area', name: 'Boys Hostel 2 Junction', latitude: 26.7990, longitude: 81.0255 },
  { id: 'main_road', name: 'Campus Main Boulevard', latitude: 26.8012, longitude: 81.0280 },
  { id: 'cafeteria', name: 'Student Mess & Cafeteria', latitude: 26.8000, longitude: 81.0260 }
];

// Issue Categories & Department Assignments
export const ISSUE_CATEGORIES = {
  STREETLIGHT: {
    label: 'Streetlighting & Power',
    department: 'ELECTRICAL',
    types: ['BROKEN_LIGHT', 'LIGHT_OUTAGE', 'FLICKERING_LIGHT']
  },
  ELECTRICAL: {
    label: 'Electrical Hazards',
    department: 'ELECTRICAL',
    types: ['EXPOSED_WIRE', 'ELECTRICAL_DAMAGE', 'TRANSFORMER_ISSUE']
  },
  WASTE: {
    label: 'Waste & Sanitation',
    department: 'SANITATION',
    types: ['OVERFLOWING_GARBAGE', 'MISSED_COLLECTION', 'ILLEGAL_DUMPING']
  },
  ROAD: {
    label: 'Roads & Sidewalks',
    department: 'PUBLIC_WORKS',
    types: ['POTHOLE', 'ROAD_DAMAGE', 'SIDEWALK_DAMAGE']
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
  OTHER: {
    label: 'Other Infrastructure',
    department: 'GENERAL_SERVICES',
    types: ['GENERAL_CIVIC']
  }
};

// Seed Data: 7 Citizen Reports -> 5 Physical Incidents
// Gate 2 Streetlight has 3 reports clustered into INC-1001 to showcase "3 Citizen Reports -> 1 Incident"
export const INITIAL_ISSUES = [
  {
    issueId: "CF-1001",
    incidentId: "INC-1001",
    category: "STREETLIGHT",
    issueType: "BROKEN_LIGHT",
    description: "Streetlight fixture near Gate 2 is damaged and pitch black at night.",
    summary: "Non-functional streetlight near Gate 2 entrance causing safety hazard.",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    department: "ELECTRICAL",
    assignedTo: "Electrical Crew Alpha",
    latitude: 26.7998,
    longitude: 81.0267,
    locationLabel: "Gate 2 Entrance",
    imageKey: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80",
    reportedBy: "alex_student",
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
    description: "Lamp near Gate 2 is not working when coming back from lab.",
    summary: "Reported street light outage near Gate 2 entrance path.",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    department: "ELECTRICAL",
    assignedTo: "Electrical Crew Alpha",
    latitude: 26.7999,
    longitude: 81.0268,
    locationLabel: "Gate 2 Entrance",
    imageKey: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    reportedBy: "priya_faculty",
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
    description: "Gate 2 entrance area is dark because main pole light is out.",
    summary: "Darkness near Gate 2 entrance due to faulty lighting.",
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    department: "ELECTRICAL",
    assignedTo: "Electrical Crew Alpha",
    latitude: 26.7997,
    longitude: 81.0266,
    locationLabel: "Gate 2 Entrance",
    imageKey: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    reportedBy: "rahul_resident",
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
    category: "ELECTRICAL",
    issueType: "EXPOSED_WIRE",
    description: "Exposed live high-voltage wire dangling near Hostel 2 main gate!",
    summary: "CRITICAL HAZARD: Exposed live electrical wire dangling near Hostel 2.",
    severity: "CRITICAL",
    status: "VERIFIED",
    department: "ELECTRICAL",
    assignedTo: "Emergency High-Voltage Taskforce",
    latitude: 26.7990,
    longitude: 81.0255,
    locationLabel: "Boys Hostel 2 Junction",
    imageKey: "https://images.unsplash.com/photo-1544724796-0f04c6e94917?auto=format&fit=crop&w=800&q=80",
    reportedBy: "vikram_hostel",
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
    category: "WASTE",
    issueType: "OVERFLOWING_GARBAGE",
    description: "Garbage bin near Academic Block entrance is overflowing onto walkway.",
    summary: "Overflowing waste bin requiring immediate sanitation collection.",
    severity: "MEDIUM",
    status: "REPORTED",
    department: "SANITATION",
    assignedTo: "Sanitation Unit 4",
    latitude: 26.8005,
    longitude: 81.0275,
    locationLabel: "Academic Block A",
    imageKey: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    reportedBy: "sara_admin",
    reportedAt: "2026-09-17T19:50:00Z",
    duplicateOf: null,
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  },
  {
    issueId: "CF-1006",
    incidentId: "INC-1004",
    category: "ROAD",
    issueType: "POTHOLE",
    description: "Deep pothole on main campus boulevard causing vehicle tire damage.",
    summary: "Deep road depression on Main Boulevard needing asphalt patch.",
    severity: "HIGH",
    status: "ASSIGNED",
    department: "PUBLIC_WORKS",
    assignedTo: "Pavement Repair Crew",
    latitude: 26.8012,
    longitude: 81.0280,
    locationLabel: "Campus Main Boulevard",
    imageKey: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    reportedBy: "driver_sunil",
    reportedAt: "2026-09-17T20:15:00Z",
    duplicateOf: null,
    verificationStatus: null,
    resolutionNote: null,
    resolutionImageKey: null,
    resolvedAt: null
  },
  {
    issueId: "CF-1007",
    incidentId: "INC-1005",
    category: "WATER",
    issueType: "WATER_LEAK",
    description: "Clean water line leak outside Student Cafeteria wasting water.",
    summary: "Underground pipe leaking clean drinking water near Cafeteria.",
    severity: "MEDIUM",
    status: "RESOLVED",
    department: "WATER_SERVICES",
    assignedTo: "Plumbing Quick Response Unit",
    latitude: 26.8000,
    longitude: 81.0260,
    locationLabel: "Student Mess & Cafeteria",
    imageKey: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    reportedBy: "cafeteria_staff",
    reportedAt: "2026-09-17T16:00:00Z",
    duplicateOf: null,
    verificationStatus: "CONFIRMED",
    resolutionNote: "Replaced faulty coupling joint and pressure-tested main line.",
    resolutionImageKey: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    resolvedAt: "2026-09-17T17:45:00Z"
  }
];
