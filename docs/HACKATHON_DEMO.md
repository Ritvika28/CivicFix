# CivicFix — Hackathon Demonstration Guide (3-Minute Script)

> **Core Value Proposition:** "From citizen report to resolved incident."
> **Hero Concept:** **REPORT ≠ INCIDENT** — Individual citizen submissions are clustered into 1 canonical Physical Incident Work Order, eliminating duplicate dispatch while keeping every citizen informed.

---

## ⏱️ 3-Minute Demo Timeline Overview

| Timestamp | Phase | Role | Screen / Action | Primary Talking Point |
| :--- | :--- | :--- | :--- | :--- |
| **0:00 – 0:30** | **Problem & Hook** | Presenter | Landing Page (`/`) | Municipal complaint bloat & `REPORT ≠ INCIDENT` paradigm. |
| **0:30 – 1:15** | **Citizen Submission & AI** | Citizen | Report Form (`/report`) | Auto-structuring, GPS location, AI classification & safety overrides. |
| **1:15 – 2:00** | **Duplicate Clustering** | Citizen | Result Modal | Haversine proximity ($15\text{m}$) + text match ($0.79$) $\rightarrow$ linked to `INC-1001`. |
| **2:00 – 2:35** | **Authority Dispatch** | Authority | Admin Dashboard (`/admin`) | GIS map markers, hotspot stats, work order assignment & status transition. |
| **2:35 – 3:00** | **Resolution & Verification**| Citizen | Issue Details (`/issues/CF-1001`) | Before/After photo comparison & citizen confirmation feedback (`CONFIRMED`). |

---

## 🎬 Detailed Click Sequence & Narration Script

### **1. Landing Page & Problem Hook (0:00 – 0:30)**

* **Navigation:** Open `http://localhost:5173/` (or live demo URL).
* **Action:** Scroll to the **"Understanding REPORT ≠ INCIDENT"** hero card.
* **What to Say:**
  > *"Judges, when a streetlight breaks or a dangerous wire dangles, 5 different citizens submit complaints. Traditional portals create 5 independent work orders, wasting municipal resources and confusing field crews. CivicFix introduces **REPORT ≠ INCIDENT**. A report is a citizen's ticket; an incident is the physical problem. CivicFix clusters redundant complaints into 1 unified work order without discarding any citizen's submission."*
* **What Judges Should Notice:**
  - Crisp hero banner highlighting the IIIT Lucknow pilot.
  - Interactive 3-step diagram explaining `3 Citizen Reports → 1 Work Order`.

---

### **2. Citizen Report & AI Structuring (0:30 – 1:15)**

* **Navigation:** Click **"Report an Issue"** button (or header link `/report`).
* **Action:**
  1. Select Location: **"Gate 2 Entrance"** (or click *Use My Live GPS*).
  2. Type Description: `"Lamp near Gate 2 is not working at night and the pathway is pitch black."`
  3. Click **"Analyze & Submit Report"**.
* **What to Say:**
  > *"As a citizen, I snap a photo and describe the problem. CivicFix immediately runs our AI classification and deterministic safety rule engine. For life-threatening hazards like exposed live wires, safety rules override AI output to force CRITICAL severity. Here, it correctly identifies the category as Streetlighting and department as Electrical."*
* **What Judges Should Notice:**
  - Animated loading state analyzing spatial proximity and text similarity.
  - Automatic extraction of Category, Severity, and Summary.

---

### **3. Spatial Duplicate Clustering Engine (1:15 – 2:00)**

* **Screen:** Result Confirmation Modal.
* **Action:** Highlight the **"Duplicate Report Detected & Clustered!"** banner.
* **What to Say:**
  > *"Notice what just happened! CivicFix calculated a Haversine spatial distance of 15 meters and a Jaccard text similarity index of 0.79. It automatically linked my new ticket — Report CF-1002 — to existing physical Incident INC-1001. My report wasn't deleted! It remains my personal tracking ticket, but authority dispatch receives 1 consolidated work order."*
* **What Judges Should Notice:**
  - Ticket ID (`CF-1002`) vs Incident ID (`INC-1001`).
  - Explicit mathematical proof of spatial distance ($\le 100\text{m}$) and text match ($\ge 0.70$).

---

### **4. Authority Command Center & Dispatch (2:00 – 2:35)**

* **Navigation:** Use top-right role pill to switch to **Authority (Officer Sharma)**, then click **"Authority Admin"** (`/admin`).
* **Action:**
  1. View GIS Map with severity-coded pin markers and campus hotspot analytics.
  2. Filter table by **ELECTRICAL** department.
  3. Click **"Manage Work Order"** on Incident `INC-1001`.
  4. Change status from `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`.
  5. Select an **"After"** resolution photo proof and click **"Update & Propagate"**.
* **What to Say:**
  > *"Now switching to municipal officer view. On the GIS map, authorities see real-time hotspots. Managing Incident INC-1001 shows 3 linked citizen reports. When Officer Sharma updates the status to RESOLVED and uploads the 'After' repair photo proof, CivicFix propagates the update across all 3 linked citizen tickets in one click via AWS Lambda and DynamoDB!"*
* **What Judges Should Notice:**
  - Real-time OpenStreetMap tile layer with severity markers and cluster legend.
  - One-click status propagation across all linked citizen tickets.

---

### **5. Resolution Evidence & Citizen Verification (2:35 – 3:00)**

* **Navigation:** Switch role back to **Citizen**, open **"My Reports"** (`/citizen`), and click **"View Details"** on `CF-1001`.
* **Action:**
  1. Show the **Resolution Progress Timeline** (`REPORTED` $\rightarrow$ `VERIFIED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`).
  2. Highlight the side-by-side **BEFORE (Citizen Photo)** vs **AFTER (Authority Proof Photo)**.
  3. Click **"YES, IT'S RESOLVED"** to confirm resolution closure.
* **What to Say:**
  > *"Back on the citizen dashboard, Alex receives notification of resolution. He inspects the side-by-side Before and After photos provided by the electrical crew and clicks 'YES, IT'S RESOLVED'. The citizen verification loop is closed! **CivicFix: From citizen report to resolved incident.** Thank you!"*
* **What Judges Should Notice:**
  - Side-by-side proof comparison.
  - Interactive citizen verification feedback loop (`CONFIRMED` / `REJECTED`).

---

## 🛠️ Key Technical Talking Points for Q&A

1. **AWS Serverless Infrastructure:** Built on AWS Lambda (`arm64` Node.js 20), API Gateway HTTP API, DynamoDB (`PAY_PER_REQUEST`), and private S3 buckets.
2. **Private S3 & Presigned URLs:** S3 bucket has **Block Public Access enabled**. Media uploads use 15-minute presigned `PUT` URLs; images are served via short-lived presigned `GET` URLs.
3. **Deterministic Safety Rules:** Safety overrides guarantee that life-threatening hazards (e.g. exposed live wires) are forced to `CRITICAL` severity regardless of LLM confidence.
4. **$0.00 Running Cost:** Architecture operates 100% within the AWS Free Tier with zero baseline server idling expenses.

---

## 🔄 Backup & Offline Fallback Plan

If cloud connectivity or network access is disrupted during the live demo presentation:
- **Transparent Fallback:** CivicFix includes an offline mock engine (`client/src/services/mockApi.js`).
- **Activation:** Simply clear or omit `VITE_API_URL` in `.env`. The UI automatically displays `🏠 Local Offline Mock Engine` in browser dev console logs and executes identical duplicate clustering logic in-memory.
- **Reset Button:** Use the **"Reset Seed Data"** button in the Admin header to instantly restore pristine demo seed state (`INC-1001`, `CF-1001`, `CF-1002`, `CF-1003`).

---

## 🔮 Known Limitations & Future Scope

1. **WhatsApp & SMS Bot:** Multi-channel reporting via WhatsApp Business API for citizens without smartphones or internet connectivity.
2. **Regional Indian Language Support:** Auto-translation for Hindi, Tamil, Marathi, and regional dialects.
3. **Edge Computer Vision:** On-device ML model for automatic pothole dimension measurement and garbage overflow volume estimation.
