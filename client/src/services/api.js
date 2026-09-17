import { awsApi } from './awsApi';
import { mockApi } from './mockApi';

// If VITE_API_URL is configured, use live AWS Serverless API. Otherwise use local offline mockApi.
const isLiveAwsConfigured = Boolean(import.meta.env.VITE_API_URL);

console.log(`[CivicFix] API Mode: ${isLiveAwsConfigured ? '⚡ LIVE AWS API Gateway (' + import.meta.env.VITE_API_URL + ')' : '🏠 Local Offline Mock Engine'}`);

export const api = isLiveAwsConfigured ? awsApi : mockApi;
