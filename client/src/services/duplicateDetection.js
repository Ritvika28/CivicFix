import { calculateDistanceMeters, calculateLocationSimilarity } from '../utils/distance.js';
import { calculateTextSimilarity } from '../utils/textSimilarity.js';

/**
 * MVP Duplicate Detection Engine
 * 
 * Formula:
 * duplicateScore = (locationSimilarity * 0.4) + (categorySimilarity * 0.3) + (textSimilarity * 0.3)
 * 
 * @param {Object} newReport - { category, description, latitude, longitude }
 * @param {Array} existingIssues - Array of existing issue items
 * @param {number} threshold - Duplicate threshold score (default 0.75)
 * @returns {Object|null} duplicate analysis result or null if unique
 */
export function findPotentialDuplicates(newReport, existingIssues = [], threshold = 0.70) {
  if (!existingIssues || existingIssues.length === 0) return null;

  let bestMatch = null;
  let maxScore = 0;

  for (const issue of existingIssues) {
    // 1. Location similarity (100 meter cutoff radius)
    const distanceMeters = calculateDistanceMeters(
      newReport.latitude,
      newReport.longitude,
      issue.latitude,
      issue.longitude
    );
    const locationScore = calculateLocationSimilarity(
      newReport.latitude,
      newReport.longitude,
      issue.latitude,
      issue.longitude,
      100 // 100 meters
    );

    // 2. Category similarity (1.0 if identical, 0.0 otherwise)
    const categoryScore = (newReport.category === issue.category) ? 1.0 : 0.0;

    // 3. Text description similarity
    const textScore = calculateTextSimilarity(
      newReport.description,
      issue.description
    );

    // Weighted composite duplicate score
    const duplicateScore = Number(
      ((locationScore * 0.4) + (categoryScore * 0.3) + (textScore * 0.3)).toFixed(2)
    );

    if (duplicateScore > maxScore) {
      maxScore = duplicateScore;
      bestMatch = {
        matchedIssue: issue,
        score: duplicateScore,
        distanceMeters,
        locationScore,
        categoryScore,
        textScore,
        reasons: [
          categoryScore > 0 ? `✓ Same category (${issue.category})` : `✗ Different category`,
          locationScore > 0 ? `✓ Within ${distanceMeters} meters` : `✗ Farther than 100m (${distanceMeters}m)`,
          textScore > 0.3 ? `✓ Similar report wording (${Math.round(textScore * 100)}% text match)` : `✗ Low text similarity`
        ]
      };
    }
  }

  if (bestMatch && maxScore >= threshold) {
    return {
      isDuplicate: true,
      score: maxScore,
      canonicalIssueId: bestMatch.matchedIssue.duplicateOf || bestMatch.matchedIssue.issueId,
      canonicalIncidentId: bestMatch.matchedIssue.incidentId,
      matchedIssue: bestMatch.matchedIssue,
      distanceMeters: bestMatch.distanceMeters,
      reasons: bestMatch.reasons
    };
  }

  return {
    isDuplicate: false,
    score: maxScore,
    bestCandidate: bestMatch
  };
}
