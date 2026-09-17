import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'CivicFixIssues';

export const handler = async (event) => {
  try {
    const issueId = event.pathParameters?.issueId;
    if (!issueId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'issueId parameter is required' })
      };
    }

    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { issueId }
    }));

    if (!res.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Issue ${issueId} not found` })
      };
    }

    // Fetch all linked reports sharing the same incidentId
    const scanRes = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    const allIssues = scanRes.Items || [];
    const incidentReports = allIssues.filter(i => i.incidentId === res.Item.incidentId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        issue: res.Item,
        incidentReports,
        incidentReportCount: incidentReports.length
      })
    };
  } catch (err) {
    console.error('Error fetching issue:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
