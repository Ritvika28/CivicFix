# CivicFix — "From citizen report to resolved incident."

CivicFix is a serverless civic intelligence and issue resolution platform for cities, college campuses, housing societies, local communities, and institutions.

---

## 📌 1. Problem Statement

Civic problems — such as broken streetlights, overflowing garbage bins, dangerous road potholes, leaking water mains, and exposed live electrical wires — are frequently reported by multiple citizens across fragmented channels.

Traditional civic reporting portals treat every citizen complaint as an isolated ticket. This creates severe inefficiencies:
- **Duplicate Work Orders:** Municipal or campus maintenance crews receive 5 separate tickets for 1 broken streetlight, wasting limited field resources.
- **Overwhelmed Authorities:** Field teams cannot prioritize urgent safety hazards due to ticket bloat.
- **Lack of Transparency:** Citizens receive no visibility when an issue reported by a neighbor is being actively serviced or resolved.

---

## 💡 2. Solution & Core Innovation: REPORT ≠ INCIDENT

CivicFix introduces a fundamental architectural distinction:

> **REPORT ≠ INCIDENT**
> - **Citizen Report:** An individual submission submitted by a citizen (photo, GPS coordinates, description).
> - **Physical Incident:** The underlying real-world physical problem requiring municipal repair.

### **The Gate 2 Demo Scenario:**
1. **Citizen A** reports: *"Streetlight near Gate 2 is broken and dark."* ($\rightarrow$ Ticket `CF-1001`)
2. **Citizen B** reports: *"Lamp near Gate 2 is not working at night."* ($\rightarrow$ Ticket `CF-1002`)
3. **Citizen C** reports: *"Gate 2 entrance dark due to broken light."* ($\rightarrow$ Ticket `CF-1003`)

👉 **3 Citizen Reports $\rightarrow$ 1 Physical Incident (`INC-1001`)**

CivicFix automatically calculates spatial proximity ($\le 100\text{m}$) and text similarity ($\ge 0.70$), linking all 3 complaints into a single physical work order (`INC-1001`). When the authority updates status or uploads a resolution proof photo, **all 3 citizens are notified instantly**.

> [!IMPORTANT]
> **No Citizen Reports Are Deleted:** Duplicate reports are not discarded. They remain active individual citizen tickets linked to the canonical incident work order.

---

## 🔄 3. Main User Workflows

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. CITIZEN      │       │ 2. AI & SPATIAL │       │ 3. CLUSTERING   │
│ Photo + Location│ ───►  │ Auto Category & │ ───►  │ 3 Reports →     │
│ & Description   │       │ Safety Override │       │ 1 Work Order    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
┌─────────────────┐       ┌─────────────────┐                │
│ 6. VERIFY       │       │ 5. RESOLVE      │                ▼
│ Citizen confirms│ ◄───  │ Authority uploads│ ◄─── ┌─────────────────┐
│ fix in UI       │       │ After photo proof│      │ 4. DISPATCH     │
└─────────────────┘       └─────────────────┘       │ Department crew │
                                                    │ assigned        │
                                                    └─────────────────┘
```

1. **Citizen Submission (`/report`):** Citizens upload a photo, select or pinpoint GPS coordinates, and describe the civic problem.
2. **AI Classification & Safety Check:** AI classifies the issue (e.g. `STREETLIGHT`, `WASTE`, `WATER`, `ROAD`, `ELECTRICAL`). High-risk keywords (e.g. *"exposed live wire"*) trigger a **deterministic safety override** forcing `CRITICAL` severity.
3. **Spatial Duplicate Clustering:** Calculates Haversine spatial distance and Jaccard text similarity. If $\text{distance} \le 100\text{m}$ and $\text{similarity} \ge 0.70$, the report links to an existing `incidentId`.
4. **Authority Dispatch (`/admin`):** Municipal or campus authorities view GIS hotspot maps, filter by department, assign response teams, and transition status (`REPORTED` $\rightarrow$ `VERIFIED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`).
5. **Resolution Evidence Upload:** Authorities upload "After" photo proof via secure presigned S3 URLs and add resolution notes.
6. **Citizen Verification (`/issues/:id`):** Citizens compare Before & After photos and submit verification feedback (`CONFIRMED` / `REJECTED`).

---

## 🏗️ 4. System Architecture & AWS Services

CivicFix is built using a modern **AWS Serverless Architecture** deployed to region **`ap-south-1` (Asia Pacific - Mumbai)**:

```
                          ┌───────────────────────────┐
                          │   React 18 / Vite / CSS   │
                          │   CivicFix Web Frontend   │
                          └─────────────┬─────────────┘
                                        │
                                        ▼ (HTTPS CORS)
                          ┌───────────────────────────┐
                          │  Amazon API Gateway v2    │
                          │        (HTTP API)         │
                          └─────────────┬─────────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                ▼                       ▼                       ▼
    ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
    │  CreateIssueFunction  │ │ ListIssuesFunction│ │ CreateUploadUrlFunc   │
    │ (Lambda Node 20 arm64)│ │  (Node 20 arm64)  │ │   (Node 20 arm64)     │
    └───────────┬───────────┘ └─────────┬─────────┘ └───────────┬───────────┘
                │                       │                       │
                ▼                       ▼                       ▼
    ┌─────────────────────────────────────────────┐ ┌───────────────────────┐
    │              Amazon DynamoDB                │ │    Amazon S3 Bucket   │
    │       Table Name: CivicFixIssues            │ │ (100% Private Bucket) │
    │     Billing: PAY_PER_REQUEST (On-Demand)    │ │ Block Public Access   │
    └─────────────────────────────────────────────┘ └───────────────────────┘
```

### **AWS Services Used:**
- **Amazon API Gateway (HTTP API v2):** Provides CORS-enabled, low-latency API endpoint routing to Lambda handlers.
- **AWS Lambda (Node.js 20, `arm64` Graviton):** Serverless compute execution for issue CRUD operations, duplicate clustering engine, and presigned URL generation (128 MB RAM, $< 50\text{ms}$ execution duration).
- **Amazon DynamoDB (`CivicFixIssues`):** Single-table layout storing citizen reports, primary key `issueId` (`CF-xxxx`), GSI `IncidentIndex` (`incidentId`), and spatial coordinates. Billing mode: `PAY_PER_REQUEST` (On-Demand).
- **Amazon S3 (`civicfix-images-277396471171-ap-south-1`):** Stores citizen "Before" photos and authority "After" resolution evidence. S3 is **100% private** with Block Public Access enabled; browser uploads use 15-minute presigned `PUT` URLs, and display renders use short-lived presigned `GET` URLs.

---

## ⚡ 5. Why Serverless?

1. **Zero Baseline Cost:** No idling EC2 instances, load balancers, or managed databases. When there are no reports, cost is strictly **$0.00**.
2. **High Scalability:** Handles sudden spikes during heavy rainstorms or community events automatically.
3. **Zero Maintenance:** No OS patching, server provisioning, or container cluster management required.

---

## 🧮 6. Duplicate Detection & AI Classification Engine

### **Duplicate Clustering Algorithm:**
$$\text{duplicateScore} = (\text{locationSimilarity} \times 0.4) + (\text{categorySimilarity} \times 0.3) + (\text{textSimilarity} \times 0.3)$$

- **Spatial Proximity:** Uses the Haversine formula to compute exact geographic distance in meters:
  $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  Reports within $100\text{m}$ receive a high location score.
- **Text Similarity:** Tokenizes descriptions, filters stop words, and calculates Jaccard token overlap index:
  $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
- **Threshold:** Any report scoring $\ge 0.70$ is automatically linked to the existing physical `incidentId`.

### **AI Classification & Deterministic Safety Rules:**
- The AI service analyzes raw complaint text to extract category, issue type, concise summary, and department routing.
- **Safety Override:** To prevent AI hallucination risks on life-threatening hazards, a deterministic rule engine inspects keywords (e.g. *"exposed live wire"*, *"sparking transformer"*). High-risk hazards strictly force `CRITICAL` severity and immediate emergency department routing.

---

## 🔒 7. Security & Privacy Posture

- **100% Private S3 Storage:** Block Public Access is enabled on the S3 bucket. No media files are publicly readable.
- **Presigned URLs:** Client browser receives short-lived (15-min upload / 60-min download) AWS IAM-signed URLs.
- **IAM Least Privilege:** Lambda execution roles are limited strictly to `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:Scan`, `dynamodb:Query`, `dynamodb:UpdateItem`, and `s3:PutObject`/`s3:GetObject` on the specific CivicFix bucket.

---

## 💰 8. Cost-Conscious Cloud Architecture

- **Active AWS Region:** `ap-south-1` (Mumbai)
- **Total Infrastructure Cost:** **$0.00**
- **Excluded Cost-Risk Services:** No EC2, RDS, NAT Gateway, Elastic Load Balancer, Bedrock, EventBridge, OpenSearch, ECS, or EKS resources are used.

---

## 🚀 9. Local Development & Setup

CivicFix features a complete **dual-mode API architecture** (`client/src/services/api.js`) that seamless seamlessly connects to live AWS or runs locally with mock data.

### **1. Clone & Install:**
```bash
git clone https://github.com/Ritvika28/CivicFix.git
cd CivicFix/client
npm install
```

### **2. Configure Environment (Optional):**
Create `client/.env`:
```env
VITE_API_URL=https://pi3cxuy7oa.execute-api.ap-south-1.amazonaws.com
```
*(If omitted, CivicFix automatically falls back to local in-memory mock engine).*

### **3. Start Development Server:**
```bash
npm run dev
```
Open browser at `http://localhost:5173`.

### **4. Run Unit Tests:**
```bash
node src/utils/duplicateDetection.test.js
```

---

## 🎬 10. Hackathon Presentation & Demo Flow

1. **Role Switcher (Navbar):** Use the role pill in the header to switch between **Citizen (Alex)** and **Authority (Officer Sharma)**.
2. **The 3 Reports $\rightarrow$ 1 Incident Demo:**
   - Go to `/report`. Submit a report for *Gate 2 Entrance*: `"Streetlight near Gate 2 is broken"`.
   - Submit a 2nd report for *Gate 2 Entrance*: `"Lamp near Gate 2 is not working at night"`.
   - Observe the popup modal: CivicFix detects spatial proximity ($15\text{m} \le 100\text{m}$) and text similarity ($0.79 \ge 0.70$), clustering both into **Incident `INC-1001`**.
3. **Authority Resolution (`/admin`):**
   - Switch to **Authority** role. Open `/admin`.
   - View GIS Map markers and campus hotspot stats.
   - Click **Manage Work Order** for `INC-1001`.
   - Change status to `RESOLVED`, upload an "After" resolution proof photo, and save.
4. **Citizen Confirmation (`/citizen`):**
   - Switch back to **Citizen** role. Open ticket details.
   - View the side-by-side **Before & After Photo Comparison**.
   - Click **"YES, IT'S RESOLVED"** to confirm resolution closure.

---

## 🔮 11. Future Scope & Roadmap

- **WhatsApp / SMS Bot:** Citizen reporting via WhatsApp Business API for low-bandwidth rural connectivity.
- **Multilingual Support:** Auto-translation for regional Indian languages (Hindi, Tamil, Marathi, Bengali).
- **Computer Vision Model:** Edge ML model for automatic pothole size and garbage density estimation directly on citizen device before upload.

---

## 📄 License
MIT License. Developed for CivicFix Hackathon 2026.
