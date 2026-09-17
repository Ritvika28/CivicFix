import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'CivicFixIssues';

// Simple stop words filter for Jaccard text similarity
const STOP_WORDS = new Set(["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in", "is", "it", "of", "on", "that", "the", "to", "with"]);

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function tokenize(text) {
  if (!text) return new Set();
  const tokens = text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
  return new Set(tokens);
}

function calculateJaccardSimilarity(textA, textB) {
  const setA = tokenize(textA);
  const setB = tokenize(textB);
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    if (!body.description) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Description is required' })
      };
    }

    const lat = Number(body.latitude || 26.7998);
    const lon = Number(body.longitude || 81.0267);

    // 1. Fetch existing issues for duplicate check
    const scanRes = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    const existingIssues = scanRes.Items || [];

    // 2. Run Duplicate Scoring
    let bestMatch = null;
    let maxScore = 0;

    for (const item of existingIssues) {
      const dist = calculateDistanceMeters(lat, lon, item.latitude, item.longitude);
      const locScore = dist < 100 ? (1 - dist / 100) : 0;
      const catScore = (body.category === item.category) ? 1.0 : 0.0;
      const textScore = calculateJaccardSimilarity(body.description, item.description);

      const score = (locScore * 0.4) + (catScore * 0.3) + (textScore * 0.3);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = { item, score, dist };
      }
    }

    const isDuplicate = maxScore >= 0.70 && bestMatch !== null;
    const issueId = `CF-${1000 + existingIssues.length + 1}`;
    const incidentId = isDuplicate ? bestMatch.item.incidentId : `INC-${1000 + existingIssues.length + 1}`;
    const duplicateOf = isDuplicate ? (bestMatch.item.duplicateOf || bestMatch.item.issueId) : null;

    const newIssue = {
      issueId,
      incidentId,
      category: body.category || 'OTHER',
      issueType: body.issueType || 'GENERAL_CIVIC',
      description: body.description,
      summary: body.summary || body.description,
      severity: body.severity || 'MEDIUM',
      status: 'REPORTED',
      department: body.department || 'GENERAL_SERVICES',
      latitude: lat,
      longitude: lon,
      locationLabel: body.locationLabel || 'Campus Location',
      imageKey: body.imageKey || null,
      reportedBy: body.reportedBy || 'citizen-user',
      duplicateOf,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: newIssue
    }));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        issue: newIssue,
        isDuplicate,
        duplicateScore: Number(maxScore.toFixed(2)),
        linkedIncidentId: incidentId
      })
    };
  } catch (err) {
    console.error('Error creating issue:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
