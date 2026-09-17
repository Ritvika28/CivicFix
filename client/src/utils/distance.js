/**
 * Calculates Haversine distance in meters between two lat/lng coordinates.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in meters
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Returns geographical similarity score [0.0 to 1.0] based on distance threshold.
 * Standard radius threshold: 100 meters
 */
export function calculateLocationSimilarity(lat1, lon1, lat2, lon2, maxRadiusMeters = 100) {
  const distance = calculateDistanceMeters(lat1, lon1, lat2, lon2);
  if (distance >= maxRadiusMeters) return 0;
  return Number((1 - (distance / maxRadiusMeters)).toFixed(2));
}
