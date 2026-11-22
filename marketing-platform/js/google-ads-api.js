/**
 * AdPulse 360 - Google Ads API Connector (v16 REST & gRPC)
 * Real-time account sync, token manager, API request/response inspector, and webhook logs
 */

const GoogleAdsApiConnector = {
  isSyncing: false,

  init() {
    this.renderApiStatus();
    this.bindEvents();
    this.renderApiLogs();
  },

  bindEvents() {
    const syncBtn = document.getElementById("btn-sync-google-ads");
    if (syncBtn) {
      syncBtn.addEventListener("click", () => this.triggerApiSync());
    }

    const saveSettingsForm = document.getElementById("api-credentials-form");
    if (saveSettingsForm) {
      saveSettingsForm.addEventListener("submit", (e) => this.handleSaveSettings(e));
    }
  },

  renderApiStatus() {
    const data = StorageManager.getData();
    const api = data.account.apiStatus;

    const statusEl = document.getElementById("api-connection-badge");
    const lastSyncEl = document.getElementById("api-last-sync-time");
    const cidEl = document.getElementById("api-display-cid");
    const modeEl = document.getElementById("api-display-mode");

    if (statusEl) {
      statusEl.innerHTML = api.connected
        ? `<span class="status-dot dot-active"></span> <span style="color: #10b981; font-weight: 700;">Connected (v16)</span>`
        : `<span class="status-dot" style="background: #ef4444;"></span> <span style="color: #ef4444;">Disconnected</span>`;
    }

    if (lastSyncEl) {
      const d = new Date(api.lastSyncTime || Date.now());
      lastSyncEl.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    if (cidEl) {
      cidEl.textContent = data.account.customerId;
    }

    if (modeEl) {
      modeEl.textContent = api.mode || "Production";
    }

    // Populate form inputs if present
    const devTokenInput = document.getElementById("api-dev-token");
    const clientIdInput = document.getElementById("api-client-id");
    const customerIdInput = document.getElementById("api-customer-id");

    if (devTokenInput) devTokenInput.value = api.developerToken || "";
    if (clientIdInput) clientIdInput.value = api.clientId || "";
    if (customerIdInput) customerIdInput.value = data.account.customerId || "";
  },

  triggerApiSync() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    const syncBtn = document.getElementById("btn-sync-google-ads");
    if (syncBtn) {
      syncBtn.disabled = true;
      syncBtn.innerHTML = `<i class="fa-solid fa-rotate fa-spin"></i> Syncing with Google Ads API...`;
    }

    App.showToast("Initiating Google Ads API query: googleAds:searchStream...");

    setTimeout(() => {
      // Simulate real API delta update
      const data = StorageManager.getData();
      data.campaigns.forEach(c => {
        if (c.status === "Active") {
          // Increment slight live traffic
          const addClicks = Math.floor(Math.random() * 8) + 2;
          const addImpr = addClicks * (Math.floor(Math.random() * 12) + 10);
          c.clicks += addClicks;
          c.impressions += addImpr;
          c.spend = Number((c.spend + (addClicks * c.avgCpc)).toFixed(2));
          if (Math.random() > 0.6) {
            c.conversions += 1;
            c.convValue += 200;
          }
        }
      });

      data.account.apiStatus.lastSyncTime = new Date().toISOString();
      StorageManager.saveData(data);

      this.isSyncing = false;
      if (syncBtn) {
        syncBtn.disabled = false;
        syncBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Sync Google Ads`;
      }

      this.renderApiStatus();
      this.addApiLogEntry("SUCCESS", "googleAds:searchStream", "Fetched 5 campaigns, 8 ad groups, and 32 keyword performance rows.");
      this.renderApiLogs();
      CampaignManager.renderCampaignsTable();
      KeywordManager.renderKeywordsTable();
      App.updateOverviewMetrics();
      AnalyticsEngine.renderAllCharts();

      App.showToast("Google Ads API sync completed! Metrics refreshed.");
    }, 1500);
  },

  handleSaveSettings(e) {
    e.preventDefault();
    const developerToken = document.getElementById("api-dev-token").value.trim();
    const clientId = document.getElementById("api-client-id").value.trim();
    const customerId = document.getElementById("api-customer-id").value.trim();
    const mode = document.getElementById("api-env-mode").value;

    StorageManager.updateApiSettings({
      developerToken,
      clientId,
      customerId,
      mode
    });

    this.renderApiStatus();
    App.showToast("Google Ads API credentials saved securely in local storage.");
  },

  apiLogs: [
    { timestamp: "Just now", type: "SUCCESS", endpoint: "POST /v16/customers/482-910-3821/googleAds:searchStream", message: "Fetched campaign metrics stream (200 OK)." },
    { timestamp: "4m ago", type: "MUTATE", endpoint: "POST /v16/customers/482-910-3821/campaignBudgets:mutate", message: "Updated daily budget to $150.00." },
    { timestamp: "18m ago", type: "AUTH", endpoint: "POST https://oauth2.googleapis.com/token", message: "OAuth2 refresh token exchanged for temporary access token (expires in 3600s)." },
    { timestamp: "1h ago", type: "CRON", endpoint: "WEBHOOK /listeners/conversions", message: "Offline conversion tracking pixel synced 14 transaction events." }
  ],

  addApiLogEntry(type, endpoint, message) {
    this.apiLogs.unshift({
      timestamp: "Just now",
      type,
      endpoint,
      message
    });
    if (this.apiLogs.length > 8) this.apiLogs.pop();
  },

  renderApiLogs() {
    const listEl = document.getElementById("api-audit-log-list");
    if (!listEl) return;

    listEl.innerHTML = this.apiLogs.map(log => {
      let badgeColor = "#10b981";
      if (log.type === "MUTATE") badgeColor = "#3b82f6";
      if (log.type === "AUTH") badgeColor = "#a855f7";
      if (log.type === "WARN") badgeColor = "#f59e0b";

      return `
        <div class="api-log-row">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="api-log-badge" style="background: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}44;">
                ${log.type}
              </span>
              <span class="font-mono" style="font-size: 0.78rem; color: #94a3b8;">${log.endpoint}</span>
            </div>
            <span style="font-size: 0.72rem; color: #64748b;">${log.timestamp}</span>
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0;">${log.message}</p>
        </div>
      `;
    }).join("");
  },

  // Open JSON Payload Modal Viewer
  openPayloadViewer() {
    const modal = document.getElementById("api-payload-modal");
    const codeEl = document.getElementById("api-payload-code");
    if (modal && codeEl) {
      const data = StorageManager.getData();
      const payloadSample = {
        apiEndpoint: "https://googleads.googleapis.com/v16/customers/482-910-3821/googleAds:searchStream",
        requestHeaders: {
          "Authorization": "Bearer ya29.a0AfH6SMDh...[REDACTED]",
          "developer-token": data.account.apiStatus.developerToken,
          "login-customer-id": data.account.customerId.replace(/-/g, ""),
          "Content-Type": "application/json"
        },
        searchQuery: `SELECT 
  campaign.id, 
  campaign.name, 
  campaign.status, 
  campaign.bidding_strategy_type, 
  metrics.impressions, 
  metrics.clicks, 
  metrics.ctr, 
  metrics.average_cpc, 
  metrics.cost_micros, 
  metrics.conversions, 
  metrics.conversions_value 
FROM campaign 
WHERE segments.date DURING LAST_30_DAYS`,
        sampleResponseStatus: 200,
        sampleResponseResultsCount: data.campaigns.length,
        liveCampaignsSnapshot: data.campaigns.map(c => ({
          id: c.id,
          name: c.name,
          status: c.status,
          spend: c.spend,
          conversions: c.conversions
        }))
      };

      codeEl.textContent = JSON.stringify(payloadSample, null, 2);
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closePayloadViewer() {
    const modal = document.getElementById("api-payload-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
};
