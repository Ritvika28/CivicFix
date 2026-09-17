import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME || 'civicfix-images-demo';

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const filename = body.filename || 'photo.jpg';
    const contentType = body.contentType || 'image/jpeg';
    const folder = body.folder || 'reports';

    // Sanitize filename
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `${folder}/${Date.now()}_${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType
    });

    // Generate 15-minute presigned upload URL
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl,
        imageKey: objectKey,
        expiresInSeconds: 900
      })
    };
  } catch (err) {
    console.error('Error generating presigned upload URL:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
