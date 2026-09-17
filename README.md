# CivicFix — "From citizen report to resolved incident."

CivicFix is a smart civic issue reporting and resolution platform for cities, college campuses, housing societies, local communities, and institutions.

---

## 📌 Problem

Civic problems (broken streetlights, overflowing garbage bins, dangerous potholes, exposed electrical wires) are often reported by multiple citizens through fragmented channels. Traditional systems treat every complaint as an isolated ticket, resulting in:
- Duplicate work orders sent to municipal or campus teams.
- Fragmented tracking without clear visibility into issue status.
- Lack of closing verification loops with citizens.

---

## 💡 Solution & Key Innovation

### **REPORT ≠ INCIDENT**

* **Report:** A submission made by an individual citizen.
* **Incident:** The underlying real-world physical problem in the community.

**Example Scenario:**
- Citizen A: *"Streetlight near Gate 2 is broken"*
- Citizen B: *"Lamp near Gate 2 is not working"*
- Citizen C: *"Gate 2 is dark because streetlight is broken"*

👉 **3 Citizen Reports $\rightarrow$ 1 Underlying Incident**

CivicFix uses intelligent duplicate detection and geographical proximity grouping to associate redundant reports with a single incident, allowing authorities to manage and resolve issues efficiently.

---

## ✨ Features

- 📱 **Citizen Reporting Flow:** Photo upload, automatic browser geolocation with campus manual override, category selection, and issue description.
- 🤖 **AI Classification Abstraction:** Structures unstructured text into issue categories, severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), summaries, and department routing.
- 🛡️ **Safety Rule Engine:** Deterministic safety rules override AI output for high-risk hazards (e.g., exposed live electrical wires are strictly forced to `HIGH`/`CRITICAL`).
- 🔄 **Duplicate Detection Engine:** Haversine distance scoring combined with text Jaccard similarity to identify and group similar nearby reports.
- 🏢 **Authority Admin Dashboard:** Real-time stats, incident dispatch, department assignment, and status timeline tracking (`REPORTED` $\rightarrow$ `VERIFIED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`).
- 📸 **Resolution Proof & Verification:** Before-and-after photo comparison and citizen confirmation loop (`CONFIRMED` / `REJECTED`).
- 🗺️ **Interactive Map & Hotspot Analytics:** Leaflet interactive map showing incident clusters, hotspots, and breakdown by category and department.

---

## 🏗️ Target Architecture

```
                    ┌─────────────────────┐
                    │   CivicFix React    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ API Gateway HTTP API│
                    └──────────┬──────────┘
                               │
                         ┌─────┴─────┐
                         │           │
                         ▼           ▼
                    ┌────────┐   ┌─────────┐
                    │ Lambda │   │ Upload  │
                    │  APIs  │   │ Lambda  │
                    └───┬────┘   └────┬────┘
                        │              │
                        ▼              ▼
                  ┌───────────┐   ┌─────────┐
                  │ DynamoDB  │   │   S3    │
                  │  Issues   │   │ Images  │
                  └───────────┘   └─────────┘

        Optional Future Extensions (Disabled Initially):
        [EventBridge] ──► Notification Processing
        [Amazon Bedrock] ──► Production LLM Classification
```

---

## ☁️ AWS Serverless Architecture & Cost Safety

CivicFix is designed to minimize cloud costs and run within the AWS Free Tier in region **`ap-south-1` (Asia Pacific - Mumbai)**:

1. **Amazon API Gateway HTTP API:** Low-latency REST API routing.
2. **AWS Lambda (Node.js 20.x):** Pay-per-request compute for issue CRUD operations and presigned URL generation.
3. **Amazon DynamoDB (`CivicFixIssues`):** Single-table design (`issueId` partition key) with On-Demand billing.
4. **Amazon S3 (`civicfix-images`):** 100% Private bucket with Block Public Access enabled. Client uploads photos via secure, short-lived S3 Presigned URLs.

---

## 🚀 Local Development Setup

CivicFix features a complete **offline mock engine** that allows full end-to-end testing without AWS credentials.

1. **Clone & Install Dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to `http://localhost:5173` to test Citizen reporting, Demo Login, Admin Dashboard, and Resolution workflows.

---

## 🤖 AI Disclosure & Hackathon Compliance

In accordance with hackathon guidelines, AI-assisted development tools (Google Antigravity Agentic Coding Platform) were utilized during the design, architecture, and coding of this application.

---

## 📄 License
MIT License. Created for CivicFix Hackathon Project 2026.
