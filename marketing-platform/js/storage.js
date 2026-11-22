/**
 * AdPulse 360 - Storage & State Synchronization Engine
 * Persists all campaign changes, budget modifications, keywords, and API settings in LocalStorage
 */

const STORAGE_KEY = "adpulse_google_ads_platform_v1";

const StorageManager = {
  // Get all data
  getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read from localStorage, using initial seed data.", e);
    }
    // Deep clone initial data
    const initial = JSON.parse(JSON.stringify(INITIAL_MARKETING_DATA));
    this.saveData(initial);
    return initial;
  },

  // Save all data
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.recalculateOverview(data);
      this.notifySubscribers();
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  },

  // Reset to initial seed data
  resetToDefault() {
    const initial = JSON.parse(JSON.stringify(INITIAL_MARKETING_DATA));
    this.saveData(initial);
    return initial;
  },

  // Recalculate KPIs based on current campaigns
  recalculateOverview(data) {
    let spend = 0, impressions = 0, clicks = 0, conversions = 0, convValue = 0;
    
    data.campaigns.forEach(c => {
      if (c.status !== "Removed") {
        spend += Number(c.spend || 0);
        impressions += Number(c.impressions || 0);
        clicks += Number(c.clicks || 0);
        conversions += Number(c.conversions || 0);
        convValue += Number(c.convValue || 0);
      }
    });

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgCpc = clicks > 0 ? spend / clicks : 0;
    const cvr = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const costPerConv = conversions > 0 ? spend / conversions : 0;
    const roas = spend > 0 ? (convValue / spend) * 100 : 0;

    data.overviewKPIs = {
      totalSpend: Number(spend.toFixed(2)),
      impressions,
      clicks,
      ctr: Number(ctr.toFixed(2)),
      avgCpc: Number(avgCpc.toFixed(2)),
      conversions,
      conversionRate: Number(cvr.toFixed(2)),
      costPerConv: Number(costPerConv.toFixed(2)),
      convValue: Number(convValue.toFixed(2)),
      roas: Number(roas.toFixed(1))
    };
  },

  // Campaign Operations
  getCampaigns() {
    return this.getData().campaigns || [];
  },

  getCampaignById(id) {
    const data = this.getData();
    return data.campaigns.find(c => c.id === id);
  },

  addCampaign(campaignData) {
    const data = this.getData();
    const newId = "camp-" + Math.floor(100 + Math.random() * 900);
    const newCamp = {
      id: newId,
      name: campaignData.name || "Untitled Search Campaign",
      type: campaignData.type || "Search",
      status: campaignData.status || "Active",
      objective: campaignData.objective || "Leads",
      dailyBudget: Number(campaignData.dailyBudget || 100),
      biddingStrategy: campaignData.biddingStrategy || "Maximize Conversions",
      targetCpa: campaignData.targetCpa ? Number(campaignData.targetCpa) : null,
      targetRoas: campaignData.targetRoas ? Number(campaignData.targetRoas) : null,
      impressions: 1200,
      clicks: 86,
      ctr: 7.17,
      avgCpc: 1.62,
      spend: 139.32,
      conversions: 4,
      cvr: 4.65,
      costPerConv: 34.83,
      convValue: 800.00,
      roas: 574.2,
      qualityAvg: 8.5,
      locations: campaignData.locations || ["United States"],
      devices: { desktop: 60, mobile: 35, tablet: 5 },
      startDate: new Date().toISOString().split("T")[0],
      endDate: campaignData.endDate || "Ongoing",
      adGroupsCount: 1,
      keywordsCount: 6
    };

    data.campaigns.unshift(newCamp);

    // Also auto-create a default Ad Group for this campaign
    const agId = "ag-" + Math.floor(200 + Math.random() * 800);
    data.adGroups.push({
      id: agId,
      campaignId: newId,
      campaignName: newCamp.name,
      name: "Default Ad Group 1",
      status: "Active",
      defaultMaxCpc: 2.00,
      clicks: 86,
      impressions: 1200,
      ctr: 7.17,
      avgCpc: 1.62,
      spend: 139.32,
      conversions: 4,
      cvr: 4.65,
      costPerConv: 34.83
    });

    this.saveData(data);
    return newCamp;
  },

  updateCampaign(id, updates) {
    const data = this.getData();
    const idx = data.campaigns.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.campaigns[idx] = { ...data.campaigns[idx], ...updates };
      this.saveData(data);
      return data.campaigns[idx];
    }
    return null;
  },

  toggleCampaignStatus(id) {
    const data = this.getData();
    const camp = data.campaigns.find(c => c.id === id);
    if (camp) {
      camp.status = camp.status === "Active" ? "Paused" : "Active";
      this.saveData(data);
      return camp.status;
    }
    return null;
  },

  deleteCampaign(id) {
    const data = this.getData();
    data.campaigns = data.campaigns.filter(c => c.id !== id);
    data.adGroups = data.adGroups.filter(ag => ag.campaignId !== id);
    data.keywords = data.keywords.filter(kw => kw.campaignId !== id);
    this.saveData(data);
    return true;
  },

  // Keywords Operations
  getKeywords() {
    return this.getData().keywords || [];
  },

  addKeyword(keywordData) {
    const data = this.getData();
    const newKw = {
      id: "kw-" + Math.floor(300 + Math.random() * 900),
      campaignId: keywordData.campaignId || data.campaigns[0].id,
      adGroupId: keywordData.adGroupId || (data.adGroups[0] ? data.adGroups[0].id : "ag-201"),
      text: keywordData.text,
      matchType: keywordData.matchType || "Broad",
      status: "Active",
      maxCpc: keywordData.maxCpc ? Number(keywordData.maxCpc) : 2.00,
      qualityScore: Math.floor(Math.random() * 3) + 7, // 7-10
      qualityScoreDetails: {
        expectedCtr: "Above Average",
        adRelevance: "Above Average",
        landingPageExp: "Average"
      },
      impressions: 450,
      clicks: 34,
      ctr: 7.55,
      avgCpc: 1.75,
      spend: 59.50,
      conversions: 2,
      cvr: 5.88,
      costPerConv: 29.75
    };
    data.keywords.unshift(newKw);
    this.saveData(data);
    return newKw;
  },

  deleteKeyword(id) {
    const data = this.getData();
    data.keywords = data.keywords.filter(k => k.id !== id);
    this.saveData(data);
    return true;
  },

  // Ad Operations
  getAds() {
    return this.getData().ads || [];
  },

  addAd(adData) {
    const data = this.getData();
    const newAd = {
      id: "ad-" + Math.floor(400 + Math.random() * 900),
      campaignId: adData.campaignId || data.campaigns[0].id,
      adGroupId: adData.adGroupId || (data.adGroups[0] ? data.adGroups[0].id : "ag-201"),
      type: "Responsive Search Ad",
      status: "Active",
      adStrength: adData.adStrength || "Good (85%)",
      finalUrl: adData.finalUrl || "https://example.com",
      displayPath1: adData.displayPath1 || "",
      displayPath2: adData.displayPath2 || "",
      headlines: adData.headlines || ["Headline 1", "Headline 2", "Headline 3"],
      descriptions: adData.descriptions || ["Description 1", "Description 2"],
      sitelinks: adData.sitelinks || [{ text: "Contact Us", url: "/contact" }],
      callouts: adData.callouts || ["Fast Setup", "24/7 Support"],
      impressions: 800,
      clicks: 62,
      ctr: 7.75,
      conversions: 3
    };
    data.ads.unshift(newAd);
    this.saveData(data);
    return newAd;
  },

  // Google Ads API Settings
  getApiSettings() {
    const data = this.getData();
    return data.account.apiStatus;
  },

  updateApiSettings(settings) {
    const data = this.getData();
    data.account.apiStatus = {
      ...data.account.apiStatus,
      ...settings,
      lastSyncTime: new Date().toISOString()
    };
    if (settings.customerId) {
      data.account.customerId = settings.customerId;
    }
    if (settings.customerName) {
      data.account.customerName = settings.customerName;
    }
    this.saveData(data);
    return data.account.apiStatus;
  },

  // Pub/Sub for cross-component reactivity
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
  },
  notifySubscribers() {
    this.listeners.forEach(fn => fn(this.getData()));
  }
};
