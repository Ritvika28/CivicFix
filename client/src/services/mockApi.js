import { INITIAL_ISSUES } from '../data/demoData';
import { analyzeIssue } from './mockAiService';
import { findPotentialDuplicates } from './duplicateDetection';

const STORAGE_KEY = 'civicfix_issues_v1';

// Internal helper to get state from localStorage
function loadIssuesFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to parse localStorage issues:', err);
    return INITIAL_ISSUES;
  }
}

// Internal helper to save state
function saveIssuesToStorage(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

// Helper to generate IDs
function generateIssueId(issues) {
  const count = issues.length + 1001;
  return `CF-${count}`;
}

function generateIncidentId(issues) {
  const incidents = new Set(issues.map(i => i.incidentId).filter(Boolean));
  const count = incidents.size + 1001;
  return `INC-${count}`;
}

export const mockApi = {
  /**
   * Fetch all issues with optional filtering
   */
  async getIssues(filter = {}) {
    await new Promise(r => setTimeout(r, 200));
    let issues = loadIssuesFromStorage();

    if (filter.status) {
      issues = issues.filter(i => i.status === filter.status);
    }
    if (filter.category) {
      issues = issues.filter(i => i.category === filter.category);
    }
    if (filter.department) {
      issues = issues.filter(i => i.department === filter.department);
    }

    return issues;
  },

  /**
   * Fetch single issue by issueId or incidentId along with associated incident reports
   */
  async getIssueById(issueId) {
    await new Promise(r => setTimeout(r, 200));
    const issues = loadIssuesFromStorage();
    let issue = issues.find(i => i.issueId === issueId);
    if (!issue) {
      issue = issues.find(i => i.incidentId === issueId);
    }

    if (!issue) {
      throw new Error(`Issue or Incident ${issueId} not found`);
    }

    // Find all reports linked under the same incidentId
    const incidentReports = issues.filter(
      i => i.incidentId === issue.incidentId
    );

    return {
      issue,
      incidentReports,
      incidentReportCount: incidentReports.length
    };
  },

  /**
   * Create new citizen issue report
   */
  async createIssue(reportInput) {
    const existingIssues = loadIssuesFromStorage();

    // 1. Run AI analysis
    const aiResult = await analyzeIssue(reportInput);

    // 2. Run Duplicate Detection Engine
    const dupResult = findPotentialDuplicates({
      category: aiResult.category,
      description: reportInput.description,
      latitude: reportInput.latitude,
      longitude: reportInput.longitude
    }, existingIssues);

    const newIssueId = generateIssueId(existingIssues);
    let assignedIncidentId;
    let duplicateOf = null;

    if (dupResult && dupResult.isDuplicate) {
      assignedIncidentId = dupResult.canonicalIncidentId;
      duplicateOf = dupResult.canonicalIssueId;
    } else {
      assignedIncidentId = generateIncidentId(existingIssues);
    }

    const newIssue = {
      issueId: newIssueId,
      incidentId: assignedIncidentId,
      category: aiResult.category,
      issueType: aiResult.issueType,
      description: reportInput.description,
      summary: aiResult.summary,
      severity: aiResult.severity,
      status: "REPORTED",
      department: aiResult.department,
      assignedTo: null,
      latitude: Number(reportInput.latitude),
      longitude: Number(reportInput.longitude),
      locationLabel: reportInput.locationLabel || "Campus Location",
      imageKey: reportInput.imageKey || "https://images.unsplash.com/photo-1544724796-0f04c6e94917?auto=format&fit=crop&w=800&q=80",
      reportedBy: reportInput.reportedBy || "demo-citizen",
      reportedAt: new Date().toISOString(),
      duplicateOf,
      verificationStatus: null,
      resolutionNote: null,
      resolutionImageKey: null,
      resolvedAt: null
    };

    const updatedList = [newIssue, ...existingIssues];
    saveIssuesToStorage(updatedList);

    return {
      issue: newIssue,
      aiResult,
      dupResult
    };
  },

  /**
   * Update issue status, department, assignment, resolution details
   */
  async updateIssue(issueId, updates) {
    await new Promise(r => setTimeout(r, 300));
    const issues = loadIssuesFromStorage();
    const index = issues.findIndex(i => i.issueId === issueId);

    if (index === -1) {
      throw new Error(`Issue ${issueId} not found`);
    }

    const existing = issues[index];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If resolving, set resolvedAt timestamp if not set
    if (updates.status === 'RESOLVED' && !updated.resolvedAt) {
      updated.resolvedAt = new Date().toISOString();
    }

    // Also update all linked reports under the same incident if status changed to RESOLVED
    if (updates.status && updates.propagateToIncident) {
      issues.forEach((item, idx) => {
        if (item.incidentId === existing.incidentId) {
          issues[idx] = {
            ...item,
            status: updates.status,
            assignedTo: updates.assignedTo || item.assignedTo,
            department: updates.department || item.department,
            resolutionNote: updates.resolutionNote || item.resolutionNote,
            resolutionImageKey: updates.resolutionImageKey || item.resolutionImageKey,
            resolvedAt: updates.status === 'RESOLVED' ? new Date().toISOString() : item.resolvedAt
          };
        }
      });
    } else {
      issues[index] = updated;
    }

    saveIssuesToStorage(issues);
    return updated;
  },

  /**
   * Mock Presigned S3 Upload URL Generator
   */
  async createUploadUrl(filename, contentType) {
    await new Promise(r => setTimeout(r, 250));
    const cleanName = (filename || 'photo.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const safeKey = `reports/demo_${Date.now()}_${cleanName}`;
    
    return {
      uploadUrl: `https://civicfix-images-demo.s3.ap-south-1.amazonaws.com/${safeKey}?mock_presigned_signature=1`,
      imageKey: safeKey,
      expiresInSeconds: 900
    };
  },

  /**
   * Mock Presigned S3 Download URL Resolver
   */
  async getDownloadUrl(imageKey) {
    if (!imageKey) return null;
    if (imageKey.startsWith('http://') || imageKey.startsWith('https://') || imageKey.startsWith('data:')) {
      return imageKey;
    }
    return "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80";
  },

  /**
   * Reset storage to initial demo state
   */
  resetDemoData() {
    saveIssuesToStorage(INITIAL_ISSUES);
    return INITIAL_ISSUES;
  }
};
