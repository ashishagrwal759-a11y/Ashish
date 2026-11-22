# AdPulse 360 — Complete Digital Marketing & Google Ads Platform

A modern, production-grade, enterprise digital marketing command center with complete **Google Ads campaign creation and management**, **real-time performance tracking**, **ad groups & keyword quality score diagnostics**, **responsive search ad previewing**, and **Google Ads API v16 integration**.

---

## 🌟 Key Features & Google Ads Functionality

### 1. Google Ads Campaign Creation & Management
- **Multi-Step Campaign Creation Wizard**:
  - Choose marketing objectives (Leads, Sales, Website Traffic, Brand Awareness).
  - Select campaign types (**Search**, **Performance Max**, **Display**, **Shopping**).
  - Configure daily budgets, geographic targeting, and device bid modifiers.
- **Smart Bidding Strategy Management**:
  - Target CPA (Cost Per Acquisition)
  - Target ROAS (Return On Ad Spend)
  - Maximize Conversions
  - Maximize Clicks & Manual CPC
- **Inline Campaign Management**:
  - One-click instant **Status Toggle (Active / Paused)**.
  - Inline **Daily Budget Editor** with real-time recalculation.
  - Edit campaign settings, duplicate, and delete campaigns.

### 2. Campaign Performance & Metrics Tracking
Tracks and computes all industry-standard Google Ads metrics in real-time:
- **Clicks** & **Impressions**
- **CTR (Click-Through Rate %)**
- **Average CPC (Cost Per Click $)**
- **Total Ad Spend ($)**
- **Conversions** (Leads / Sales)
- **Conversion Rate (CvR %)**
- **Cost Per Conversion (CPA $)**
- **Total Conversion Value ($)**
- **ROAS % (Return On Ad Spend / ROI)**

### 3. Keywords, Match Types & Quality Score Diagnostics
- **Comprehensive Match Types Support**:
  - `[Exact Match]`: High intent, precise targeting.
  - `"Phrase Match"`: Semantic context matching.
  - `Broad Match`: Reach expansion.
  - `-Negative Keywords`: Eliminates wasted ad spend on irrelevant queries.
- **Quality Score Diagnostic Engine (1-10)**:
  - Visual rating bars and status.
  - Sub-metrics: *Expected CTR*, *Ad Relevance*, and *Landing Page Experience*.
- **Max CPC Bidding**: Set and adjust bids per keyword.

### 4. Responsive Search Ad (RSA) Builder & Live Google SERP Preview
- **Interactive Ad Creator**:
  - Up to 5 headlines (30 char limit with live counter).
  - Up to 4 descriptions (90 char limit with live counter).
  - Display Path 1 & 2 (`domain.com/Path1/Path2`).
  - Sitelinks and Callout extensions.
- **Live Google Search Results Simulator**:
  - Pixel-perfect Google mobile/desktop search card with Google favicon, "Sponsored" badge, green/gray path, and blue clickable headline.
- **Algorithmic Ad Strength Meter**:
  - Analyzes headline diversity, keyword inclusion, and character count into *Poor, Average, Good, or Excellent (94%+)*.

### 5. Audience Targeting & Demographics
- Target **In-Market** audiences, **Affinity** segments, and **Website Visitor Remarketing Lists**.
- Configure positive and negative **Bid Modifiers** (`+35%` on high-intent groups, `-40%` on low-intent segments).
- Demographic controls for **Age Brackets** and **Household Income Tiers**.

### 6. Google Ads API v16 Integration & Diagnostics
- **Authentication & Credentials Manager**:
  - Customer ID (CID: `482-910-3821`).
  - Developer Token & OAuth2 Client ID/Secret settings.
  - Switch between **Production API** and **Google Ads Test Account (Sandbox)**.
- **Live Sync Engine**:
  - One-click sync button querying `googleAds:searchStream` to pull real-time delta metrics.
- **JSON API Payload Inspector**:
  - Inspect exact REST/gRPC queries and response payloads communicated to Google's endpoints.
- **Webhook & Event Audit Log**:
  - Live feed tracking mutate operations, OAuth refreshes, and conversion tracking events.

### 7. Executive ROI Reporting & AI Recommendations
- **ROI & Revenue Calculator**:
  - Evaluates Net Ad Profit (`Revenue - Spend = Net Profit`) and Portfolio ROAS.
- **1-Click CSV Data Exporters**:
  - Export all campaigns performance to CSV.
  - Export all keywords and Quality Scores to CSV.
  - Print-ready client executive summary.
- **AI Optimization Recommendations**:
  - Evaluates budget pacing, identifies wasted spend keywords, and optimizes ad headlines with one-click "Apply" actions.

---

## 🚀 How to Run Locally

Because this platform is engineered with modern modular JavaScript (ES6+), semantic HTML5, and responsive CSS3:

1. **Directly in Your Browser**:
   - Double-click `marketing-platform/index.html` in Windows Explorer or open `file:///d:/ashish%20portfolio/marketing-platform/index.html`.
2. **Persistence**:
   - All campaigns, keywords, ads, and API settings are automatically synchronized and persisted in browser `localStorage`.
   - You can create, edit, pause, and delete campaigns, and changes will remain saved!
   - Click the "Reset Factory Data" button at any time to restore the initial demo state.

---

## 📁 File Structure

```
d:\ashish portfolio\marketing-platform\
├── index.html                  # Main Application Dashboard
├── README.md                   # Platform documentation
├── css/
│   ├── dashboard.css           # App layout, sidebar, dark SaaS design system
│   └── components.css          # Tables, modals, SERP simulator, form controls, toasts
└── js/
    ├── app.js                  # Master controller & tab routing
    ├── data.js                 # Initial seed dataset (campaigns, keywords, ads, metrics)
    ├── storage.js              # LocalStorage persistence & state synchronization
    ├── analytics.js            # Chart.js rendering (with pure SVG/Canvas fallback)
    ├── campaigns.js            # Campaign wizard & table management
    ├── keywords.js             # Keywords, match types & Quality Score diagnostics
    ├── adbuilder.js            # RSA ad creator & Google SERP preview
    ├── google-ads-api.js       # Google Ads API v16 connector & JSON inspector
    └── reports.js              # CSV exports, ROI engine & AI recommendations
```

---

© 2026 AdPulse 360. Production-Ready Digital Marketing & Google Ads Platform.
