import { ISSUE_CATEGORIES } from '../data/demoData';

/**
 * Mock AI Classification Engine
 * Simulates structural analysis, keyword matching, and deterministic safety overrides.
 * 
 * @param {Object} reportInput - { description, category, latitude, longitude, locationLabel }
 * @returns {Promise<Object>} AI analysis output
 */
export async function analyzeIssue(reportInput) {
  // Simulate 600ms AI latency for authentic UI feedback
  await new Promise(resolve => setTimeout(resolve, 600));

  const text = (reportInput.description || '').toLowerCase();
  const userCategory = reportInput.category || '';

  // 1. SAFETY OVERRIDE: Check for high-hazard electrical risk
  const electricalDangerKeywords = ['exposed', 'wire', 'shock', 'spark', 'live wire', 'touching', 'electrical hazard', 'high voltage'];
  const containsElectricalHazard = electricalDangerKeywords.some(kw => text.includes(kw));

  if (containsElectricalHazard) {
    return {
      category: 'ELECTRICAL',
      issueType: 'EXPOSED_WIRE',
      severity: 'CRITICAL',
      department: 'ELECTRICAL',
      summary: 'CRITICAL HAZARD: Hazardous exposed electrical wiring detected in citizen report.',
      confidence: 0.98,
      safetyOverrideTriggered: true,
      reasoning: 'Deterministic safety rule enforced CRITICAL severity due to exposed live electrical danger.'
    };
  }

  // 2. Keyword-based classification mapping
  let category = userCategory || 'OTHER';
  let issueType = 'GENERAL_CIVIC';
  let severity = 'MEDIUM';
  let confidence = 0.88;

  if (text.includes('light') || text.includes('dark') || text.includes('lamp') || text.includes('bulb') || text.includes('street light')) {
    category = 'STREETLIGHT';
    issueType = text.includes('flicker') ? 'FLICKERING_LIGHT' : 'BROKEN_LIGHT';
    severity = 'MEDIUM';
    confidence = 0.94;
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('dump') || text.includes('bin')) {
    category = 'WASTE';
    issueType = text.includes('missed') ? 'MISSED_COLLECTION' : 'OVERFLOWING_GARBAGE';
    severity = 'MEDIUM';
    confidence = 0.92;
  } else if (text.includes('pothole') || text.includes('road') || text.includes('crack') || text.includes('sidewalk') || text.includes('pavement')) {
    category = 'ROAD';
    issueType = text.includes('pothole') ? 'POTHOLE' : 'ROAD_DAMAGE';
    severity = text.includes('deep') || text.includes('major') ? 'HIGH' : 'MEDIUM';
    confidence = 0.90;
  } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('burst')) {
    category = 'WATER';
    issueType = text.includes('burst') ? 'PIPE_BURST' : 'WATER_LEAK';
    severity = text.includes('burst') || text.includes('major') ? 'HIGH' : 'MEDIUM';
    confidence = 0.93;
  } else if (text.includes('drain') || text.includes('flood') || text.includes('sewer') || text.includes('clog')) {
    category = 'DRAINAGE';
    issueType = text.includes('flood') ? 'FLOODING' : 'BLOCKED_DRAIN';
    severity = text.includes('flood') ? 'HIGH' : 'MEDIUM';
    confidence = 0.91;
  } else if (text.includes('bench') || text.includes('sign') || text.includes('fence') || text.includes('property')) {
    category = 'PUBLIC_PROPERTY';
    issueType = text.includes('bench') ? 'DAMAGED_BENCH' : 'DAMAGED_SIGN';
    severity = 'LOW';
    confidence = 0.86;
  }

  // Determine Department via strict routing table
  const categoryConfig = ISSUE_CATEGORIES[category] || ISSUE_CATEGORIES.OTHER;
  const department = categoryConfig.department;

  // Generate concise summary
  const locationText = reportInput.locationLabel ? ` near ${reportInput.locationLabel}` : '';
  const summary = `${categoryConfig.label} issue reported${locationText}. Suggested department dispatch: ${department}.`;

  return {
    category,
    issueType,
    severity,
    department,
    summary,
    confidence,
    safetyOverrideTriggered: false,
    reasoning: 'AI model structured the report into standard category, severity, and department.'
  };
}
