import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'CivicFixIssues';

export const handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    let items = res.Items || [];

    if (params.status) {
      items = items.filter(i => i.status === params.status);
    }
    if (params.category) {
      items = items.filter(i => i.category === params.category);
    }
    if (params.department) {
      items = items.filter(i => i.department === params.department);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(items)
    };
  } catch (err) {
    console.error('Error listing issues:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
