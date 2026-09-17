import assert from 'node:assert';
import { calculateDistanceMeters, calculateLocationSimilarity } from '../utils/distance.js';
import { calculateTextSimilarity } from '../utils/textSimilarity.js';
import { findPotentialDuplicates } from '../services/duplicateDetection.js';

console.log("🧪 Running CivicFix Core Engine Unit Tests...\n");

// Test 1: Haversine distance calculation
const d = calculateDistanceMeters(26.7998, 81.0267, 26.7999, 81.0268);
console.log(`[Test 1] Haversine Distance (Gate 2 coords): ${d} meters`);
assert(d < 50, "Distance should be under 50 meters");

// Test 2: Text Jaccard similarity calculation
const textA = "Streetlight near Gate 2 is broken";
const textB = "Lamp near Gate 2 is not working";
const sim = calculateTextSimilarity(textA, textB);
console.log(`[Test 2] Text Similarity ('${textA}' vs '${textB}'): ${sim}`);
assert(sim > 0.2, "Similarity score should be above 0.2");

// Test 3: Duplicate detection composite scoring
const newReport = {
  category: "STREETLIGHT",
  description: "Gate 2 light is completely dark",
  latitude: 26.7998,
  longitude: 81.0267
};

const existingIssues = [
  {
    issueId: "CF-1001",
    incidentId: "INC-1001",
    category: "STREETLIGHT",
    description: "Streetlight near Gate 2 is broken",
    latitude: 26.7998,
    longitude: 81.0267
  }
];

const dupResult = findPotentialDuplicates(newReport, existingIssues);
console.log(`[Test 3] Duplicate Detection Score: ${dupResult.score} (IsDuplicate: ${dupResult.isDuplicate})`);
assert(dupResult.isDuplicate === true, "Should identify report as duplicate of CF-1001");
assert.strictEqual(dupResult.canonicalIncidentId, "INC-1001", "Should link to INC-1001");

console.log("\n✅ All CivicFix core engine unit tests passed cleanly!");
