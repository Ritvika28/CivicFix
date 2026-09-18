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
   * Fetch single issue details from DynamoDB with incident lookup fallback
   */
  async getIssueById(issueId) {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${issueId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.issue) return data;
      }
    } catch (err) {
      console.warn(`Direct lookup for issueId ${issueId} failed, falling back to list scan:`, err);
    }

    // Fallback: If direct /issues/{issueId} returns 404 (e.g. if issueId is an INC-xxxx incident ID or duplicate ID),
    // scan all issues from DynamoDB and locate the record by issueId or incidentId
    const allIssues = await this.getIssues();
    const issue = allIssues.find(i => i.issueId === issueId || i.incidentId === issueId);
    if (!issue) {
      throw new Error(`Issue or Incident ${issueId} not found`);
    }

    const incidentReports = allIssues.filter(i => i.incidentId === issue.incidentId);
    return {
      issue,
      incidentReports,
      incidentReportCount: incidentReports.length
    };
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
  async createUploadUrl(filename, contentType, folder = 'reports') {
    const res = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, contentType, folder })
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return await res.json();
  },

  /**
   * Request Presigned S3 Download URL for private object keys
   */
  async getDownloadUrl(imageKey) {
    if (!imageKey) return null;
    if (imageKey.startsWith('http://') || imageKey.startsWith('https://') || imageKey.startsWith('data:')) {
      return imageKey;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download', imageKey })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.downloadUrl;
    } catch (err) {
      console.warn('Failed to fetch presigned download URL:', err);
      return null;
    }
  }
};

