const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pi3cxuy7oa.execute-api.ap-south-1.amazonaws.com';

export const awsApi = {
  /**
   * Fetch issues from live DynamoDB via API Gateway
   */
  async getIssues(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const url = `${API_BASE_URL}/issues${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return await res.json();
  },

  /**
   * Fetch single issue details from DynamoDB
   */
  async getIssueById(issueId) {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}`);
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return await res.json();
  },

  /**
   * Create issue report in DynamoDB via Lambda
   */
  async createIssue(reportData) {
    const res = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return await res.json();
  },

  /**
   * Update issue in DynamoDB via Lambda
   */
  async updateIssue(issueId, updates) {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return await res.json();
  },

  /**
   * Request S3 Presigned Upload URL from Lambda
   */
  async createUploadUrl(filename, contentType) {
    const res = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, contentType })
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return await res.json();
  }
};
