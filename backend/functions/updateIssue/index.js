import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'CivicFixIssues';

export const handler = async (event) => {
  try {
    const issueId = event.pathParameters?.issueId;
    const body = JSON.parse(event.body || '{}');

    if (!issueId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'issueId parameter is required' })
      };
    }

    const currentRes = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { issueId }
    }));

    if (!currentRes.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Issue ${issueId} not found` })
      };
    }

    const existing = currentRes.Item;
    const newStatus = body.status || existing.status;
    const newDept = body.department || existing.department;
    const newAssigned = body.assignedTo !== undefined ? body.assignedTo : existing.assignedTo;
    const newResNote = body.resolutionNote !== undefined ? body.resolutionNote : existing.resolutionNote;
    const newResImg = body.resolutionImageKey !== undefined ? body.resolutionImageKey : existing.resolutionImageKey;
    const newVerification = body.verificationStatus !== undefined ? body.verificationStatus : existing.verificationStatus;
    const now = new Date().toISOString();
    const resolvedAt = (newStatus === 'RESOLVED' && !existing.resolvedAt) ? now : existing.resolvedAt;

    // If propagateToIncident is true, update all reports under same incidentId
    if (body.propagateToIncident && existing.incidentId) {
      const scanRes = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
      const allIssues = scanRes.Items || [];
      const incidentItems = allIssues.filter(i => i.incidentId === existing.incidentId);

      for (const item of incidentItems) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { issueId: item.issueId },
          UpdateExpression: 'SET #st = :st, department = :dp, assignedTo = :as, resolutionNote = :rn, resolutionImageKey = :ri, resolvedAt = :ra, updatedAt = :u',
          ExpressionAttributeNames: { '#st': 'status' },
          ExpressionAttributeValues: {
            ':st': newStatus,
            ':dp': newDept,
            ':as': newAssigned,
            ':rn': newResNote,
            ':ri': newResImg,
            ':ra': resolvedAt,
            ':u': now
          }
        }));
      }
    } else {
      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { issueId },
        UpdateExpression: 'SET #st = :st, department = :dp, assignedTo = :as, resolutionNote = :rn, resolutionImageKey = :ri, verificationStatus = :vs, resolvedAt = :ra, updatedAt = :u',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: {
          ':st': newStatus,
          ':dp': newDept,
          ':as': newAssigned,
          ':rn': newResNote,
          ':ri': newResImg,
          ':vs': newVerification,
          ':ra': resolvedAt,
          ':u': now
        }
      }));
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: `Issue ${issueId} updated successfully` })
    };
  } catch (err) {
    console.error('Error updating issue:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
