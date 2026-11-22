/**
 * AdPulse 360 - Digital Marketing & Google Ads Platform
 * Seed Data & Initial Schema
 */

const INITIAL_MARKETING_DATA = {
  account: {
    customerName: "AdPulse Growth Enterprise",
    customerId: "482-910-3821",
    currency: "USD",
    currencySymbol: "$",
    timeZone: "America/New_York (EST)",
    managerAccount: "MCC-Global-Agency-912",
    apiStatus: {
      connected: true,
      mode: "Production (Google Ads API v16)",
      lastSyncTime: new Date().toISOString(),
      developerToken: "adp_live_tok_99382109xKls",
      clientId: "8492019382-adpulse.apps.googleusercontent.com"
    }
  },

  // Overview Aggregate KPIs
  overviewKPIs: {
    totalSpend: 15830.80,
    impressions: 563100,
    clicks: 18980,
    ctr: 3.37, // %
    avgCpc: 0.83, // $
    conversions: 604,
    conversionRate: 3.18, // %
    costPerConv: 26.21, // $
    convValue: 87280.00, // $
    roas: 551.3 // % (5.51x)
  },

  // Google Ads Campaigns
  campaigns: [
    {
      id: "camp-101",
      name: "US - Search - High Intent Enterprise Solutions",
      type: "Search",
      status: "Active",
      objective: "Leads",
      dailyBudget: 150.00,
      biddingStrategy: "Target CPA ($42.00)",
      targetCpa: 42.00,
      targetRoas: null,
      impressions: 42500,
      clicks: 3120,
      ctr: 7.34,
      avgCpc: 1.85,
      spend: 5772.00,
      conversions: 138,
      cvr: 4.42,
      costPerConv: 41.83,
      convValue: 27600.00,
      roas: 478.1,
      qualityAvg: 8.4,
      locations: ["United States", "Canada"],
      devices: { desktop: 68, mobile: 28, tablet: 4 },
      startDate: "2026-09-01",
      endDate: "Ongoing",
      adGroupsCount: 3,
      keywordsCount: 24
    },
    {
      id: "camp-102",
      name: "US - Performance Max - Lead Generation Q4",
      type: "Performance Max",
      status: "Active",
      objective: "Sales & Leads",
      dailyBudget: 220.00,
      biddingStrategy: "Maximize Conversions",
      targetCpa: 36.00,
      targetRoas: null,
      impressions: 128400,
      clicks: 6450,
      ctr: 5.02,
      avgCpc: 1.02,
      spend: 6579.00,
      conversions: 184,
      cvr: 2.85,
      costPerConv: 35.75,
      convValue: 31280.00,
      roas: 475.4,
      qualityAvg: 8.0,
      locations: ["United States"],
      devices: { desktop: 52, mobile: 44, tablet: 4 },
      startDate: "2026-10-01",
      endDate: "Ongoing",
      adGroupsCount: 2,
      keywordsCount: 0 // Asset groups in PMax
    },
    {
      id: "camp-103",
      name: "Global - Remarketing Display & Video",
      type: "Display",
      status: "Active",
      objective: "Brand Awareness",
      dailyBudget: 80.00,
      biddingStrategy: "Maximize Clicks",
      targetCpa: null,
      targetRoas: null,
      impressions: 310000,
      clicks: 4120,
      ctr: 1.33,
      avgCpc: 0.55,
      spend: 2266.00,
      conversions: 48,
      cvr: 1.17,
      costPerConv: 47.20,
      convValue: 8640.00,
      roas: 381.3,
      qualityAvg: 7.2,
      locations: ["Global (All Countries)"],
      devices: { desktop: 35, mobile: 60, tablet: 5 },
      startDate: "2026-08-15",
      endDate: "Ongoing",
      adGroupsCount: 4,
      keywordsCount: 16
    },
    {
      id: "camp-104",
      name: "US - Search - Brand Protection & Navigational",
      type: "Search",
      status: "Active",
      objective: "Website Traffic",
      dailyBudget: 50.00,
      biddingStrategy: "Target Impression Share (95%)",
      targetCpa: 8.00,
      targetRoas: null,
      impressions: 18200,
      clicks: 2890,
      ctr: 15.88,
      avgCpc: 0.42,
      spend: 1213.80,
      conversions: 162,
      cvr: 5.61,
      costPerConv: 7.49,
      convValue: 19440.00,
      roas: 1601.5,
      qualityAvg: 9.8,
      locations: ["United States", "United Kingdom"],
      devices: { desktop: 60, mobile: 38, tablet: 2 },
      startDate: "2026-07-01",
      endDate: "Ongoing",
      adGroupsCount: 2,
      keywordsCount: 8
    },
    {
      id: "camp-105",
      name: "EU - Shopping & Product Feed (Seasonal)",
      type: "Shopping",
      status: "Paused",
      objective: "Sales",
      dailyBudget: 120.00,
      biddingStrategy: "Target ROAS (450%)",
      targetCpa: null,
      targetRoas: 450,
      impressions: 64000,
      clicks: 2400,
      ctr: 3.75,
      avgCpc: 1.15,
      spend: 2760.00,
      conversions: 72,
      cvr: 3.00,
      costPerConv: 38.33,
      convValue: 12960.00,
      roas: 469.5,
      qualityAvg: 7.8,
      locations: ["Germany", "France", "Netherlands"],
      devices: { desktop: 45, mobile: 50, tablet: 5 },
      startDate: "2026-06-01",
      endDate: "2026-09-30",
      adGroupsCount: 3,
      keywordsCount: 0 // Shopping feed based
    }
  ],

  // Ad Groups
  adGroups: [
    {
      id: "ag-201",
      campaignId: "camp-101",
      campaignName: "US - Search - High Intent Enterprise Solutions",
      name: "Enterprise Web Development & Architecture",
      status: "Active",
      defaultMaxCpc: 2.20,
      clicks: 1420,
      impressions: 18400,
      ctr: 7.72,
      avgCpc: 1.95,
      spend: 2769.00,
      conversions: 68,
      cvr: 4.79,
      costPerConv: 40.72
    },
    {
      id: "ag-202",
      campaignId: "camp-101",
      campaignName: "US - Search - High Intent Enterprise Solutions",
      name: "Custom WordPress Redesign Advisory",
      status: "Active",
      defaultMaxCpc: 1.80,
      clicks: 1040,
      impressions: 14200,
      ctr: 7.32,
      avgCpc: 1.74,
      spend: 1809.60,
      conversions: 46,
      cvr: 4.42,
      costPerConv: 39.34
    },
    {
      id: "ag-203",
      campaignId: "camp-101",
      campaignName: "US - Search - High Intent Enterprise Solutions",
      name: "Shopify B2B & Wholesale Migration",
      status: "Active",
      defaultMaxCpc: 2.10,
      clicks: 660,
      impressions: 9900,
      ctr: 6.67,
      avgCpc: 1.81,
      spend: 1194.60,
      conversions: 24,
      cvr: 3.64,
      costPerConv: 49.78
    },
    {
      id: "ag-204",
      campaignId: "camp-104",
      campaignName: "US - Search - Brand Protection & Navigational",
      name: "Exact Brand Terms",
      status: "Active",
      defaultMaxCpc: 0.50,
      clicks: 2150,
      impressions: 12400,
      ctr: 17.34,
      avgCpc: 0.38,
      spend: 817.00,
      conversions: 125,
      cvr: 5.81,
      costPerConv: 6.54
    }
  ],

  // Keywords (with Match Types & Quality Scores)
  keywords: [
    {
      id: "kw-301",
      campaignId: "camp-101",
      adGroupId: "ag-201",
      text: "[enterprise web development company]",
      matchType: "Exact",
      status: "Active",
      maxCpc: 2.50,
      qualityScore: 9,
      qualityScoreDetails: {
        expectedCtr: "Above Average",
        adRelevance: "Above Average",
        landingPageExp: "Above Average"
      },
      impressions: 8900,
      clicks: 820,
      ctr: 9.21,
      avgCpc: 2.05,
      spend: 1681.00,
      conversions: 42,
      cvr: 5.12,
      costPerConv: 40.02
    },
    {
      id: "kw-302",
      campaignId: "camp-101",
      adGroupId: "ag-201",
      text: "\"custom corporate website design\"",
      matchType: "Phrase",
      status: "Active",
      maxCpc: 2.20,
      qualityScore: 8,
      qualityScoreDetails: {
        expectedCtr: "Average",
        adRelevance: "Above Average",
        landingPageExp: "Above Average"
      },
      impressions: 6400,
      clicks: 430,
      ctr: 6.72,
      avgCpc: 1.82,
      spend: 782.60,
      conversions: 18,
      cvr: 4.19,
      costPerConv: 43.48
    },
    {
      id: "kw-303",
      campaignId: "camp-101",
      adGroupId: "ag-202",
      text: "[wordpress redesign services]",
      matchType: "Exact",
      status: "Active",
      maxCpc: 2.00,
      qualityScore: 9,
      qualityScoreDetails: {
        expectedCtr: "Above Average",
        adRelevance: "Above Average",
        landingPageExp: "Above Average"
      },
      impressions: 5900,
      clicks: 510,
      ctr: 8.64,
      avgCpc: 1.70,
      spend: 867.00,
      conversions: 26,
      cvr: 5.10,
      costPerConv: 33.35
    },
    {
      id: "kw-304",
      campaignId: "camp-101",
      adGroupId: "ag-203",
      text: "\"b2b shopify developers\"",
      matchType: "Phrase",
      status: "Active",
      maxCpc: 2.40,
      qualityScore: 8,
      qualityScoreDetails: {
        expectedCtr: "Average",
        adRelevance: "Above Average",
        landingPageExp: "Above Average"
      },
      impressions: 4800,
      clicks: 340,
      ctr: 7.08,
      avgCpc: 1.90,
      spend: 646.00,
      conversions: 14,
      cvr: 4.12,
      costPerConv: 46.14
    },
    {
      id: "kw-305",
      campaignId: "camp-104",
      adGroupId: "ag-204",
      text: "[adpulse marketing]",
      matchType: "Exact",
      status: "Active",
      maxCpc: 0.50,
      qualityScore: 10,
      qualityScoreDetails: {
        expectedCtr: "Above Average",
        adRelevance: "Above Average",
        landingPageExp: "Above Average"
      },
      impressions: 11200,
      clicks: 1980,
      ctr: 17.68,
      avgCpc: 0.36,
      spend: 712.80,
      conversions: 118,
      cvr: 5.96,
      costPerConv: 6.04
    },
    {
      id: "kw-306",
      campaignId: "camp-101",
      adGroupId: "ag-201",
      text: "-free",
      matchType: "Negative",
      status: "Active",
      maxCpc: null,
      qualityScore: null,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      avgCpc: 0,
      spend: 0,
      conversions: 0,
      cvr: 0,
      costPerConv: 0
    },
    {
      id: "kw-307",
      campaignId: "camp-101",
      adGroupId: "ag-201",
      text: "-cheap",
      matchType: "Negative",
      status: "Active",
      maxCpc: null,
      qualityScore: null,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      avgCpc: 0,
      spend: 0,
      conversions: 0,
      cvr: 0,
      costPerConv: 0
    }
  ],

  // Responsive Search Ads
  ads: [
    {
      id: "ad-401",
      campaignId: "camp-101",
      adGroupId: "ag-201",
      type: "Responsive Search Ad",
      status: "Active",
      adStrength: "Excellent (94%)",
      finalUrl: "https://adpulse360.com/enterprise-solutions",
      displayPath1: "Solutions",
      displayPath2: "Enterprise",
      headlines: [
        "Enterprise Web Development",
        "High-Converting Architecture",
        "Scale Your Digital Revenue",
        "98/100 Core Web Vitals",
        "Custom WordPress & Shopify"
      ],
      descriptions: [
        "Transform complex business workflows into high-converting responsive web platforms.",
        "Partner with verified technical developers and growth specialists. Request a proposal today."
      ],
      sitelinks: [
        { text: "View Case Studies", url: "/case-studies" },
        { text: "Schedule Discovery", url: "/contact" },
        { text: "WordPress Redesigns", url: "/wordpress" },
        { text: "B2B Shopify Stores", url: "/shopify" }
      ],
      callouts: ["Sub-Second Load Times", "Full Custom Code", "Dedicated Support", "Verified Results"],
      impressions: 24200,
      clicks: 1840,
      ctr: 7.60,
      conversions: 82
    },
    {
      id: "ad-402",
      campaignId: "camp-104",
      adGroupId: "ag-204",
      type: "Responsive Search Ad",
      status: "Active",
      adStrength: "Excellent (98%)",
      finalUrl: "https://adpulse360.com",
      displayPath1: "Official",
      displayPath2: "Platform",
      headlines: [
        "AdPulse™ Official Site",
        "Complete Marketing Platform",
        "Managed Google Ads Growth",
        "Data-Driven ROI & Insights"
      ],
      descriptions: [
        "The complete digital marketing command center for Google Ads, conversions, and revenue growth.",
        "Take command of clicks, impressions, CPC, and target ROAS with our executive dashboard."
      ],
      sitelinks: [
        { text: "Interactive Live Demo", url: "/demo" },
        { text: "Client Testimonials", url: "/reviews" }
      ],
      callouts: ["Instant Setup", "Google Ads API v16", "24/7 Monitoring"],
      impressions: 16800,
      clicks: 2680,
      ctr: 15.95,
      conversions: 154
    }
  ],

  // Audiences & Targeting Segments
  audiences: [
    {
      id: "aud-501",
      name: "In-Market: Enterprise Web Design & Development Services",
      type: "In-Market",
      bidModifier: "+25%",
      impressions: 19800,
      clicks: 1640,
      conversions: 84,
      cvr: 5.12,
      roas: 520
    },
    {
      id: "aud-502",
      name: "In-Market: E-Commerce Platform Software (Shopify / B2B)",
      type: "In-Market",
      bidModifier: "+20%",
      impressions: 14200,
      clicks: 980,
      conversions: 46,
      cvr: 4.69,
      roas: 480
    },
    {
      id: "aud-503",
      name: "Website Visitors (Past 30 Days) - Non-Converters",
      type: "Remarketing",
      bidModifier: "+35%",
      impressions: 28400,
      clicks: 2190,
      conversions: 112,
      cvr: 5.11,
      roas: 640
    },
    {
      id: "aud-504",
      name: "Affinity: Technology Business Leaders & Founders",
      type: "Affinity",
      bidModifier: "+15%",
      impressions: 34000,
      clicks: 1820,
      conversions: 58,
      cvr: 3.19,
      roas: 410
    }
  ],

  // Historical Daily Time-Series (Past 14 Days)
  dailyPerformance: [
    { date: "Oct 22", spend: 980.20, clicks: 1210, impressions: 36400, conversions: 38, revenue: 5400 },
    { date: "Oct 23", spend: 1045.50, clicks: 1280, impressions: 38200, conversions: 42, revenue: 6100 },
    { date: "Oct 24", spend: 1120.00, clicks: 1390, impressions: 41000, conversions: 46, revenue: 6800 },
    { date: "Oct 25", spend: 890.40, clicks: 1050, impressions: 31200, conversions: 31, revenue: 4500 },
    { date: "Oct 26", spend: 760.10, clicks: 920, impressions: 28900, conversions: 28, revenue: 4100 },
    { date: "Oct 27", spend: 1190.80, clicks: 1460, impressions: 43500, conversions: 49, revenue: 7200 },
    { date: "Oct 28", spend: 1240.00, clicks: 1510, impressions: 45100, conversions: 52, revenue: 7650 },
    { date: "Oct 29", spend: 1180.30, clicks: 1440, impressions: 42900, conversions: 48, revenue: 6980 },
    { date: "Oct 30", spend: 1210.50, clicks: 1480, impressions: 43800, conversions: 51, revenue: 7420 },
    { date: "Oct 31", spend: 1290.00, clicks: 1560, impressions: 46200, conversions: 54, revenue: 8100 },
    { date: "Nov 01", spend: 910.20, clicks: 1100, impressions: 33400, conversions: 34, revenue: 4900 },
    { date: "Nov 02", spend: 840.60, clicks: 990, impressions: 30100, conversions: 30, revenue: 4400 },
    { date: "Nov 03", spend: 1340.00, clicks: 1620, impressions: 48900, conversions: 56, revenue: 8450 },
    { date: "Nov 04", spend: 1420.20, clicks: 1710, impressions: 51200, conversions: 60, revenue: 8980 }
  ],

  // AI Optimization Recommendations
  recommendations: [
    {
      id: "rec-01",
      category: "Bidding & Budgets",
      title: "Raise Daily Budget on PMax Campaign",
      description: "Campaign 'US - Performance Max - Lead Generation Q4' is hitting 98% of its budget early at 475% ROAS. Increasing budget by $50/day is projected to capture +24 conversions.",
      impact: "+18% Conversions",
      scoreBoost: "+4.2%",
      actionText: "Apply Budget Increase ($220 -> $270)",
      campaignId: "camp-102"
    },
    {
      id: "rec-02",
      category: "Keywords & Targeting",
      title: "Add 6 Negative Keywords to Eliminate Wasted Spend",
      description: "Identified queries matching 'free templates', 'student internship', and 'diy tutorial' costing $312/month with 0 conversions.",
      impact: "Save $312/month",
      scoreBoost: "+3.8%",
      actionText: "Add 6 Negative Keywords",
      campaignId: "camp-101"
    },
    {
      id: "rec-03",
      category: "Ads & Creative",
      title: "Improve Ad Strength on Search Ad #401",
      description: "Add 2 more unique headlines containing top keywords to increase Ad Strength from Good to Excellent.",
      impact: "+9% Click-Through Rate",
      scoreBoost: "+2.5%",
      actionText: "Open Ad Editor",
      campaignId: "camp-101"
    }
  ]
};
